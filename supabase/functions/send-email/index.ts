import React from 'react'
import { createClient } from '@supabase/supabase-js'
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'
import { Resend } from 'https://esm.sh/resend@4.0.0'
import { renderAsync } from '@react-email/components'
import { WelcomeEmail } from './_templates/welcome.tsx'
import { LoginWelcomeEmail } from './_templates/login-welcome.tsx'
import { SubscriptionSuccessEmail } from './_templates/subscription-success.tsx'
import { SubscriptionCancelledEmail } from './_templates/subscription-cancelled.tsx'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)
const hookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET') as string
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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
  const isServiceRole = serviceRoleKey && authHeader?.includes(serviceRoleKey)

  const payload = await req.text()
  const headers = Object.fromEntries(req.headers)

  let payload_data: any

  if (isServiceRole) {
    console.log('Authenticating via Service Role')
    payload_data = JSON.parse(payload)
  } else if (authHeader && authHeader.startsWith('Bearer ')) {
    // Check if the caller is an admin
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

  if (!payload_data) {
    console.log('Authenticating via Webhook Signature')
    // Standardwebhooks expects a base64 encoded secret or a whsec_ prefixed string
    const getValidSecret = (secret: string) => {
      if (!secret) return ''
      if (secret.startsWith('whsec_')) return secret
      try {
        atob(secret)
        return secret
      } catch {
        return btoa(secret)
      }
    }

    const wh = new Webhook(getValidSecret(hookSecret))
    try {
      payload_data = wh.verify(payload, headers) as any
    } catch (err: any) {
      console.error('Webhook verification failed:', err.message)
      return new Response(JSON.stringify({ error: 'Unauthorized or Invalid Signature' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
  }

  try {
    const {
      user,
      email_data = {},
      action_type: root_action_type,
    } = payload_data

    const { token, token_hash, redirect_to, email_action_type: nested_action_type } = email_data
    const email_action_type = root_action_type || nested_action_type || 'unknown'

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
        default:
          return 'Verify Your Email'
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
      from: 'RulCode <support@rulcode.com>',
      to: [user.email],
      subject: getSubject(email_action_type),
      html,
    })

    if (error) {
      console.error('Error sending email:', error)
      throw error
    }

    console.log(`Email sent successfully to ${user.email}`)

    return new Response(JSON.stringify({}), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  } catch (err: unknown) {
    const error = err as { code?: number; message?: string }
    console.error('Error in send-email function:', error)
    return new Response(
      JSON.stringify({
        error: {
          http_code: error.code || 500,
          message: error.message || 'Unknown error',
        },
      }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    )
  }
})
