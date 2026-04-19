import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const { currentPassword, newPassword } = await req.json();

  const userId = req.cookies.get('dashboard_auth')?.value;
  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  if (!newPassword || newPassword.length < 6) {
    return NextResponse.json({ error: 'New password must be at least 6 characters.' }, { status: 400 });
  }

  const { data, error } = await supabase.rpc('change_dashboard_password', {
    p_user_id: userId,
    p_current_password: currentPassword,
    p_new_password: newPassword,
  });

  if (error) {
    return NextResponse.json({ error: 'Failed to change password.' }, { status: 500 });
  }

  if (data === false) {
    return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 401 });
  }

  return NextResponse.json({ success: true });
}
