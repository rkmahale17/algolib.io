import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Parse query parameters
    const url = new URL(req.url);
    const search = url.searchParams.get('search') || '';
    const category = url.searchParams.get('category') || '';

    console.log('Fetching algorithms with params:', { search, category });

    // Build query - select only needed fields
    let query = supabase
      .from('algorithms')
      .select(`
        id,
        name,
        title,
        difficulty,
        category,
        list_type,
        description,
        time_complexity,
        space_complexity,
        serial_no
      `);

    // Apply filters
    if (search) {
      query = query.or(`title.ilike.%${search}%,name.ilike.%${search}%`);
    }
    if (category) {
      query = query.eq('category', category);
    }

    // Order by serial_no
    query = query.order('serial_no', { ascending: true, nullsFirst: false });

    const { data, error } = await query;

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log(`Fetched ${data?.length || 0} algorithms`);

    // Map to response format
    const algorithms = (data || []).map((algo: any) => ({
      id: algo.id,
      title: algo.title || algo.name,
      name: algo.name,
      category: algo.category,
      difficulty: algo.difficulty,
      description: algo.description,
      timeComplexity: algo.time_complexity,
      spaceComplexity: algo.space_complexity,
      slug: algo.id,
      listType: algo.list_type,
      serial_no: algo.serial_no,
    }));

    return new Response(
      JSON.stringify({ algorithms, totalCount: algorithms.length }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error fetching algorithms:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to fetch algorithms' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
