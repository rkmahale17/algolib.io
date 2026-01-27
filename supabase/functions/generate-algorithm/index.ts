const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // target: "info" | "test_cases" | "solutions" | "add_approaches" | "all" (legacy)
    const {
      topic,
      referenceCode,
      userPrompt,
      existingApproaches = [],
      approachCount = 2,
      mode = "problem",
      target = "all",
      input_schema, // Required for 'test_cases' and 'solutions'
    } = await req.json();
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
        MODE: ${mode === "core" ? "Core Algorithm (Define problem yourself)" : "LeetCode Problem (Match standard definition)"}
        ${referenceCode ? `REFERENCE CODE PROVIDED (Use for Logic): \n${referenceCode}` : ""}
        ${userPrompt ? `USER CONTEXT / INSTRUCTIONS: \n"${userPrompt}"\n(Follow these instructions specifically.)` : ""}
        ${input_schema ? `INPUT SCHEMA PROVIDED: \n${JSON.stringify(input_schema)}` : ""}

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
        1. **Escape Control Characters**: In JSON strings, you MUST properly escape:
           - Newlines: Use \\\\n (NOT literal newlines)
           - Tabs: Use \\\\t (NOT literal tabs)
           - Quotes: Use \\\\" for double quotes inside strings
        2. **No Literal Line Breaks**: NEVER include actual line breaks inside JSON string values.

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
            "problemDescription": "DETAILED HTML explanation... (What needs to be solved, Input format, Output format, Constraints)",
            "problemStatement": "STRICT HTML - The formal problem statement",
            "steps": "HTML <ol><li>Global high level steps</li></ol>",
            "useCase": "HTML <ul><li><strong>Domain</strong> - Desc</li></ul> (5+ items)",
            "tips": "HTML <ul><li>Tip</li></ul> (5+ items)",
            "comparisonTable": "STRICT HTML Table with 6 columns: Approach, Core Idea, Time, Space, When to Use, Notes. Use this structure: \\n${TABLE_STRUCTURE}",
            "timeComplexity": "O(..)",
            "spaceComplexity": "O(..)",
            "constraints": ["String array"],
            "io": [
              {
                "input": "Labeled format using input_schema names. Example: 'nums = [2, 7], target = 9'",
                "output": "Expected output value.",
                "explanation": "Clear explanation"
              }
            ]
          },
          "input_schema": [
            {
              "name": "nums", 
              "type": "number[] | number[][] | string[][] | string | etc", 
              "label": "Numbers"
            }
          ],
          "metadata": {
            "overview": "Detailed Guide. Max 300 words. Split into many paragraphs (break after ~60 words). use <p> tags.",
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
        {
          "test_cases": [
            { "input": [1, 2], "output": 3, "description": "...", "isSubmission": false }
          ]
        }

        REQUIREMENTS:
        1. **Input Format**: 'input' MUST be an **ARRAY of values** in order of input_schema.
        2. **Quality**: 12 Total Cases.
           - 2 Basic
           - 3 Edge (Min/Max/Empty)
           - 2 Boundary
           - 3 Complex
           - 2 Submission (Mark isSubmission: true)
        3. **2D Arrays**: [[1,2], [3,4]] -> Input array wrapping it: [[[1,2], [3,4]]]
        `;

    // 3. SOLUTIONS PROMPT
    // If target === 'add_approaches', focus only on NEW approaches
    const implsPrompt = (langs: string[]) => `
        ${BASE_SYSTEM_PROMPT}

        TASK: Generate Code Implementations for: ${langs.join(", ")}.
        
        ${target === "add_approaches"
        ? `GENERATE **${approachCount} NEW** distinct approaches. 
              EXCLUDE these existing approaches: ${existingApproaches.join(", ")}.
              Use strategy-based naming.`
        : `You MUST generate MULTIPLE VIABLE APPROACHES (at least 1, MAX 3).
              1. **Optimized Approach** (First) - codeType: "optimize"
              2. **Strategy-Based Approach** (Required) - e.g. "dfs", "bfs", "dp", "greedy"
              3. **Alternative Approaches** (Optional)`
      }

        **CRITICAL JSON FORMATTING RULES**:
        1. **Escape Control Characters**: Use \\\\n for newlines, \\\\" for quotes.
        2. **Function Only**: No classes. Return standalone function.
        3. **Helpers**: Place helpers ABOVE main function.
        4. **All Languages**: Must implement in TS, Python, Java, C++.

        JSON Structure:
        {
          "implementations": [
            {
              "lang": "TypeScript", // "Python", "Java", "C++"
              "code": [
                {
                  "codeType": "optimize" | "strategy-name", 
                  "code": "FUNCTION CODE ONLY",
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

    // --- EXECUTE BASED ON TARGET ---
    console.log(`Starting Generation... Mode: ${target}, Topic: ${topic}`);

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

    } else if (target === "solutions" || target === "add_approaches") {
      // 3. Generate Solutions
      if (!input_schema && target !== 'add_approaches') throw new Error("input_schema is required for solutions generation");
      // Note: add_approaches might not strictly need schema if it can infer from topic, but safer if provided. 
      // Existing flow didn't strictly leverage schema for code gen input args, it inferred. 
      // But passing it is good context.

      const [tsData, pyData, javaData, cppData] = await Promise.all([
        generateChunk(implsPrompt(["typescript"])),
        generateChunk(implsPrompt(["python"])),
        generateChunk(implsPrompt(["java"])),
        generateChunk(implsPrompt(["cpp"])),
      ]);

      if (!tsData || !pyData || !javaData || !cppData) throw new Error("Failed to generate Implementations.");

      responseData = {
        implementations: [
          ...(tsData.implementations || []),
          ...(pyData.implementations || []),
          ...(javaData.implementations || []),
          ...(cppData.implementations || [])
        ],
      };

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
      const [tsData, pyData, javaData, cppData] = await Promise.all([
        generateChunk(implsPrompt(["typescript"])),
        generateChunk(implsPrompt(["python"])),
        generateChunk(implsPrompt(["java"])),
        generateChunk(implsPrompt(["cpp"])),
      ]);

      responseData = {
        ...infoData,
        ...testData,
        implementations: [
          ...(tsData.implementations || []),
          ...(pyData.implementations || []),
          ...(javaData.implementations || []),
          ...(cppData.implementations || [])
        ],
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
