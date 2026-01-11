import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const slug = searchParams.get('client_id');

  if (!slug) {
    return NextResponse.json(
      { error: 'client_id parameter is required' },
      { status: 400 }
    );
  }

  // Verify client exists by looking up slug
  const { data: clientData, error: clientError } = await supabase
    .from('web_clients')
    .select('id')
    .eq('slug', slug)
    .single();

  if (clientError || !clientData) {
    return NextResponse.json(
      { error: 'Client not found' },
      { status: 404 }
    );
  }

  const appId = process.env.INSTAGRAM_APP_ID;
  const redirectUri = `${request.nextUrl.origin}/api/instagram/callback`;

  if (!appId) {
    return NextResponse.json(
      { error: 'Instagram App ID not configured' },
      { status: 500 }
    );
  }

  // Build Instagram OAuth URL
  const authUrl = new URL('https://www.instagram.com/oauth/authorize');
  authUrl.searchParams.set('client_id', appId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', 'instagram_business_basic');
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('state', slug); // Pass slug as state

  return NextResponse.redirect(authUrl.toString());
}
