const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { topic, referenceCode } = await req.json();
        const apiKey = Deno.env.get("GEMINI_API_KEY");

        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is not set");
        }

        if (!topic) {
            throw new Error("Topic is required");
        }

        console.log("Generating algorithm for topic:", topic);

        const referenceCodeSection = referenceCode ? `
      CRITICAL INSTRUCTION - REFERENCE CODE PROVIDED:
      The user has provided the following REFERENCE CODE for the optimized approach:
      """
      ${referenceCode}
      """
      1. You MUST use the logic, variable names, and structure from this reference code for the 'optimize' codeType in ALL languages (translate it faithfully to TypeScript, Python, Java, C++).
      2. The 'explanation.steps' (global steps) MUST describe THIS specific reference approach.
      3. The 'explanationBefore' for the optimized approach must explain THIS specific code.
      ` : '';

        const prompt = `
      You are an expert algorithm tutor. Generate a detailed coding tutorial for the algorithm topic: "${topic}".
      
      IMPORTANT: The 'topic' provided is a specific Algorithm/LeetCode problem. 
      You MUST ensure the 'problemStatement', 'input_schema', 'constraints', and 'test_cases' EXACTLY MATCH the standard known definition of this problem (e.g. from LeetCode/NeetCode). 
      Do NOT invent a new problem. Just format the standard problem details into the requested HTML/JSON structure below.

      ${referenceCodeSection}

      You must return strictly valid JSON. Do not include markdown code blocks or any other text outside the JSON.
      
      The JSON structure must match this TypeScript interface:
      
      interface Algorithm {
        id: string; // url-friendly-id
        title: string;
        name: string;
        category: string; // e.g. "Arrays & Hashing", "Dynamic Programming"
        difficulty: "easy" | "medium" | "hard";
        description: string; // Brief one-line description
        serial_no: number; // match blind 75 list if possible, or 0
        list_type: "blind75" | "other" | "coreAlgo"; 
        explanation: {
          problemStatement: string; // Full detailed problem statement in HTML
          steps: string; // HTML ol list - GLOBAL steps matching the reference/optimized approach
          useCase: string; // HTML ul list - At least 5 items
          tips: string; // HTML ul list - At least 5 items
          comparisonTable: string; // HTML table
          timeComplexity: string;
          spaceComplexity: string;
          constraints: string[];
          io: Array<{ input: string; output: string; explanation: string; }>; // LeetCode style examples
        };
        implementations: Array<{
          lang: "typescript" | "python" | "java" | "cpp";
          code: Array<{
            codeType: "starter" | "brute-force" | "better" | "optimize";
            code: string; // The full function code
            explanationBefore: string; // HTML string containing: Overview, Intuition, Steps, Complexity
            explanationAfter: string; // HTML string for additional notes
          }>;
        }>;
        test_cases: Array<{
          input: any[]; 
          output: any;
          description: string;
        }>;
        input_schema: Array<{
          name: string;
          type: string; 
          label: string;
        }>;
        metadata: {
          overview: string; // Detailed algorithm overview (approx 150-220 words per paragraph, at least 2 paragraphs)
          companyTags: string[];
          likes: number; 
          dislikes: number; 
        }
      }

      CONTENT RULES (Strict):
      1. **Structure & Descriptiveness**: 
         - **Problem Statement**: Use strict HTML.
         - **Metadata Overview**: MUST be descriptive, each paragraph approx 150-220 words.
         - **Use Cases**: Provide AT LEAST 5 items with strong tags for domain names.
         - **Pro Tips**: Provide AT LEAST 5 items.
         - **IO Examples**: Provide 3 clear examples with input, output, and visual explanation.
         - **Comparison Table**: Full HTML table comparing all approaches.

      2. **HTML Rules**:
         - Use pure HTML, no Markdown when HTML is requested.
         - Use code tags with class font-mono for variable formatting.
         - Lists: Steps use ol, Use cases/Pro tips use ul.
         - Use proper table structure with thead and tbody.
      
      3. **Code Rules**:
         - **ALL 4 Languages Required**: Provide implementations for typescript, python, java, and cpp for every code approach.
         - **Detailed Comments**: Complex logic MUST have inline comments.
         - **STARTER CODE**: For codeType starter, provide ONLY the function signature. The body should be empty or contain a single return statement.
      
      4. **Requirements**:
         - Provide at least 12 test cases.
         - Provide at least 4 approaches for typescript (brute-force, better, optimize, etc.).
         - Ensure Python, Java, and C++ also have the same approaches as Typescript.
         - The optimize codeType must be the best possible time complexity.

      5. **TRUTHFULNESS & ACCURACY**:
         - NO HALLUCINATIONS: Do not invent constraints or problem details.
         - VERIFY COMPLEXITY: Double-check Time and Space complexity.
         - CONSISTENCY: The logic in Python MUST match Java/CPP/TS exactly.

      6. **STRICT TEMPLATE for explanationBefore**:
         For every approach, explanationBefore MUST follow this HTML structure:
         - Overview section with strong tag
         - Intuition section explaining the logic
         - Steps to Solve as ordered list
         - Time Complexity in a muted background div
         - Space Complexity in a muted background div
         - Link to /complexity page

      EXAMPLE OUTPUT FORMAT (Two Sum):
      {
        "id": "two-sum",
        "title": "Two Sum",
        "name": "Two Sum",
        "category": "Arrays & Hashing",
        "difficulty": "easy",
        "description": "Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.",
        "serial_no": 1,
        "list_type": "blind75",
        "explanation": {
          "problemStatement": "<p>Given an array of integers <code class='font-mono'>nums</code> and an integer <code class='font-mono'>target</code>, return indices of the two numbers such that they add up to target.</p>",
          "steps": "<ol class='list-decimal list-inside space-y-2'><li>Initialize a hash map.</li><li>Iterate through the array.</li><li>Calculate complement.</li><li>Check if complement exists in map.</li><li>Return indices or store current element.</li></ol>",
          "useCase": "<ul class='list-disc list-inside space-y-2'><li><strong>Financial Systems</strong> - Finding transactions that sum to a target.</li></ul>",
          "tips": "<ul class='list-disc list-inside space-y-2'><li>Use a Hash Map for O(1) lookups.</li></ul>",
          "comparisonTable": "<div class='overflow-x-auto'><table class='min-w-full'><thead><tr><th>Approach</th><th>Time</th><th>Space</th></tr></thead><tbody><tr><td>Brute Force</td><td>O(n^2)</td><td>O(1)</td></tr><tr><td>Hash Table</td><td>O(n)</td><td>O(n)</td></tr></tbody></table></div>",
          "timeComplexity": "O(n)",
          "spaceComplexity": "O(n)",
          "constraints": ["2 <= nums.length <= 10^4"],
          "io": [{ "input": "nums = [2,7,11,15], target = 9", "output": "[0,1]", "explanation": "nums[0] + nums[1] == 9" }]
        },
        "implementations": [
          {
            "lang": "typescript",
            "code": [
              {
                "codeType": "starter",
                "code": "function twoSum(nums: number[], target: number): number[] {\\n    \\n}",
                "explanationBefore": "<div class='space-y-4'><p><strong>Overview:</strong> Starting point for the algorithm.</p></div>",
                "explanationAfter": ""
              },
              {
                "codeType": "optimize",
                "code": "function twoSum(nums: number[], target: number): number[] {\\n    const map = new Map<number, number>();\\n    for (let i = 0; i < nums.length; i++) {\\n        const complement = target - nums[i];\\n        if (map.has(complement)) {\\n            return [map.get(complement)!, i];\\n        }\\n        map.set(nums[i], i);\\n    }\\n    return [];\\n}",
                "explanationBefore": "<div class='space-y-4'><p><strong>Overview:</strong> One-pass hash table approach.</p></div>",
                "explanationAfter": ""
              }
            ]
          }
        ],
        "test_cases": [{"input": [[2, 7, 11, 15], 9], "output": [0, 1], "description": "Basic test"}],
        "input_schema": [{"name": "nums", "type": "number[]", "label": "Numbers"}, {"name": "target", "type": "number", "label": "Target"}],
        "metadata": {
          "overview": "The Two Sum problem is a fundamental challenge for understanding hash maps and time-space trade-offs.",
          "companyTags": ["Google", "Amazon"],
          "likes": 50000,
          "dislikes": 0
        }
      }

      IMPORTANT REQUIREMENTS:
      1. Provide at least 3 approaches in the typescript implementation.
      2. Ensure the optimize solution is the best possible time complexity.
      3. test_cases must have input as an array of arguments that matches the function signature.
      
      Output JUST the JSON object for this single algorithm.
    `;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
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
                    generationConfig: {
                        maxOutputTokens: 65536,
                    },
                }),
            }
        );

        if (!response.ok) {
            const errText = await response.text();
            console.error("Gemini API Error:", errText);
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
            jsonString = jsonString.replace(/^```json\s*/, "").replace(/\s*```$/, "");
        } else if (jsonString.startsWith("```")) {
            jsonString = jsonString.replace(/^```\s*/, "").replace(/\s*```$/, "");
        }

        const parsedAlgorithm = JSON.parse(jsonString);

        console.log("Successfully generated algorithm:", parsedAlgorithm.id);

        return new Response(JSON.stringify(parsedAlgorithm), {
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
