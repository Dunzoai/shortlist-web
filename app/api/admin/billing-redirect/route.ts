import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Dani Diaz's client ID
const DANI_CLIENT_ID = 'a6601136-0ab3-40f0-a4ba-79b6be33a24c'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const debug = searchParams.get('debug')

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  if (!serviceRoleKey || !supabaseUrl) {
    if (debug) return NextResponse.json({ error: 'Missing env vars' })
    return NextResponse.redirect('https://my.shortlistpass.com/login')
  }

  try {
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    // Get Dani's email from her client record (search by name since ID was truncated)
    const { data: client, error: clientError } = await supabaseAdmin
      .from('clients')
      .select('id, email, name')
      .eq('name', 'Dani Diaz')
      .single()

    if (clientError || !client?.email) {
      if (debug) return NextResponse.json({ error: 'Client not found', clientError })
      return NextResponse.redirect('https://my.shortlistpass.com/login')
    }

    // Check if user exists and is linked
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const authUser = existingUsers?.users?.find(u => u.email?.toLowerCase() === client.email.toLowerCase())

    const { data: portalLink } = await supabaseAdmin
      .from('client_portal_users')
      .select('*')
      .eq('client_id', client.id)
      .single()

    if (debug) {
      return NextResponse.json({
        client,
        authUserExists: !!authUser,
        authUserId: authUser?.id,
        portalLink
      })
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
      return NextResponse.redirect('https://my.shortlistpass.com/login')
    }

    // Redirect to the magic link
    return NextResponse.redirect(data.properties.action_link)
  } catch (err) {
    if (debug) return NextResponse.json({ error: String(err) })
    return NextResponse.redirect('https://my.shortlistpass.com/login')
  }
}
