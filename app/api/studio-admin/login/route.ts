import { NextRequest, NextResponse } from 'next/server';
import { STUDIO_ADMIN_COOKIE, studioAdminToken } from '@/lib/studioAdmin';

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (!password) {
    return NextResponse.json({ error: 'Password is required' }, { status: 400 });
  }

  const token = studioAdminToken();
  if (!token) {
    return NextResponse.json(
      { error: 'Server misconfigured: missing SUNDAY_ADMIN_PASSWORD' },
      { status: 500 }
    );
  }

  if (password !== process.env.SUNDAY_ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set(STUDIO_ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
