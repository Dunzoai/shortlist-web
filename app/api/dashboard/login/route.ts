import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const { email, password, keepLoggedIn } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  const { data, error } = await supabase.rpc('verify_dashboard_user', {
    p_email: email.trim(),
    p_password: password,
  });

  if (error || !data || data.length === 0) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  const user = data[0];
  const maxAge = keepLoggedIn ? 60 * 60 * 24 * 30 : 60 * 60 * 8;
  const res = NextResponse.json({ success: true });

  res.cookies.set('dashboard_auth', user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/dashboard',
    maxAge,
  });

  res.cookies.set('dashboard_user', JSON.stringify({ id: user.id, email: user.email, name: user.name }), {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/dashboard',
    maxAge,
  });

  return res;
}
