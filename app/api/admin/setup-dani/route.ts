import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const DANI_CLIENT_ID = 'a6601136-0ab3-40f0-a4ba-79b6be33a24c'
const DANI_EMAIL = 'danidiazrealestate@gmail.com'

export async function GET() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  if (!serviceRoleKey || !supabaseUrl) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  try {
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    // Check if user exists in auth
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    let user = existingUsers?.users?.find(u => u.email?.toLowerCase() === DANI_EMAIL.toLowerCase())

    if (!user) {
      // Create user with a temp password
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: DANI_EMAIL,
        password: 'DaniDiaz2024!',
        email_confirm: true,
        user_metadata: { name: 'Dani Diaz', client_id: DANI_CLIENT_ID },
      })

      if (createError) {
        return NextResponse.json({ error: `Create user failed: ${createError.message}` }, { status: 400 })
      }
      user = newUser.user
    }

    // Link in client_portal_users
    const { error: linkError } = await supabaseAdmin
      .from('client_portal_users')
      .upsert({
        client_id: DANI_CLIENT_ID,
        user_id: user.id,
      }, { onConflict: 'user_id' })

    if (linkError) {
      return NextResponse.json({ error: `Link failed: ${linkError.message}` }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'Dani is set up!',
      email: DANI_EMAIL,
      userId: user.id,
      clientId: DANI_CLIENT_ID
    })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 })
  }
}
