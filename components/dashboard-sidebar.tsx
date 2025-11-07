"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { LayoutDashboard, UserCog, LogOut, FlaskConical } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

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
      icon: (
        <LayoutDashboard className="text-white/70 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Research & Dev",
      href: "/dashboard/research",
      icon: (
        <FlaskConical className="text-white/70 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Profile",
      href: "/dashboard/profile",
      icon: (
        <UserCog className="text-white/70 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Logout",
      href: "/api/auth/logout",
      icon: (
        <LogOut className="text-white/70 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  const [open, setOpen] = useState(true);

  // Discord avatar URL
  const avatarUrl = avatar
    ? `https://cdn.discordapp.com/avatars/${userId}/${avatar}.png`
    : "https://cdn.discordapp.com/embed/avatars/0.png";

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row bg-black w-full flex-1 overflow-hidden",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen} animate={true}>
        <SidebarBody className="justify-between gap-10 bg-black border-r border-white/5">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: username,
                href: "/dashboard/profile",
                icon: (
                  <Image
                    src={avatarUrl}
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex flex-1">
        <div className="flex flex-col flex-1 w-full h-full overflow-auto bg-black">
          {children}
        </div>
      </div>
    </div>
  );
}

export const Logo = () => {
  return (
    <Link
      href="/dashboard"
      className="font-normal flex space-x-2 items-center text-sm py-1 relative z-20"
    >
      <Image
        src="/logo1.png"
        alt="R.O.T.I Staff Logo"
        width={24}
        height={24}
        className="flex-shrink-0"
        unoptimized
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-white/90 whitespace-pre"
      >
        R.O.T.I Staff
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="/dashboard"
      className="font-normal flex space-x-2 items-center text-sm py-1 relative z-20"
    >
      <Image
        src="/logo1.png"
        alt="R.O.T.I Staff Logo"
        width={24}
        height={24}
        className="flex-shrink-0"
        unoptimized
      />
    </Link>
  );
};
