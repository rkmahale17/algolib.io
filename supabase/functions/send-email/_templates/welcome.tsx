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
  CARD_BACKGROUND,
} from './shared.ts'

interface WelcomeEmailProps {
  user_email: string
  supabase_url?: string
  token_hash?: string
  redirect_to?: string
  email_action_type?: string
}

export const WelcomeEmail = ({
  user_email,
  supabase_url,
  token_hash,
  redirect_to,
  email_action_type,
}: WelcomeEmailProps) => {
  const confirmationUrl = supabase_url && token_hash 
    ? `${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type || 'signup'}&redirect_to=${redirect_to}`
    : "https://rulcode.com/dashboard"

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
          
          /* Gmail Dark Mode Hack */
          u + .body .bg-main { background-color: ${BACKGROUND_COLOR} !important; }
          u + .body .bg-card { background-color: ${CARD_BACKGROUND} !important; }
          
          [data-ogsc] .bg-main { background-color: ${BACKGROUND_COLOR} !important; }
          [data-ogsb] .bg-main { background-color: ${BACKGROUND_COLOR} !important; }
          
          [data-ogsc] .bg-card { background-color: ${CARD_BACKGROUND} !important; }
          [data-ogsb] .bg-card { background-color: ${CARD_BACKGROUND} !important; }

          @media (prefers-color-scheme: dark) {
            body { background-color: ${BACKGROUND_COLOR} !important; }
            .bg-main { background-color: ${BACKGROUND_COLOR} !important; }
            .bg-card { background-color: ${CARD_BACKGROUND} !important; }
          }
        `}</style>
      </Head>
      <Preview>Confirm your email address for RulCode</Preview>
      <Body className="body" style={mainStyle}>
        <Container className="bg-main" style={containerStyle}>
          <Section className="bg-card" style={cardStyle}>
            
            {/* Logo Section */}
            <Section style={{ marginBottom: '32px' }}>
              <Img
                src={LOGO_URL}
                width="32"
                height="32"
                alt="RulCode"
                style={{ display: 'block', backgroundColor: 'transparent' }}
              />
            </Section>

            {/* Hero Image Section */}
            <Section style={{ marginBottom: '48px' }}>
              <Img
                src={HERO_IMAGE_URL}
                width="520"
                height="auto"
                alt="Welcome"
                style={{ 
                  display: 'block', 
                  width: '100%', 
                  maxWidth: '520px', 
                  borderRadius: '12px',
                  backgroundColor: 'transparent'
                }}
              />
            </Section>

            {/* Body Content */}
            <Section>
              <Heading style={headingCondensed}>
                almost there
              </Heading>
              <Text style={textStyle}>
                Thank you for signing up for RulCode.
              </Text>
              <Text style={textStyle}>
                To verify your account and start mastering algorithm patterns, we just need to confirm your email.
              </Text>
              <Text style={{ ...textStyle, color: 'rgb(129,129,129)', marginTop: '24px' }}>
                If you didn't create an account, you can safely ignore this email.
              </Text>
            </Section>

            {/* Action Button */}
            <Section style={{ margin: '40px 0' }}>
              <Link href={confirmationUrl} style={buttonStyle}>
                Confirm Email
              </Link>
            </Section>

            <Hr style={hrStyle} />

            <Section>
              <Text style={footerStyle}>
                RulCode helps developers master complex coding patterns through interactive visualizations and curated practice.
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

export default WelcomeEmail
