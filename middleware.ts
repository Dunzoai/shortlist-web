import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const isPortalSubdomain = hostname.startsWith('portal.')
  const isClientPortalSubdomain = hostname.startsWith('my.') || hostname.startsWith('clients.')

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

  // Handle client portal subdomain - map paths to /client-portal routes
  if (isClientPortalSubdomain) {
    if (!effectivePathname.startsWith('/client-portal')) {
      effectivePathname = `/client-portal${effectivePathname === '/' ? '/login' : effectivePathname}`
      needsRewrite = true
    }
  }

  const isPortalRoute = effectivePathname.startsWith('/portal')
  const isClientRoute = effectivePathname.startsWith('/client-portal')
  const isLoginPage = effectivePathname === '/portal/login'
  const isClientLoginPage = effectivePathname === '/client-portal/login'

  // Only protect portal/client routes (but not login pages)
  if ((!isPortalRoute && !isClientRoute) || isLoginPage || isClientLoginPage) {
    if (needsRewrite) {
      const url = request.nextUrl.clone()
      url.pathname = effectivePathname
      return NextResponse.rewrite(url)
    }
    return NextResponse.next()
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('[Middleware] Missing Supabase environment variables')
    return NextResponse.redirect(new URL('/error', request.url))
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
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
    url.pathname = isPortalSubdomain ? '/login' : isClientRoute ? '/client-portal/login' : '/portal/login'
    return NextResponse.redirect(url)
  }

  // For client routes, check if user is linked to a client OR is a super admin (Owner)
  if (isClientRoute) {
    // Check if user is an Owner in representatives table
    const { data: rep } = await supabase
      .from('representatives')
      .select('id, role')
      .eq('email', user.email)
      .eq('role', 'Owner')
      .single()

    if (rep) {
      // Super admin - allow access to all client routes
      if (needsRewrite) {
        const url = request.nextUrl.clone()
        url.pathname = effectivePathname
        return NextResponse.rewrite(url)
      }
      return supabaseResponse
    }

    const { data: portalUser } = await supabase
      .from('client_portal_users')
      .select('client_id')
      .eq('user_id', user.id)
      .single()

    if (!portalUser) {
      const url = request.nextUrl.clone()
      url.pathname = '/client-portal/login'
      url.searchParams.set('error', 'not_authorized')
      return NextResponse.redirect(url)
    }

    // Client is authorized, continue
    if (needsRewrite) {
      const url = request.nextUrl.clone()
      url.pathname = effectivePathname
      return NextResponse.rewrite(url)
    }
    return supabaseResponse
  }

  // Check if user email is in admin list (for portal routes)
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
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
