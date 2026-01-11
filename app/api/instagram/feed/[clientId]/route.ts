import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: { clientId: string } }
) {
  const { clientId } = params;

  try {
    // Get the access token from Supabase
    const { data: tokenData, error: tokenError } = await supabase
      .from('instagram_tokens')
      .select('access_token, username, expires_at')
      .eq('client_id', clientId)
      .single();

    if (tokenError || !tokenData) {
      return NextResponse.json(
        { error: 'Instagram account not connected for this client' },
        { status: 404 }
      );
    }

    // Check if token is expired
    const expiresAt = new Date(tokenData.expires_at);
    if (expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Instagram token has expired. Please reconnect your account.' },
        { status: 401 }
      );
    }

    const accessToken = tokenData.access_token;

    // Fetch latest 6 posts from Instagram Graph API
    const fields = 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp';
    const instagramResponse = await fetch(
      `https://graph.instagram.com/me/media?fields=${fields}&limit=6&access_token=${accessToken}`
    );

    if (!instagramResponse.ok) {
      const errorData = await instagramResponse.json();
      throw new Error(`Instagram API error: ${JSON.stringify(errorData)}`);
    }

    const instagramData = await instagramResponse.json();

    // Transform the data to include username
    const posts = instagramData.data.map((post: any) => ({
      id: post.id,
      caption: post.caption || '',
      media_type: post.media_type,
      media_url: post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url,
      permalink: post.permalink,
      timestamp: post.timestamp,
    }));

    return NextResponse.json({
      username: tokenData.username,
      posts,
    });
  } catch (error) {
    console.error('Error fetching Instagram feed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch Instagram feed' },
      { status: 500 }
    );
  }
}
