import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const isPortalSubdomain = hostname.startsWith('portal.')

  // Handle portal subdomain - rewrite to /portal routes
  if (isPortalSubdomain) {
    const pathname = request.nextUrl.pathname

    // Don't rewrite if already going to /portal or /auth
    if (!pathname.startsWith('/portal') && !pathname.startsWith('/auth')) {
      const url = request.nextUrl.clone()
      url.pathname = `/portal${pathname === '/' ? '' : pathname}`
      return NextResponse.rewrite(url)
    }
  }

  const isPortalRoute = request.nextUrl.pathname.startsWith('/portal')
  const isLoginPage = request.nextUrl.pathname === '/portal/login'

  // Only protect portal routes
  if (!isPortalRoute || isLoginPage) {
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = '/portal/login'
    return NextResponse.redirect(url)
  }

  // Check if user email is in admin list
  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map((e) => e.trim().toLowerCase()) ?? []

  if (!adminEmails.includes(user.email?.toLowerCase() ?? '')) {
    const url = request.nextUrl.clone()
    url.pathname = '/portal/login'
    url.searchParams.set('error', 'not_authorized')
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
