
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // target: "all" (default) | "initial" | "enrichment"
    const { topic, referenceCode, mode = "problem", target = "all" } = await req.json();
    const apiKey = Deno.env.get("GEMINI_API_KEY");

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set");
    }
    if (!topic) {
      throw new Error("Topic is required");
    }

    // --- SHARED RULES ---
    const HTML_TEMPLATE = `
        <p><strong>Approach Overview:</strong></p>
        <p>[Deep dive introduction part 1 (max 250 words)]</p>
        <p>[Deep dive introduction part 2...]</p>
        <hr />
        <p><strong>Intuition:</strong></p>
        <p>[Analogy & Theory part 1 (max 250 words)]</p>
        <p>[Analogy & Theory part 2...]</p>
        <hr />
        <p><strong>Step-by-step thinking:</strong></p>
        <ol>
           <li><p>[Detailed step explanation (max 250 words)]</p></li>
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

    // --- CHUNK 1: CORE DATA PROMPT ---
    const corePrompt = `
        ${BASE_SYSTEM_PROMPT}

        TASK: Generate the CORE METADATA and EXPLANATION for this algorithm.
        ${target === 'enrichment' ? 'Generate ONLY the Comparison Table. Other keys optional/null.' : 'Generate COMPLETE metadata.'}
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
            "comparisonTable": ${target === 'initial' ? 'null' : `"STRICT HTML Table with 6 columns: Approach, Core Idea, Time, Space, When to Use, Notes"`},
            "timeComplexity": "O(..)",
            "spaceComplexity": "O(..)",
            "constraints": ["String array"],
            "io": [{"input": "...", "output": "...", "explanation": "..."}]
          },
          "test_cases": [{"input": [1, 2], "output": 3, "description": "...", "isSubmission": false}],
          "input_schema": [{"name": "nums", "type": "number[]", "label": "Numbers"}],
          "metadata": {
            "overview": "Detailed Guide. Max 600 words. Split into 2 paragraphs (break after ~300 words).",
            "companyTags": [], "likes": 0, "dislikes": 0
          }
        }

        REQUIREMENTS:
        ${target !== 'initial' ? `1. **Comparison Table**: MUST use this EXACT HTML structure: \n ${TABLE_STRUCTURE}` : ''}
        2. **Test Cases**: 
            - **Input Format**: 'input' MUST be an **ARRAY of values** matching input_schema order. Example: \`[2, [[1,0]]]\`. 
            - **Do NOT** use an object like \`{"num": 2}\`. IT MUST BE AN ARRAY: \`[2]\`.
            - Provide 12 total. Mark the LAST 8 as 'isSubmission: true'.
        3. **Metadata**: Overview must be **Detailed**. 
           - **Structure**: Use multiple \`<p>\` tags. 
           - **Paragraph Rule**: **MAX 250 WORDS per paragraph**. Split content logically.
           - **Content**: Start with classification, then history/applications. Total length ~600 words.
           - **Tone**: Educational, clear, professional.
        `;

    // --- CHUNK 2 & 3: IMPLEMENTATIONS PROMPT ---
    const implsPrompt = (langs: string[]) => `
        ${BASE_SYSTEM_PROMPT}

        TASK: Generate Code Implementations for: ${langs.join(", ")}.
        
        ${target === 'initial'
        ? 'You MUST generate ONLY the **Optimize** approach.'
        : target === 'enrichment'
          ? 'You MUST generate the **Brute Force** and **Better** approaches (if applicable). DO NOT generate Optimize again.'
          : 'You MUST generate ALL VIABLE APPROACHES (at least 3, MAX 5). E.g. Brute Force, Better, Optimize. If there are other distinct approaches (e.g. Iterative vs Recursive), INCLUDE THEM up to 5.'
      }

        JSON Structure:
        {
          "implementations": [
            {
              "lang": "${langs[0]}",
              "code": [
                {
                  "codeType": "${target === 'initial' ? 'optimize' : 'descriptive-name-e.g-brute-force-dfs'}",
                  "code": "FUNCTION CODE ONLY",
                  "explanationBefore": "EXTREMELY DETAILED HTML (1000+ words)",
                  "explanationAfter": "HTML content"
                }
                // ... other approaches
              ]
            }
            // ... repeat for other languages
          ]
        }

        CRITICAL CODE RULES:
        1. **FUNCTION ONLY (STRICT)**: 
           - **NO 'class Solution'**. 
           - **NO 'public class Solution'**.
           - **NO imports**. 
           - **Return ONLY the standalone function**.
           - Example Java: \`public boolean canFinish(...) { ... }\` (NOT wrapped in class).
           - Example C++: \`bool canFinish(...) { ... }\` (NOT wrapped in class).
        2. **Detailed Comments**: **EXTREME COMMENTING REQUIRED**. 
           - **Rule**: Explain every 1-2 lines of code. 
           - **Content**: Explain *WHY* we are doing this, not just what syntax it is. 
           - **Style**: Use inline comments (`//`) or block comments above the lines.
    3. ** Starter Code **: Signature ONLY.No logic.
        4. ** Reference Code **: If provided, use it for 'optimize' logic.
        
        HTML RULES(explanationBefore):
        Use this template exactly:
        ${ HTML_TEMPLATE }

        ** DETAIL LEVEL **:
    1. ** Approach Overview **: ~600 - 1000 words. ** MUST split into multiple \`<p>\` tags**. Max 250 words per paragraph.
        2. **Intuition**: ~600-1000 words. **MUST split into multiple \`<p>\` tags**. Max 250 words per paragraph. Use Analogies ("Explain like I'm 5").
        3. **Step-by-step**: Educational. If a step is long, split it.
        4. **General**: **STRICT RULE**: NO single paragraph should exceed 250 words. Divide and conquer the text.

        ${target !== 'initial' ? "For the LAST approach (optimize), put the Comparison Table HTML in 'explanationAfter'." : ''}
        `;

    // --- EXECUTE BASED ON TARGET ---
    console.log(`Starting Chunked Generation (${target})...`);

    let coreData = null;
    let implsPart1 = null;
    let implsPart2 = null;

    if (target === "all") {
      [coreData, implsPart1, implsPart2] = await Promise.all([
        generateChunk(corePrompt),
        generateChunk(implsPrompt(["typescript", "python"])),
        generateChunk(implsPrompt(["java", "cpp"]))
      ]);
    } else if (target === "initial") {
      // Initial: Core Data (No Table) + Optimized Impls
      [coreData, implsPart1, implsPart2] = await Promise.all([
        generateChunk(corePrompt),
        generateChunk(implsPrompt(["typescript", "python"])),
        generateChunk(implsPrompt(["java", "cpp"]))
      ]);
    } else if (target === "enrichment") {
      // Enrichment: Table Only + Brute/Better Impls
      // We still request 'corePrompt' but it only returns the Explanation block with Table
      // NOTE: We merge coreData 'explanation.comparisonTable' later
      [coreData, implsPart1, implsPart2] = await Promise.all([
        generateChunk(corePrompt),
        generateChunk(implsPrompt(["typescript", "python"])),
        generateChunk(implsPrompt(["java", "cpp"]))
      ]);
    }

    if ((target !== 'enrichment' && !coreData)) throw new Error("Failed to generate Core Data.");
    if ((!implsPart1 || !implsPart2)) throw new Error("Failed to generate Implementations.");

    // --- MERGE ---
    let finalJson: any = {};

    if (target === "all" || target === "initial") {
      finalJson = {
        ...coreData,
        implementations: [
          ...(implsPart1.implementations || []),
          ...(implsPart2.implementations || [])
        ]
      };
    } else if (target === "enrichment") {
      // For enrichment, we return a merged structure that frontend can merge
      finalJson = {
        // If coreData returns comparisonTable, include it
        explanation: {
          comparisonTable: coreData?.explanation?.comparisonTable || ""
        },
        implementations: [
          ...(implsPart1.implementations || []),
          ...(implsPart2.implementations || [])
        ]
      };
    }

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
