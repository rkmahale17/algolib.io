import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
  Hr,
} from 'https://esm.sh/@react-email/components@0.0.22'
import * as React from 'https://esm.sh/react@18.3.1'

interface ConfirmationEmailProps {
  supabase_url: string
  email_action_type: string
  redirect_to: string
  token_hash: string
  token: string
  user_email?: string
}

export const ConfirmationEmail = ({
  token,
  supabase_url,
  email_action_type,
  redirect_to,
  token_hash,
  user_email,
}: ConfirmationEmailProps) => {
  const getSubjectAndHeading = () => {
    switch (email_action_type) {
      case 'signup':
        return { heading: 'Welcome to RulCode!', preview: 'Confirm your email to get started' }
      case 'recovery':
        return { heading: 'Reset Your Password', preview: 'Click the link to reset your password' }
      case 'invite':
        return { heading: "You're Invited!", preview: 'Accept your invitation to RulCode' }
      case 'magiclink':
        return { heading: 'Your Magic Link', preview: 'Click to sign in to RulCode' }
      case 'email_change':
        return { heading: 'Confirm Email Change', preview: 'Verify your new email address' }
      default:
        return { heading: 'Verify Your Email', preview: 'Click to verify your email' }
    }
  }

  const { heading, preview } = getSubjectAndHeading()

  const getButtonText = () => {
    switch (email_action_type) {
      case 'signup':
        return 'Confirm Email'
      case 'recovery':
        return 'Reset Password'
      case 'invite':
        return 'Accept Invitation'
      case 'magiclink':
        return 'Sign In'
      case 'email_change':
        return 'Confirm New Email'
      default:
        return 'Verify Email'
    }
  }

  const confirmationUrl = `${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`

  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with Logo */}
          <Section style={header}>
            <Text style={logo}>RulCode</Text>
          </Section>

          <Section style={content}>
            <Heading style={h1}>{heading}</Heading>
            
            {email_action_type === 'signup' && (
              <Text style={text}>
                Thanks for signing up! Please confirm your email address to get started with RulCode.
              </Text>
            )}
            
            {email_action_type === 'recovery' && (
              <Text style={text}>
                We received a request to reset your password. Click the button below to create a new password.
              </Text>
            )}

            {email_action_type === 'magiclink' && (
              <Text style={text}>
                Click the button below to sign in to your RulCode account.
              </Text>
            )}

            {email_action_type === 'email_change' && (
              <Text style={text}>
                Please confirm your new email address by clicking the button below.
              </Text>
            )}

            <Section style={buttonContainer}>
              <Link href={confirmationUrl} style={button}>
                {getButtonText()}
              </Link>
            </Section>

            <Text style={textMuted}>
              Or copy and paste this link into your browser:
            </Text>
            <Text style={linkText}>{confirmationUrl}</Text>

            {token && (
              <>
                <Text style={textMuted}>
                  Alternatively, use this verification code:
                </Text>
                <code style={code}>{token}</code>
              </>
            )}

            <Hr style={hr} />

            <Text style={footer}>
              If you didn't request this email, you can safely ignore it.
            </Text>
          </Section>

          <Section style={footerSection}>
            <Text style={footerText}>
              © {new Date().getFullYear()} RulCode. All rights reserved.
            </Text>
            <Link href="https://rulcode.com" style={footerLink}>
              rulcode.com
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default ConfirmationEmail

const main = {
  backgroundColor: '#0f0f23',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
}

const header = {
  padding: '24px',
  textAlign: 'center' as const,
}

const logo = {
  color: '#22d3ee',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0',
  letterSpacing: '-1px',
}

const content = {
  backgroundColor: '#1a1a2e',
  borderRadius: '12px',
  padding: '40px',
  border: '1px solid #2a2a4a',
}

const h1 = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 24px',
  textAlign: 'center' as const,
}

const text = {
  color: '#a1a1aa',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 24px',
  textAlign: 'center' as const,
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#22d3ee',
  borderRadius: '8px',
  color: '#0f0f23',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: 'bold',
  padding: '14px 32px',
  textDecoration: 'none',
  textAlign: 'center' as const,
}

const textMuted = {
  color: '#71717a',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '16px 0 8px',
  textAlign: 'center' as const,
}

const linkText = {
  color: '#22d3ee',
  fontSize: '12px',
  lineHeight: '18px',
  wordBreak: 'break-all' as const,
  textAlign: 'center' as const,
  margin: '0 0 16px',
}

const code = {
  display: 'block',
  padding: '16px',
  margin: '16px auto',
  width: 'fit-content',
  backgroundColor: '#0f0f23',
  borderRadius: '8px',
  border: '1px solid #2a2a4a',
  color: '#22d3ee',
  fontSize: '24px',
  fontFamily: 'monospace',
  letterSpacing: '4px',
  textAlign: 'center' as const,
}

const hr = {
  borderColor: '#2a2a4a',
  margin: '32px 0',
}

const footer = {
  color: '#52525b',
  fontSize: '13px',
  lineHeight: '20px',
  textAlign: 'center' as const,
}

const footerSection = {
  textAlign: 'center' as const,
  padding: '24px',
}

const footerText = {
  color: '#52525b',
  fontSize: '12px',
  margin: '0 0 8px',
}

const footerLink = {
  color: '#22d3ee',
  fontSize: '12px',
  textDecoration: 'none',
}
