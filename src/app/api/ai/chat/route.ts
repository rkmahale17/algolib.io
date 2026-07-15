import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import OpenAI from 'openai';

const API_KEY = process.env.OPENAI_API_KEY || process.env.ALI_DASHSCOPE_API_KEY || '';
const BASE_URL = process.env.OPENAI_BASE_URL || 'https://openrouter.ai/api/v1';

const PRIMARY_MODEL = process.env.QWEN_MODEL_NAME || 'openai/gpt-4o-mini';
const FALLBACK_MODEL = process.env.QWEN_FALLBACK_MODEL || 'openai/gpt-3.5-turbo';

const MAX_PROBLEM_DESC_CHARS = 1500;
const MAX_USER_CODE_CHARS = 2000;
const MAX_HISTORY_MSG_CHARS = 1000;

export const dynamic = 'force-dynamic';

function truncate(text: string, maxLen: number): string {
    if (!text || text.length <= maxLen) return text;
    return text.slice(0, maxLen) + '\n... [truncated]';
}

const openai = new OpenAI({
    apiKey: API_KEY,
    baseURL: BASE_URL,
    defaultHeaders: {
        'HTTP-Referer': 'https://rulcode.com',
        'X-Title': 'RulCode'
    }
});

/**
 * Calls OpenAI SDK and returns a ReadableStream that safely handles mid-stream errors.
 */
async function createSafeStream(model: string, messages: any[]): Promise<{ stream?: ReadableStream, error?: string }> {
    try {
        const stream = await openai.chat.completions.create({
            model,
            messages,
            stream: true,
            temperature: 0.7,
            max_tokens: 2000,
        });

        const encoder = new TextEncoder();

        const readableStream = new ReadableStream({
            async start(controller) {
                try {
                    let receivedContent = false;
                    for await (const chunk of stream as any) {
                        if (chunk.error) {
                            console.error("OpenRouter stream chunk error:", chunk.error);
                            const data = `data: ${JSON.stringify({ error: chunk.error.message || 'API Error' })}\n\n`;
                            controller.enqueue(encoder.encode(data));
                            break;
                        }
                        
                        const content = chunk.choices?.[0]?.delta?.content || '';
                        if (content) {
                            receivedContent = true;
                            const data = `data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n\n`;
                            controller.enqueue(encoder.encode(data));
                        }
                    }
                    if (!receivedContent) {
                        console.warn("RULA Stream warning: Received 200 OK but stream yielded no text content.");
                    }
                    controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                    controller.close();
                } catch (err: any) {
                    console.error('Model stream interrupted mid-way:', err.message);
                    // Instead of sending a raw error chunk that breaks the client,
                    // we gracefully close the stream. The client will keep the partial text.
                    controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                    controller.close();
                }
            }
        });

        return { stream: readableStream };
    } catch (err: any) {
        return { error: err.message || 'Failed to start stream' };
    }
}

export async function POST(req: NextRequest) {
    try {
        const { problemId, problemDescription, userCode, language, message, mode, history } = await req.json();

        // Auth
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // ---- Build system prompt with truncated inputs ----
        const safeDesc = truncate(problemDescription || '', MAX_PROBLEM_DESC_CHARS);
        const safeCode = truncate(userCode || 'No code provided yet.', MAX_USER_CODE_CHARS);

        const systemInstruction = `You are RULA, an AI coding assistant for RulCode.
Problem: ${problemId}

${safeDesc}

User's Code (${language}):
\`\`\`${language}
${safeCode}
\`\`\`

Rules:
- You are a highly empathetic, patient coding tutor. Explain concepts so simply and descriptively that even a child or complete beginner could understand.
- Use simple analogies and avoid dense academic jargon. Break down complex logic into easy-to-digest pieces.
- IMPORTANT: The user is coding in ${language}. ALL code examples MUST be in ${language}.
- IMPORTANT: When providing full code, you MUST respect the exact boilerplate of the existing code. DO NOT change imports, add new classes, or change function/method names. Just follow the starter code / user code and only change the underlying logic without changing the structure.
- Show SMALL code snippets only when needed. Make sure to explain what every single line of code does.
- Mode "${mode}": ${{
    hint: 'Give a gentle, highly descriptive nudge using simple analogies. Do not reveal the code answer.',
    approach: 'Explain the high-level intuition and logic like a story, step-by-step, making it extremely easy to understand for beginners.',
    thinking: 'Walk through the logical thought process very simply, as if explaining to a 10-year-old. Detail the "why".',
    solution: 'Show the optimal solution. You MUST explain every part of the solution in extremely simple terms.',
    fix: 'Identify the bugs and explain them simply. Then, provide ONLY the fully corrected code block. DO NOT repeat the user\'s original incorrect code. In the corrected code block, use comments to highlight exactly what was changed. Preserve the exact original boilerplate.',
    chat: 'Answer the question thoroughly and descriptively, prioritizing extreme clarity and beginner-friendly language.'
}[mode] || 'Answer descriptively and clearly.'}
- Use Markdown formatting and bold key terms to aid reading.`;

        // Only keep last 4 history messages, truncated
        const recentHistory = (history || []).slice(-4);

        const rawMessages = [
            { role: 'system' as const, content: systemInstruction },
            ...recentHistory.map((msg: any) => ({
                role: (msg.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
                content: truncate(msg.content || '', MAX_HISTORY_MSG_CHARS)
            })),
            { role: 'user' as const, content: message }
        ].filter(m => m.content && m.content.trim() !== '');

        const collapsedMessages = rawMessages.reduce((acc: any[], curr) => {
            if (acc.length > 0 && acc[acc.length - 1].role === curr.role && curr.role !== 'system') {
                acc[acc.length - 1].content += '\n\n' + curr.content;
            } else {
                acc.push(curr);
            }
            return acc;
        }, []);

        console.log(`RULA — Model: ${PRIMARY_MODEL} | Mode: ${mode}`);

        // ---- Attempt 1: Primary model ----
        let result = await createSafeStream(PRIMARY_MODEL, collapsedMessages);

        if (result.error) {
            console.error(`Primary model failed: ${result.error}`);

            // ---- Attempt 2: Fallback model ----
            if (FALLBACK_MODEL && FALLBACK_MODEL !== PRIMARY_MODEL) {
                console.log(`Trying fallback model: ${FALLBACK_MODEL}`);
                result = await createSafeStream(FALLBACK_MODEL, collapsedMessages);
            }

            if (result.error) {
                console.error(`Fallback also failed: ${result.error}`);
                
                // ---- Attempt 3: Minimal Context ----
                console.log('Trying minimal context...');
                const minimalMessages = [
                    { role: 'system', content: `You are RULA, a concise AI coding assistant. Problem: ${problemId}. Be very brief.` },
                    { role: 'user', content: message }
                ];
                result = await createSafeStream(PRIMARY_MODEL, minimalMessages);

                if (result.error) {
                    throw new Error('AI service is temporarily unavailable. Please try again.');
                }
            }
        }

        return new Response(result.stream!, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

    } catch (error: any) {
        console.error('AI Chat Error:', error.message);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
