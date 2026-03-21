import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders })
    }

    try {
        const body = await req.json()
        console.log('Incoming Payload:', JSON.stringify(body))

        const userId = body.userId || body.customer_id
        const email = body.email || body.customerEmail
        const planType = body.planType || '3monthly'
        const isLocal = body.isLocal || false

        console.log(`Mode: ${isLocal ? 'LOCAL/TEST' : 'LIVE'}`)

        // Map plan types to environment variables
        const productIdMap: Record<string, string | undefined> = isLocal ? {
            '3monthly': Deno.env.get('TEST_DODO_PRODUCT_ID_THREE_MONTHLY'),
            '6monthly': Deno.env.get('TEST_DODO_PRODUCT_ID_SIX_MONTHLY'),
            'yearly': Deno.env.get('TEST_DODO_PRODUCT_ID_YEARLY'),
        } : {
            '3monthly': Deno.env.get('DODO_PRODUCT_ID_THREE_MONTHLY'),
            '6monthly': Deno.env.get('DODO_PRODUCT_ID_SIX_MONTHLY'),
            'yearly': Deno.env.get('DODO_PRODUCT_ID_YEARLY'),
        }

        const productId = productIdMap[planType]

        const dodoApiKey = (isLocal ? Deno.env.get('TEST_DODO_API_KEY') : Deno.env.get('DODO_API_KEY'))?.trim()
        console.log('API Key Check:', {
            exists: !!dodoApiKey,
            length: dodoApiKey?.length,
            prefix: dodoApiKey?.substring(0, 10) + '...'
        })

        if (!dodoApiKey) {
            console.error('CRITICAL: DODO_API_KEY is not set')
            throw new Error('DODO_API_KEY is not set')
        }
        if (!productId) {
            console.error(`CRITICAL: Product ID for plan "${planType}" is not set. Checked keys: DODO_PRODUCT_ID_THREE_MONTHLY, DODO_PRODUCT_ID_SIX_MONTHLY, DODO_PRODUCT_ID_YEARLY`)
            throw new Error(`Pricing configuration error for ${planType}`)
        }

        // Identify User
        let finalUserId = userId;
        const finalEmail = email;

        if (!finalEmail) {
            console.error('CRITICAL: No email found in request body')
            throw new Error('Missing email')
        }

        if (!finalUserId) {
            console.log(`userId missing for ${finalEmail}, attempting profile lookup...`)
            const supabaseUrl = Deno.env.get('SUPABASE_URL')
            const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

            if (supabaseUrl && supabaseServiceKey) {
                const supabase = createClient(supabaseUrl, supabaseServiceKey)
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('email', finalEmail)
                    .maybeSingle()

                if (profileError) {
                    console.error('Profile lookup error:', profileError)
                } else if (profile) {
                    finalUserId = profile.id
                    console.log(`Resolved userId from email: ${finalUserId}`)
                } else {
                    console.warn(`No profile found for email: ${finalEmail}`)
                }
            } else {
                console.error('Supabase credentials missing in Edge Function environment')
            }
        }

        if (!finalUserId) {
            console.error('User Identification Failed:', { userId, email })
            throw new Error('Could not identify your account. Please check your login status.')
        }

        const isLive = dodoApiKey.startsWith('live_')
        const baseUrl =
            'https://test.dodopayments.com'

        console.log(`Dodo Environment Check: isLive=${isLive}, baseUrl=${baseUrl}`)
        console.log(`Initiating ${isLive ? 'LIVE' : 'TEST'} checkout for ${finalEmail} (Plan: ${planType}, Product: ${productId})`)

        const dodoPayload = {
            product_cart: [{ product_id: productId, quantity: 1 }],
            metadata: {
                supabase_user_id: finalUserId,
                plan_type: planType
            },
            customer: { email: finalEmail },
            billing_address: { country: 'IN' },
            payment_link: true,
            return_url: body.returnUrl || `${req.headers.get('origin') ?? 'http://localhost:3000'}/dashboard?success=true`,
        }

        console.log('Sending request to Dodo Payments...')

        const response = await fetch(`${baseUrl}/checkouts`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${dodoApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dodoPayload),
        })

        const responseText = await response.text();
        console.log(`Dodo Response [${response.status}]:`, responseText)

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            throw new Error(`Invalid JSON response from Dodo (${response.status})`);
        }

        if (!response.ok) {
            const errorMsg = data.message || data.error?.message || responseText || `Dodo API Error (${response.status})`
            console.error('Dodo API rejected request:', {
                status: response.status,
                errorMsg,
                baseUrl,
                isLive
            })
            throw new Error(errorMsg);
        }

        return new Response(
            JSON.stringify(data),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )

    } catch (error: any) {
        const msg = error instanceof Error ? error.message : 'Unknown'
        console.error('Task Execution Failed:', msg)
        return new Response(
            JSON.stringify({ error: msg }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
})
