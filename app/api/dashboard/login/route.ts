import { NextRequest, NextResponse } from 'next/server';

const DASHBOARD_PASSWORD = process.env.DASHBOARD_PASSWORD || 'growwithgia2026';

export async function POST(req: NextRequest) {
  const { password, keepLoggedIn } = await req.json();

  if (password !== DASHBOARD_PASSWORD) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });

  // Set a signed cookie
  const maxAge = keepLoggedIn ? 60 * 60 * 24 * 30 : 60 * 60 * 8; // 30 days or 8 hours
  res.cookies.set('dashboard_auth', 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/dashboard',
    maxAge,
  });

  return res;
}
