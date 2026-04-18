import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/proxy'

export async function proxy(request: NextRequest) {
    return await updateSession(request)
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - _next/data (internal pre-fetch data)
         * - favicon.ico (favicon file)
         * - images/assets...
         */
        '/((?!api|_next/static|_next/image|_next/data|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
