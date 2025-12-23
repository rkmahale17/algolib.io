
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // target: "all" (default) | "add_approaches"
    const { topic, referenceCode, userPrompt, existingApproaches = [], approachCount = 2, mode = "problem", target = "all" } = await req.json();
    const apiKey = Deno.env.get("GEMINI_API_KEY");

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set");
    }
    if (!topic) {
      throw new Error("Topic is required");
    }

    // --- SHARED RULES ---
    const HTML_TEMPLATE = `
        <p>[Deep dive introduction part 1 (max 60 words)]</p>
        <p>[Deep dive introduction part 2...]</p>
        <hr />
        <p><strong>Intuition:</strong></p>
        <p>[Analogy & Theory part 1 (max 60 words)]</p>
        <p>[Analogy & Theory part 2...]</p>
        <hr />
        <p><strong>Step-by-step thinking:</strong></p>
        <ol>
           <li><p>[Detailed step explanation (max 60 words)]</p></li>
           <li>...</li>
        </ol>
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
        ${userPrompt ? `USER CONTEXT / INSTRUCTIONS: \n"${userPrompt}"\n(Follow these instructions specifically. This may include LeetCode problem description, examples, constraints, or other context to help you generate accurate content.)` : ''}

        GENERAL RULES:
        1. **Truthfulness**: Verify complexity. No hallucinations.
        2. **HTML**: Use strict HTML for formatted fields.
        3. **Detailed**: Explanations must be deep and educational.
        4. **LeetCode Context**: If user provides LeetCode problem description or examples in USER CONTEXT, use them to ensure accuracy and match the official problem format.
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

    // --- CHUNK 1: CORE DATA PROMPT ---
    const corePrompt = `
        ${BASE_SYSTEM_PROMPT}


        TASK: Generate the CORE METADATA and EXPLANATION for this algorithm.
        Generate COMPLETE metadata.
        Do NOT generate code implementations yet.

        **CRITICAL JSON FORMATTING RULES**:
        1. **Escape Control Characters**: In JSON strings, you MUST properly escape:
           - Newlines: Use \\\\n (NOT literal newlines)
           - Tabs: Use \\\\t (NOT literal tabs)
           - Quotes: Use \\\\" for double quotes inside strings
           - Backslashes: Use \\\\\\\\ for literal backslashes
        2. **No Literal Line Breaks**: NEVER include actual line breaks inside JSON string values
        3. **Example**: Instead of "text with\nactual newline", use "text with\\\\nescaped newline"
        4. **HTML Content**: HTML strings can be long but must be on a single line with escaped newlines

        JSON Structure:
        {
          "id": "url-friendly-id",
          "title": "Title",
          "name": "Name",
          "category": "Category",
          "difficulty": "easy" | "medium" | "hard",
          "description": "One line description",
          "serial_no": 376,
          "list_type": "coreAlgo or blind75",
          "explanation": {
            "problemDescription": "DETAILED HTML explanation of what the problem is asking for and what inputs to expect. Use <p>, <ul>, <li> tags. Include: 1) What the problem wants you to solve, 2) Input format explanation with examples, 3) Output format explanation, 4) Key constraints to consider. This helps users understand WHAT to implement.",
            "problemStatement": "STRICT HTML - The formal problem statement",
            "steps": "HTML <ol><li>Global high level steps</li></ol>",
            "useCase": "HTML <ul><li><strong>Domain</strong> - Desc</li></ul> (5+ items)",
            "tips": "HTML <ul><li>Tip</li></ul> (5+ items)",
            "comparisonTable": "STRICT HTML Table with 6 columns: Approach, Core Idea, Time, Space, When to Use, Notes",
            "timeComplexity": "O(..)",
            "spaceComplexity": "O(..)",
            "constraints": ["String array"],
            "io": [
              {
                "input": "Labeled format using input_schema names. Example: 'nums = [2, 7, 11, 15], target = 9'",
                "output": "Expected output value. Example: '[0, 1]'",
                "explanation": "Clear explanation of why this output is correct"
              }
            ]
          },
          "test_cases": [{{"input": [1, 2], "output": 3, "description": "...", "isSubmission": false}}],
          "input_schema": [
            {{
              "name": "nums", 
              "type": "number[] | number[][] | string[][] | etc", 
              "label": "Numbers"
            }}
          ],
          "metadata": {
            "overview": "Detailed Guide. Max 300 words. Split into many  paragraphs (break after ~60 words).",
            "companyTags": [], "likes": 0, "dislikes": 0
          }
        }

        REQUIREMENTS:
        1. **Problem Description**: MUST include a dedicated "problemDescription" field that:
           - Explains WHAT the problem is asking you to solve in simple terms
           - Describes the INPUT format with concrete examples (e.g., "You will receive an array of integers nums and a target integer")
           - Describes the OUTPUT format (e.g., "Return an array of two indices")
           - Highlights key constraints (e.g., "You cannot use the same element twice")
           - Use HTML formatting with <p> tags for paragraphs and <ul>/<li> for lists
           - Example structure:
             <p>This problem asks you to find two numbers in an array that add up to a specific target value.</p>
             <p><strong>Input Format:</strong></p>
             <ul>
               <li><code>nums</code>: An array of integers (e.g., [2, 7, 11, 15])</li>
               <li><code>target</code>: An integer representing the sum we're looking for (e.g., 9)</li>
             </ul>
             <p><strong>Output Format:</strong> Return an array containing the indices of the two numbers that add up to the target.</p>
             <p><strong>Key Points:</strong> You may assume exactly one solution exists, and you cannot use the same element twice.</p>
        
        2. **Input/Output Examples (io field)**: MUST use LABELED format:
           - **Format**: Use parameter names from input_schema
           - **Example**: If input_schema has [{"name": "nums", ...}, {"name": "target", ...}]
             Then io input should be: "nums = [2, 7, 11, 15], target = 9"
           - **NOT**: Just "[2, 7, 11, 15], 9" or raw arrays
            - **Multi-line for readability**: For complex inputs (2D arrays, long arrays), use escaped newlines in JSON strings:
              Example: \"grid = [[1,2,3],\\\\n        [4,5,6],\\\\n        [7,8,9]]\"
            - Provide 3-5 diverse examples covering edge cases
        
        3. **Comparison Table**: MUST use this EXACT HTML structure: \n ${TABLE_STRUCTURE}
        
        4. **Test Cases - HIGH QUALITY REQUIRED**: 
            - **Input Format**: 'input' MUST be an **ARRAY of values** matching input_schema order. Example: \`[2, [[1,0]]]\`. 
            - **Do NOT** use an object like \`{{"num": 2}}\`. IT MUST BE AN ARRAY: \`[2]\`.
            - **2D Arrays**: For 2D array inputs (type: "number[][]" or "string[][]"), the test case input should contain the nested array directly. 
              Example: If input_schema has {{"name": "grid", "type": "number[][]"}}, then test case input is: \`[[[1,2],[3,4]]]\` (array containing the 2D array).
            
            - **QUALITY REQUIREMENTS** (12 total test cases):
              1. **Basic/Happy Path** (2 cases) - Standard valid inputs
              2. **Edge Cases** (3 cases):
                 - Minimum size (e.g., array with 1-2 elements)
                 - Maximum constraints (large values, long arrays)
                 - Empty inputs (if allowed)
              3. **Boundary Cases** (2 cases):
                 - Values at constraint boundaries (min/max values)
                 - Special values (0, negative numbers, duplicates)
              4. **Complex Cases** (3 cases):
                 - Multiple valid solutions (if applicable)
                 - Tricky patterns that test algorithm logic
                 - Cases that might break naive implementations
              5. **Submission Cases** (2 cases) - Mark LAST 8 as 'isSubmission: true'
                 - Comprehensive cases for final validation
            
            - **Descriptions**: Each test case MUST have a clear, meaningful description explaining what it tests
        
        5. **Input Schema Types**: 
            - **Supported Types**: "number", "string", "boolean", "number[]", "string[]", "boolean[]", "number[][]", "string[][]", "char[][]"
            - **2D Arrays**: Use "number[][]" for 2D number arrays, "string[][]" for 2D string arrays, "char[][]" for 2D character arrays
            - **Order Matters**: The order of input_schema items MUST match the order of values in test case 'input' arrays
        
        6. **Metadata**: Overview must be **Detailed**. 
           - **Structure**: Use multiple \`<p>\` tags. 
           - **Paragraph Rule**: **MAX 60 WORDS per paragraph**. Split content logically.
           - **Content**: Start with classification, then history/applications. Total length ~600 words.
           - **Tone**: Educational, clear, professional.
        `;

    // --- CHUNK 2 & 3: IMPLEMENTATIONS PROMPT ---
    // If target === 'add_approaches', focus only on NEW approaches
    const implsPrompt = (langs: string[]) => `
        ${BASE_SYSTEM_PROMPT}

        TASK: Generate Code Implementations for: ${langs.join(", ")}.
        
        ${target === 'add_approaches'
        ? `GENERATE **${approachCount} NEW** distinct approaches. 
              EXCLUDE these existing approaches: ${existingApproaches.join(", ")}.
              Use strategy-based naming (e.g., "dfs", "bfs", "dp", "greedy", "two-pointer", "sliding-window", "binary-search", "sorting").
              Context from User: "${userPrompt || 'Provide additional unique methods'}"`
        : `You MUST generate MULTIPLE VIABLE APPROACHES (at least 2, MAX 4).
              **APPROACH STRUCTURE & ORDER**:
              1. **Optimized Approach** (MUST BE FIRST) - codeType: "optimize"
                 - This is the BEST solution with optimal time/space complexity
                 - NOT a brute force approach
              
              2. **Strategy-Based Approach** (REQUIRED) - Use descriptive strategy names:
                 - "dfs" - Depth-First Search
                 - "bfs" - Breadth-First Search  
                 - "dp" - Dynamic Programming
                 - "greedy" - Greedy Algorithm
                 - "two-pointer" - Two Pointer Technique
                 - "sliding-window" - Sliding Window
                 - "binary-search" - Binary Search
                 - "sorting" - Sorting-based approach
                 - "backtracking" - Backtracking
                 - "divide-conquer" - Divide and Conquer
                 - "monotonic-stack" - Monotonic Stack
                 - "union-find" - Union Find / Disjoint Set
                 - Or other relevant algorithmic strategies
              
              3. **Alternative Approaches** (OPTIONAL) - Additional valid solutions with different trade-offs
                 - "iterative" - Iterative implementation
                 - "recursive" - Recursive implementation
                 - "better" - Intermediate optimization
             `
      }

        **CRITICAL JSON FORMATTING RULES**:
        1. **Escape Control Characters**: In JSON strings, you MUST properly escape:
           - Newlines: Use \\\\n (NOT literal newlines)
           - Tabs: Use \\\\t (NOT literal tabs)
           - Quotes: Use \\\\" for double quotes inside strings
           - Backslashes: Use \\\\\\\\ for literal backslashes
        2. **No Literal Line Breaks**: NEVER include actual line breaks inside JSON string values
        3. **Code Strings**: When including code in "code" field, ensure all newlines are escaped as \\\\n
        4. **HTML Content**: HTML in "explanationBefore" and "explanationAfter" must have escaped newlines

        JSON Structure:
        {
          "implementations": [
            {
              "lang": "${langs[0] === 'typescript' ? 'TypeScript' : langs[0]}", // MUST be strict: "TypeScript" (camelCase for TS), "java", "python", "cpp"
              "code": [
                {
                  "codeType": "${target === 'add_approaches' ? 'strategy-name (e.g., "dfs", "bfs", "dp", "greedy")' : 'optimize'}", 
                  "code": "FUNCTION CODE ONLY",
                  "explanationBefore": "EXTREMELY DETAILED HTML (1000+ words)",
                  "explanationAfter": "HTML content"
                }
                // ... generate ${target === 'add_approaches' ? approachCount : '2-4'} approaches
              ]
            }
            // ... repeat for other languages
          ]
        }

        CRITICAL codeType RULES:
        1. **Standard Values**: Use ONLY these standardized codeType values:
           - "optimize" - for the best/optimized approach (MUST BE FIRST, NOT brute force)
           - Strategy names: "dfs", "bfs", "dp", "greedy", "two-pointer", "sliding-window", "binary-search", "sorting", "backtracking", "divide-conquer", "monotonic-stack", "union-find"
           - Alternative: "iterative", "recursive", "better"
           - "starter" - for starter code (signature only, no logic)
        2. **NO Brute Force First**: The first approach should NEVER be brute force. Always start with the optimized solution.
        3. **Order**: The "optimize" approach MUST always be first in the code array.

        CRITICAL CODE RULES:
        1. **FUNCTION ONLY (STRICT)**: 
           - **NO 'class Solution'**. 
           - **NO 'public class Solution'**.
           - **NO imports** (EXCEPTION: Python typing - you MUST use "from typing import List" when needed). 
           - **Return ONLY the standalone function** (with typing import for Python if needed).
           - The test runner will wrap your function automatically - you provide ONLY the function itself.
        
        2. **HELPER FUNCTIONS PLACEMENT (CRITICAL)**:
           - **ALL helper functions MUST be placed ABOVE the main function**
           - **NEVER place helper functions below or after the main function**
           - **Order**: Helper functions first, then main function at the bottom
           - **Example Pattern**:
             * Helper Function 1 (defined first)
             * Helper Function 2 (defined second)
             * Main Function (defined LAST - this is the entry point)
           - **Why This Matters**: The test runner needs to find the main function, and having helpers above ensures they're available when the main function is called
           - **Applies to ALL languages**: TypeScript, Python, Java, AND C++
        
        3. **ALL LANGUAGES REQUIRED (CRITICAL)**:
           - **EVERY approach MUST have implementations in ALL 4 languages**: TypeScript, Python, Java, AND C++
           - **If you cannot provide a valid implementation in ALL 4 languages for an approach, DO NOT include that approach at all**
           - **No partial approaches**: An approach with only 2-3 language implementations is NOT acceptable
           - **Quality over quantity**: It's better to have 2 complete approaches (all 4 languages) than 4 partial approaches
           - **Verification**: Before including an approach, verify you can implement it in TypeScript, Python, Java, AND C++
        
        4. **EXACT CODE FORMAT BY LANGUAGE**:
        
           **TypeScript Format:**
           \`\`\`typescript
           function twoSum(nums: number[], target: number): number[] {
               // Initialize hash map to store number -> index mapping for O(1) lookup
               const map = new Map<number, number>();
               
               // Iterate through each number with its index
               for (let i = 0; i < nums.length; i++) {
                   // Calculate what number we need to reach the target
                   const complement = target - nums[i];
                   
                   // Check if we've seen the complement before (O(1) lookup)
                   if (map.has(complement)) {
                       // Found the pair! Return indices of complement and current number
                       return [map.get(complement)!, i];
                   }
                   
                   // Store current number and its index for future complement checks
                   map.set(nums[i], i);
               }
               
               return [];
           }
           \`\`\`
           
           **Python Format (ALWAYS use List from typing):**
           \`\`\`python
           from typing import List

           def twoSum(nums: List[int], target: int) -> List[int]:
               # Initialize hash map to store number -> index mapping for O(1) lookup
               num_map = {}
               
               # Iterate through each number with its index
               for i, num in enumerate(nums):
                   # Calculate what number we need to reach the target
                   complement = target - num
                   
                   # Check if we've seen the complement before (O(1) lookup)
                   if complement in num_map:
                       # Found the pair! Return indices of complement and current number
                       return [num_map[complement], i]
                   
                   # Store current number and its index for future complement checks
                   num_map[num] = i
               
               return []
           \`\`\`
           
           **Java Format (NO class wrapper, standalone function):**
           \`\`\`java
           public int[] twoSum(int[] nums, int target) {
               // Initialize hash map to store number -> index mapping for O(1) lookup
               Map<Integer, Integer> map = new HashMap<>();
               
               // Iterate through each number with its index
               for (int i = 0; i < nums.length; i++) {
                   // Calculate what number we need to reach the target
                   int complement = target - nums[i];
                   
                   // Check if we've seen the complement before (O(1) lookup)
                   if (map.containsKey(complement)) {
                       // Found the pair! Return indices of complement and current number
                       return new int[]{map.get(complement), i};
                   }
                   
                   // Store current number and its index for future complement checks
                   map.put(nums[i], i);
               }
               
               return new int[]{};
           }
           \`\`\`
           
           **C++ Format (NO class wrapper, standalone function):**
           \`\`\`cpp
           vector<int> twoSum(vector<int>& nums, int target) {
               // Initialize hash map to store number -> index mapping for O(1) lookup
               unordered_map<int, int> numMap;
               
               // Iterate through each number with its index
               for (int i = 0; i < nums.size(); i++) {
                   // Calculate what number we need to reach the target
                   int complement = target - nums[i];
                   
                   // Check if we've seen the complement before (O(1) lookup)
                   if (numMap.find(complement) != numMap.end()) {
                       // Found the pair! Return indices of complement and current number
                       return {numMap[complement], i};
                   }
                   
                   // Store current number and its index for future complement checks
                   numMap[nums[i]] = i;
               }
               
               return {};
           }
           \`\`\`
        
        3. **Python Type Hints**: 
           - **ALWAYS use \`List\` (capital L) from typing module** for list types
           - **NEVER use \`list\` (lowercase)** for type hints
           - Examples: \`List[int]\`, \`List[str]\`, \`List[List[int]]\`
           - Include \`from typing import List\` at the top when using List types
           - Also use \`Optional\` from typing when needed: \`Optional[int]\`
        
        4. **Detailed Comments**: **EXTREME COMMENTING REQUIRED**. 
           - **Rule**: Explain every 1-2 lines of code with detailed inline comments
           - **Content**: Explain *WHY* we are doing this, the logic behind it, not just what the syntax does
           - **Style**: Use inline comments (//, #) for line-by-line explanations
           - **Quality**: See the examples above - every significant line has a comment explaining the reasoning
        
        5. **Starter Code**: Signature ONLY. No logic. Include typing imports for Python.
           - TypeScript: \`function twoSum(nums: number[], target: number): number[] {\n    \n}\`
           - Python: \`from typing import List\n\ndef twoSum(nums: List[int], target: int) -> List[int]:\n    pass\`
           - Java: \`public int[] twoSum(int[] nums, int target) {\n    \n}\`
           - C++: \`vector<int> twoSum(vector<int>& nums, int target) {\n    \n}\`
        
        6. **Reference Code**: ${target === 'add_approaches' ? 'Use only if relevant to new approaches.' : "If provided, use it for 'optimize' logic."}
        
        
        HTML RULES (explanationBefore):
        Use this template exactly:
        ${HTML_TEMPLATE}

        **DETAIL LEVEL**:
        1. **Approach Overview**: ~400-700 words. **MUST split into multiple \`<p>\` tags**. Max 60 words per paragraph.
        2. **Intuition**: ~400-700 words. **MUST split into multiple \`<p>\` tags**. Max 60 words per paragraph. Use Analogies ("Explain like I'm 5").
        3. **Step-by-step**: Educational. If a step is long, split it.
        4. **General**: **STRICT RULE**: NO single paragraph should exceed 60 words. Divide and conquer the text.
        
        ${target === 'all' ? `**COMPARISON TABLE UPDATE**: For the **Optimize** approach (which is FIRST), put the Comparison Table HTML in 'explanationAfter'.` : ''}

        `;

    // --- EXECUTE ---
    console.log(`Starting Generation... Mode: ${target}, Topic: ${topic}`);

    let coreData = null;
    let implsPart1 = null;
    let implsPart2 = null;

    if (target === 'all') {
      [coreData, implsPart1, implsPart2] = await Promise.all([
        generateChunk(corePrompt),
        generateChunk(implsPrompt(["typescript", "python"])),
        generateChunk(implsPrompt(["java", "cpp"]))
      ]);

      if (!coreData) throw new Error("Failed to generate Core Data.");
    } else {
      // Add Approaches Mode: Only run impls chunks
      [implsPart1, implsPart2] = await Promise.all([
        generateChunk(implsPrompt(["typescript", "python"])),
        generateChunk(implsPrompt(["java", "cpp"]))
      ]);
    }

    if (!implsPart1 || !implsPart2) throw new Error("Failed to generate Implementations.");

    // --- MERGE ---
    const finalJson = {
      ...(coreData || {}), // If null (add_approaches), we return empty core. Client handles merge.
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
