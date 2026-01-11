import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  // Optional: Add authentication check for cron job
  // const authHeader = request.headers.get('authorization');
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  const appSecret = process.env.INSTAGRAM_APP_SECRET;

  if (!appSecret) {
    return NextResponse.json(
      { error: 'Instagram App Secret not configured' },
      { status: 500 }
    );
  }

  try {
    // Get all tokens expiring within 10 days
    const tenDaysFromNow = new Date();
    tenDaysFromNow.setDate(tenDaysFromNow.getDate() + 10);

    const { data: tokens, error: fetchError } = await supabase
      .from('instagram_tokens')
      .select('*')
      .lt('expires_at', tenDaysFromNow.toISOString());

    if (fetchError) {
      throw new Error(`Failed to fetch tokens: ${fetchError.message}`);
    }

    if (!tokens || tokens.length === 0) {
      return NextResponse.json({
        message: 'No tokens need refreshing',
        refreshed: 0,
      });
    }

    const results = [];
    let successCount = 0;
    let errorCount = 0;

    // Refresh each token
    for (const token of tokens) {
      try {
        const refreshParams = new URLSearchParams({
          grant_type: 'ig_refresh_token',
          access_token: token.access_token,
        });

        const refreshResponse = await fetch(
          `https://graph.instagram.com/refresh_access_token?${refreshParams.toString()}`
        );

        if (!refreshResponse.ok) {
          const errorData = await refreshResponse.json();
          throw new Error(`Failed to refresh token: ${JSON.stringify(errorData)}`);
        }

        const refreshData = await refreshResponse.json();
        const newAccessToken = refreshData.access_token;
        const expiresIn = refreshData.expires_in;

        // Calculate new expiration date
        const newExpiresAt = new Date(Date.now() + expiresIn * 1000);

        // Update token in database
        const { error: updateError } = await supabase
          .from('instagram_tokens')
          .update({
            access_token: newAccessToken,
            expires_at: newExpiresAt.toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('client_id', token.client_id);

        if (updateError) {
          throw new Error(`Failed to update token: ${updateError.message}`);
        }

        results.push({
          client_id: token.client_id,
          status: 'success',
          new_expires_at: newExpiresAt.toISOString(),
        });
        successCount++;
      } catch (error) {
        console.error(`Error refreshing token for client ${token.client_id}:`, error);
        results.push({
          client_id: token.client_id,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        errorCount++;
      }
    }

    return NextResponse.json({
      message: 'Token refresh completed',
      total: tokens.length,
      success: successCount,
      errors: errorCount,
      results,
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to refresh tokens' },
      { status: 500 }
    );
  }
}
