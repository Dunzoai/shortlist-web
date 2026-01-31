import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const { serviceId, serviceName, clientId, action = 'cancelled' } = await req.json()

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Supabase env vars not configured')
      return NextResponse.json({ error: 'Configuration error' }, { status: 500 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false } }
    )

    const { data: client } = await supabase
      .from('clients')
      .select('name, email')
      .eq('id', clientId)
      .single()

    const adminEmail = process.env.ADMIN_EMAILS?.split(',')[0] || 'admin@example.com'

    await supabase.from('notifications').insert({
      type: action === 'paused' ? 'service_paused' : 'service_cancelled',
      recipient_email: adminEmail,
      subject: `Service ${action}: ${serviceName}`,
      body: `Client ${client?.name || 'Unknown'} has ${action} the service: ${serviceName}`,
      metadata: { serviceId, clientId, serviceName }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Notification error:', error)
    return NextResponse.json({ error: 'Notification failed' }, { status: 500 })
  }
}
