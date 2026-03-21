import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.1'
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'

const resendApiKey = Deno.env.get('RESEND_API_KEY')
const supabaseUrl = Deno.env.get('SUPABASE_URL') || Deno.env.get('VITE_SUPABASE_URL')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('VITE_SUPABASE_PUBLISHABLE_KEY')
const webhookSecret = Deno.env.get('DODO_PAYMENTS_WEBHOOK_SECRET')
const testWebhookSecret = (Deno.env.get('TEST_DODO_PAYMENTS_WEBHOOK_SECRET') || Deno.env.get('DODO_WEBHOOK_SECRET'))?.trim()

const supabase = createClient(supabaseUrl!, supabaseServiceKey!)

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log('Webhook initialization:', {
    has_resend: !!resendApiKey,
    has_supabase_url: !!supabaseUrl,
    has_service_key: !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
    has_webhook_secret: !!webhookSecret,
    has_test_webhook_secret: !!testWebhookSecret,
    secret_name_used: Deno.env.get('DODO_PAYMENTS_WEBHOOK_SECRET') ? 'DODO_PAYMENTS_WEBHOOK_SECRET' : 'DODO_WEBHOOK_SECRET'
})

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders })
    }

    const payload = await req.text()

    // Log all headers for debugging
    const allHeaders = Object.fromEntries(req.headers.entries())
    console.log('Incoming Webhook Headers:', allHeaders)

    // Extract specific webhook headers - Dodo/Svix standard
    const webhookHeaders = {
        'webhook-id': req.headers.get('webhook-id') || req.headers.get('svix-id') || '',
        'webhook-signature': req.headers.get('webhook-signature') || req.headers.get('svix-signature') || '',
        'webhook-timestamp': req.headers.get('webhook-timestamp') || req.headers.get('svix-timestamp') || '',
    }

    // Verify webhook signature if secret is provided
    if (webhookSecret || testWebhookSecret) {
        try {
            // First try live secret
            if (webhookSecret) {
                try {
                    const wh = new Webhook(webhookSecret)
                    wh.verify(payload, webhookHeaders)
                    console.log('Webhook verified with LIVE secret')
                } catch (liveError: any) {
                    // If live fails, try test secret
                    if (testWebhookSecret) {
                        try {
                            const wh = new Webhook(testWebhookSecret)
                            wh.verify(payload, webhookHeaders)
                            console.log('Webhook verified with TEST secret')
                        } catch (testError: any) {
                            console.error('Webhook verification failed for both LIVE and TEST secrets:', testError.message)
                            return new Response(`Invalid signature: ${testError.message}`, { status: 401 })
                        }
                    } else {
                        console.error('Webhook verification failed for LIVE secret and NO TEST secret provided:', liveError.message)
                        return new Response(`Invalid signature: ${liveError.message}`, { status: 401 })
                    }
                }
            } else if (testWebhookSecret) {
                // Only test secret is available
                try {
                    const wh = new Webhook(testWebhookSecret)
                    wh.verify(payload, webhookHeaders)
                    console.log('Webhook verified with TEST secret (only test secret provided)')
                } catch (testError: any) {
                    console.error('Webhook verification failed with TEST secret:', testError.message)
                    return new Response(`Invalid signature: ${testError.message}`, { status: 401 })
                }
            }
        } catch (err: any) {
            return new Response(`Invalid signature: ${err.message}`, { status: 401 })
        }
    } else {
        console.warn('DODO_PAYMENTS_WEBHOOK_SECRET not set, skipping signature verification')
    }

    const event = JSON.parse(payload)

    // Robust extraction: Dodo can send event_type at root, or payload_type inside data
    const data = event.data || event
    const event_type = event.event_type || event.type || data.payload_type || data.type

    console.log(`Received Dodo event: ${event_type}`, {
        has_data: !!data,
        data_keys: data ? Object.keys(data) : [],
        subscription_id: data?.subscription_id || data?.id,
        raw_event_keys: Object.keys(event)
    })

    if (!data) {
        console.error('No data found in Dodo event payload', event)
        return new Response('Invalid event structure', { status: 400 })
    }

    const customerEmail = data.customer?.email
    const subscriptionId = data.subscription_id || data.id

    if (!customerEmail) {
        console.error('No customer email found in event data', {
            event_type,
            has_customer: !!data.customer,
            customer_keys: data.customer ? Object.keys(data.customer) : []
        })
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

    const rawPeriodEnd = data.current_period_end || data.subscription?.current_period_end
    const rawPlanType = data.metadata?.plan_type || '3monthly'
    const tier = 'pro' // As per requirement, all current purchases are for 'pro'

    // Normalize plan types to match database schema if needed
    const normalizedPlanType = rawPlanType === 'yearly' ? 'yearly' :
        rawPlanType === '6monthly' ? '6monthly' :
            '3monthly' // Default to 3monthly

    // Helper to calculate period end if missing
    const calculatePeriodEnd = (start: Date, plan: string) => {
        const end = new Date(start)
        if (plan === 'yearly') end.setFullYear(end.getFullYear() + 1)
        else if (plan === '6monthly') end.setMonth(end.getMonth() + 6)
        else end.setMonth(end.getMonth() + 3) // Default 3 months
        return end.toISOString()
    }

    // Helper to parse Dodo date (handles Unix seconds vs ISO)
    const parseDodoDate = (date: any) => {
        if (!date) return null
        if (typeof date === 'number') {
            // Assume seconds if < 10^12 (year 2033), otherwise ms
            return new Date(date < 10000000000 ? date * 1000 : date).toISOString()
        }
        return new Date(date).toISOString()
    }

    const currentPeriodEnd = parseDodoDate(rawPeriodEnd) || calculatePeriodEnd(new Date(), normalizedPlanType)

    try {
        switch (event_type) {
            case 'subscription.active':
            case 'subscription.created':
            case 'subscription.renewed':
                const subscriptionUpdate = {
                    subscription_status: 'active',
                    subscription_tier: tier,
                    subscription_duration: normalizedPlanType,
                    subscription_plan_id: data.product_id,
                    current_period_end: currentPeriodEnd,
                    cancel_at_period_end: false,
                }
                console.log(`Updating profile for ${event_type}:`, subscriptionUpdate)
                const { error: subError } = await supabase
                    .from('profiles')
                    .update(subscriptionUpdate)
                    .eq('id', userId)

                if (subError) {
                    console.error(`Supabase update error for ${event_type}:`, subError)
                } else {
                    console.log(`Successfully updated profile for ${event_type}`)
                }
                break

            case 'subscription.cancelled':
                console.log(`Setting cancel_at_period_end for user ${userId}`)
                const { error: cancelUpdateError } = await supabase
                    .from('profiles')
                    .update({
                        cancel_at_period_end: true,
                    })
                    .eq('id', userId)

                if (cancelUpdateError) {
                    console.error(`Supabase update error for ${event_type}:`, cancelUpdateError)
                } else {
                    console.log(`Successfully set cancel_at_period_end for ${event_type}`)
                }
                break

            case 'subscription.expired':
                console.log(`Expiring subscription for user ${userId}`)
                const { error: expireError } = await supabase
                    .from('profiles')
                    .update({
                        subscription_status: 'expired',
                        subscription_tier: 'free',
                        cancel_at_period_end: false,
                    })
                    .eq('id', userId)

                if (expireError) {
                    console.error(`Supabase update error for ${event_type}:`, expireError)
                } else {
                    console.log(`Successfully expired subscription for ${event_type}`)
                }
                break

            case 'payment.succeeded':
                // For direct payments or subscription payments
                const paymentSubscriptionId = data.subscription_id || data.id
                console.log(`Processing payment.succeeded for user ${userId}, subId: ${paymentSubscriptionId}`)

                const { error: paymentError } = await supabase
                    .from('profiles')
                    .update({
                        subscription_status: 'active',
                        subscription_tier: tier,
                        subscription_duration: normalizedPlanType,
                        // Update period end if provided in the payment event
                        current_period_end: currentPeriodEnd,
                        ...(paymentSubscriptionId && { subscription_id: paymentSubscriptionId }),
                        cancel_at_period_end: false
                    })
                    .eq('id', userId)

                if (paymentError) {
                    console.error('Supabase update error for payment.succeeded:', paymentError)
                } else {
                    console.log('Successfully updated profile for payment.succeeded')
                }
                break

            default:
                console.log(`Unhandled event type: ${event_type}`)
        }

        // Send welcome email on new subscription or renewal payment
        if (event_type === 'subscription.created' || event_type === 'subscription.renewed' || event_type === 'payment.succeeded') {
            await sendWelcomeEmail(customerEmail)
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

async function sendWelcomeEmail(email: string) {
    if (!resendApiKey) {
        console.log('RESEND_API_KEY not set, skipping email')
        return
    }

    try {
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'RulCode <support@rulcode.com>',
                to: email,
                subject: 'Welcome to RulCode Pro!',
                html: `
                    <h1>Welcome to RulCode Pro! 🚀</h1>
                    <p>Thank you for subscribing. You now have full access to all algorithms and premium content.</p>
                    <p>Start mastering algorithms today: <a href="https://rulcode.com">https://rulcode.com</a></p>
                    <br/>
                    <p>Happy Coding,</p>
                    <p>The RulCode Team</p>
                `,
            }),
        })

        if (!res.ok) {
            const error = await res.text()
            console.error('Error sending email:', error)
        } else {
            console.log(`Welcome email sent to ${email}`)
        }
    } catch (e) {
        console.error('Failed to send welcome email:', e)
    }
}
