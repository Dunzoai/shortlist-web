import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { currentPassword, newPassword } = await req.json();
  const storedPassword = process.env.DASHBOARD_PASSWORD || 'growwithgia2026';

  if (currentPassword !== storedPassword) {
    return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 401 });
  }

  if (!newPassword || newPassword.length < 6) {
    return NextResponse.json({ error: 'New password must be at least 6 characters.' }, { status: 400 });
  }

  // Note: This updates the env var in memory only for this process.
  // To persist, update DASHBOARD_PASSWORD in Vercel env vars.
  process.env.DASHBOARD_PASSWORD = newPassword;

  return NextResponse.json({ success: true, message: 'Password updated. Update DASHBOARD_PASSWORD in Vercel to persist across deploys.' });
}
