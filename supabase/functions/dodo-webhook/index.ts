import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.1'
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'

const resendApiKey = Deno.env.get('RESEND_API_KEY')
const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const dodoWebhookSecret = Deno.env.get('DODO_WEBHOOK_SECRET')

const supabase = createClient(supabaseUrl!, supabaseServiceKey!)

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders })
    }

    const payload = await req.text()

    // Extract specific webhook headers
    const webhookHeaders = {
        'webhook-id': req.headers.get('webhook-id') || '',
        'webhook-signature': req.headers.get('webhook-signature') || '',
        'webhook-timestamp': req.headers.get('webhook-timestamp') || '',
    }

    // Verify webhook signature if secret is provided
    if (dodoWebhookSecret) {
        try {
            const wh = new Webhook(dodoWebhookSecret)
            // Verify using the raw text payload and structured headers
            wh.verify(payload, webhookHeaders)
        } catch (err) {
            console.error('Webhook verification failed:', err)
            return new Response('Invalid signature', { status: 401 })
        }
    }

    const event = JSON.parse(payload)
    console.log(`Received Dodo event: ${event.event_type}`, event)

    const { event_type, data } = event
    const customerEmail = data.customer?.email
    const subscriptionId = data.subscription_id || data.id

    if (!customerEmail) {
        console.error('No customer email found in event')
        return new Response('Missing customer email', { status: 400 })
    }

    // Find user by email
    const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', customerEmail)
        .single()

    if (userError || !userData) {
        console.error(`User not found for email: ${customerEmail}`, userError)
        return new Response('User not found', { status: 404 })
    }

    const userId = userData.id

    try {
        switch (event_type) {
            case 'subscription.active':
            case 'subscription.created':
                await supabase
                    .from('profiles')
                    .update({
                        subscription_status: 'active',
                        subscription_id: subscriptionId,
                        current_period_end: data.current_period_end,
                    })
                    .eq('id', userId)
                break

            case 'subscription.cancelled':
            case 'subscription.expired':
                await supabase
                    .from('profiles')
                    .update({
                        subscription_status: 'canceled',
                        // Keep subscription_id for history, but status is canceled
                    })
                    .eq('id', userId)
                break

            case 'payment.succeeded':
                // If it's a subscription payment, update period end
                if (data.subscription_id) {
                    await supabase
                        .from('profiles')
                        .update({
                            subscription_status: 'active',
                            current_period_end: data.current_period_end,
                        })
                        .eq('id', userId)
                }
                break

            default:
                console.log(`Unhandled event type: ${event_type}`)
        }

        return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })
    } catch (err) {
        console.error('Error updating profile:', err)
        return new Response('Error updating profile', { status: 500 })
    }
})
