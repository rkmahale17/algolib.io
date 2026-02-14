import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.2'
import { Resend } from 'https://esm.sh/resend@4.0.0'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

interface BulkEmailRequest {
  subject: string
  content: string
  ctaText?: string
  ctaUrl?: string
  testEmail?: string // If provided, only send to this email for testing
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Verify admin authorization
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    }

    // Verify the user is an admin
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      console.error('Auth error:', authError)
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    }

    // Check if user is admin using the is_algorithms_admin function
    const { data: isAdmin, error: adminError } = await supabase.rpc('is_algorithms_admin')
    
    if (adminError || !isAdmin) {
      console.error('Admin check error:', adminError)
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    }

    const { subject, content, ctaText, ctaUrl, testEmail }: BulkEmailRequest = await req.json()

    if (!subject || !content) {
      return new Response(JSON.stringify({ error: 'Subject and content are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      })
    }

    console.log(`Starting bulk email send. Subject: ${subject}`)
    console.log(`Test mode: ${testEmail ? 'Yes - ' + testEmail : 'No'}`)

    // Fetch user emails
    let emails: string[] = []
    
    if (testEmail) {
      emails = [testEmail]
    } else {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('email')
        .not('email', 'is', null)

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError)
        throw new Error('Failed to fetch user emails')
      }

      emails = profiles?.map(p => p.email).filter(Boolean) as string[]
    }

    console.log(`Total emails to send: ${emails.length}`)

    // Generate email HTML
    const emailHtml = generateBroadcastEmail(subject, content, ctaText, ctaUrl)

    // Send emails in batches of 50
    const BATCH_SIZE = 50
    const results = {
      total: emails.length,
      successful: 0,
      failed: 0,
      errors: [] as string[],
    }

    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
      const batch = emails.slice(i, i + BATCH_SIZE)
      console.log(`Sending batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(emails.length / BATCH_SIZE)}`)

      // Send emails in current batch
      const batchPromises = batch.map(async (email) => {
        try {
          const { error } = await resend.emails.send({
            from: 'RulCode <support@rulcode.com>',
            to: [email],
            subject: subject,
            html: emailHtml,
          })

          if (error) {
            console.error(`Failed to send to ${email}:`, error)
            results.failed++
            results.errors.push(`${email}: ${error.message}`)
          } else {
            results.successful++
          }
        } catch (err) {
          console.error(`Error sending to ${email}:`, err)
          results.failed++
          results.errors.push(`${email}: ${err instanceof Error ? err.message : 'Unknown error'}`)
        }
      })

      await Promise.all(batchPromises)

      // Add a small delay between batches to respect rate limits
      if (i + BATCH_SIZE < emails.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    console.log(`Bulk email complete. Successful: ${results.successful}, Failed: ${results.failed}`)

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })

  } catch (err: unknown) {
    const error = err as { message?: string }
    console.error('Error in send-bulk-email function:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    )
  }
})

function generateBroadcastEmail(subject: string, content: string, ctaText?: string, ctaUrl?: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width: 600px; background-color: #1a1a1a; border-radius: 12px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 40px; text-align: center; background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); border-bottom: 1px solid #333;">
              <h1 style="margin: 0; color: #22c55e; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                RulCode
              </h1>
              <p style="margin: 8px 0 0 0; color: #888; font-size: 14px;">
                Learn. Visualize. Master Algorithms.
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 24px 0; color: #fff; font-size: 22px; font-weight: 600;">
                ${subject}
              </h2>
              <div style="color: #ccc; font-size: 16px; line-height: 1.6;">
                ${content.split('\n').map(line => `<p style="margin: 0 0 16px 0;">${line}</p>`).join('')}
              </div>
              
              ${ctaText && ctaUrl ? `
              <div style="margin-top: 32px; text-align: center;">
                <a href="${ctaUrl}" style="display: inline-block; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                  ${ctaText}
                </a>
              </div>
              ` : ''}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #111; border-top: 1px solid #333;">
              <p style="margin: 0 0 8px 0; color: #888; font-size: 14px; text-align: center;">
                You're receiving this email because you're a RulCode user.
              </p>
              <p style="margin: 0; color: #666; font-size: 12px; text-align: center;">
                © ${new Date().getFullYear()} RulCode. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}
