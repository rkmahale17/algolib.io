import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.1'
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const sendEmailHookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET')
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

    // 1. Signature Verification
    if (webhookSecret) {
        if (!signature || !(await verifySignature(webhookSecret, rawBody, signature))) {
            return new Response('Invalid signature', { status: 401 })
        }
    }

    // 2. Generate unique event_id (SHA-256 of raw body)
    const encoder = new TextEncoder()
    const dataHash = await crypto.subtle.digest('SHA-256', encoder.encode(rawBody))
    const eventId = Array.from(new Uint8Array(dataHash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')

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
    const resourceType = String(event.data?.type || 'unknown')
    const resourceUpdatedAt = attributes.updated_at || new Date().toISOString()
    const idempotencyKey = `${eventName}:${resourceId}`

    console.log(`Received LS event: ${eventName}`, {
        subscription_id: resourceId,
        event_id: eventId,
        updated_at: resourceUpdatedAt
    })

    if (!eventName || !resourceId) {
        return new Response('Invalid event structure', { status: 400 })
    }

    let webhookEventDbId: string | undefined
    try {
        // 3. Atomic Dedup (Step 2 in flow)
        const { data: inserted, error: insertError } = await supabase
            .from('webhook_events')
            .insert({
                event_id: eventId,
                event_name: eventName,
                resource_id: resourceId,
                resource_type: resourceType,
                payload: event,
                resource_updated_at: resourceUpdatedAt,
                idempotency_key: idempotencyKey,
                status: 'received'
            })
            .select('id')
            .maybeSingle()

        if (insertError) {
            // Check if it was a conflict or a real error
            if (insertError.code === '23505') {
                console.log(`Event ${eventId} already in DB. Skipping (duplicate).`)
                return new Response('OK (duplicate)', { status: 200 })
            }
            throw insertError
        }

        if (!inserted) {
            console.log(`Event ${eventId} was not inserted (likely already exists). Skipping.`)
            return new Response('OK (duplicate)', { status: 200 })
        }

        webhookEventDbId = inserted.id

        // 4. Update status to processing
        await supabase.from('webhook_events').update({ status: 'processing' }).eq('id', webhookEventDbId)

        // 5. Stale Check (Step 4 in flow)
        const { data: latestProcessed } = await supabase
            .from('webhook_events')
            .select('resource_updated_at')
            .eq('idempotency_key', idempotencyKey)
            .eq('status', 'processed')
            .order('resource_updated_at', { ascending: false })
            .limit(1)
            .maybeSingle()

        if (latestProcessed && new Date(latestProcessed.resource_updated_at) >= new Date(resourceUpdatedAt)) {
            console.log(`Event ${eventId} is stale. Skipping.`)
            await supabase.from('webhook_events').update({
                status: 'skipped',
                skip_reason: 'stale'
            }).eq('id', webhookEventDbId)
            return new Response('OK (stale)', { status: 200 })
        }

        // 6. Resolve User
        let userId = customData.supabase_user_id
        console.log(`[DEBUG] Event: ${eventName}, Attributes Keys: ${Object.keys(attributes).join(', ')}`)

        let customerEmail = attributes.user_email || attributes.email || attributes.customer_email
        console.log(`[DEBUG] Resolved initial customerEmail from LS payload: ${customerEmail}`)

        if (userId) {
            console.log(`[DEBUG] userId ${userId} present in customData, fetching profile...`)
            const { data: userData } = await supabase.from('profiles').select('email, subscription_status').eq('id', userId).maybeSingle()
            if (userData) {
                if (userData.email) {
                    console.log(`[DEBUG] Found account email in DB: ${userData.email}. Using this for the welcome email.`)
                    customerEmail = userData.email
                }

                // 7. Terminal State Check (Step 5 in flow)
                const isTerminalIncoming = ['subscription_cancelled', 'subscription_expired'].includes(eventName)
                const isTerminalExisting = ['canceled', 'expired'].includes(userData.subscription_status)

                if (isTerminalIncoming && isTerminalExisting) {
                    console.log(`User ${userId} is already in terminal state. Skipping ${eventName}.`)
                    await supabase.from('webhook_events').update({
                        status: 'skipped',
                        skip_reason: 'terminal'
                    }).eq('id', webhookEventDbId)
                    return new Response('OK (terminal)', { status: 200 })
                }
            }
        } else if (customerEmail) {
            // Fallback: Resolution by email
            console.log(`[DEBUG] userId missing, attempting profile lookup by email ${customerEmail}...`)
            const { data: userData } = await supabase.from('profiles').select('id, subscription_status').eq('email', customerEmail).maybeSingle()
            if (userData) {
                userId = userData.id
                console.log(`[DEBUG] Resolved userId from email: ${userId}`)

                // Terminal State Check
                const isTerminalIncoming = ['subscription_cancelled', 'subscription_expired'].includes(eventName)
                const isTerminalExisting = ['canceled', 'expired'].includes(userData.subscription_status)

                if (isTerminalIncoming && isTerminalExisting) {
                    console.log(`User ${userId} is already in terminal state. Skipping ${eventName}.`)
                    await supabase.from('webhook_events').update({
                        status: 'skipped',
                        skip_reason: 'terminal'
                    }).eq('id', webhookEventDbId)
                    return new Response('OK (terminal)', { status: 200 })
                }
            }
        }

        if (!userId) {
            console.error(`User resolution failed for event ${eventName} (Sub ID: ${resourceId})`)
            await supabase.from('webhook_events').update({
                status: 'failed',
                last_error: 'User not found'
            }).eq('id', webhookEventDbId)
            return new Response('User not found', { status: 404 })
        }

        // 8. Process Logic
        console.log(`Processing LS event "${eventName}" for user ${userId}...`)
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

        switch (eventName) {
            case 'subscription_created':
            case 'subscription_updated':
            case 'subscription_resumed':
            case 'subscription_payment_recovered':
            case 'subscription_payment_success': {
                let targetStatus = lsStatus === 'on_trial' ? 'trialing' : (lsStatus === 'paid' ? 'active' : (lsStatus || 'active'));
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
            default:
                // Handle ignored events
                await supabase.from('webhook_events').update({
                    status: 'skipped',
                    skip_reason: 'ignored'
                }).eq('id', webhookEventDbId)
                return new Response('OK (ignored)', { status: 200 })
        }

        // 9. Send Emails
        // Only send welcome email on initial creation to prevent duplicates
        if (eventName === 'subscription_created') {
            try {
                await triggerSubscriptionEmail(customerEmail || '', 'active')
            } catch (e: any) {
                console.warn('Email error:', e.message)
            }
        } else if (eventName === 'subscription_cancelled') {
            try {
                await triggerSubscriptionEmail(customerEmail || '', 'cancelled', currentPeriodEnd || undefined)
            } catch (e: any) {
                console.warn('Email error:', e.message)
            }
        }

        // 10. Mark as processed
        await supabase.from('webhook_events').update({
            status: 'processed',
            processed_at: new Date().toISOString()
        }).eq('id', webhookEventDbId)

        return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
        })

    } catch (err: any) {
        console.error('Webhook Runtime Error:', err.message)
        if (typeof webhookEventDbId !== 'undefined') {
            try {
                await supabase.from('webhook_events').update({
                    status: 'failed',
                    last_error: err.message
                }).eq('id', webhookEventDbId)
            } catch (dbErr: any) {
                console.error('Failed to record error in DB:', dbErr.message)
            }
        }
        return new Response(JSON.stringify({ error: err.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500
        })
    }
})

async function triggerSubscriptionEmail(email: string, action_type: 'active' | 'cancelled', period_end?: string) {
    if (!email || !serviceRoleKey) {
        console.warn('Missing email or serviceRoleKey, skipping email trigger')
        return
    }

    const payload = JSON.stringify({
        user: { email },
        action_type: 'subscription',
        subscription_data: {
            action_type,
            period_end
        }
    })

    try {
        const res = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'Content-Type': 'application/json',
            },
            body: payload,
        })

        if (!res.ok) {
            const errorText = await res.text()
            console.error('Error triggering send-email function:', errorText)
        } else {
            console.log(`Successfully triggered ${action_type} email for ${email}`)
        }
    } catch (err: any) {
        console.error('Failed to call send-email function:', err.message)
    }
}
