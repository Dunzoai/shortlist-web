import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  if (!serviceRoleKey) {
    console.error('[invite-client] Missing SUPABASE_SERVICE_ROLE_KEY')
    return NextResponse.json({ error: 'Server misconfigured: missing service role key' }, { status: 500 })
  }
  if (!supabaseUrl) {
    console.error('[invite-client] Missing NEXT_PUBLIC_SUPABASE_URL')
    return NextResponse.json({ error: 'Server misconfigured: missing Supabase URL' }, { status: 500 })
  }

  try {
    const { clientId, email, name } = await request.json()

    if (!clientId || !email) {
      return NextResponse.json({ error: 'clientId and email are required' }, { status: 400 })
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    // Check if user already exists in auth
    const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers()

    if (listError) {
      console.error('[invite-client] Failed to list users:', listError)
      return NextResponse.json({ error: `Auth error: ${listError.message}` }, { status: 500 })
    }

    const existingUser = existingUsers?.users?.find(u => u.email === email)

    let userId: string

    if (existingUser) {
      userId = existingUser.id
    } else {
      // Invite user via Supabase (sends magic link email)
      const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
        data: { name, client_id: clientId },
        redirectTo: `https://my.shortlistpass.com/client-portal/auth/callback`,
      })

      if (inviteError) {
        console.error('[invite-client] Supabase invite error:', inviteError)
        return NextResponse.json({ error: `Invite failed: ${inviteError.message}` }, { status: 400 })
      }

      if (!inviteData?.user?.id) {
        return NextResponse.json({ error: 'Invite succeeded but no user ID returned' }, { status: 500 })
      }

      userId = inviteData.user.id
    }

    // Link user to client in client_portal_users
    const { error: linkError } = await supabaseAdmin
      .from('client_portal_users')
      .upsert({
        client_id: clientId,
        user_id: userId,
        role: 'client',
      }, { onConflict: 'user_id' })

    if (linkError) {
      console.error('[invite-client] Link error:', linkError)
      return NextResponse.json({ error: `Database error: ${linkError.message}` }, { status: 400 })
    }

    return NextResponse.json({ success: true, userId, alreadyExisted: !!existingUser })
  } catch (err) {
    console.error('[invite-client] Unexpected error:', err)
    return NextResponse.json({
      error: `Unexpected error: ${err instanceof Error ? err.message : 'Unknown'}`
    }, { status: 500 })
  }
}
