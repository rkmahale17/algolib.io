import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // This will refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()

  // Protection Logic
  if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/dashboard')) {
      if (!user) {
          const next = url.pathname
          url.pathname = '/login'
          url.searchParams.set('next', next)
          return NextResponse.redirect(url)
      }

      // Admin Protection - Basic authentication check only.
      // Role-based protection is handled at the layout/page level (ProtectedAdminRoute)
      // to avoid redundant database queries in the middleware.
      if (url.pathname.startsWith('/admin')) {
          if (!user) {
              const next = url.pathname
              url.pathname = '/login'
              url.searchParams.set('next', next)
              return NextResponse.redirect(url)
          }
      }
  }

  return response
}
