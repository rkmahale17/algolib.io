import React from 'https://esm.sh/react@18.3.1'
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'
import { Resend } from 'https://esm.sh/resend@4.0.0'
import { renderAsync } from 'https://esm.sh/@react-email/components@0.0.22'
import { ConfirmationEmail } from './_templates/confirmation.tsx'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)
const hookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET') as string

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

  const payload = await req.text()
  const headers = Object.fromEntries(req.headers)
  
  console.log('Received email hook request')
  
  const wh = new Webhook(hookSecret)
  
  try {
    const {
      user,
      email_data: { token, token_hash, redirect_to, email_action_type },
    } = wh.verify(payload, headers) as {
      user: {
        email: string
      }
      email_data: {
        token: string
        token_hash: string
        redirect_to: string
        email_action_type: string
        site_url: string
        token_new: string
        token_hash_new: string
      }
    }

    console.log(`Processing ${email_action_type} email for ${user.email}`)

    const getSubject = (actionType: string): string => {
      switch (actionType) {
        case 'signup':
          return 'Welcome to RulCode - Confirm Your Email'
        case 'recovery':
          return 'RulCode - Reset Your Password'
        case 'invite':
          return "You're Invited to RulCode!"
        case 'magiclink':
          return 'RulCode - Your Magic Link'
        case 'email_change':
          return 'RulCode - Confirm Your New Email'
        default:
          return 'RulCode - Verify Your Email'
      }
    }

    const html = await renderAsync(
      React.createElement(ConfirmationEmail, {
        supabase_url: Deno.env.get('SUPABASE_URL') ?? '',
        token,
        token_hash,
        redirect_to,
        email_action_type,
        user_email: user.email,
      })
    )

    console.log('Email HTML rendered successfully')

    const { error } = await resend.emails.send({
      from: 'RulCode <no-reply@rulcode.com>',
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
