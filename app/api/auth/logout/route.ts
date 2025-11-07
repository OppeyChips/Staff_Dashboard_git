import { NextResponse } from 'next/server';

export async function GET() {
  const response = NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));

  // Clear authentication cookies
  response.cookies.delete('discord_user');
  response.cookies.delete('discord_token');

  return response;
}
