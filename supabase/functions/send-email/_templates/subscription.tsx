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
  Img,
} from 'https://esm.sh/@react-email/components@0.0.22'
import * as React from 'https://esm.sh/react@18.3.1'

interface SubscriptionEmailProps {
  user_email: string
  action_type: 'active' | 'cancelled' | 'trial_ending'
  period_end?: string
}

export const SubscriptionEmail = ({
  user_email,
  action_type,
  period_end,
}: SubscriptionEmailProps) => {
  const getSubjectAndHeading = () => {
    switch (action_type) {
      case 'active':
        return { heading: 'Premium Activated! 👑', preview: 'Welcome to RulCode Premium' }
      case 'cancelled':
        return { heading: 'Subscription Cancelled', preview: 'Your premium access will end soon' }
      case 'trial_ending':
        return { heading: 'Trial Ending Soon', preview: 'Don\'t lose your progress!' }
      default:
        return { heading: 'Subscription Update', preview: 'Update on your RulCode subscription' }
    }
  }

  const { heading, preview } = getSubjectAndHeading()

  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>RulCode</Text>
          </Section>

          <Section style={content}>
            <Heading style={h1}>{heading}</Heading>
            
            {action_type === 'active' && (
              <Text style={text}>
                Congratulations! Your premium subscription is now active. You have full access to all algorithm patterns, Blind 75 problems, and advanced visualizations.
              </Text>
            )}
            
            {action_type === 'cancelled' && (
              <Text style={text}>
                Your subscription has been cancelled. You will continue to have premium access until {period_end ? new Date(period_end).toLocaleDateString() : 'the end of your current period'}.
              </Text>
            )}

            {action_type === 'trial_ending' && (
              <Text style={text}>
                Your 10-day free trial is ending in 2 days. Upgrade now to keep your progress and maintain full access to all premium patterns.
              </Text>
            )}

            <Section style={buttonContainer}>
              <Link href="https://rulcode.com/problems" style={button}>
                {action_type === 'active' ? 'Start Practicing' : 'Upgrade Now'}
              </Link>
            </Section>

            <Hr style={hr} />

            <Text style={footer}>
              Questions? Reply to this email or visit our support page.
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

export default SubscriptionEmail

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
