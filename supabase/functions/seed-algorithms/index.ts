import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AlgorithmData {
  id: string;
  title: string;
  name: string;
  category: string;
  difficulty: string;
  explanation: any;
  implementations: any;
  problemsToSolve: any;
  testCases: any;
  inputSchema: any;
  tutorials: any;
  likes: number;
  dislikes: number;
  visualizationUrl: string;
  commonNotes: string;
  commonWhiteBoard: string;
  companyTags: string[];
  listType: string;
  overview: string;
  timeComplexity: string;
  spaceComplexity: string;
  availableLanguages: string;
  editorialId: string;
  userCompletionGraphData: any;
  shareCount: number;
  imageUrls: any[];
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting seed-algorithms function');

    // Create Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get algorithms from request body
    const { algorithms } = await req.json();

    if (!algorithms || !Array.isArray(algorithms)) {
      return new Response(
        JSON.stringify({ error: 'Invalid request body. Expected { algorithms: AlgorithmData[] }' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Received ${algorithms.length} algorithms to seed`);

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    // Process each algorithm
    for (const algo of algorithms) {
      try {
        console.log(`Seeding algorithm: ${algo.name}`);

        const { error } = await supabase
          .from('algorithms')
          .upsert({
            id: algo.id,
            title: algo.title,
            name: algo.name,
            category: algo.category,
            difficulty: algo.difficulty,
            description: algo.explanation.problemStatement,
            explanation: algo.explanation,
            implementations: algo.implementations,
            problems_to_solve: algo.problemsToSolve,
            test_cases: algo.testCases,
            input_schema: algo.inputSchema,
            tutorials: algo.tutorials,
            list_type: algo.listType,
            metadata: {
              likes: algo.likes,
              dislikes: algo.dislikes,
              visualizationUrl: algo.visualizationUrl,
              commonNotes: algo.commonNotes,
              commonWhiteBoard: algo.commonWhiteBoard,
              companyTags: algo.companyTags,

              overview: algo.overview,
              timeComplexity: algo.timeComplexity,
              spaceComplexity: algo.spaceComplexity,
              availableLanguages: algo.availableLanguages,
              editorialId: algo.editorialId,
              userCompletionGraphData: algo.userCompletionGraphData,
              shareCount: algo.shareCount,
              imageUrls: algo.imageUrls,
            },
          });

        if (error) {
          console.error(`Error seeding ${algo.name}:`, error);
          results.failed++;
          results.errors.push(`${algo.name}: ${error.message}`);
        } else {
          console.log(`Successfully seeded ${algo.name}`);
          results.success++;
        }
      } catch (error: any) {
        console.error(`Exception seeding ${algo.name}:`, error);
        results.failed++;
        results.errors.push(`${algo.name}: ${error.message}`);
      }
    }

    console.log('Seed process completed', results);

    return new Response(
      JSON.stringify({
        message: 'Seed process completed',
        results,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('Error in seed-algorithms function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
