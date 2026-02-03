import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export async function GET() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  if (!serviceRoleKey || !supabaseUrl) {
    return NextResponse.redirect('https://my.shortlistpass.com/login')
  }

  try {
    // Get current user from the admin session
    const cookieStore = await cookies()
    const supabase = createServerClient(
      supabaseUrl,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll() {},
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user?.email) {
      return NextResponse.redirect('https://my.shortlistpass.com/login')
    }

    // Generate magic link for the client portal
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: user.email,
      options: {
        redirectTo: 'https://my.shortlistpass.com/client-portal/auth/callback',
      },
    })

    if (error || !data?.properties?.action_link) {
      console.error('[billing-redirect] Error generating link:', error)
      return NextResponse.redirect('https://my.shortlistpass.com/login')
    }

    // Redirect to the magic link
    return NextResponse.redirect(data.properties.action_link)
  } catch (err) {
    console.error('[billing-redirect] Error:', err)
    return NextResponse.redirect('https://my.shortlistpass.com/login')
  }
}
