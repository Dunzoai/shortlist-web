import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const clientId = searchParams.get('client_id');

  if (!clientId) {
    return NextResponse.json(
      { error: 'client_id parameter is required' },
      { status: 400 }
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
  const authUrl = new URL('https://api.instagram.com/oauth/authorize');
  authUrl.searchParams.set('client_id', appId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', 'user_profile,user_media');
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('state', clientId); // Pass client_id as state

  return NextResponse.redirect(authUrl.toString());
}
