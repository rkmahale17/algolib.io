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

interface InviteUserEmailProps {
  supabase_url: string
  token_hash: string
  redirect_to: string
  email_action_type: string
  invited_by?: string
}

export const InviteUserEmail = ({
  supabase_url,
  token_hash,
  redirect_to,
  email_action_type,
  invited_by,
}: InviteUserEmailProps) => {
  const inviteUrl = `${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`

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
      <Preview>You're invited to RulCode!</Preview>
      <Body className="body" style={mainStyle}>
        <div style={forceDarkWrapper}>

        <Container className="bg-main" style={containerStyle}>
          <Section className="bg-card" style={cardStyle}>
            
            <Section>
              <Img
                src={HERO_IMAGE_URL}
                width="600"
                height="auto"
                alt="Join RulCode"
                style={{ display: 'block', width: '100%', maxWidth: '600px', backgroundColor: 'transparent' }}
              />
            </Section>

            <Section style={{ padding: '40px' }}>
              <Section style={{ marginBottom: '32px' }}>
                <Row>
                  <Column style={{ width: '42px', verticalAlign: 'middle', paddingRight: '8px' }}>
                    <Img src={LOGO_URL} width="42" height="39" alt="Logo" style={{ display: 'block', borderRadius: '4px' }} />
                  </Column>
                  <Column style={{ verticalAlign: 'middle' }}>
                    <Heading className="text-force-white" style={headingCondensed}>
                      YOU'RE&nbsp;INVITED
                    </Heading>
                  </Column>
                </Row>
              </Section>

              <Section>
                <Text className="text-force-grey" style={textStyle}>
                  {invited_by ? `${invited_by} has invited you to join RulCode.` : "You've been invited to join RulCode."}
                </Text>
                <Text className="text-force-grey" style={textStyle}>
                  RulCode is the ultimate platform for mastering algorithm patterns and technical interview preparation.
                </Text>
              </Section>

              <Section style={{ marginTop: '40px' }}>
                <Link className="cta-button" href={inviteUrl} style={buttonStyle}>
                  Accept Invitation
                </Link>
              </Section>

              <Hr style={hrStyle} />

              <Section>
                <Text className="text-force-grey" style={footerStyle}>
                  If you weren't expecting this invitation, you can safely ignore this email.
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

export default InviteUserEmail
