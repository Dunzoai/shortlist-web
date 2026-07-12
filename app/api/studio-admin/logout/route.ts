import { NextResponse } from 'next/server';
import { STUDIO_ADMIN_COOKIE } from '@/lib/studioAdmin';

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(STUDIO_ADMIN_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return res;
}
