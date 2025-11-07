"use client";
import React from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { LayoutDashboard, UserCog, LogOut, FlaskConical } from "lucide-react";

interface DashboardSidebarProps {
  username: string;
  userId: string;
  avatar?: string;
  children: React.ReactNode;
}

export function DashboardSidebar({ username, userId, avatar, children }: DashboardSidebarProps) {
  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="text-white/70 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Research & Dev",
      href: "/dashboard/research",
      icon: <FlaskConical className="text-white/70 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Profile",
      href: "/dashboard/profile",
      icon: <UserCog className="text-white/70 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Logout",
      href: "/api/auth/logout",
      icon: <LogOut className="text-white/70 h-5 w-5 flex-shrink-0" />,
    },
  ];

  return (
    <Sidebar
      username={username}
      userId={userId}
      avatar={avatar}
      links={links}
    >
      {children}
    </Sidebar>
  );
}
