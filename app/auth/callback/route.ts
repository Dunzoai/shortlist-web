import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const DASHBOARD_EMAILS = ['grow.withgia26@gmail.com', 'hello@shortlistpass.com']

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/portal'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Check if this is a dashboard user — redirect to Gia's subdomain
      const { data: { user } } = await supabase.auth.getUser()
      if (user && DASHBOARD_EMAILS.includes(user.email?.toLowerCase() ?? '')) {
        return NextResponse.redirect('https://demo.growwithgia.shortlistpass.com/dashboard/inbox')
      }
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/portal/login?error=auth_failed`)
}
