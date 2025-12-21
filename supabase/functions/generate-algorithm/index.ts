
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

        // --- SHARED RULES ---
        const HTML_TEMPLATE = `
        <p>[Overview content - NO HEADING]</p>
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
        `;

        const TABLE_STRUCTURE = `
        <div className="relative overflow-x-auto w-full">
          <table className="w-full border-collapse border border-border">
            <thead>
              <tr>
                <th className="border px-4 py-2">Approach</th>
                <th className="border px-4 py-2">Core Idea</th>
                <th className="border px-4 py-2">Time Complexity</th>
                <th className="border px-4 py-2">Space Complexity</th>
                <th className="border px-4 py-2">When to Use</th>
                <th className="border px-4 py-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              <!-- Rows here -->
            </tbody>
          </table>
        </div>
        `;

        const BASE_SYSTEM_PROMPT = `
        You are an expert algorithm tutor.
        TOPIC: "${topic}"
        MODE: ${mode === 'core' ? 'Core Algorithm (Define problem yourself)' : 'LeetCode Problem (Match standard definition)'}
        ${referenceCode ? `REFERENCE CODE PROVIDED (Use for Logic): \n${referenceCode}` : ''}

        GENERAL RULES:
        1. **Truthfulness**: Verify complexity. No hallucinations.
        2. **HTML**: Use strict HTML for formatted fields.
        3. **Detailed**: Explanations must be deep and educational.
        `;

        // --- HELPER TO CALL GEMINI ---
        async function generateChunk(promptText: string) {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: promptText }] }],
                    }),
                }
            );
            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`Gemini Error: ${response.status} ${errText}`);
            }
            const data = await response.json();
            let rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!rawText) return null;

            // cleanup json
            rawText = rawText.trim();
            if (rawText.startsWith("```json")) {
                rawText = rawText.replace(/^```json\s*/, "").replace(/\s*```$/, "");
            } else if (rawText.startsWith("```")) {
                rawText = rawText.replace(/^```\s*/, "").replace(/\s*```$/, "");
            }
            return JSON.parse(rawText);
        }

        // --- CHUNK 1: CORE DATA ---
        const corePrompt = `
        ${BASE_SYSTEM_PROMPT}

        TASK: Generate the CORE METADATA and EXPLANATION for this algorithm.
        Do NOT generate code implementations yet.

        JSON Structure:
        {
          "id": "url-friendly-id",
          "title": "Title",
          "name": "Name",
          "category": "Category",
          "difficulty": "easy" | "medium" | "hard",
          "description": "One line description",
          "serial_no": 0,
          "list_type": "coreAlgo",
          "explanation": {
            "problemStatement": "STRICT HTML",
            "steps": "HTML <ol><li>Global high level steps</li></ol>",
            "useCase": "HTML <ul><li><strong>Domain</strong> - Desc</li></ul> (5+ items)",
            "tips": "HTML <ul><li>Tip</li></ul> (5+ items)",
            "comparisonTable": "STRICT HTML Table with 6 columns: Approach, Core Idea, Time, Space, When to Use, Notes",
            "timeComplexity": "O(..)",
            "spaceComplexity": "O(..)",
            "constraints": ["String array"],
            "io": [{"input": "...", "output": "...", "explanation": "..."}]
          },
          "test_cases": [{"input": [], "output": null, "description": "...", "isSubmission": false}],
          "input_schema": [{"name": "nums", "type": "number[]", "label": "Numbers"}],
          "metadata": {
            "overview": "2 paragraphs, \\n\\n separated, 220 words each.",
            "companyTags": [], "likes": 0, "dislikes": 0
          }
        }

        REQUIREMENTS:
        1. **Comparison Table**: MUST use this EXACT HTML structure:
           ${TABLE_STRUCTURE}
        2. **Test Cases**: Provide 12 total. Mark the LAST 8 as 'isSubmission: true'.
        3. **Metadata**: Overview must be very descriptive.
        `;

        // --- CHUNK 2 & 3: IMPLEMENTATIONS ---
        const implsPrompt = (langs: string[]) => `
        ${BASE_SYSTEM_PROMPT}

        TASK: Generate Code Implementations for: ${langs.join(", ")}.
        
        JSON Structure:
        {
          "implementations": [
            {
              "lang": "${langs[0]}",
              "code": [
                {
                  "codeType": "starter" | "brute-force" | "better" | "optimize",
                  "code": "FUNCTION CODE ONLY",
                  "explanationBefore": "HTML content",
                  "explanationAfter": "HTML content"
                }
              ]
            }
            // ... repeat for other languages
          ]
        }

        CRITICAL CODE RULES:
        1. **FUNCTION ONLY**: Return ONLY the function definition. 
           - **NO 'class Solution'**. 
           - **NO imports**. 
           - **NO 'public static void'** unless absolutely necessary for a standalone function (prefer minimal signature).
        2. **Detailed Comments**: Inline comments for complex logic.
        3. **Starter Code**: Signature ONLY. No logic.
        4. **Reference Code**: If provided, use it for 'optimize' logic.
        
        HTML RULES (explanationBefore):
        Use this template exactly (NO 'Overview' heading):
        ${HTML_TEMPLATE}

        For the LAST approach (optimize), put the Comparison Table HTML in 'explanationAfter'.
        `;

        // --- EXECUTE PARALLEL ---
        console.log("Starting Chunked Generation...");
        const [coreData, implsPart1, implsPart2] = await Promise.all([
            generateChunk(corePrompt),
            generateChunk(implsPrompt(["typescript", "python"])),
            generateChunk(implsPrompt(["java", "cpp"]))
        ]);

        if (!coreData || !implsPart1 || !implsPart2) {
            throw new Error("Failed to generate one or more chunks.");
        }

        // --- MERGE ---
        const finalJson = {
            ...coreData,
            implementations: [
                ...(implsPart1.implementations || []),
                ...(implsPart2.implementations || [])
            ]
        };

        return new Response(JSON.stringify(finalJson), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Error in generate-algorithm:", error);
        return new Response(JSON.stringify({ error: (error as Error).message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
        });
    }
});
