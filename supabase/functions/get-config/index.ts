import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Return public Supabase config (these are public/anon values, safe to expose)
    const config = {
      supabaseUrl: Deno.env.get('SUPABASE_URL') || Deno.env.get('VITE_SUPABASE_URL'),
      supabaseAnonKey: Deno.env.get('SUPABASE_ANON_KEY') || Deno.env.get('VITE_SUPABASE_PUBLISHABLE_KEY'),
      projectId: Deno.env.get('VITE_SUPABASE_PROJECT_ID'),
    };

    console.log('Config request received, returning public config');

    return new Response(JSON.stringify(config), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in get-config function:', error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
