import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || process.env.ALI_DASHSCOPE_API_KEY || '',
    baseURL: process.env.OPENAI_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1',
});

async function main() {
    try {
        console.log("Starting stream...");
        const response = await openai.chat.completions.create({
            model: process.env.QWEN_MODEL_NAME || 'qwen-coder-plus',
            messages: [{ role: 'user', content: 'Explain quicksort in detail step by step' }],
            stream: true,
            temperature: 0.7,
            max_tokens: 1500,
        });

        for await (const chunk of response) {
            process.stdout.write(chunk.choices?.[0]?.delta?.content || "");
        }
        console.log("\nStream done.");
    } catch (e: any) {
        console.error("\nError in stream:", e.message);
    }
}
main();
