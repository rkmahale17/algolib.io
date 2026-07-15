import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@/utils/supabase/server';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || process.env.ALI_DASHSCOPE_API_KEY || '',
    baseURL: process.env.OPENAI_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1',
});

const MODEL_NAME = process.env.QWEN_MODEL_NAME || 'qwen-coder-plus';

export async function POST(req: NextRequest) {
    try {
        const { problemId, problemDescription, userCode, language, submissionId } = await req.json();

        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check pro subscription status
        const { data: profile } = await supabase
            .from('profiles')
            .select('subscription_status')
            .eq('id', user.id)
            .single();

        if (profile?.subscription_status !== 'pro' && profile?.subscription_status !== 'premium') {
             // For strict enforcement: return NextResponse.json({ error: 'Pro feature only' }, { status: 403 });
        }

        const systemInstruction = `You are RULCO, an expert AI code reviewer.
You are reviewing a user's accepted solution for problem ${problemId}.

Problem Description:
${problemDescription}

User's Accepted Code (${language}):
\`\`\`${language}
${userCode}
\`\`\`

Instructions:
Provide a structured code review in valid JSON format ONLY. Do not include markdown code blocks (\`\`\`json) in the response, just the raw JSON object.
Format:
{
  "score": number, // 0 to 100 representing code quality and efficiency
  "strengths": string[], // List of 2-3 positive aspects of the code
  "improvements": string[], // List of 2-3 areas for improvement (cleanliness, efficiency, modern syntax)
  "complexityAnalysis": string, // Explanation of Time and Space complexity
  "summary": string // 1-2 sentence overall review summary
}`;

        const response = await openai.chat.completions.create({
            model: MODEL_NAME,
            messages: [
                { role: 'system', content: systemInstruction },
                { role: 'user', content: 'Please review my code.' }
            ],
            temperature: 0.2,
            max_tokens: 1024,
            response_format: { type: "json_object" }
        });

        const reviewText = response.choices[0]?.message?.content || '{}';
        const reviewData = JSON.parse(reviewText);

        // Store review in database
        const { error: dbError } = await supabase
            .from('ai_reviews')
            .upsert({
                user_id: user.id,
                algorithm_id: problemId,
                submission_id: submissionId,
                language: language,
                review_content: reviewData
            }, { onConflict: 'user_id,algorithm_id,submission_id' });

        if (dbError) {
            console.error('Error saving review:', dbError);
        }

        return NextResponse.json(reviewData);

    } catch (error: any) {
        console.error('AI Review Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
