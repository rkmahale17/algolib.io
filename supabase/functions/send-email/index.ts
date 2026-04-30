import React from 'react'
import { createClient } from '@supabase/supabase-js'
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'
import { Resend } from 'https://esm.sh/resend@4.0.0'
import { renderAsync } from '@react-email/components'
import { WelcomeEmail } from './_templates/welcome.tsx'
import { LoginWelcomeEmail } from './_templates/login-welcome.tsx'
import { SubscriptionSuccessEmail } from './_templates/subscription-success.tsx'
import { SubscriptionCancelledEmail } from './_templates/subscription-cancelled.tsx'
import { ResetPasswordEmail } from './_templates/reset-password.tsx'
import { InviteUserEmail } from './_templates/invite-user.tsx'
import { ChangeEmail } from './_templates/change-email.tsx'
import { ReauthenticateEmail } from './_templates/reauthenticate.tsx'
import { OnboardingWelcomeEmail } from './_templates/onboarding-welcome.tsx'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)
const hookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET') as string
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Initialize Supabase client with Service Role Key for background tasks
const supabaseAdmin = createClient(
  supabaseUrl,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  { auth: { persistSession: false } }
)

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const authHeader = req.headers.get('Authorization')
  const hookSecretHeader = req.headers.get('x-hook-secret')
  const isServiceRole = serviceRoleKey && authHeader?.includes(serviceRoleKey)

  const payload = await req.text()
  const headers = Object.fromEntries(req.headers)

  let payload_data: any

  // 1. Check Service Role or Simple Hook Secret
  if (isServiceRole || (hookSecret && (authHeader?.includes(hookSecret) || hookSecretHeader === hookSecret))) {
    console.log('Authenticating via Service Role or Hook Secret')
    try {
      payload_data = JSON.parse(payload)
    } catch (e) {
      console.error('Failed to parse payload:', e)
    }
  } 
  // 2. Check Admin Session
  else if (authHeader && authHeader.startsWith('Bearer ')) {
    console.log('Authenticating via Admin Session')
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    })
    
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      
      if (profile?.role === 'admin') {
        payload_data = JSON.parse(payload)
      }
    }
  }

  // 3. Fallback to Webhook Signature (Standardwebhooks)
  if (!payload_data && hookSecret) {
    console.log('Authenticating via Webhook Signature')
    const getValidSecret = (secret: string) => {
      if (!secret) return ''
      // Support the official v1,whsec_ prefix from Supabase docs
      const cleanSecret = secret.replace('v1,whsec_', '')
      try {
        atob(cleanSecret)
        return cleanSecret
      } catch {
        return btoa(cleanSecret)
      }
    }

    const wh = new Webhook(getValidSecret(hookSecret))
    try {
      payload_data = wh.verify(payload, headers) as any
    } catch (err: any) {
      console.error('Webhook verification failed:', err.message)
    }
  }

  if (!payload_data) {
    return new Response(JSON.stringify({ error: 'Unauthorized or Invalid Signature' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const {
      user,
      email_data = {},
      action_type: root_action_type,
    } = payload_data

    const { token, token_hash, redirect_to, email_action_type: nested_action_type } = email_data
    const email_action_type = root_action_type || nested_action_type || 'unknown'
    const sub_action_type = email_action_type === 'subscription' ? payload_data.subscription_data?.action_type : null

    // --- IDEMPOTENCY & DEBOUNCING ---
    // We include sub_action_type for subscriptions so 'success' and 'cancelled' don't block each other
    const idempotencyKey = sub_action_type 
      ? `${email_action_type}:${sub_action_type}:${user.email}`
      : `${email_action_type}:${user.email}`
    
    const DEBOUNCE_WINDOW_MS = 60000 // 1 minute

    let eventRecord: any = null

    try {
      // Check for recent duplicate
      const { data: recentEmail } = await supabaseAdmin
        .from('mailed_events')
        .select('id, status, created_at')
        .eq('idempotency_key', idempotencyKey)
        .gt('created_at', new Date(Date.now() - DEBOUNCE_WINDOW_MS).toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (recentEmail) {
        console.log(`Debouncing: Duplicate ${email_action_type} for ${user.email} detected (last sent ${recentEmail.created_at})`)
        // Log the duplicate attempt (async, don't wait for it if it fails)
        supabaseAdmin.from('mailed_events').insert({
          user_email: user.email,
          action_type: email_action_type,
          sub_action_type,
          status: 'duplicate',
          idempotency_key: idempotencyKey,
          payload: { original_id: recentEmail.id }
        }).then(({ error }) => { if (error) console.error('Failed to log duplicate:', error) })

        return new Response(JSON.stringify({ 
          message: 'Already sent recently. Please wait a moment before trying again.',
          type: 'debounced'
        }), {
          status: 200, // Still return 200 so UI says "Success" (the user already has a pending email)
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        })
      }

      // Log the intent to send
      const { data, error: logError } = await supabaseAdmin
        .from('mailed_events')
        .insert({
          user_email: user.email,
          action_type: email_action_type,
          sub_action_type,
          status: 'pending',
          token_hash,
          redirect_to,
          idempotency_key: idempotencyKey,
          payload: payload_data
        })
        .select()
        .single()

      if (logError) {
        console.error('Failed to log email intent:', logError)
      } else {
        eventRecord = data
      }
    } catch (dbError) {
      // If DB fails, we still proceed to send the email!
      console.error('Database error in email tracking (continuing send):', dbError)
    }

    console.log(`Processing ${email_action_type} email for ${user.email}`)

    const getSubject = (actionType: string): string => {
      if (actionType === 'subscription') {
        return payload_data.subscription_data?.action_type === 'cancelled'
          ? 'RulCode - Subscription Cancelled'
          : 'Welcome to RulCode Pro! 🚀'
      }

      switch (actionType) {
        case 'signup':
          return 'Welcome to RulCode - Confirm Your Email'
        case 'recovery':
          return 'RulCode - Reset Your Password'
        case 'invite':
          return "You're Invited to RulCode!"
        case 'magiclink':
          return 'Sign in to RulCode'
        case 'email_change':
          return 'Verify Your New Email Address'
        case 'reauthentication':
          return 'Confirm Your Identity'
        case 'onboarding':
          return 'Welcome to RulCode! Let\'s Get Started'
        default:
          return 'Verify Your Email'
      }
    }

    const getFromEmail = (actionType: string): string => {
      if (actionType === 'subscription') {
        return payload_data.subscription_data?.action_type === 'cancelled'
          ? 'RulCode <support@rulcode.com>'
          : 'RulCode <billing@rulcode.com>'
      }

      switch (actionType) {
        case 'signup':
        case 'onboarding':
          return 'RulCode <hello@rulcode.com>'
        case 'magiclink':
        case 'recovery':
        case 'invite':
        case 'email_change':
        case 'reauthentication':
          return 'RulCode <auth@rulcode.com>'
        default:
          return 'RulCode <hello@rulcode.com>'
      }
    }

    let template;
    if (email_action_type === 'subscription') {
      if (payload_data.subscription_data?.action_type === 'cancelled') {
        template = React.createElement(SubscriptionCancelledEmail, {
          user_email: user.email,
          period_end: payload_data.subscription_data?.period_end,
        });
      } else {
        template = React.createElement(SubscriptionSuccessEmail, {
          user_email: user.email,
        });
      }
    } else if (email_action_type === 'signup') {
      template = React.createElement(WelcomeEmail, {
        user_email: user.email,
        supabase_url: supabaseUrl,
        token_hash,
        redirect_to,
        email_action_type,
      });
    } else if (email_action_type === 'recovery') {
      template = React.createElement(ResetPasswordEmail, {
        supabase_url: supabaseUrl,
        token_hash,
        redirect_to,
        email_action_type,
      });
    } else if (email_action_type === 'invite') {
      template = React.createElement(InviteUserEmail, {
        supabase_url: supabaseUrl,
        token_hash,
        redirect_to,
        email_action_type,
      });
    } else if (email_action_type === 'email_change') {
      template = React.createElement(ChangeEmail, {
        supabase_url: supabaseUrl,
        token_hash,
        redirect_to,
        email_action_type,
      });
    } else if (email_action_type === 'reauthentication') {
      template = React.createElement(ReauthenticateEmail, {
        supabase_url: supabaseUrl,
        token_hash,
        redirect_to,
        email_action_type,
      });
    } else if (email_action_type === 'onboarding') {
      template = React.createElement(OnboardingWelcomeEmail, {
        user_email: user.email,
      });
    } else {
      template = React.createElement(LoginWelcomeEmail, {
        supabase_url: supabaseUrl,
        token_hash,
        redirect_to,
        email_action_type,
        token,
      });
    }

    const html = await renderAsync(template)

    console.log('Email HTML rendered successfully')


    const { error } = await resend.emails.send({
      from: getFromEmail(email_action_type),
      to: [user.email],
      reply_to: 'support@rulcode.com',
      subject: getSubject(email_action_type),
      html,
    })

    if (error) {
      console.error('Error sending email:', error)
      
      // Update audit log with failure
      if (eventRecord) {
        await supabaseAdmin
          .from('mailed_events')
          .update({ status: 'failed', error: JSON.stringify(error) })
          .eq('id', eventRecord.id)
      }
      
      throw error
    }

    console.log(`Email sent successfully to ${user.email}`)

    // Update audit log with success
    if (eventRecord) {
      await supabaseAdmin
        .from('mailed_events')
        .update({ status: 'sent', sent_at: new Date().toISOString() })
        .eq('id', eventRecord.id)
    }

    return new Response(JSON.stringify({}), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  } catch (err: unknown) {
    const error = err as { code?: number; message?: string; name?: string }
    console.error('Error in send-email function:', error)
    
    // Check if it's a Resend rate limit error
    const isRateLimit = error.name === 'rate_limit_exceeded' || error.message?.includes('rate limit')
    
    return new Response(
      JSON.stringify({
        error: {
          http_code: isRateLimit ? 429 : (error.code || 500),
          message: error.message || 'Unknown error',
          type: error.name
        },
      }),
      {
        status: isRateLimit ? 429 : 500, // Return 429 to client if it's a rate limit
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    )
  }
})
