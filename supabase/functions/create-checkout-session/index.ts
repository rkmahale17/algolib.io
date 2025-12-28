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
        const { productId: reqProductId, customerEmail } = await req.json()
        const dodoApiKey = Deno.env.get('DODO_API_KEY')
        const envProductId = Deno.env.get('DODO_PRODUCT_ID')
        const productId = envProductId || reqProductId

        if (!dodoApiKey) {
            throw new Error('DODO_API_KEY is not set')
        }

        // Determine environment based on API key prefix or explicit setting
        // Assuming test key for now based on previous conversation
        const isTest = dodoApiKey.startsWith('zxx') || dodoApiKey.startsWith('test')
        const baseUrl = isTest ? 'https://test.dodopayments.com' : 'https://live.dodopayments.com'

        console.log(`Environment: ${isTest ? 'TEST' : 'LIVE'} (Key starts with: ${dodoApiKey.substring(0, 8)}...)`)
        console.log(`Creating Dodo session at ${baseUrl} for product: ${productId} (User: ${customerEmail})`)

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

        let data;
        const responseText = await response.text();

        try {
            data = JSON.parse(responseText);
        } catch (e) {
            console.error('Failed to parse Dodo response as JSON:', responseText);
            throw new Error(`Invalid response from Dodo: ${response.statusText}`);
        }

        if (!response.ok) {
            console.error('Dodo API Error Status:', response.status);
            console.error('Dodo API Error Body:', responseText);
            throw new Error(data.message || `Dodo API Error: ${response.statusText}`);
        }

        return new Response(
            JSON.stringify(data),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
        console.error('Error:', errorMessage)
        return new Response(
            JSON.stringify({ error: errorMessage }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
})
