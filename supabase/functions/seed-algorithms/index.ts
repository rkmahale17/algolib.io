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

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    if (!supabaseUrl || !supabaseServiceKey || !supabaseAnonKey) {
      throw new Error('Missing required environment variables');
    }

    // First, verify the user is authenticated and is an admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create a client with the user's JWT to verify their identity
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Get the authenticated user
    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is an admin using the is_algorithms_admin function
    const { data: isAdmin, error: adminCheckError } = await userClient.rpc('is_algorithms_admin');
    if (adminCheckError || !isAdmin) {
      console.error('Admin check failed:', adminCheckError, 'isAdmin:', isAdmin);
      return new Response(
        JSON.stringify({ error: 'Forbidden: Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Admin verified:', user.id);

    // Now create the service role client for actual database operations
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
            metadata: {
              likes: algo.likes,
              dislikes: algo.dislikes,
              visualizationUrl: algo.visualizationUrl,
              commonNotes: algo.commonNotes,
              commonWhiteBoard: algo.commonWhiteBoard,
              companyTags: algo.companyTags,
              list_type: algo.listType,
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
