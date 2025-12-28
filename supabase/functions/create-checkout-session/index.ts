import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.1'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders })
    }

    try {
        const { productId, customerEmail } = await req.json()
        const dodoApiKey = Deno.env.get('DODO_API_KEY')

        if (!dodoApiKey) {
            throw new Error('DODO_API_KEY is not set')
        }

        // Determine environment based on API key prefix or explicit setting
        // Assuming test key for now based on previous conversation
        const isTest = dodoApiKey.startsWith('zxx') || dodoApiKey.startsWith('test')
        const baseUrl = isTest ? 'https://test.dodopayments.com' : 'https://live.dodopayments.com'

        console.log(`Creating Dodo checkout session for product: ${productId} and user: ${customerEmail}`)

        const response = await fetch(`${baseUrl}/v1/checkout-sessions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${dodoApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                product_cart: [
                    {
                        product_id: productId,
                        quantity: 1,
                    },
                ],
                customer: {
                    email: customerEmail,
                },
                billing: {
                    // Defaulting to US if not provided, Dodo requires a country
                    country: 'IN',
                },
                payment_methods: ['card'],
            }),
        })

        const data = await response.json()

        if (!response.ok) {
            console.error('Dodo API Error:', data)
            throw new Error(data.message || 'Failed to create Dodo checkout session')
        }

        return new Response(
            JSON.stringify(data),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )
    } catch (error) {
        console.error('Error:', error.message)
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
})
