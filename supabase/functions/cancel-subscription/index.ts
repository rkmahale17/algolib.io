import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders })
    }

    try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')
        const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')

        const body = await req.json().catch(() => ({}))
        const isLocal = body.isLocal || false

        const dodoApiKey = (isLocal ? Deno.env.get('TEST_DODO_API_KEY') : Deno.env.get('DODO_API_KEY'))?.trim()

        if (!dodoApiKey) throw new Error(`${isLocal ? 'TEST_' : ''}DODO_API_KEY is not set`)

        const authHeader = req.headers.get('Authorization')
        if (!authHeader) throw new Error('No authorization header')

        const supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
            global: { headers: { Authorization: authHeader } },
        })

        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) throw new Error('Unauthorized')

        // Get subscription_id from profile
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('subscription_id, subscription_status')
            .eq('id', user.id)
            .single()

        if (profileError || !profile?.subscription_id) {
            throw new Error('No active subscription found to cancel')
        }

        if (profile.subscription_status !== 'active') {
            throw new Error('Subscription is already canceled or inactive')
        }

        // Detect Environment
        const isLive = dodoApiKey.startsWith('live_')
        const baseUrl = isLive ? 'https://www.dodopayments.com' : 'https://test.dodopayments.com'

        console.log(`Cancelling subscription ${profile.subscription_id} for user ${user.id}`)

        const response = await fetch(`${baseUrl}/subscriptions/${profile.subscription_id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${dodoApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: 'cancelled' }),
        })

        if (!response.ok) {
            const errorData = await response.json()
            console.error('Dodo API Error:', errorData)
            throw new Error(errorData.message || 'Failed to cancel subscription with Dodo Payments')
        }

        // Note: The actual status update in our DB will happen via the webhook
        // but we can return success here.

        return new Response(
            JSON.stringify({ success: true, message: 'Subscription cancellation initiated' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )

    } catch (error: any) {
        console.error('Cancellation Error:', error.message)
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
})
