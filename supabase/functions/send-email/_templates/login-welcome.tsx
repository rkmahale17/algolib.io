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
  Row,
  Column,
  Font,
} from '@react-email/components'
import React from 'react'
import {
  mainStyle,
  containerStyle,
  cardStyle,
  headingCondensed,
  textStyle,
  buttonStyle,
  hrStyle,
  footerStyle,
  footerTextStyle,
  footerLinkStyle,
  LOGO_URL,
  HERO_IMAGE_URL,
  SOCIAL_ICONS,
  BACKGROUND_COLOR,
  BRAND_COLOR,
  BORDER_COLOR,
} from './shared.ts'

interface LoginWelcomeEmailProps {
  supabase_url: string
  token_hash: string
  redirect_to: string
  email_action_type: string
  token?: string
}

export const LoginWelcomeEmail = ({
  supabase_url,
  token_hash,
  redirect_to,
  email_action_type,
  token,
}: LoginWelcomeEmailProps) => {
  const confirmationUrl = `${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`

  return (
    <Html lang="en">
      <Head>
        <meta name="color-scheme" content="only dark" />
        <meta name="supported-color-schemes" content="only dark" />
        <Font
          fontFamily="IBM Plex Sans Condensed"
          fallbackFontFamily="Arial"
          webFont={{
            url: 'https://fonts.gstatic.com/s/ibmplexsanscondensed/v15/Gg8gN4UfRSqiPg7Jn2ZI12V4DCEwkj1E4LVeHY5a64vr.ttf',
            format: 'truetype',
          }}
          fontWeight={500}
          fontStyle="normal"
        />
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: 'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7W0Q5nw.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <style>{`
          :root { color-scheme: only dark; }
          @media (prefers-color-scheme: dark) {
            body { background-color: ${BACKGROUND_COLOR} !important; }
          }
        `}</style>
      </Head>
      <Preview>Sign in to RulCode - Your Magic Link</Preview>
      <Body style={mainStyle}>
        <Container style={containerStyle}>
          <Section style={cardStyle}>
            <Section style={{ marginBottom: '32px' }}>
              <Img src={LOGO_URL} width="32" height="32" alt="RulCode" style={{ display: 'block', backgroundColor: 'transparent' }} />
            </Section>

            <Section style={{ marginBottom: '48px' }}>
              <Img
                src={HERO_IMAGE_URL}
                width="520"
                height="auto"
                alt="Welcome Back"
                style={{ display: 'block', width: '100%', maxWidth: '520px', borderRadius: '12px', backgroundColor: 'transparent' }}
              />
            </Section>

            <Section>
              <Heading style={headingCondensed}>Welcome Back</Heading>
              <Text style={textStyle}>
                Click the button below to securely sign in to your RulCode account. This link will expire shortly.
              </Text>
            </Section>

            <Section style={{ margin: '40px 0' }}>
              <Link href={confirmationUrl} style={buttonStyle}>
                Sign In to RulCode
              </Link>
            </Section>

            {token && (
              <Section style={{ marginBottom: '40px' }}>
                <Text style={{ ...textStyle, marginBottom: '12px' }}>Alternatively, use this verification code:</Text>
                <code style={{
                  display: 'inline-block',
                  padding: '12px 24px',
                  backgroundColor: BACKGROUND_COLOR,
                  borderRadius: '8px',
                  border: `1px solid ${BORDER_COLOR}`,
                  color: BRAND_COLOR,
                  fontSize: '24px',
                  fontFamily: 'monospace',
                  letterSpacing: '4px',
                }}>{token}</code>
              </Section>
            )}

            <Hr style={hrStyle} />

            <Section>
              <Text style={footerStyle}>
                If you didn't request this sign-in link, you can safely ignore this email.
              </Text>

              <Section style={{ marginTop: '32px', width: '152px' }}>
                <Row>
                  <Column style={{ width: '20px', paddingRight: '24px' }}>
                    <Link href="https://x.com/rulcode"><Img src={SOCIAL_ICONS.x} width="20" height="20" alt="X" /></Link>
                  </Column>
                  <Column style={{ width: '20px', paddingRight: '24px' }}>
                    <Link href="https://linkedin.com/company/rulcode"><Img src={SOCIAL_ICONS.linkedin} width="20" height="20" alt="LinkedIn" /></Link>
                  </Column>
                  <Column style={{ width: '20px', paddingRight: '24px' }}>
                    <Link href="https://youtube.com/@rulcode"><Img src={SOCIAL_ICONS.youtube} width="20" height="20" alt="YouTube" /></Link>
                  </Column>
                  <Column style={{ width: '20px' }}>
                    <Link href="https://github.com/rulcode"><Img src={SOCIAL_ICONS.github} width="20" height="20" alt="GitHub" /></Link>
                  </Column>
                </Row>
              </Section>

              <Section style={{ marginTop: '32px' }}>
                <Text style={footerTextStyle}>
                  Megapolis Street, Hinjewadi<br />
                  Pune, 411057
                </Text>
              </Section>

              <Section style={{ marginTop: '20px' }}>
                <Text style={{ ...footerTextStyle, maxWidth: '160px' }}>
                  <Link href="https://rulcode.com/unsubscribe" style={footerLinkStyle}>
                    Unsubscribe
                  </Link> from RulCode marketing emails.
                </Text>
              </Section>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default LoginWelcomeEmail
