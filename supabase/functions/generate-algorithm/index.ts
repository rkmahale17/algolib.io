const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // target: "info" | "test_cases" | "solutions" | "optimized" | "add_approaches" | "all" (legacy) | "enhance_comments" | "starter_code"
    const {
      topic,
      referenceCode,
      userPrompt,
      existingApproaches = [],
      approachCount = 2,
      mode = "problem",
      problemType = "dsa",
      target = "all",
      input_schema, // Required for 'test_cases', 'solutions', 'starter_code'
      implementations: inputImplementations, // For 'enhance_comments'
      lang: targetLang, // For 'starter_code'
      // For pattern_explanations
      title,
      description,
      categories,
    } = await req.json();
    const apiKey = Deno.env.get("GEMINI_API_KEY");

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set");
    }
    if (!topic && !['pattern_explanations', 'enhance_comments'].includes(target)) {
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
           <li><p>[Crystal clear, short step explanation (max 30 words)]</p></li>
           <li>...</li>
        </ol>
        <hr />
        <p>
          <strong>Time Complexity:</strong> [Complexity]<br>
          <strong>Space Complexity:</strong> [Complexity]<br>
          <br>
          <AlgoLink url="/guides/time-complexity" className="m-4">Learn Complexity</AlgoLink>
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
        MODE: ${mode === "core" ? "Core Algorithm (Define problem yourself)" : "LeetCode Problem (Match standard definition)"}
        ${referenceCode ? `REFERENCE CODE PROVIDED (Use for Logic): \n${referenceCode}` : ""}
        ${userPrompt ? `USER CONTEXT / INSTRUCTIONS: \n"${userPrompt}"\n(Follow these instructions specifically.)` : ""}
        ${input_schema ? `INPUT SCHEMA PROVIDED: \n${JSON.stringify(input_schema)}` : ""}
        PROBLEM TYPE: ${problemType === 'sql' ? 'SQL / Database Query' : problemType === 'frontend' ? 'Frontend / UI / Browser / Web API Implementation (Use frontend specific terminology)' : 'Standard Data Structures & Algorithms'}
        
        GENERAL RULES:
        1. **Truthfulness**: Verify complexity. No hallucinations.
        2. **HTML**: Use strict HTML for formatted fields.
        3. **Detailed**: Explanations must be deep and educational.
        4. **C++ namespace**: For C++ code, do NOT use the 'std::' namespace prefix (e.g. write 'vector<string>' instead of 'std::vector<std::string>', 'string' instead of 'std::string', etc.) as 'using namespace std;' is already globally defined.
        `;

    // --- HELPER TO CALL GEMINI ---
    async function generateChunk(promptText: string) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
          }),
        },
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

    // --- PROMPTS ---

    // 1. INFO PROMPT (Metadata)
    const infoPrompt = `
        ${BASE_SYSTEM_PROMPT}

        TASK: Generate the CORE METADATA and EXPLANATION for this algorithm.
        Do NOT generate test cases or code yet.

        **CRITICAL JSON FORMATTING RULES**:
        1. **No Literal Line Breaks in JSON**: NEVER include actual unescaped line breaks inside JSON string values.
        2. **No Newline Text Escape inside Text/HTML**: Do NOT use literal '\\\\n' or '\\\\n' (backslash-n) inside HTML, description, overview, tips, or explanation fields. Write all HTML and text fields as a single line (no newlines). Use HTML tags (like '<p>', '<br>', '<li>') for formatting and breaks.
        3. **Code Newlines**: In code blocks, use standard JSON escaped newlines (which appear as '\\n' in JSON). Do NOT double-escape (do NOT use '\\\\n').
        4. **Escape Quotes**: Use \\\\" for double quotes inside JSON strings.

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
            "problemDescription": "DETAILED HTML explanation (What needs to be solved, Input format, Output format, Constraints). MUST use multiple meaningful <p> tags properly divided for readability instead of a single block of text. For SQL schemas, MUST use strict HTML <table> tags (<thead>, <tbody>, <th>, <td>) and NEVER use ASCII art tables (+---+---+). Do NOT include, mention, or append any examples here.",
            "problemStatement": "STRICT HTML - The formal problem statement. MUST use multiple meaningful <p> tags properly divided for readability. For SQL schemas, MUST use strict HTML <table> tags and NEVER use ASCII art tables. Do NOT include, mention, or append any examples, input/output samples, or walk-through explanations here (examples must go exclusively in the 'io' field).",
            "steps": "HTML <ol><li>Crystal clear and short step to solve the problem (max 25 words per step, exactly 4-5 steps total)</li></ol>",
            "useCase": "HTML <ul><li><strong>Domain</strong> - Desc</li></ul> (5+ items)",
            "tips": "HTML <ul><li>Short progressive hint to solve the problem (max 20 words)</li></ul> (exactly 5 items, getting progressively more revealing)",
            "comparisonTable": "STRICT HTML Table with 6 columns: Approach, Core Idea, Time, Space, When to Use, Notes. Use this structure: \\n${TABLE_STRUCTURE}",
            "timeComplexity": "O(..)",
            "spaceComplexity": "O(..)",
            "constraints": ["String array"],
            "io": [
              {
                "input": "${problemType === 'sql' ? 'MUST be a strict HTML <table> representing the input DB tables and their data. Use <thead> and <tbody>.' : 'Labeled format using input_schema names. Example: \\\'nums = [2, 7], target = 9\\\''}",
                "output": "${problemType === 'sql' ? 'MUST be a strict HTML <table> representing the expected query result rows. Use <thead> and <tbody>.' : 'Expected output value.'}",
                "explanation": "${problemType === 'sql' ? 'Clear explanation in strict HTML format using <p> tags.' : 'Clear explanation'}"
              }
            ]
          },
          "input_schema": [
            {
              "name": "nums", 
              "type": "${problemType === 'sql' ? 'table' : 'number[] | number[][] | string[][] | string | etc'}", 
              "label": "Numbers"
            }
          ],
          "metadata": {
            "overview": "Detailed Guide. Max 300 words. Split into many paragraphs (break after ~60 words). use <p> tags.",
            ${problemType === 'sql' ? `"db_setup": "ONLY valid SQLite-compatible SQL CREATE TABLE statements for the problem. SQLite does not support AUTO_INCREMENT, so use INTEGER PRIMARY KEY (which auto-increments automatically) for primary keys and avoid AUTO_INCREMENT. Do NOT provide INSERT INTO statements here. Treat this as a Code Block: use standard escaped newlines (\\\\n), NOT HTML <br> tags.",` : ''}
            "companyTags": [], "likes": 0, "dislikes": 0
          }
        }
        `;

    // 2. TEST CASES PROMPT
    const testCasesPrompt = `
        ${BASE_SYSTEM_PROMPT}

        TASK: Generate TEST CASES for this algorithm.
        Use the provided INPUT SCHEMA (from previous step/context).

        JSON Structure:
        ${problemType === 'frontend' ? `{
          "test_cases": [
            { "name": "Test case description", "testCode": "assert(fn(1) === 2);", "isSubmission": false }
          ]
        }` : `{
          "test_cases": [
            { "input": [1, 2], "output": 3, "description": "...", "isSubmission": false }
          ]
        }`}

        REQUIREMENTS:
        1. **Input Format**: ${problemType === 'sql' ? '\'input\' MUST be an **ARRAY of values** in order of input_schema. For SQL problems, the input array should contain the actual JSON data representing the rows of the tables defined in the schema (e.g. `[{"Person": [{"personId": 1, ...}]}]` or `[[["John", "Doe"], ...]]`). Expected output should be the expected rows/result of the query.' : problemType === 'frontend' ? 'Frontend problems use unit test assertions. Each test case MUST have a `name` and `testCode`. The `testCode` contains executable TypeScript test assertions using helpers like `assert`, `assertEquals`, `assertThrows`, `createMockFn`.' : '\'input\' MUST be an **ARRAY of values** in order of input_schema.'}
        2. **Quality**: ${problemType === 'sql' ? 'Exactly 3 Total Cases (1 Basic, 1 Edge, 1 Complex). Mark the last one as isSubmission: true.' : problemType === 'frontend' ? 'Exactly 5 Total Cases. Mark the last 2 as isSubmission: true.' : '12 Total Cases.\n           - 2 Basic\n           - 3 Edge (Min/Max/Empty)\n           - 2 Boundary\n           - 3 Complex\n           - 2 Submission (Mark isSubmission: true)'}
        3. **2D Arrays**: [[1,2], [3,4]] -> Input array wrapping it: [[[1,2], [3,4]]] (only for DSA)
        `;

    // 3. SOLUTIONS PROMPT
    // If target === 'add_approaches', focus only on NEW approaches
    const implsPrompt = (langs: string[]) => `
        ${BASE_SYSTEM_PROMPT}

        TASK: Generate Code Implementations for: ${langs.join(", ")}.
        
        ${mode === "core"
        ? `GENERATE EXACTLY ONE APPROACH.
           IF Reference Code is provided, use that logic.
           ELSE use the best optimized approach for this core pattern.
           - codeType: "optimize"`
        : target === "add_approaches"
          ? `GENERATE **${approachCount} NEW** distinct approaches. 
              EXCLUDE these existing approaches: ${existingApproaches.join(", ")}.
              Use strategy-based naming.`
          : target === "optimized"
            ? `GENERATE EXACTLY ONE APPROACH.
               IF Reference Code is provided, use that logic.
               ELSE use the best optimized approach for this problem.
               - codeType: "optimize"`
            : `You MUST generate MULTIPLE VIABLE APPROACHES (at least 1, MAX 3).
               1. **Optimized Approach** (First) - codeType: "optimize"
               2. **Strategy-Based Approach** (Required) - e.g. "dfs", "bfs", "dp", "greedy"
               3. **Alternative Approaches** (Optional)`
      }

        **CRITICAL JSON FORMATTING RULES**:
        1. **No Literal Line Breaks in JSON**: NEVER include actual unescaped line breaks inside JSON string values.
        2. **No Newline Text Escape inside Text/HTML**: Do NOT use literal '\\\\n' or '\\\\n' (backslash-n) inside HTML, explanationBefore, or explanationAfter fields. Write all HTML and text fields as a single line (no newlines). Use HTML tags (like '<p>', '<br>', '<li>') for formatting and breaks.
        3. **Code Newlines**: In code blocks, use standard JSON escaped newlines (which appear as '\\n' in JSON). Do NOT double-escape (do NOT use '\\\\n').
        4. **Escape Quotes**: Use \\\\" for double quotes inside JSON strings.
        5. **Stand-alone Functions**: For **TypeScript** and **Python**, use standalone functions.
        6. **Helpers**: Place helpers ABOVE main function.
        7. **All Languages**: ${problemType === 'sql' ? 'Must implement only in standard SQLite. DO NOT wrap the SQL query in a function or class. Just provide the raw SQLite query.' : problemType === 'frontend' ? 'Must implement in TypeScript.' : 'Must implement in TS, Python, Java, C++.'}
        8. **Strict Wrapping (Java/C++)**:
           - For **Java**: You MUST wrap everything in \`public static class Solution { ... }\`.
           - For **C++**: You MUST wrap everything in \`class Solution { public: ... };\`.
           - NO main function, NO example calls, NO extra boilerplates outside the class.
        9. **C++ namespace**: Do NOT use 'std::' namespace prefix in C++ code. The environment already uses 'using namespace std;'.

        JSON Structure:
        {
          "implementations": [
            {
              "lang": "${langs[0]}",
              "code": [
                {
                  "codeType": "optimize" | "strategy-name", 
                  "code": "${problemType === 'sql' ? 'RAW SQLITE QUERY ONLY (e.g. SELECT ...)' : 'FUNCTION CODE ONLY'}",
                  "explanationBefore": "Detailed HTML (approx 500+ words) using template provided earlier.",
                  "explanationAfter": "HTML content"
                }
              ]
            }
          ]
        }
        
        HTML TEMPLATE for explanationBefore:
        ${HTML_TEMPLATE}
        `;

    // 4. ENHANCE COMMENTS PROMPT
    const enhanceCommentsPrompt = (impls: any[]) => `
        ${BASE_SYSTEM_PROMPT}

        TASK: ENHANCE COMMENTS for the provided code implementation.
        
        RULES:
        1. **NO CODE CHANGE**: Do NOT change any logic, variables, names, or structure. Return the EXACT SAME code but with comments added. Logic preservation does NOT mean ignoring the wrapping requirement. Always ensure the 'Solution' class wrapper is present for Java and C++.
        2. **Educational Comments**: Add professional, well-formatted comments explaining the logic step-by-step.
        3. **Targeted**: You are provided with a specific language and approach. Return only that.
        4. **Formatting**: Ensure proper indentation and formatting of the code.
        5. **Return Exact Structure**: Return the input structure with only the 'code' field updated.
        6. **Strict Wrapping (Java/C++)**: 
           - For **Java**: If the source is not already wrapped, you MUST wrap everything in \`public static class Solution { ... }\`.
           - For **C++**: If the source is not already wrapped, you MUST wrap everything in \`class Solution { public: ... };\`.

        INPUT CODE:
        ${JSON.stringify(impls)}

        JSON Structure:
        {
          "implementations": [
            {
              "lang": "Language (e.g. Python, Java, C++, TypeScript)",
              "code": [
                {
                  "codeType": "...", 
                  "code": "CODE WITH COMMENTS",
                  "explanationBefore": "Keep existing",
                  "explanationAfter": "Keep existing"
                }
              ]
            }
          ]
        }
    `;

    // 5. STARTER CODE PROMPT
    const starterCodePrompt = (reference: string, lang: string) => `
        ${BASE_SYSTEM_PROMPT}

        TASK: Generate a STARTER TEMPLATE for the "${lang}" language.
        
        REFERENCE CODE (Optimized Solution):
        ${reference}

        RULES:
        1. **Strip Logic**: Remove the implementation details but KEEP the function signature and any necessary setup.
        2. **Placeholder**: Use exactly one comment inside the function body: "// TODO: Implement" (or "# TODO: Implement" for Python). Do NOT add ANY other comments or information inside the function body.
        3. **Common Classes**: If the problem uses classes like \`ListNode\`, \`TreeNode\`, \`GraphNode\`, etc., you MUST include commented-out definitions of these classes in the specific language's syntax at the top.
        4. **Strict Wrapping (Java/C++)**:
           - For **Java**: You MUST wrap everything in \`public static class Solution { ... }\`.
           - For **C++**: You MUST wrap everything in \`class Solution { public: ... };\`.
           - NO main function, NO example calls, NO extra boilerplates outside the class.
        5. **Python Rule**: Do NOT use a class-based approach for Python. You MUST create a standalone function ONLY. Because it is a standalone function, do NOT include the \`self\` parameter in the function signature.
        6. **C++ namespace**: Do NOT use 'std::' namespace prefix in C++ starter code. The environment already uses 'using namespace std;'.

        **CRITICAL JSON FORMATTING RULES**:
        1. **No Literal Line Breaks in JSON**: NEVER include actual unescaped line breaks inside JSON string values. Use standard JSON escaped newlines (e.g. '\\n' in JSON) for code. Do NOT double-escape as '\\\\n'.

        JSON Structure:
        {
          "code": "STARTER CODE CONTENT"
        }
    `;

    // 6. PATTERN EXPLANATIONS PROMPT
    const patternExplanationsPrompt = (t: string, d: string, c: string[]) => `
        You are an expert DSA instructor creating content for the "Guess the Pattern" assessment.
        Given the problem title, description, and selected categories/patterns, generate explanations for why these patterns apply.

        Problem Title: ${t}
        Problem Description: 
        ${d}

        Selected Patterns: ${c.join(', ')}

        Instructions:
        Generate a structured JSON object where keys are the pattern names. Also, include a "General" key that explains the basic intuition, data types involved, and the core solution logic.
        The values should be clear, detailed explanations (suitable for a student) written in HTML format.
        Ensure the keys exactly match the selected patterns.

        CRITICAL: For the "General" key, you MUST strictly follow this exact sequence and structure (adapt the brackets to the actual problem):

        <p>The '${t}' problem asks us to find...</p>
        <p><strong>Basic Intuition (Brute-Force):</strong></p>
        <p>[Explain the straightforward approach...]</p>
        <p>Time Complexity: O(...) due to...</p>
        <p>Space Complexity: O(...) as...</p>
        
        <p><strong>Optimized Intuition ([Primary Pattern]):</strong></p>
        <p>[Explain the optimized perspective...]</p>
        
        <p><strong>Data Types Involved:</strong></p>
        <ul>
          <li><code>[var1]</code>: [description]</li>
          <li><code>[var2]</code>: [description]</li>
        </ul>
        
        <p><strong>Core Solution Logic ([Primary Pattern]):</strong></p>
        <ol>
          <li>[Step 1]</li>
          <li>[Step 2]</li>
        </ol>
        <p>Time Complexity: O(...) on average...</p>
        <p>Space Complexity: O(...) in the worst case...</p>

        Output FORMAT (strictly JSON, no markdown codeblocks):
        {
          "General": "STRICTLY FOLLOW THE HTML SEQUENCE SPECIFIED ABOVE...",
          "Pattern Name 1": "Why this pattern applies...",
          "Pattern Name 2": "Why this pattern applies..."
        }
    `;

    // --- EXECUTE BASED ON TARGET ---
    console.log(`Starting Generation... Mode: ${target}, Topic: ${topic || title}`);

    let responseData = {};

    if (target === "info") {
      // 1. Generate Info
      responseData = await generateChunk(infoPrompt);
      if (!responseData) throw new Error("Failed to generate Info.");
    } else if (target === "test_cases") {
      // 2. Generate Test Cases
      if (!input_schema) throw new Error("input_schema is required for test_cases generation");
      responseData = await generateChunk(testCasesPrompt);
      if (!responseData) throw new Error("Failed to generate Test Cases.");

    } else if (target === "solutions" || target === "optimized" || target === "add_approaches") {
      // 3. Generate Solutions
      if (!input_schema && target !== 'add_approaches') throw new Error("input_schema is required for solutions/optimized generation");
      // Note: add_approaches might not strictly need schema if it can infer from topic, but safer if provided. 
      // Existing flow didn't strictly leverage schema for code gen input args, it inferred. 
      // But passing it is good context.

      const sqlOnly = problemType === 'sql';
      const frontendOnly = problemType === 'frontend';
      
      const generationPromises = sqlOnly ? [
        generateChunk(implsPrompt(["sql"]))
      ] : frontendOnly ? [
        generateChunk(implsPrompt(["TypeScript"]))
      ] : [
        generateChunk(implsPrompt(["TypeScript"])),
        generateChunk(implsPrompt(["python"])),
        generateChunk(implsPrompt(["java"])),
        generateChunk(implsPrompt(["cpp"])),
      ];

      const responses = await Promise.all(generationPromises);

      if (responses.some(r => !r)) throw new Error("Failed to generate Implementations.");

      const allImpls = responses.flatMap(r => r.implementations || []);

      // Normalize languages to match frontend expected IDs
      const normalizedImpls = allImpls.map((impl: any) => {
        let normalizedLang = impl.lang;
        if (!normalizedLang) return impl;
        const lower = normalizedLang.toLowerCase();
        if (lower === 'c++' || lower === 'cplusplus' || lower === 'cpp') {
          normalizedLang = 'cpp';
        } else if (lower === 'typescript') {
          normalizedLang = 'TypeScript';
        } else if (lower === 'javascript') {
          normalizedLang = 'javascript';
        } else if (lower === 'python') {
          normalizedLang = 'python';
        } else if (lower === 'java') {
          normalizedLang = 'java';
        } else if (lower === 'sql') {
          normalizedLang = 'sql';
        }
        return { ...impl, lang: normalizedLang };
      });

      responseData = {
        implementations: normalizedImpls,
      };

    } else if (target === "enhance_comments") {
      if (!inputImplementations) throw new Error("implementations is required for enhance_comments");
      responseData = await generateChunk(enhanceCommentsPrompt(inputImplementations));
      if (!responseData) throw new Error("Failed to enhance comments.");

    } else if (target === "starter_code") {
      if (!referenceCode || !targetLang) throw new Error("referenceCode and lang are required for starter_code");
      responseData = await generateChunk(starterCodePrompt(referenceCode, targetLang));
      if (!responseData) throw new Error("Failed to generate starter code.");

    } else if (target === "pattern_explanations") {
      if (!title || !description || !categories) throw new Error("title, description, and categories are required for pattern_explanations");
      responseData = await generateChunk(patternExplanationsPrompt(title, description, categories));
      if (!responseData) throw new Error("Failed to generate pattern explanations.");

    } else if (target === "all") {
      // Legacy Monolithic Mode (Optional, for backward compat or one-shot)
      // This runs EVERYTHING. Might still timeout.
      const corePromptLegacy = `
          ${infoPrompt}
          ALSO GENERATE "test_cases" (12 cases) AND "input_schema" in the SAME JSON.
       `;
      // Note: reusing prompts is tricky if they define contradicting JSON structures.
      // It's safer to keep the old logic for "all" or simply deprecate it. 
      // User asked to SPLIT it. So I will implement "all" as a chained server-side call or just separate invocations?
      // Let's just do Promise.all if they really want "all", but with risk.
      // Actually, the prompt above for 'info' includes 'input_schema' but NOT 'test_cases'.
      // I'll stick to the new split. If target='all', I'll chain them internally here.

      console.log("Running in legacy 'all' mode - internally chained.");

      // A. Info
      const infoData = await generateChunk(infoPrompt);

      // B. Test Cases
      // Inject schema into prompt context
      const schema = infoData.input_schema;
      const testCasesPromptWithSchema = testCasesPrompt.replace(
        `INPUT SCHEMA PROVIDED:`,
        `INPUT SCHEMA PROVIDED: \n${JSON.stringify(schema)}`
      );
      const testData = await generateChunk(testCasesPromptWithSchema);

      // C. Solutions
      let allImplsLegacy: any[] = [];
      
      if (problemType === 'sql') {
        const sqlData = await generateChunk(implsPrompt(["sql"]));
        allImplsLegacy = [...(sqlData.implementations || [])];
      } else if (problemType === 'frontend') {
        const tsData = await generateChunk(implsPrompt(["typescript"]));
        allImplsLegacy = [
          ...(tsData?.implementations || []),
        ];
      } else {
        const [tsData, pyData, javaData, cppData] = await Promise.all([
          generateChunk(implsPrompt(["typescript"])),
          generateChunk(implsPrompt(["python"])),
          generateChunk(implsPrompt(["java"])),
          generateChunk(implsPrompt(["cpp"])),
        ]);
        allImplsLegacy = [
          ...(tsData.implementations || []),
          ...(pyData.implementations || []),
          ...(javaData.implementations || []),
          ...(cppData.implementations || [])
        ];
      }

      // Normalize languages to match frontend expected IDs
      const normalizedImplsLegacy = allImplsLegacy.map((impl: any) => {
        let normalizedLang = impl.lang;
        if (!normalizedLang) return impl;
        const lower = normalizedLang.toLowerCase();
        if (lower === 'c++' || lower === 'cplusplus' || lower === 'cpp') {
          normalizedLang = 'cpp';
        } else if (lower === 'typescript') {
          normalizedLang = 'TypeScript';
        } else if (lower === 'javascript') {
          normalizedLang = 'javascript';
        } else if (lower === 'python') {
          normalizedLang = 'python';
        } else if (lower === 'java') {
          normalizedLang = 'java';
        }
        return { ...impl, lang: normalizedLang };
      });

      responseData = {
        ...infoData,
        ...testData,
        implementations: normalizedImplsLegacy,
      };
    }

    return new Response(JSON.stringify(responseData), {
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
