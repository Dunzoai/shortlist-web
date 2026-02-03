import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Dani Diaz's client ID
const DANI_CLIENT_ID = 'a6601136-0ab3-40f0-a4ba-79b6be33a24c'

export async function GET() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  if (!serviceRoleKey || !supabaseUrl) {
    return NextResponse.redirect('https://my.shortlistpass.com/login')
  }

  try {
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    // Get Dani's email from her client record
    const { data: client, error: clientError } = await supabaseAdmin
      .from('clients')
      .select('email')
      .eq('id', DANI_CLIENT_ID)
      .single()

    if (clientError || !client?.email) {
      console.error('[billing-redirect] Client not found:', clientError)
      return NextResponse.redirect('https://my.shortlistpass.com/login')
    }

    // Generate magic link for her email
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: client.email,
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
