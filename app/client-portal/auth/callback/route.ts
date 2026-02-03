import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const type = requestUrl.searchParams.get('type')

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {}
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.exchangeCodeForSession(code)

    // Update last_login_at for tracking
    if (user) {
      await supabase
        .from('client_portal_users')
        .update({ last_login_at: new Date().toISOString() })
        .eq('user_id', user.id)
    }

    // If this is an invite/signup flow, redirect to set-password
    if (type === 'invite' || type === 'signup' || type === 'recovery') {
      return NextResponse.redirect(new URL('/client-portal/set-password', request.url))
    }
  }

  return NextResponse.redirect(new URL('/client-portal/services', request.url))
}
