export const BRAND_COLOR = '#84CC16'
export const BACKGROUND_COLOR = '#000000'
export const CARD_BACKGROUND = '#111111'
export const TEXT_PRIMARY = '#ffffff'
export const TEXT_SECONDARY = '#c4c4c4'
export const TEXT_MUTED = '#818181'
export const BORDER_COLOR = '#2b2b2b'

export const LOGO_URL = 'https://dkebbjneobjtmuzzrsdo.supabase.co/storage/v1/object/public/asset/logo.webp'
export const HERO_IMAGE_URL = 'https://dkebbjneobjtmuzzrsdo.supabase.co/storage/v1/object/public/asset/hero.webp'

export const SOCIAL_LINKS = {
  x: 'https://x.com/rulcode',
  linkedin: 'https://www.linkedin.com/company/rulcode',
  github: 'https://github.com/rulcode',
  youtube: 'https://youtube.com/@rulcode'
}

export const SOCIAL_ICONS = {
  x: 'https://react-email-demo-4fmncscpy-resend.vercel.app/static/shared/social-x-white.png',
  linkedin: 'https://react-email-demo-4fmncscpy-resend.vercel.app/static/shared/social-li-white.png',
  github: 'https://react-email-demo-4fmncscpy-resend.vercel.app/static/shared/social-gh-white.png',
  youtube: 'https://react-email-demo-4fmncscpy-resend.vercel.app/static/shared/social-yt-white.png'
}

export const mainStyle = {
  backgroundColor: BACKGROUND_COLOR,
  backgroundImage: `linear-gradient(${BACKGROUND_COLOR}, ${BACKGROUND_COLOR})`,
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  color: TEXT_PRIMARY,
  padding: '40px 0',
}

export const containerStyle = {
  margin: '0 auto',
  maxWidth: '600px',
  backgroundColor: BACKGROUND_COLOR,
  backgroundImage: `linear-gradient(${BACKGROUND_COLOR}, ${BACKGROUND_COLOR})`,
}

export const cardStyle = {
  backgroundColor: CARD_BACKGROUND,
  backgroundImage: `linear-gradient(${CARD_BACKGROUND}, ${CARD_BACKGROUND})`,
  padding: '40px',
  borderRadius: '16px',
  border: `1px solid ${BORDER_COLOR}`,
}

export const headingCondensed = {
  color: TEXT_PRIMARY,
  fontSize: '56px',
  fontWeight: '500',
  margin: '32px 0 24px',
  textTransform: 'uppercase' as const,
  lineHeight: '1',
  letterSpacing: '-1.68px',
  fontFamily: '"IBM Plex Sans Condensed", "Arial Narrow", Arial, sans-serif',
}

export const textStyle = {
  color: TEXT_SECONDARY,
  fontSize: '14px',
  lineHeight: '1.5',
  letterSpacing: '0.3px',
  margin: '0 0 16px',
  textAlign: 'left' as const,
}

export const buttonContainerStyle = {
  textAlign: 'left' as const,
  margin: '32px 0',
}

export const buttonStyle = {
  backgroundColor: BRAND_COLOR,
  color: '#000000',
  display: 'inline-block',
  fontSize: '15px',
  fontWeight: '700',
  letterSpacing: '0.2px',
  padding: '16px 32px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  borderRadius: '8px',
}

export const hrStyle = {
  borderColor: BORDER_COLOR,
  margin: '40px 0',
}

export const footerStyle = {
  color: TEXT_SECONDARY,
  fontSize: '13px',
  lineHeight: '1.5',
  letterSpacing: '0.2px',
  textAlign: 'left' as const,
}

export const footerTextStyle = {
  color: TEXT_SECONDARY,
  fontSize: '11px',
  lineHeight: '1.5',
  letterSpacing: '0.3px',
  margin: '0 0 4px',
}

export const footerLinkStyle = {
  color: TEXT_SECONDARY,
  fontSize: '11px',
  textDecoration: 'underline',
}
