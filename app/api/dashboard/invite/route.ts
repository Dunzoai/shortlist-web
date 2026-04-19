import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const userId = req.cookies.get('dashboard_auth')?.value;
  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { email, name, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
  }

  const { data, error } = await supabase.rpc('invite_dashboard_user', {
    p_email: email.trim(),
    p_name: name?.trim() || null,
    p_password: password,
  });

  if (error) {
    if (error.message?.includes('unique') || error.message?.includes('duplicate') || error.code === '23505') {
      return NextResponse.json({ error: 'A user with this email already exists.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create user.' }, { status: 500 });
  }

  return NextResponse.json({ success: true, userId: data });
}
