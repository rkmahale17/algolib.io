
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
      
      IMPORTANT: The 'topic' provided is a specific Algorithm/LeetCode problem. 
      You MUST ensure the 'problemStatement', 'input_schema', 'constraints', and 'test_cases' EXACTLY MATCH the standard known definition of this problem (e.g. from LeetCode). 
      Do NOT invent a new problem. Just format the standard problem details into the requested HTML/JSON structure below.

      You must return strictly valid JSON. Do not include markdown code blocks or any other text outside the JSON.
      
      The JSON structure must match this TypeScript interface:
      
      interface Algorithm {
        id: string; // url-friendly-id
        title: string;
        name: string;
        category: string; // e.g. "Arrays & Hashing", "Dynamic Programming"
        difficulty: "easy" | "medium" | "hard";
        description: string; // Brief description
        serial_no: number; // match blind 75 list if possible, or 0
        list_type: "blind75" | "other" | "coreAlgo"; 
        explanation: {
          problemStatement: string; // Full detailed problem statement in HTML
          steps: string; // HTML <ol><li>...</li></ol>
          useCase: string; // HTML <ul><li>...</li></ul>
          tips: string; // HTML <ul><li>...</li></ul>
          comparisonTable: string; // HTML <div className="relative overflow-x-auto w-full"><table className="w-full border-collapse border border-border">...</table></div>
          timeComplexity: string;
          spaceComplexity: string;
          constraints: string[];
        };
        implementations: Array<{
          lang: "typescript" | "python" | "java" | "cpp"; // Return 'typescript', 'python', 'java', 'cpp'
          code: Array<{
            codeType: "starter" | "brute-force" | "better" | "optimize";
            code: string; // The full function code
            explanationBefore: string; // HTML string containing: Overview, Intuition, Steps, Complexity
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
          companyTags: string[];
          likes: number; 
          dislikes: number; 
        }
      }

      CONTENT RULES (Strict):
      1. **Structure**: 
         - Problem Statement (HTML)
         - Use Cases (<ul><li>)
         - Pro Tips (<ul><li>)
         - Steps to Solve (<ol><li>) - aligned with the exact approach
         - Comparison Table (HTML)
      
      2. **HTML Rules**:
         - Use pure HTML, no Markdown when HTML is requested.
         - Use variable formatting like: <code className="font-mono">variable</code>
         - Lists: Steps -> <ol><li>, Use cases/Pro tips -> <ul><li>
         - Comparison table wrapper: <div className="relative overflow-x-auto w-full"><table className="w-full border-collapse border border-border">
         - Padding class used: p-2
      
      3. **Code Rules**:
         - Always include clear detailed inline comments.
         - Prefer clarity over clever tricks.
         - No unnecessary imports.
         - Java: Handle static vs non-static, use local helper class if function-inside-function behavior is needed.
      
      4. **Requirements**:
         - Provide at least 12 test cases.
         - Provide at least 4 approaches for typescript (brute-force, optimized, etc.).
         - Include implementations for: typescript, python, java, cpp.
         - 'optimize' codeType must be the best possible time complexity.

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
          "problemStatement": "<p>Given an array of integers <code class=\"font-mono\">nums</code> and an integer <code class=\"font-mono\">target</code>, return indices of the two numbers such that they add up to <code class=\"font-mono\">target</code>.</p><p>You may assume that each input would have exactly one solution, and you may not use the same element twice.</p>",
          "steps": "<ol><li>Initialize a hash map to store value-to-index mappings.</li><li>Iterate through the array.</li><li>For each element, calculate the complement (target - current).</li><li>If complement exists in map, return [map.get(complement), current_index].</li><li>Otherwise, store the current element and its index.</li></ol>",
          "useCase": "<ul><li>Financial transactions (finding pairs that sum to a value).</li><li>Verification systems.</li></ul>",
          "tips": "<ul><li>Use a Hash Map for O(1) lookups.</li><li>Watch out for using the same element twice.</li></ul>",
          "comparisonTable": "<div className=\"relative overflow-x-auto w-full\"><table className=\"w-full border-collapse border border-border\"><thead><tr><th className=\"border border-border p-2\">Approach</th><th className=\"border border-border p-2\">Time</th><th className=\"border border-border p-2\">Space</th></tr></thead><tbody><tr><td className=\"border border-border p-2\">Brute Force</td><td className=\"border border-border p-2\">O(n^2)</td><td className=\"border border-border p-2\">O(1)</td></tr><tr><td className=\"border border-border p-2\">One-pass Hash Table</td><td className=\"border border-border p-2\">O(n)</td><td className=\"border border-border p-2\">O(n)</td></tr></tbody></table></div>",
          "timeComplexity": "O(n)",
          "spaceComplexity": "O(n)",
          "constraints": ["2 <= nums.length <= 10^4"]
        },
        "implementations": [
          {
            "lang": "typescript",
            "code": [
              {
                "codeType": "starter",
                "code": "function twoSum(nums: number[], target: number): number[] {\n    \n}",
                "explanationBefore": "<p>Starter code definition.</p>",
                "explanationAfter": ""
              },
              {
                "codeType": "brute-force",
                "code": "function twoSum(nums: number[], target: number): number[] {\n    // Brute force implementation\n}",
                "explanationBefore": "<p>The <strong>Brute Force</strong> approach checks every pair of numbers.</p><p><strong>Intuition</strong></p><p>Check every combination.</p><p><strong>Step-by-step thinking</strong></p><ol><li>Outer loop i.</li><li>Inner loop j.</li></ol><p><strong>Complexity Analysis</strong></p><p className=\"p-2\"><AlgoLink url=\"/complexity\">Time: O(n^2) / Space: O(1)</AlgoLink></p>",
                "explanationAfter": "<p>Time Complexity: O(n^2) because of nested loops.</p>"
              },
               {
                "codeType": "optimize",
                "code": "function twoSum(nums: number[], target: number): number[] {\n    // Optimized implementation\n}",
                "explanationBefore": "<p>Use a Hash Map.</p><p><strong>Intuition</strong></p><p>Store visited numbers to find complements instantly.</p><p><strong>Step-by-step thinking</strong></p><ol><li>Create map.</li><li>Iterate array.</li><li>Calculate complement = target - num.</li><li>Check map.</li></ol><p><strong>Complexity Analysis</strong></p><p className=\"p-2\"><AlgoLink url=\"/complexity\">Time: O(n) / Space: O(n)</AlgoLink></p>",
                "explanationAfter": "<p>Time Complexity: O(n)</p>"
              }
            ]
          }
        ],
        "test_cases": [{"input": [[2, 7, 11, 15], 9], "output": [0, 1], "description": "Basic"}],
        "input_schema": [{"name": "nums", "type": "number[]", "label": "Numbers"}, {"name": "target", "type": "number", "label": "Target"}],
        "metadata": {"companyTags": ["Google"], "likes": 50000, "dislikes": 0}
      }

      EXAMPLE 2: Best Time to Buy and Sell Stock
      {
        "id": "best-time-to-buy-and-sell-stock",
        "title": "Best Time to Buy and Sell Stock",
        "name": "Best Time to Buy and Sell Stock",
        "category": "Arrays & Hashing",
        "difficulty": "easy",
        "description": "Maximize profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.",
        "serial_no": 2,
        "list_type": "blind75",
        "explanation": {
            "problemStatement": "Maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.",
            "steps": ["Track minPrice so far.", "Calculate potential profit at each step."],
            "timeComplexity": "O(n)",
            "spaceComplexity": "O(1)",
            "constraints": ["1 <= prices.length <= 10^5"]
        },
        "implementations": [
            {
                "lang": "typescript",
                "code": [
                    {
                        "codeType": "starter",
                        "code": "function maxProfit(prices: number[]): number {\n    \n}",
                        "explanationBefore": "<p>Function signature.</p>",
                        "explanationAfter": ""
                    },
                    {
                        "codeType": "optimize",
                        "code": "function maxProfit(prices: number[]): number {\n    let minPrice = Infinity;\n    let maxProfit = 0;\n    for (let i = 0; i < prices.length; i++) {\n        if (prices[i] < minPrice) {\n            minPrice = prices[i];\n        } else if (prices[i] - minPrice > maxProfit) {\n            maxProfit = prices[i] - minPrice;\n        }\n    }\n    return maxProfit;\n}",
                        "explanationBefore": "<p>We iterate through the prices while keeping track of the <strong>minimum price</strong> seen so far.</p><p><strong>Intuition</strong></p><p>Buy low, sell high.</p><p><strong>Step-by-step thinking</strong></p><ol><li>Iterate prices.</li><li>Update minPrice.</li></ol><p><strong>Complexity Analysis</strong></p><p className=\"p-2\"><AlgoLink url=\"/complexity\">Time: O(n) / Space: O(1)</AlgoLink></p>",
                        "explanationAfter": "<p>This is a single pass solution, O(n).</p>"
                    }
                ]
            }
        ],
        "test_cases": [{"input": [[7, 1, 5, 3, 6, 4]], "output": 5, "description": "Buy at 1, sell at 6"}],
        "input_schema": [{"name": "prices", "type": "number[]", "label": "Prices"}],
        "metadata": {"companyTags": ["Amazon"], "likes": 20000, "dislikes": 500}
      }

      EXAMPLE 3: 3Sum
      {
        "id": "3sum",
        "title": "3Sum",
        "name": "3Sum",
        "category": "Arrays & Hashing",
        "difficulty": "medium",
        "description": "Find all triplets that sum to zero.",
        "serial_no": 9,
        "list_type": "blind75",
        "explanation": {
            "problemStatement": "Result set must not contain duplicate triplets.",
            "steps": ["Sort array.", "Fix one number, use two pointers for the other two."],
            "timeComplexity": "O(n^2)",
            "spaceComplexity": "O(1)",
            "constraints": []
        },
        "implementations": [
            {
                "lang": "typescript",
                "code": [
                     {
                        "codeType": "optimize",
                        "code": "function threeSum(nums: number[]): number[][] {\n    nums.sort((a, b) => a - b);\n    const res: number[][] = [];\n    for (let i = 0; i < nums.length - 2; i++) {\n        if (i > 0 && nums[i] === nums[i - 1]) continue;\n        let l = i + 1, r = nums.length - 1;\n        while (l < r) {\n            const sum = nums[i] + nums[l] + nums[r];\n            if (sum > 0) r--;\n            else if (sum < 0) l++;\n            else {\n                res.push([nums[i], nums[l], nums[r]]);\n                l++;\n                while (nums[l] === nums[l - 1] && l < r) l++;\n            }\n        }\n    }\n    return res;\n}",
                         "explanationBefore": "<p>The key idea is to <strong>sort</strong> the input array first.</p><ul><li>Fix one element \`i\`.</li><li>Use two pointers \`l\` and \`r\` to find pairs that sum to \` - nums[i]\`.</li></ul><p><strong>Intuition</strong></p><p>Fix one number, reduce to Two Sum.</p><p><strong>Step-by-step thinking</strong></p><ol><li>Sort.</li><li>Loop i.</li><li>Use 2 pointers.</li></ol><p><strong>Complexity Analysis</strong></p><p className=\"p-2\"><AlgoLink url=\"/complexity\">Time: O(n^2) / Space: O(1)</AlgoLink></p>",
                        "explanationAfter": "<p>Sorting takes O(N log N). The nested loop takes O(N^2).</p>"
                    }
                ]
            }
        ],
        "test_cases": [{"input": [[-1,0,1,2,-1,-4]], "output": [[-1,-1,2],[-1,0,1]], "description": "Found triplets"}],
        "input_schema": [{"name": "nums", "type": "number[]", "label": "Numbers"}],
        "metadata": {"companyTags": ["Facebook"], "likes": 25000, "dislikes": 1000}
      }

      EXAMPLE 4: Container With Most Water
      {
        "id": "container-with-most-water",
        "title": "Container With Most Water",
        "name": "Container With Most Water",
        "category": "Two Pointers",
        "difficulty": "medium",
        "description": "Find two lines that form a container with most water.",
        "serial_no": 10,
        "list_type": "blind75",
        "explanation": {
            "problemStatement": "Find two lines that together with the x-axis form a container, such that the container contains the most water.",
            "steps": ["Use two pointers starting at ends.", "Move the shorter line inwards."],
            "timeComplexity": "O(n)",
            "spaceComplexity": "O(1)",
            "constraints": []
        },
        "implementations": [
            {
                "lang": "typescript",
                "code": [
                    {
                        "codeType": "optimize",
                        "code": "function maxArea(height: number[]): number {\n    let l = 0, r = height.length - 1;\n    let res = 0;\n    while (l < r) {\n        const area = (r - l) * Math.min(height[l], height[r]);\n        res = Math.max(res, area);\n        if (height[l] < height[r]) l++;\n        else r--;\n    }\n    return res;\n}",
                        "explanationBefore": "<p>We use a <strong>Two Pointer</strong> approach starting from the widest container.</p><p><strong>Intuition</strong></p><p>Wide is good. Shrink if height is small.</p><p><strong>Step-by-step thinking</strong></p><ol><li>Start l=0, r=end.</li><li>Calc area.</li><li>Move smaller pointer.</li></ol><p><strong>Complexity Analysis</strong></p><p className=\"p-2\"><AlgoLink url=\"/complexity\">Time: O(n) / Space: O(1)</AlgoLink></p>",
                        "explanationAfter": "<p>Since we always move the shorter line, we visit each element at most once. Time Complexity: O(n).</p>"
                    }
                ]
            }
        ],
        "test_cases": [{"input": [[1,8,6,2,5,4,8,3,7]], "output": 49, "description": "Max area"}],
        "input_schema": [{"name": "height", "type": "number[]", "label": "Heights"}],
        "metadata": {"companyTags": ["Amazon"], "likes": 20000, "dislikes": 500}
      }

      IMPORTANT REQUIREMENTS:
      1. Provide at least 3 approaches in the 'typescript' implementation if applicable (e.g., brute-force, better, optimize). 
      2. 'explanationBefore' and 'explanationAfter' MUST be in HTML format (use <p>, <ul>, <li>, <strong>, etc).
      3. Ensure the 'optimize' solution is the best possible time complexity.
      4. 'test_cases' must have 'input' as an array of arguments that matches the function signature.
      
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
