import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type') as 'magiclink' | 'email';
  const code = searchParams.get('code');

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignore in server component
          }
        },
      },
    }
  );

  let error = null;

  if (tokenHash && type) {
    // Verify the token hash directly (magic link flow)
    const result = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    error = result.error;
  } else if (code) {
    // PKCE code exchange flow
    const result = await supabase.auth.exchangeCodeForSession(code);
    error = result.error;
  } else {
    error = { message: 'Missing token' };
  }

  if (!error) {
    return NextResponse.redirect(new URL('/dashboard/inbox', request.url));
  }

  return NextResponse.redirect(new URL('/dashboard/login?error=auth_failed', request.url));
}
