import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state'); // This is the slug
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.json(
      { error: `Instagram authorization failed: ${error}` },
      { status: 400 }
    );
  }

  if (!code || !state) {
    return NextResponse.json(
      { error: 'Missing code or client_id in callback' },
      { status: 400 }
    );
  }

  const slug = state;

  try {
    // Look up client UUID from web_clients table using slug
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

    const clientUuid = clientData.id;

    const appId = process.env.INSTAGRAM_APP_ID;
    const appSecret = process.env.INSTAGRAM_APP_SECRET;
    const redirectUri = `${request.nextUrl.origin}/api/instagram/callback`;

    if (!appId || !appSecret) {
      return NextResponse.json(
        { error: 'Instagram credentials not configured' },
        { status: 500 }
      );
    }
    // Step 1: Exchange code for short-lived access token
    const tokenParams = new URLSearchParams({
      client_id: appId,
      client_secret: appSecret,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      code,
    });

    const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenParams.toString(),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      throw new Error(`Failed to get access token: ${JSON.stringify(errorData)}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    const userId = tokenData.user_id;

    // Calculate expiration date (1 hour for short-lived token)
    const expiresAt = new Date(Date.now() + 3600 * 1000);

    // Get Instagram username
    const userResponse = await fetch(
      `https://graph.instagram.com/me?fields=username&access_token=${accessToken}`
    );

    const userData = await userResponse.json();
    const username = userData.username;

    // Step 3: Save to Supabase using UUID
    const { error: dbError } = await supabase
      .from('instagram_tokens')
      .upsert({
        client_id: clientUuid,
        access_token: accessToken,
        instagram_user_id: userId,
        instagram_username: username,
        token_expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'client_id'
      });

    if (dbError) {
      throw new Error(`Failed to save token: ${dbError.message}`);
    }

    // Redirect to success page or close window
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Instagram Connected</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background: #f7f7f7;
            }
            .container {
              text-align: center;
              padding: 2rem;
              background: white;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            h1 { color: #1B365D; margin: 0 0 1rem 0; }
            p { color: #3D3D3D; }
            .success { color: #C4A25A; font-size: 3rem; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="success">✓</div>
            <h1>Instagram Connected!</h1>
            <p>Your Instagram account @${username} has been successfully connected.</p>
            <p>You can close this window now.</p>
          </div>
          <script>
            setTimeout(() => window.close(), 3000);
          </script>
        </body>
      </html>
      `,
      {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      }
    );
  } catch (error) {
    console.error('Instagram OAuth error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
}
