import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const { clientId: slug } = await params;
  console.log('[Instagram Feed] Fetching feed for client slug:', slug);

  try {
    // Look up client UUID from web_clients table using slug
    const { data: clientData, error: clientError } = await supabase
      .from('web_clients')
      .select('id')
      .eq('slug', slug)
      .single();

    if (clientError || !clientData) {
      console.error('[Instagram Feed] Client not found:', slug, clientError);
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    const clientUuid = clientData.id;
    console.log('[Instagram Feed] Found client UUID:', clientUuid);

    // Get the access token from Supabase using UUID
    const { data: tokenData, error: tokenError } = await supabase
      .from('instagram_tokens')
      .select('access_token, instagram_username, token_expires_at')
      .eq('client_id', clientUuid)
      .single();

    if (tokenError || !tokenData) {
      console.error('[Instagram Feed] No token found for client:', clientUuid, tokenError);
      return NextResponse.json(
        { error: 'Instagram account not connected for this client' },
        { status: 404 }
      );
    }

    console.log('[Instagram Feed] Found token, expires at:', tokenData.token_expires_at);

    // Check if token is expired
    const expiresAt = new Date(tokenData.token_expires_at);
    if (expiresAt < new Date()) {
      console.error('[Instagram Feed] Token expired:', expiresAt);
      return NextResponse.json(
        { error: 'Instagram token has expired. Please reconnect your account.' },
        { status: 401 }
      );
    }

    const accessToken = tokenData.access_token;
    console.log('[Instagram Feed] Using access token (first 20 chars):', accessToken.substring(0, 20) + '...');

    // Step 1: Test token by fetching user profile first
    console.log('[Instagram Feed] Testing token with profile fetch...');
    const profileUrl = `https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`;
    const profileResponse = await fetch(profileUrl);

    console.log('[Instagram Feed] Profile response status:', profileResponse.status);

    if (!profileResponse.ok) {
      const profileError = await profileResponse.json();
      console.error('[Instagram Feed] Profile fetch failed:', JSON.stringify(profileError, null, 2));
      throw new Error(`Instagram profile fetch failed: ${JSON.stringify(profileError)}`);
    }

    const profileData = await profileResponse.json();
    console.log('[Instagram Feed] Profile data:', JSON.stringify(profileData, null, 2));

    // Step 2: Fetch latest 6 posts from Instagram Business API
    console.log('[Instagram Feed] Token works! Now fetching media...');
    const mediaUrl = `https://graph.instagram.com/v21.0/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=6&access_token=${accessToken}`;
    const instagramResponse = await fetch(mediaUrl);

    console.log('[Instagram Feed] Media response status:', instagramResponse.status);

    if (!instagramResponse.ok) {
      const errorData = await instagramResponse.json();
      console.error('[Instagram Feed] Media fetch failed:', JSON.stringify(errorData, null, 2));
      throw new Error(`Instagram API error: ${JSON.stringify(errorData)}`);
    }

    const instagramData = await instagramResponse.json();
    console.log('[Instagram Feed] Media data received, post count:', instagramData.data?.length || 0);

    // Transform the data to include username
    const posts = instagramData.data.map((post: any) => ({
      id: post.id,
      caption: post.caption || '',
      media_type: post.media_type,
      media_url: post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url,
      permalink: post.permalink,
      timestamp: post.timestamp,
    }));

    console.log('[Instagram Feed] Successfully transformed posts, returning response');

    return NextResponse.json({
      username: tokenData.instagram_username,
      posts,
    });
  } catch (error) {
    console.error('[Instagram Feed] ERROR:', error);
    console.error('[Instagram Feed] Error details:', error instanceof Error ? error.stack : error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch Instagram feed' },
      { status: 500 }
    );
  }
}
