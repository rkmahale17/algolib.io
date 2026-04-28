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
        const planType = body.planType || 'yearly'
        const isLocal = body.isLocal || false

        console.log(`Mode: ${isLocal ? 'LOCAL/TEST' : 'LIVE'}`)

        // Lemon Squeezy uses Variant IDs (not Product IDs) for checkout
        const variantPrefix = isLocal ? 'LS_TEST_VARIANT_ID_' : 'LS_VARIANT_ID_'
        const variantIdMap: Record<string, string | undefined> = {
            '3monthly': Deno.env.get(`${variantPrefix}3MONTHLY`),
            '6monthly': Deno.env.get(`${variantPrefix}6MONTHLY`),
            'yearly': Deno.env.get(`${variantPrefix}YEARLY`),
        }

        const variantId = variantIdMap[planType]
        const storeId = (isLocal ? Deno.env.get('LS_TEST_STORE_ID') : Deno.env.get('LS_STORE_ID'))?.trim()
        const lsApiKey = (isLocal ? Deno.env.get('LS_TEST_API_KEY') : Deno.env.get('LS_API_KEY'))?.trim()

        console.log('LS Config Check:', {
            has_api_key: !!lsApiKey,
            api_key_prefix: lsApiKey?.substring(0, 10) + '...',
            store_id: storeId,
            variant_id: variantId,
            plan_type: planType,
            prefix_used: variantPrefix
        })

        if (!lsApiKey) throw new Error(`${isLocal ? 'LS_TEST_API_KEY' : 'LS_API_KEY'} is not set in edge function secrets`)
        if (!storeId) throw new Error(`${isLocal ? 'LS_TEST_STORE_ID' : 'LS_STORE_ID'} is not set in edge function secrets`)
        if (!variantId) throw new Error(`${variantPrefix}${planType.toUpperCase()} is not set. Check your Supabase Edge Function secrets.`)

        // Resolve user identity
        let finalUserId = userId
        let finalEmail = email

        const supabaseUrl = Deno.env.get('SUPABASE_URL')
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
        const supabase = (supabaseUrl && supabaseServiceKey)
            ? createClient(supabaseUrl, supabaseServiceKey)
            : null

        if (!finalEmail && finalUserId && supabase) {
            console.log(`Email missing for ${finalUserId}, attempting profile lookup...`)
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('email')
                .eq('id', finalUserId)
                .maybeSingle()

            if (error) console.error('Email lookup error:', error)
            else if (profile?.email) {
                finalEmail = profile.email
                console.log(`Resolved email from userId: ${finalEmail}`)
            }
        }

        if (!finalEmail) throw new Error('Missing email. Please ensure your profile has an email address.')

        if (!finalUserId && finalEmail && supabase) {
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('id')
                .eq('email', finalEmail)
                .maybeSingle()

            if (error) console.error('Profile lookup error:', error)
            else if (profile) {
                finalUserId = profile.id
                console.log(`Resolved userId from email: ${finalUserId}`)
            }
        }

        if (!finalUserId) throw new Error('Could not identify your account. Please check your login status.')

        const origin = req.headers.get('origin') ?? 'http://localhost:3000'
        const redirectUrl = body.returnUrl || `${origin}/pricing`

        // Build Lemon Squeezy checkout via JSON:API spec
        // https://docs.lemonsqueezy.com/api/checkouts/create-a-checkout
        const lsPayload = {
            data: {
                type: 'checkouts',
                attributes: {
                    test_mode: isLocal,
                    product_options: {
                        redirect_url: redirectUrl,
                        receipt_button_text: 'Back to RulCode',
                        receipt_link_url: redirectUrl,
                    },
                    checkout_options: {
                        embed: false,
                        media: true,
                        logo: true,
                        desc: true,
                        discount: true,
                        dark: true,
                    },
                    checkout_data: {
                        email: finalEmail,
                        name: body.customerName || undefined,
                        // Custom data is passed through to webhook events under meta.custom_data
                        custom: {
                            supabase_user_id: finalUserId,
                            plan_type: planType,
                        },
                    },
                },
                relationships: {
                    store: {
                        data: { type: 'stores', id: String(storeId) },
                    },
                    variant: {
                        data: { type: 'variants', id: String(variantId) },
                    },
                },
            },
        }

        console.log(`Creating LS checkout for ${finalEmail} (Plan: ${planType}, Variant: ${variantId})`)
        console.log('LS Payload:', JSON.stringify(lsPayload, null, 2))

        const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json',
                'Authorization': `Bearer ${lsApiKey}`,
            },
            body: JSON.stringify(lsPayload),
        })

        const responseText = await response.text()
        console.log(`LS Response [${response.status}]:`, responseText)

        if (!response.ok) {
            let errDetail = responseText
            try {
                const data = JSON.parse(responseText)
                errDetail = data?.errors?.[0]?.detail || data?.errors?.[0]?.title || responseText
            } catch { /* ignore */ }

            console.error('LS API Error:', {
                status: response.status,
                detail: errDetail,
                payloadSent: JSON.stringify(lsPayload)
            })

            // Special hint for 404s
            if (response.status === 404) {
                console.warn('HINT: A 404 usually means the Variant ID or Store ID is invalid, OR you are using a Live key with Test IDs (or vice-versa).')
            }

            throw new Error(errDetail || `Lemon Squeezy API Error (${response.status})`)
        }

        const data = JSON.parse(responseText)
        const checkoutUrl = data?.data?.attributes?.url
        if (!checkoutUrl) throw new Error('No checkout URL returned from Lemon Squeezy')

        console.log(`Checkout URL created: ${checkoutUrl}`)

        return new Response(
            JSON.stringify({ checkout_url: checkoutUrl }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )

    } catch (error: any) {
        const msg = error instanceof Error ? error.message : 'Unknown error'
        console.error('Checkout creation failed:', msg)
        return new Response(
            JSON.stringify({ error: msg }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
})
