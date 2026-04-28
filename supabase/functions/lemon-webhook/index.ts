import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.1'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const resendApiKey = Deno.env.get('RESEND_API_KEY')
const webhookSecret = Deno.env.get('LS_WEBHOOK_SECRET')?.trim()

if (!serviceRoleKey) {
    console.warn('CRITICAL: SUPABASE_SERVICE_ROLE_KEY is missing.')
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Verify Lemon Squeezy webhook signature (HMAC-SHA256)
async function verifySignature(secret: string, rawBody: string, signature: string): Promise<boolean> {
    try {
        const encoder = new TextEncoder()
        const keyData = encoder.encode(secret)
        const bodyData = encoder.encode(rawBody)

        const cryptoKey = await crypto.subtle.importKey(
            'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
        )
        const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, bodyData)
        const computedHex = Array.from(new Uint8Array(signatureBuffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('')

        return computedHex === signature
    } catch (err: any) {
        console.error('Signature verification error:', err.message)
        return false
    }
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders })
    }

    const rawBody = await req.text()
    const signature = req.headers.get('x-signature') || ''

    // 1. Verify signature
    if (webhookSecret) {
        if (!signature || !(await verifySignature(webhookSecret, rawBody, signature))) {
            return new Response('Invalid signature', { status: 401 })
        }
    }

    let event: any
    try {
        event = JSON.parse(rawBody)
    } catch {
        return new Response('Invalid JSON', { status: 400 })
    }

    const eventName = event.meta?.event_name || ''
    const customData = event.meta?.custom_data || {}
    const attributes = event.data?.attributes || {}
    const resourceId = String(event.data?.id || '')
    // Composite ID to prevent blocking different events for the same resource
    const eventId = `${resourceId}_${eventName}`

    console.log(`Received LS event: ${eventName}`, {
        custom_data: customData,
        subscription_id: resourceId,
        status: attributes.status,
    })

    if (!eventName || !eventId) {
        return new Response('Invalid event structure', { status: 400 })
    }

    try {
        // 2. Idempotency Check
        const { data: existingEvent } = await supabase
            .from('webhook_events')
            .select('id')
            .eq('id', eventId)
            .maybeSingle()

        if (existingEvent) {
            console.log(`Event ${eventId} already processed. Skipping.`)
            return new Response('OK (duplicate)', { status: 200 })
        }

        // 3. Resolve User
        let userId = customData.supabase_user_id
        const customerEmail = attributes.user_email

        if (!userId) {
            // Fallback 1: Email
            if (customerEmail) {
                console.log(`userId missing in custom_data for ${customerEmail}, attempting profile lookup by email...`)
                const { data: userData } = await supabase.from('profiles').select('id').eq('email', customerEmail).maybeSingle()
                if (userData) {
                    userId = userData.id
                    console.log(`Resolved userId from email: ${userId}`)
                }
            }
            // Fallback 2: Subscription ID
            if (!userId && resourceId) {
                console.log(`Still no userId, attempting lookup by LS subscription_id: ${resourceId}`)
                const { data: subData } = await supabase.from('profiles').select('id').eq('subscription_id', resourceId).maybeSingle()
                if (subData) {
                    userId = subData.id
                    console.log(`Resolved userId from subscription_id: ${userId}`)
                }
            }
        }

        if (!userId) {
            console.error(`User resolution failed for event ${eventName} (Sub ID: ${resourceId})`)
            return new Response('User not found', { status: 404 })
        }

        console.log(`Processing LS event "${eventName}" for user ${userId}...`)

        // 4. Map LS fields
        const rawPlanType: string = customData.plan_type || 'yearly'
        const lsStatus: string = attributes.status || ''
        const renewsAt: string | null = attributes.renews_at || null
        const endsAt: string | null = attributes.ends_at || null
        const trialEndsAt: string | null = attributes.trial_ends_at || null
        const isCancelled: boolean = attributes.cancelled === true
        const customerPortalUrl: string | null = attributes.urls?.update_payment_method || attributes.urls?.customer_portal || null

        const actualSubscriptionId = eventName === 'subscription_payment_success'
            ? (attributes.subscription_id ? String(attributes.subscription_id) : resourceId)
            : resourceId

        const currentPeriodEnd = (lsStatus === 'on_trial' && trialEndsAt) ? trialEndsAt : (renewsAt || endsAt || null)

        // 5. Update Profile
        switch (eventName) {
            case 'subscription_created':
            case 'subscription_updated':
            case 'subscription_resumed':
            case 'subscription_payment_success': {
                let targetStatus = lsStatus === 'on_trial' ? 'trialing' : (lsStatus === 'paid' ? 'active' : (lsStatus || 'active'));

                // Priority: Future trial date
                if (trialEndsAt && new Date(trialEndsAt) > new Date()) {
                    targetStatus = 'trialing';
                }

                const update: any = {
                    subscription_status: targetStatus,
                    subscription_tier: 'pro',
                    subscription_duration: rawPlanType,
                    subscription_plan_id: attributes.variant_id ? String(attributes.variant_id) : undefined,
                    cancel_at_period_end: isCancelled,
                }

                if (customerPortalUrl) update.customer_portal_url = customerPortalUrl
                if (trialEndsAt) update.trial_end_date = trialEndsAt
                if (currentPeriodEnd) update.current_period_end = currentPeriodEnd
                if (actualSubscriptionId) update.subscription_id = actualSubscriptionId

                const { error } = await supabase.from('profiles').update(update).eq('id', userId)
                if (error) throw error
                break
            }

            case 'subscription_cancelled': {
                const { error } = await supabase.from('profiles').update({
                    subscription_status: 'canceled',
                    cancel_at_period_end: true,
                    current_period_end: endsAt || currentPeriodEnd,
                }).eq('id', userId)
                if (error) throw error
                break
            }

            case 'subscription_expired': {
                await supabase.from('profiles').update({
                    subscription_status: 'expired',
                    subscription_tier: 'free',
                    cancel_at_period_end: false,
                }).eq('id', userId)
                break
            }

            case 'subscription_payment_failed':
            case 'subscription_unpaid': {
                await supabase.from('profiles').update({
                    subscription_status: 'past_due',
                    current_period_end: renewsAt || currentPeriodEnd
                }).eq('id', userId)
                break
            }
        }

        // 6. Emails
        if (eventName === 'subscription_created' || eventName === 'subscription_payment_success') {
            try {
                await sendWelcomeEmail(customerEmail || '')
            } catch (e: any) {
                console.warn('Email error:', e.message)
            }
        }

        // 7. Mark as processed
        try {
            await supabase.from('webhook_events').insert({
                id: eventId,
                event_name: eventName,
                payload: event.data
            })
        } catch (e: any) {
            console.warn('Idempotency error:', e.message)
        }

        return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
        })

    } catch (err: any) {
        console.error('Webhook Runtime Error:', err.message)
        return new Response(JSON.stringify({ error: err.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500
        })
    }
})

async function sendWelcomeEmail(email: string) {
    if (!email || !resendApiKey) return
    const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
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
        const errorText = await res.text()
        console.error('Resend error:', errorText)
    } else {
        console.log(`Welcome email sent to ${email}`)
    }
}
