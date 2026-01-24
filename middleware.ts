import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const isPortalSubdomain = hostname.startsWith('portal.')

  // Determine the effective pathname (after potential rewrite)
  let effectivePathname = request.nextUrl.pathname
  let needsRewrite = false

  // Handle portal subdomain - map paths to /portal routes
  if (isPortalSubdomain) {
    if (!effectivePathname.startsWith('/portal') && !effectivePathname.startsWith('/auth')) {
      effectivePathname = `/portal${effectivePathname === '/' ? '' : effectivePathname}`
      needsRewrite = true
    }
  }

  const isPortalRoute = effectivePathname.startsWith('/portal')
  const isLoginPage = effectivePathname === '/portal/login'

  // Only protect portal routes (but not login page)
  if (!isPortalRoute || isLoginPage) {
    if (needsRewrite) {
      const url = request.nextUrl.clone()
      url.pathname = effectivePathname
      return NextResponse.rewrite(url)
    }
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
    // On portal subdomain, redirect to /login (cleaner URL)
    url.pathname = isPortalSubdomain ? '/login' : '/portal/login'
    return NextResponse.redirect(url)
  }

  // Check if user email is in admin list
  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map((e) => e.trim().toLowerCase()) ?? []

  if (!adminEmails.includes(user.email?.toLowerCase() ?? '')) {
    const url = request.nextUrl.clone()
    url.pathname = isPortalSubdomain ? '/login' : '/portal/login'
    url.searchParams.set('error', 'not_authorized')
    return NextResponse.redirect(url)
  }

  // If we need to rewrite (portal subdomain with non-portal path), do it now
  if (needsRewrite) {
    const url = request.nextUrl.clone()
    url.pathname = effectivePathname
    // Copy cookies to rewrite response
    const rewriteResponse = NextResponse.rewrite(url)
    supabaseResponse.cookies.getAll().forEach(cookie => {
      rewriteResponse.cookies.set(cookie.name, cookie.value)
    })
    return rewriteResponse
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
