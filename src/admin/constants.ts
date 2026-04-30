
export const IS_ADMIN_ENABLED = 
  process.env.NODE_ENV === 'development' || 
  process.env.BUILD_ADMIN === 'true' || 
  process.env.NEXT_PUBLIC_ADMIN_ENABLED === 'true';
