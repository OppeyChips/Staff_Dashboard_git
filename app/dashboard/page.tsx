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

  // Use global_name (display name) if available, otherwise username
  const displayName = user.global_name || user.username;

  return (
    <DashboardSidebar
      username={user.username}
      userId={user.id}
      avatar={user.avatar}
    >
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {/* Purple glow from top right */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-light text-white/90 tracking-tight">
            Hello, {displayName}
          </h1>
          <p className="mt-4 text-white/40 text-sm">
            Welcome to the Staff Dashboard
          </p>
        </div>
      </div>
    </DashboardSidebar>
  );
}
