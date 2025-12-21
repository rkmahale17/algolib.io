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
        const { topic, referenceCode } = await req.json();
        const apiKey = Deno.env.get("GEMINI_API_KEY");

        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is not set");
        }

        if (!topic) {
            throw new Error("Topic is required");
        }

        const prompt = `
      You are an expert algorithm tutor. Generate a detailed coding tutorial for the algorithm topic: "${topic}".
      
      IMPORTANT: The 'topic' provided is a specific Algorithm/LeetCode problem. 
      You MUST ensure the 'problemStatement', 'input_schema', 'constraints', and 'test_cases' EXACTLY MATCH the standard known definition of this problem (e.g. from LeetCode/NeetCode). 
      Do NOT invent a new problem. Just format the standard problem details into the requested HTML/JSON structure below.

      ${referenceCode ? `
      CRITICAL INSTRUCTION - REFERENCE CODE PROVIDED:
      The user has provided the following REFERENCE CODE for the optimized approach:
      \`\`\`
      ${referenceCode}
      \`\`\`
      1. You MUST use the logic, variable names, and structure from this reference code for the 'optimize' codeType in ALL languages (translate it faithfully to TypeScript, Python, Java, C++).
      2. The 'explanation.steps' (global steps) MUST describe THIS specific reference approach.
      3. The 'explanationBefore' for the optimized approach must explain THIS specific code.
      ` : ''}

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
          steps: string; // HTML <ol>...</ol> - GLOBAL steps matching the reference/optimized approach
          useCase: string; // HTML <ul>...</ul> - At least 5 items
          tips: string; // HTML <ul>...</ul> - At least 5 items
          comparisonTable: string; // HTML <table>...</table>
          timeComplexity: string;
          spaceComplexity: string;
          constraints: string[];
          io: Array<{ input: string; output: string; explanation: string; }>; // LeetCode style examples
        };
        implementations: Array<{
          lang: "typescript" | "python" | "java" | "cpp"; // Return 'typescript', 'python', 'java', 'cpp'
          code: Array<{
            codeType: "starter" | "brute-force" | "better" | "optimize";
            code: string; // The full function code
            explanationBefore: string; // HTML string containing: Overview, Intuition, Steps, Complexity (STRICT TEMPLATE)
            explanationAfter: string; // HTML string for additional notes or specific details
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
         - **Metadata Overview**: MUST be descriptive, each paragraph approx 150-220 words. Explain the core concept deeply.
         - **Use Cases**: Provide AT LEAST 5 items. Format: <li><strong>Domain Name</strong> - Detailed description.</li>
         - **Pro Tips**: Provide AT LEAST 5 items. Format: <li>Detailed tip.</li>
         - **IO Examples**: Provide 3 clear examples with input, output, and visual explanation.
         - **Comparison Table**: Full HTML table comparing all approaches.

      2. **HTML Rules**:
         - Use pure HTML, no Markdown when HTML is requested.
         - Use variable formatting like: <code class="font-mono">variable</code>
         - Lists: Steps -> <ol>, Use cases/Pro tips -> <ul>
         - Comparison table wrapper: <div class="overflow-x-auto"><table>...</table></div>
         - Classes: Use 'font-mono' for code snippets.
      
      3. **Code Rules**:
         - **ALL 4 Languages Required**: You MUST provide implementations for **typescript**, **python**, **java**, and **cpp** for *every* code approach (brute-force, optimize, etc.). Do not skip any language.
         - **Detailed Comments**: Every line of code must be clear. Complex logic MUST have inline comments explaining *why* it is done.
         - Reference Code Translation: If reference code is provided, translate it logic-for-logic into all 4 languages.
         - Java: Handle static vs non-static (use local helper class if function-inside-function needed).
      
      4. **Requirements**:
         - Provide at least 12 test cases.
         - Provide at least 4 approaches for typescript (brute-force, optimized, etc.). 
         - **CRITICAL**: Ensure Python, Java, and C++ also have the same approaches as Typescript.
         - 'optimize' codeType must be the best possible time complexity (or match Reference Code).
         - **Explanation After**: For the LAST approach (the most optimized one), the 'explanationAfter' field MUST contain the **Complexity Comparison Table** HTML (same as 'explanation.comparisonTable'). It should be a summary validation of why this is the best.

      5. **TRUTHFULNESS & ACCURACY PROTOCOL (CRITICAL)**:
         - **NO HALLUCINATIONS**: Do not invent constraints or problem details that do not exist in the standard LeetCode problem.
         - **VERIFY COMPLEXITY**: Double-check Time and Space complexity. Do not just guess. If it's O(n log n), say so.
         - **CONSISTENCY**: The logic in Python MUST match the logic in Java/CPP/TS exactly. Do not use different algorithms for different languages unless language features strictly require it.
         - **QUALITY CHECK**: Before outputting, ask yourself: "Is this explanation clear enough for a beginner? Is the code bug-free?"

      5. **STRICT TEMPLATE for 'explanationBefore'**:
         For every approach, 'explanationBefore' MUST follow this EXACT HTML structure:

         \`\`\`html
         <div class="space-y-4">
           <h4 class="font-semibold">Overview:</h4>
           <p>[Detailed overview of this specific approach. Explain what it does.]</p>
         </div>
         <div class="space-y-4">
           <h4 class="font-semibold">Intuition:</h4>
           <p>[Explain the intuition/logic behind it. Use <code class="font-mono">variable</code> for code terms.]</p>
         </div>
         <div class="space-y-4">
           <h4 class="font-semibold">Steps to Solve:</h4>
         </div>
         <ol class="list-decimal list-inside space-y-2">
           <li>[Step 1]</li>
           <li>[Step 2]</li>
           ...
         </ol>
         <div class="mt-4 p-3 bg-muted rounded-lg">
           <p><strong>Time Complexity:</strong> [Complexity, e.g. O(n)]</p>
         </div>
         <div class="mt-2 p-3 bg-muted rounded-lg">
           <p><strong>Space Complexity:</strong> [Complexity, e.g. O(1)]</p>
         </div>
         <div class="mt-2">
           <a href="/complexity" class="text-primary hover:underline">Learn more about time & space complexity</a>
         </div>
         \`\`\`

      TRAINING DATA (Follow these examples STRICTLY):

      EXAMPLE 1: Two Sum
      {
        "id": "two-sum",
        "title": "Two Sum",
        "name": "Two Sum",
        "category": "Arrays & Hashing",
        "difficulty": "easy",
        "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        "serial_no": 1,
        "list_type": "blind75",
        "explanation": {
          "problemStatement": "<p>Given an array of integers <code class='font-mono'>nums</code> and an integer <code class='font-mono'>target</code>, return indices of the two numbers such that they add up to target.</p><p>You may assume that each input would have exactly one solution, and you may not use the same element twice.</p>",
          "steps": "<ol class='list-decimal list-inside space-y-2'><li>Initialize a hash map to store value-to-index mappings.</li><li>Iterate through the array.</li><li>For each element, calculate the complement (target - current).</li><li>If complement exists in map, return [map.get(complement), current_index].</li><li>Otherwise, store the current element and its index.</li></ol>",
          "useCase": "<ul class='list-disc list-inside space-y-2'><li><strong>Financial Systems</strong> - Detecting fraud by finding transactions that sum to a suspicious round number.</li><li><strong>E-commerce</strong> - Finding two products that exactly use up a gift card balance.</li><li><strong>Payment Gateways</strong> - Verifying if any two pending charges sum up to a specific refund amount.</li><li><strong>Gaming</strong> - Matching two players whose skill ratings sum to a specific team balance requirement.</li><li><strong>Data Analysis</strong> - Finding pairs of data points that satisfy a specific summation constraint in large datasets.</li></ul>",
          "tips": "<ul class='list-disc list-inside space-y-2'><li>Use a Hash Map to achieve O(1) lookups instead of scanning the array repeatedly.</li><li>Be careful not to use the same element twice; check the index or ensure strict inequality.</li><li>Handle potential integer overflow if working with very large numbers in typed languages like C++.</li><li>Consider the case where multiple pairs might exist, though the problem guarantees one unique solution here.</li><li>If the array is sorted, a Two Pointer approach could be used instead of a Hash Map to save space.</li></ul>",
          "comparisonTable": "<div class='overflow-x-auto'><table class='min-w-full divide-y divide-border'><thead><tr><th class='px-4 py-2 text-left'>Approach</th><th class='px-4 py-2 text-left'>Time</th><th class='px-4 py-2 text-left'>Space</th></tr></thead><tbody><tr><td class='px-4 py-2'>Brute Force</td><td class='px-4 py-2'>O(n^2)</td><td class='px-4 py-2'>O(1)</td></tr><tr><td class='px-4 py-2'>One-pass Hash Table</td><td class='px-4 py-2'>O(n)</td><td class='px-4 py-2'>O(n)</td></tr></tbody></table></div>",
          "timeComplexity": "O(n)",
          "spaceComplexity": "O(n)",
          "constraints": ["2 <= nums.length <= 10^4"],
          "io": [
             { "input": "nums = [2,7,11,15], target = 9", "output": "[0,1]", "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]." },
             { "input": "nums = [3,2,4], target = 6", "output": "[1,2]", "explanation": "Because nums[1] + nums[2] == 6, we return [1, 2]." }
          ]
        },
        "implementations": [
          {
            "lang": "typescript",
            "code": [
              {
                "codeType": "starter",
                "code": "function twoSum(nums: number[], target: number): number[] {\n    \n}",
                "explanationBefore": "<div class='space-y-4'><h4 class='font-semibold'>Overview:</h4><p>This is the starting point for the algorithm.</p></div><div class='space-y-4'><h4 class='font-semibold'>Intuition:</h4><p>Implement the solution inside this function.</p></div><div class='space-y-4'><h4 class='font-semibold'>Steps to Solve:</h4></div><ol class='list-decimal list-inside space-y-2'><li>Write code.</li></ol><div class='mt-4 p-3 bg-muted rounded-lg'><p><strong>Time Complexity:</strong> N/A</p></div><div class='mt-2 p-3 bg-muted rounded-lg'><p><strong>Space Complexity:</strong> N/A</p></div><div class='mt-2'><a href='/complexity' class='text-primary hover:underline'>Learn more about time & space complexity</a></div>",
                "explanationAfter": ""
              },
               {
                "codeType": "optimize",
                "code": "function twoSum(nums: number[], target: number): number[] {\n    const map = new Map<number, number>();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement)!, i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}",
                "explanationBefore": "<div class='space-y-4'><h4 class='font-semibold'>Overview:</h4><p>This approach involves iterating through the array once while using a Hash Map to store the numbers we have seen so far and their indices. By storing the complement (target - current) in the map, we can achieve O(1) lookups.</p></div><div class='space-y-4'><h4 class='font-semibold'>Intuition:</h4><p>In a brute force approach, for every element <code class='font-mono'>x</code>, we search for <code class='font-mono'>target - x</code> in the rest of the array. This search takes O(n). A Hash Map allows us to perform this search in O(1) time. As we iterate, we ask, 'Have I seen the complement of the current number before?' If yes, we found the pair.</p></div><div class='space-y-4'><h4 class='font-semibold'>Steps to Solve:</h4></div><ol class='list-decimal list-inside space-y-2'><li>Create an empty Hash Map.</li><li>Iterate through the array.</li><li>Calculate complement.</li><li>Check map for complement.</li><li>If found, return indices.</li><li>Else, add current number to map.</li></ol><div class='mt-4 p-3 bg-muted rounded-lg'><p><strong>Time Complexity:</strong> O(n)</p></div><div class='mt-2 p-3 bg-muted rounded-lg'><p><strong>Space Complexity:</strong> O(n)</p></div><div class='mt-2'><a href='/complexity' class='text-primary hover:underline'>Learn more about time & space complexity</a></div>",
                "explanationAfter": "<div class='mt-4'><h4 class='font-semibold'>Complexity Comparison:</h4></div><div class='overflow-x-auto mt-2'><table class='min-w-full divide-y divide-border'><thead><tr><th class='px-4 py-2 text-left'>Approach</th><th class='px-4 py-2 text-left'>Time</th><th class='px-4 py-2 text-left'>Space</th></tr></thead><tbody><tr><td class='px-4 py-2'>Brute Force</td><td class='px-4 py-2'>O(n^2)</td><td class='px-4 py-2'>O(1)</td></tr><tr><td class='px-4 py-2'>One-pass Hash Table</td><td class='px-4 py-2'>O(n)</td><td class='px-4 py-2'>O(n)</td></tr></tbody></table></div>"
              }
            ]
          }
        ],
        "test_cases": [{"input": [[2, 7, 11, 15], 9], "output": [0, 1], "description": "Basic"}],
        "input_schema": [{"name": "nums", "type": "number[]", "label": "Numbers"}, {"name": "target", "type": "number", "label": "Target"}],
        "metadata": {
            "overview": "The Two Sum problem is a fundamental algorithmic challenge that serves as an excellent introduction to the concept of time-space trade-offs. The problem asks us to identify two distinct numbers within an array that sum up to a specific target value. While it may seem trivial at first glance, the problem highlights the significant efficiency gains that can be achieved by choosing the right data structure. A naive approach would involve comparing every possible pair of numbers, leading to a quadratic time complexity which is inefficient for large datasets. By utilizing a Hash Map, we can drastically reduce the search time.\n\nThe optimal solution leverages the power of a Hash Map (or Hash Table) to store elements and their indices as we iterate through the array. This allows us to check for the existence of a 'complement' (the difference between the target and the current number) in constant time, O(1). This transformation from a nested loop structure to a single pass content-aware lookup is a recurring theme in many advanced algorithms. Mastering Two Sum is a crucial first step in understanding how auxiliary space can be used to optimize computational time.",
            "companyTags": ["Google"], 
            "likes": 50000, 
            "dislikes": 0
        }
      }

      IMPORTANT REQUIREMENTS:
      1. Provide at least 3 approaches in the 'typescript' implementation if applicable (e.g., brute-force, better, optimize). 
      2. 'explanationBefore' and 'explanationAfter' MUST use the STRICT HTML TEMPLATE provided above.
      3. Ensure the 'optimize' solution is the best possible time complexity.
      4. 'test_cases' must have 'input' as an array of arguments that matches the function signature.
      
      Output JUST the JSON object for this single algorithm.
    `;

        console.log(`Generating algorithm for topic: ${topic}`);

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
        console.log(`Successfully generated algorithm: ${parsedAlgorithm.id}`);

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
