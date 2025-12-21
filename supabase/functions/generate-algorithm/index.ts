
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { topic, referenceCode, mode = "problem" } = await req.json(); // mode: "problem" | "core"
        const apiKey = Deno.env.get("GEMINI_API_KEY");

        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is not set");
        }

        if (!topic) {
            throw new Error("Topic is required");
        }

        const BASE_RULES = `
      You must return strictly valid JSON. Do not include markdown code blocks.
      
      Output JSON format:
      interface Algorithm {
        id: string; // url-friendly-id
        title: string;
        name: string;
        category: string;
        difficulty: "easy" | "medium" | "hard";
        description: string;
        serial_no: number; // 0 for core algo
        list_type: "blind75" | "other" | "coreAlgo"; 
        explanation: {
          problemStatement: string; // HTML
          steps: string; // HTML <ol><li>...</li></ol> (GLOBAL steps)
          useCase: string; // HTML <ul><li>...</li></ul> (5+ items)
          tips: string; // HTML <ul><li>...</li></ul> (5+ items)
          comparisonTable: string; // HTML (Table)
          timeComplexity: string;
          spaceComplexity: string;
          constraints: string[];
          io: Array<{ input: string; output: string; explanation: string; }>;
        };
        implementations: Array<{
          lang: "typescript" | "python" | "java" | "cpp";
          code: Array<{
            codeType: "starter" | "brute-force" | "better" | "optimize";
            code: string;
            explanationBefore: string; // STRICT HTML TEMPLATE
            explanationAfter: string;
          }>;
        }>;
        test_cases: Array<{
          input: any[]; 
          output: any;
          description: string;
          isSubmission?: boolean; // Last 8 tests must be true
        }>;
        input_schema: Array<{ name: string; type: string; label: string; }>;
        metadata: {
          overview: string; // 2+ paragraphs, approx 220 words each
          companyTags: string[];
          likes: number; 
          dislikes: number; 
        }
      }

      CONTENT RULES (Strict):
      1. **Structure**: 
         - **Problem Statement**: Use strict HTML.
         - **Metadata Overview**: MUST be descriptive. Use \\n\\n to separate paragraphs. Approx 220 words per paragraph.
         - **Use Cases**: AT LEAST 5 items. Format: <ul><li><strong>Domain</strong> - Description.</li></ul>
         - **Pro Tips**: AT LEAST 5 items. Format: <ul><li>Tip content.</li></ul>
         - **IO Examples**: 3 clear examples.

      2. **HTML Layout (explanationBefore)**:
         MUST follow this EXACT structure with <hr/> tags:
         \`\`\`html
         <p><strong>Overview:</strong><br /> [Content]</p>
         <hr />
         <p><strong>Intuition:</strong><br /> [Content]</p>
         <hr />
         <p><strong>Steps to Solve:</strong></p>
         <ol><li>...</li></ol>
         <hr />
         <p>
           <strong>Time Complexity:</strong> [Complexity]<br>
           <strong>Space Complexity:</strong> [Complexity]<br>
           <br>
           <AlgoLink url="/complexity" className="m-4">Learn Complexity</AlgoLink>
           <br><br>
         </p>
         \`\`\`

      3. **Code Rules (CRITICAL)**:
         - **ALL 4 Languages**: Generate TypeScript, Python, Java, C++ for EVERY approach.
         - **NO CLASSES / NO IMPORTS**: Return ONLY the function definition. Do NOT wrap in \`class Solution\`. Do NOT add imports. Just the function.
         - **Detailed Comments**: Inline comments explaining complex logic.
         - **Starter Code**: Signature ONLY. No logic.
         - **Reference Code**: If provided, STRICTLY translate logic to all 4 languages.
      
      4. **Requirements**:
         - **Test Cases**: Provide 12 total. Mark the LAST 8 as \`isSubmission: true\` (Hidden).
         - **Approaches**: At least 4 for TS. Same count for others.
         - **Explanation After**: Last approach must contain the \`comparisonTable\` HTML.

      5. **TRUTHFULNESS PROTOCOL**:
         - NO Hallucinations. Verify complexity. Identical logic across languages.
        `;

        const CORE_ALGO_PROMPT = `
      You are an expert algorithm tutor. Generate a detailed tutorial for the CORE ALGORITHM: "${topic}".
      
      Since this is a core algorithm (e.g. Merge Sort, BFS), it may not match a specific LeetCode problem.
      YOUR TASK:
      1. **Define the Problem Yourself**: Create a standard "problem statement" for this algorithm. (e.g. "Given an unsorted array, return it sorted.").
      2. **Define Inputs/Outputs**: Create a logical input schema and test cases.
      3. **Educational Focus**: Explain HOW it works deeply in the Metadata Overview.
      
      ${BASE_RULES}
        `;

        const PROBLEM_PROMPT = `
      You are an expert algorithm tutor. Generate a detailed tutorial for the ALGORITHM TOPIC: "${topic}".
      
      IMPORTANT: This is a known LeetCode/Standard problem.
      YOUR TASK:
      1. **Match Exact Definition**: The 'problemStatement', 'input_schema', 'constraints', and 'test_cases' MUST EXACTLY MATCH the standard known definition (e.g. from LeetCode).
      2. **Do NOT Invent**: Do not create your own variation. Use the standard one.
      
      ${BASE_RULES}
        `;

        const prompt = mode === "core" ? CORE_ALGO_PROMPT : PROBLEM_PROMPT;

        const finalPrompt = `
      ${prompt}
      
      ${referenceCode ? `
      CRITICAL - REFERENCE CODE PROVIDED:
      Use this logic for the 'optimize' approach and global steps:
      \`\`\`
      ${referenceCode}
      \`\`\`
      ` : ''}

      Output JUST the JSON.
        `;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: finalPrompt }] }],
                }),
            }
        );

        if (!response.ok) {
            const errConf = await response.text();
            throw new Error(`Gemini API Error: ${response.status} ${errConf}`);
        }

        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!rawText) throw new Error("No content generated");

        let jsonString = rawText.trim();
        if (jsonString.startsWith("```json")) {
            jsonString = jsonString.replace(/^```json/, "").replace(/```$/, "");
        } else if (jsonString.startsWith("```")) {
            jsonString = jsonString.replace(/^```/, "").replace(/```$/, "");
        }

        return new Response(jsonString, {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: (error as Error).message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
        });
    }
});
