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
        const { stats } = await req.json();

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

        const systemInstruction = `You are an expert AI programming coach reviewing a user's profile on a coding platform.
            
You are provided with their solving statistics, difficulty breakdown, and recent activity.

User Stats:
${JSON.stringify(stats, null, 2)}

Instructions:
Provide a structured profile review in valid JSON format ONLY. Do not include markdown code blocks (\`\`\`json) in the response, just the raw JSON object.
Format:
{
  "overallScore": number, // 0 to 100 representing overall profile strength
  "strengths": string[], // List of 2-3 positive aspects of their profile (e.g. consistency, mastery of easy problems)
  "weaknesses": string[], // List of 2-3 areas for improvement (e.g. low hard problems solved, inconsistent streaks)
  "recommendations": string[], // Actionable steps to improve
  "summary": string, // 1-2 sentence overall assessment
  "skillDistribution": [
    { "topic": "Dynamic Programming", "proficiency": 80 }
    // infer 3-5 topics based on their stats
  ]
}`;

        const response = await openai.chat.completions.create({
            model: MODEL_NAME,
            messages: [
                { role: 'system', content: systemInstruction },
                { role: 'user', content: 'Please review my profile.' }
            ],
            temperature: 0.2,
            max_tokens: 1024,
            response_format: { type: "json_object" }
        });

        const scanText = response.choices[0]?.message?.content || '{}';
        const scanData = JSON.parse(scanText);

        // Store scan in database
        const { error: dbError } = await supabase
            .from('ai_profile_scans')
            .insert({
                user_id: user.id,
                scan_content: scanData,
                stats_snapshot: stats
            });

        if (dbError) {
            console.error('Error saving profile scan:', dbError);
        }

        return NextResponse.json(scanData);

    } catch (error: any) {
        console.error('AI Profile Scan Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
