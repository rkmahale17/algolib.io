
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { topic } = await req.json();
        const apiKey = Deno.env.get("GEMINI_API_KEY");

        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is not set");
        }

        if (!topic) {
            throw new Error("Topic is required");
        }

        const prompt = `
      You are an expert algorithm tutor. Generate a detailed coding tutorial for the algorithm topic: "${topic}".
      
      You must return strictly valid JSON. Do not include markdown code blocks or any other text outside the JSON.
      
      The JSON structure must match this TypeScript interface:
      
      interface Algorithm {
        id: string; // url-friendly-id
        title: string;
        name: string;
        category: string; // e.g. "Arrays & Hashing", "Dynamic Programming"
        difficulty: "easy" | "medium" | "hard";
        description: string; // Brief description
        serial_no: number; // guess a number or return 0
        list_type: "blind75" | "other" | "coreAlgo"; // default to "other" if not sure
        explanation: {
          problemStatement: string; // Full detailed problem statement
          steps: string[]; // High level logical steps
          timeComplexity: string;
          spaceComplexity: string;
          constraints: string[];
        };
        implementations: Array<{
          lang: "typescript" | "python" | "java" | "cpp"; // Return at least 'typescript', others optional but preferred
          code: Array<{
            codeType: "starter" | "brute-force" | "better" | "optimize"; // MUST include 'optimize' and preferably 'brute-force'
            code: string; // The full function code
          }>;
        }>;
        test_cases: Array<{
          input: any[]; // Array of arguments. e.g. if function takes (nums, target), this is [[1,2], 3]
          output: any;
          description: string;
        }>;
        input_schema: Array<{
          name: string;
          type: string; // e.g. "number[]", "string"
          label: string;
        }>;
        metadata: {
          companyTags: string[];
          likes: number; // estimate
          dislikes: number; // estimate
        }
      }

      IMPORTANT REQUIREMENTS:
      1. Provide at least 3 approaches in the 'typescript' implementation if applicable (e.g., brute-force, better, optimize). If only one optimal solution exists, provide that.
      2. Ensure the 'optimize' solution is the best possible time complexity.
      3. The 'starter' code should be just the function signature.
      4. 'test_cases' must have 'input' as an array of arguments that matches the function signature.
      
      Output JUST the JSON object for this single algorithm.
    `;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: prompt,
                                },
                            ],
                        },
                    ],
                }),
            }
        );

        if (!response.ok) {
            const errConf = await response.text();
            console.error("Gemini API Error:", errConf);
            throw new Error(`Gemini API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!rawText) {
            throw new Error("No content generated from Gemini");
        }

        // Clean up markdown code blocks if the model ignores the instruction
        let jsonString = rawText.trim();
        if (jsonString.startsWith("```json")) {
            jsonString = jsonString.replace(/^```json/, "").replace(/```$/, "");
        } else if (jsonString.startsWith("```")) {
            jsonString = jsonString.replace(/^```/, "").replace(/```$/, "");
        }

        const parsedAlgorithm = JSON.parse(jsonString);

        return new Response(JSON.stringify(parsedAlgorithm), {
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
