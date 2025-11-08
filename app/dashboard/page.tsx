import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { DashboardContent } from '@/components/dashboard-content';

interface DiscordUser {
  id: string;
  username: string;
  global_name?: string;
  discriminator: string;
  avatar: string;
  email?: string;
}

export default async function Dashboard() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('discord_user');

  // Redirect to login if not authenticated
  if (!userCookie) {
    redirect('/');
  }

  let user: DiscordUser;
  try {
    user = JSON.parse(userCookie.value);
  } catch {
    redirect('/');
  }

  return <DashboardContent user={user} />;
}
