import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, referenceCode, generatorMode, target } = await req.json();
    
    console.log('Generating algorithm for:', { topic, generatorMode, target });

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const prompt = buildPrompt(topic, referenceCode, generatorMode, target);
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Gemini API error:', error);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const result = await response.json();
    const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error('No content generated');
    }

    // Extract JSON from the response
    const jsonMatch = generatedText.match(/```json\n?([\s\S]*?)\n?```/) || 
                      generatedText.match(/\{[\s\S]*\}/);
    
    let algorithmData;
    if (jsonMatch) {
      const jsonStr = jsonMatch[1] || jsonMatch[0];
      algorithmData = JSON.parse(jsonStr);
    } else {
      throw new Error('Could not parse generated content as JSON');
    }

    console.log('Successfully generated algorithm data');

    return new Response(JSON.stringify(algorithmData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error generating algorithm:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function buildPrompt(topic: string, referenceCode: string, mode: string, target: string): string {
  const basePrompt = `Generate comprehensive algorithm data for: "${topic}"
  
Return a JSON object with this structure:
{
  "id": "kebab-case-id",
  "name": "Algorithm Name",
  "title": "Display Title",
  "description": "Brief description",
  "category": "Category name",
  "difficulty": "Easy|Medium|Hard",
  "time_complexity": "O(...)",
  "space_complexity": "O(...)",
  "implementations": {
    "python": "# Python code",
    "javascript": "// JavaScript code", 
    "typescript": "// TypeScript code",
    "java": "// Java code",
    "cpp": "// C++ code"
  },
  "explanation": {
    "overview": "Detailed overview",
    "steps": ["Step 1", "Step 2"],
    "tips": ["Tip 1", "Tip 2"],
    "use_case": "When to use this"
  },
  "problems_to_solve": [
    {"title": "Problem 1", "difficulty": "Easy", "link": ""}
  ],
  "tutorials": [
    {"title": "Tutorial 1", "url": "", "type": "video|article"}
  ]
}`;

  if (referenceCode) {
    return `${basePrompt}\n\nReference code to analyze:\n\`\`\`\n${referenceCode}\n\`\`\``;
  }

  if (mode === 'strategy' && target) {
    return `${basePrompt}\n\nFocus on the "${target}" algorithmic strategy/pattern.`;
  }

  return basePrompt;
}
