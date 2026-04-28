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
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!
        const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!

        const body = await req.json().catch(() => ({}))
        const isLocal = body.isLocal || false

        const lsApiKey = (isLocal ? Deno.env.get('LS_TEST_API_KEY') : Deno.env.get('LS_API_KEY'))?.trim()
        if (!lsApiKey) throw new Error(`${isLocal ? 'LS_TEST_API_KEY' : 'LS_API_KEY'} is not set`)

        // Authenticate caller using their JWT
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) throw new Error('No authorization header')

        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
            global: { headers: { Authorization: authHeader } },
        })

        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) throw new Error('Unauthorized')

        // Fetch subscription_id stored after the last webhook
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('subscription_id, subscription_status')
            .eq('id', user.id)
            .single()

        if (profileError || !profile?.subscription_id) {
            throw new Error('No active subscription found to cancel')
        }

        if (profile.subscription_status === 'expired' || profile.subscription_status === 'cancelled') {
            throw new Error('Subscription is already cancelled or expired')
        }

        // Lemon Squeezy cancel: DELETE /v1/subscriptions/{id}
        // This sets the subscription to "cancelled" — it remains active until ends_at (grace period)
        // The DB update happens via the lemon-webhook receiving `subscription_cancelled`
        const response = await fetch(
            `https://api.lemonsqueezy.com/v1/subscriptions/${profile.subscription_id}`,
            {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                    'Authorization': `Bearer ${lsApiKey}`,
                },
            }
        )

        // LS returns 200 with updated subscription or 204 on success
        if (!response.ok) {
            let errorMsg = `Lemon Squeezy API Error (${response.status})`
            try {
                const errorData = await response.json()
                errorMsg = errorData?.errors?.[0]?.detail || errorMsg
            } catch { /* ignore */ }
            console.error('LS cancel API error:', errorMsg)
            throw new Error(errorMsg)
        }

        return new Response(
            JSON.stringify({ success: true, message: 'Subscription cancellation initiated' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )

    } catch (error: any) {
        console.error('Cancel Subscription Error:', error.message)
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
})
