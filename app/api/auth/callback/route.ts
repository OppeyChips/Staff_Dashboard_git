import { NextRequest, NextResponse } from 'next/server';

interface DiscordTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

interface DiscordUser {
  id: string;
  username: string;
  global_name?: string;
  discriminator: string;
  avatar: string;
  email?: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  // Handle authorization denial
  if (error) {
    return NextResponse.redirect(new URL('/?error=access_denied', request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/?error=missing_code', request.url));
  }

  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = process.env.DISCORD_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.json(
      { error: 'Missing Discord OAuth configuration' },
      { status: 500 }
    );
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Discord token exchange failed:', errorData);
      throw new Error(`Failed to exchange code for token: ${JSON.stringify(errorData)}`);
    }

    const tokenData: DiscordTokenResponse = await tokenResponse.json();

    // Fetch user information
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user information');
    }

    const userData: DiscordUser = await userResponse.json();

    // Create response and redirect to dashboard
    const response = NextResponse.redirect(new URL('/dashboard', request.url));

    // Set session cookie with user data (you may want to use a more secure session management solution)
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax' as const,
      path: '/',
      ...(isProduction && { domain: '.profchips.beer' }), // Set domain for production
    };

    response.cookies.set('discord_user', JSON.stringify({
      id: userData.id,
      username: userData.username,
      global_name: userData.global_name,
      discriminator: userData.discriminator,
      avatar: userData.avatar,
      email: userData.email,
    }), {
      ...cookieOptions,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Optionally store the access token (consider encryption in production)
    response.cookies.set('discord_token', tokenData.access_token, {
      ...cookieOptions,
      maxAge: tokenData.expires_in,
    });

    return response;
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(new URL('/?error=oauth_failed', request.url));
  }
}
