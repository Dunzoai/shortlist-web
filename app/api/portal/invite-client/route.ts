import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  if (!serviceRoleKey || !supabaseUrl) {
    return NextResponse.json({ error: 'Missing server configuration' }, { status: 500 })
  }

  const { clientId, email, name } = await request.json()

  if (!clientId || !email) {
    return NextResponse.json({ error: 'clientId and email are required' }, { status: 400 })
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // Check if user already exists in auth
  const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
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
      return NextResponse.json({ error: inviteError.message }, { status: 400 })
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
    return NextResponse.json({ error: linkError.message }, { status: 400 })
  }

  return NextResponse.json({ success: true, userId, alreadyExisted: !!existingUser })
}
