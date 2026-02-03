import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  if (!serviceRoleKey || !supabaseUrl) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  try {
    const { clientId, email, name, password } = await request.json()

    if (!clientId || !email || !password) {
      return NextResponse.json({ error: 'clientId, email, and password required' }, { status: 400 })
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    // Check if user exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const existingUser = existingUsers?.users?.find(u => u.email?.toLowerCase() === email.toLowerCase())

    let userId: string

    if (existingUser) {
      // Update password for existing user
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
        password,
        email_confirm: true,
      })
      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 400 })
      }
      userId = existingUser.id
    } else {
      // Create new user with password
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name, client_id: clientId },
      })
      if (createError) {
        return NextResponse.json({ error: createError.message }, { status: 400 })
      }
      userId = newUser.user.id
    }

    // Link to client
    await supabaseAdmin
      .from('client_portal_users')
      .upsert({ client_id: clientId, user_id: userId }, { onConflict: 'user_id' })

    return NextResponse.json({ success: true, userId })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 })
  }
}
