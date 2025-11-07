import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { DashboardSidebar } from '@/components/dashboard-sidebar';

interface DiscordUser {
  id: string;
  username: string;
  global_name?: string;
  discriminator: string;
  avatar: string;
  email?: string;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('discord_user');

  if (!userCookie) {
    redirect('/');
  }

  let user: DiscordUser;
  try {
    user = JSON.parse(userCookie.value);
  } catch (error) {
    redirect('/');
  }

  return (
    <DashboardSidebar
      key={user.id}
      username={user.username}
      userId={user.id}
      avatar={user.avatar}
    >
      {children}
    </DashboardSidebar>
  );
}
