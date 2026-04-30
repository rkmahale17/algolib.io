import {Body,
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
  AntiClip,
  forceDarkWrapper} from './shared.tsx'

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
        <meta name="color-scheme" content="dark" />
        <meta name="supported-color-schemes" content="dark" />
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
          @media (prefers-color-scheme: dark) {
            body, table, td, p, span, a {
              color: #ffffff !important;
              -webkit-text-fill-color: #ffffff !important;
            }
          }
          .cta-button {
            transition: all 0.2s ease-in-out !important;
            box-shadow: 0 4px 12px rgba(132, 204, 22, 0.4) !important;
          }
          .cta-button:hover, .cta-button:focus {
            background-color: #98e61a !important;
            box-shadow: 0 10px 28px rgba(132, 204, 22, 0.7) !important;
            transform: translateY(-3px) !important;
            outline: none !important;
          }
        `}</style>
      </Head>
      <Preview>Confirm your email address for RulCode</Preview>
      <Body className="body" style={mainStyle}>
        <div style={forceDarkWrapper}>

        <Container className="bg-main" style={containerStyle}>
          <Section className="bg-card" style={cardStyle}>
            
            <Section>
              <Img
                src={HERO_IMAGE_URL}
                width="600"
                height="auto"
                alt="Welcome to RulCode"
                style={{ display: 'block', width: '100%', maxWidth: '600px', backgroundColor: 'transparent' }}
              />
            </Section>

            <Section style={{ padding: '40px' }}>
              
              <Section style={{ marginBottom: '32px' }}>
                <Row>
                  <Column style={{ width: '42px', verticalAlign: 'middle', paddingRight: '8px' }}>
                    <Img
                      src={LOGO_URL}
                      width="42"
                      height="39"
                      alt="Logo"
                      style={{ display: 'block', borderRadius: '4px' }}
                    />
                  </Column>
                  <Column style={{ verticalAlign: 'middle' }}>
                    <Heading className="text-force-white" style={headingCondensed}>
                      ALMOST&nbsp;THERE
                    </Heading>
                  </Column>
                </Row>
              </Section>

              <Section>
                <Text className="text-force-grey" style={textStyle}>
                  Thank you for signing up for RulCode.
                </Text>
                <Text className="text-force-grey" style={textStyle}>
                  To verify your account and start mastering algorithm patterns, we just need to confirm your email address.
                </Text>
              </Section>

              <Section style={{ marginTop: '40px' }}>
                <Link href={confirmationUrl} className="cta-button" style={buttonStyle}>
                  Confirm Email
                </Link>
              </Section>

              <Hr style={hrStyle} />

              <Section>
                <Text className="text-force-grey" style={footerStyle}>
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
                  <Text className="text-force-grey" style={footerTextStyle}>
                    Megapolis Street, Hinjewadi<br />
                    Pune, 411057
                    <AntiClip />
                  </Text>
                </Section>
              </Section>
            </Section>

          </Section>
        </Container>
      
        </div>
      </Body>
    </Html>
  )
}

export default WelcomeEmail
