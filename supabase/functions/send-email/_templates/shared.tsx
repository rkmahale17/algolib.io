import React from 'react'

export const BRAND_COLOR = '#84CC16'
export const BACKGROUND_COLOR = 'transparent'
export const CARD_BACKGROUND = '#000000'
export const TEXT_PRIMARY = '#ffffff'
export const TEXT_SECONDARY = '#ffffff'
export const TEXT_MUTED = '#a1a1a1'
export const BORDER_COLOR = '#333333'

export const LOGO_URL = 'https://dkebbjneobjtmuzzrsdo.supabase.co/storage/v1/object/public/asset/logo-circle.svg'
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

export const forceDarkWrapper = {
  backgroundColor: 'transparent',
  color: '#ffffff',
  WebkitTextFillColor: '#ffffff',
}

export const mainStyle = {
  backgroundColor: 'transparent',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  color: TEXT_PRIMARY,
  WebkitTextFillColor: TEXT_PRIMARY,
}

export const containerStyle = {
  margin: '0 auto',
  maxWidth: '600px',
  backgroundColor: 'transparent',
}

export const cardStyle = {
  backgroundColor: CARD_BACKGROUND,
  borderRadius: '24px',
  border: `1px solid ${BORDER_COLOR}`,
  overflow: 'hidden' as const,
}

export const headingCondensed = {
  color: TEXT_PRIMARY,
  WebkitTextFillColor: TEXT_PRIMARY,
  fontSize: '42px',
  fontWeight: '500',
  margin: '0',
  textTransform: 'uppercase' as const,
  lineHeight: '1.1',
  letterSpacing: '-0.5px',
  fontFamily: '"IBM Plex Sans Condensed", "Arial Narrow", Arial, sans-serif',
}

export const textStyle = {
  color: TEXT_SECONDARY,
  WebkitTextFillColor: TEXT_SECONDARY,
  fontSize: '15px',
  lineHeight: '1.6',
  letterSpacing: '0.2px',
  margin: '0 0 16px',
  textAlign: 'left' as const,
}

export const buttonContainerStyle = {
  textAlign: 'left' as const,
  margin: '32px 0',
}

export const buttonStyle = {
  backgroundColor: BRAND_COLOR,
  backgroundImage: `linear-gradient(${BRAND_COLOR}, ${BRAND_COLOR})`,
  color: '#ffffff',
  WebkitTextFillColor: '#ffffff',
  display: 'inline-block',
  fontSize: '24px',
  fontWeight: '500',
  margin: '0',
  padding: '16px 16px',
  textTransform: 'uppercase' as const,
  lineHeight: '1.1',
  letterSpacing: '-0.8px',
  fontFamily: '"IBM Plex Sans Condensed", "Arial Narrow", Arial, sans-serif',
  textDecoration: 'none',
  textAlign: 'center' as const,
  borderRadius: '6px',
  boxShadow: '0 4px 12px rgba(132, 204, 22, 0.3)',
}

export const hrStyle = {
  borderColor: BORDER_COLOR,
  margin: '40px 0',
}

export const footerStyle = {
  color: TEXT_SECONDARY,
  WebkitTextFillColor: TEXT_SECONDARY,
  fontSize: '13px',
  lineHeight: '1.5',
  letterSpacing: '0.2px',
  textAlign: 'left' as const,
}

export const footerTextStyle = {
  color: TEXT_SECONDARY,
  WebkitTextFillColor: TEXT_SECONDARY,
  fontSize: '11px',
  lineHeight: '1.5',
  letterSpacing: '0.3px',
  margin: '0 0 4px',
}

export const footerLinkStyle = {
  color: TEXT_SECONDARY,
  WebkitTextFillColor: TEXT_SECONDARY,
  fontSize: '11px',
  textDecoration: 'underline',
}

export const AntiClip = () => (
  <span style={{ display: 'none', fontSize: '1px', color: 'transparent', lineHeight: '1px', opacity: 0 }}>
    {Math.random().toString(36).substring(7)}
  </span>
)
