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
} from './shared.ts'

interface SubscriptionCancelledEmailProps {
  user_email: string
  period_end?: string
}

export const SubscriptionCancelledEmail = ({
  user_email,
  period_end,
}: SubscriptionCancelledEmailProps) => {
  const expiryDate = period_end ? new Date(period_end).toLocaleDateString() : 'the end of your current period'

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
      <Preview>RulCode Pro: Subscription Cancelled</Preview>
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
                alt="Cancelled"
                style={{ display: 'block', width: '100%', maxWidth: '520px', borderRadius: '12px', backgroundColor: 'transparent' }}
              />
            </Section>

            <Section>
              <Heading style={headingCondensed}>PRO CANCELLED</Heading>
              <Text style={textStyle}>
                Your RulCode Pro subscription has been cancelled. You will continue to have access to all premium features until <span style={{ color: '#ffffff', fontWeight: '600' }}>{expiryDate}</span>.
              </Text>
              <Text style={textStyle}>
                After this date, your account will revert to the free plan. We'd love to have you back whenever you're ready to resume your prep!
              </Text>
            </Section>

            <Section style={{ margin: '40px 0' }}>
              <Link href="https://rulcode.com/pricing" style={buttonStyle}>
                Reactivate Pro
              </Link>
            </Section>

            <Hr style={hrStyle} />

            <Section>
              <Text style={footerStyle}>
                If you have any questions or feedback about why you're leaving, we'd love to hear from you. Just reply to this email.
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

export default SubscriptionCancelledEmail
