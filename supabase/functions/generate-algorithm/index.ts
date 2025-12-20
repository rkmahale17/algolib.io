
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
          problemStatement: string; // Full detailed problem statement
          steps: string[]; // High level logical steps
          timeComplexity: string;
          spaceComplexity: string;
          constraints: string[];
        };
        implementations: Array<{
          lang: "typescript" | "python" | "java" | "cpp"; // Return at least 'typescript'
          code: Array<{
            codeType: "starter" | "brute-force" | "better" | "optimize";
            code: string; // The full function code
            explanationBefore: string; // HTML formatted string (e.g. <p>...</p>) explaining the approach theory
            explanationAfter: string; // HTML formatted string (e.g. <p>...</p>) explaining complexity and details
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
          "problemStatement": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
          "steps": ["Hash Map approach is optimal.", "Iterate and check complement."],
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
                "code": "function twoSum(nums: number[], target: number): number[] {\n    for (let i = 0; i < nums.length; i++) {\n        for (let j = i + 1; j < nums.length; j++) {\n            if (nums[i] + nums[j] === target) return [i, j];\n        }\n    }\n    return [];\n}",
                "explanationBefore": "<p>The <strong>Brute Force</strong> approach checks every pair of numbers.</p>",
                "explanationAfter": "<p>Time Complexity: O(n^2) because of nested loops.</p>"
              },
              {
                "codeType": "optimize",
                "code": "function twoSum(nums: number[], target: number): number[] {\n    const map = new Map<number, number>();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) return [map.get(complement)!, i];\n        map.set(nums[i], i);\n    }\n    return [];\n}",
                "explanationBefore": "<p>The <strong>Optimized</strong> approach uses a Hash Map (Object or Map) to store visited numbers.</p>",
                "explanationAfter": "<p>Time Complexity: O(n) as we pass through the list once.</p>"
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
                        "explanationBefore": "<p>We iterate through the prices while keeping track of the <strong>minimum price</strong> seen so far.</p>",
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
                        "explanationBefore": "<p>The key idea is to <strong>sort</strong> the input array first.</p><ul><li>Fix one element `i`.</li><li>Use two pointers `l` and `r` to find pairs that sum to ` - nums[i]`.</li></ul>",
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
                        "explanationBefore": "<p>We use a <strong>Two Pointer</strong> approach starting from the widest container.</p>",
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
