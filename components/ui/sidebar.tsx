"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, User, Settings, Bell, Grid, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const AnimatedMenuToggle = ({
  toggle,
  isOpen,
}: {
  toggle: () => void;
  isOpen: boolean;
}) => (
  <button
    onClick={toggle}
    aria-label="Toggle menu"
    className="focus:outline-none z-999"
  >
    <motion.div animate={{ y: isOpen ? 13 : 0 }} transition={{ duration: 0.3 }}>
      <motion.svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        transition={{ duration: 0.3 }}
        className="text-white"
      >
        <motion.path
          fill="transparent"
          strokeWidth="3"
          stroke="currentColor"
          strokeLinecap="round"
          variants={{
            closed: { d: "M 2 2.5 L 22 2.5" },
            open: { d: "M 3 16.5 L 17 2.5" },
          }}
        />
        <motion.path
          fill="transparent"
          strokeWidth="3"
          stroke="currentColor"
          strokeLinecap="round"
          variants={{
            closed: { d: "M 2 12 L 22 12", opacity: 1 },
            open: { opacity: 0 },
          }}
          transition={{ duration: 0.2 }}
        />
        <motion.path
          fill="transparent"
          strokeWidth="3"
          stroke="currentColor"
          strokeLinecap="round"
          variants={{
            closed: { d: "M 2 21.5 L 22 21.5" },
            open: { d: "M 3 2.5 L 17 16.5" },
          }}
        />
      </motion.svg>
    </motion.div>
  </button>
);

const CollapsibleSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-4">
      <button
        className="w-full flex items-center justify-between py-2 px-4 rounded-xl hover:bg-white/5 transition-colors text-white/90"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-sm">{title}</span>
        {open ? <ChevronDown className="h-4 w-4 text-white/70" /> : <ChevronRight className="h-4 w-4 text-white/70" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface SidebarProps {
  username: string;
  userId: string;
  avatar?: string;
  links: Array<{
    label: string;
    href: string;
    icon: React.ReactNode;
  }>;
  children: React.ReactNode;
}

const Sidebar = ({ username, userId, avatar, links, children }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const mobileSidebarVariants = {
    hidden: { x: "-100%" },
    visible: { x: 0 },
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Discord avatar URL
  const avatarUrl = avatar
    ? `https://cdn.discordapp.com/avatars/${userId}/${avatar}.png`
    : "https://cdn.discordapp.com/embed/avatars/0.png";

  return (
    <div className="flex h-screen bg-black">
      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden fixed inset-0 z-40 bg-black/50"
              onClick={toggleSidebar}
            />

            {/* Sidebar Panel */}
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={mobileSidebarVariants}
              transition={{ duration: 0.3 }}
              className="md:hidden fixed inset-y-0 left-0 z-50 w-[280px] bg-black border-r border-white/5"
            >
              <div className="flex flex-col h-full">
                {/* Profile Section */}
                <div className="p-4 border-b border-white/5">
                  <div className="flex items-center space-x-3">
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="font-semibold text-white/90">{username}</p>
                      <p className="text-sm text-white/40">R.O.T.I Staff</p>
                    </div>
                  </div>
                </div>

                {/* Navigation Section */}
                <nav className="flex-1 p-4 overflow-y-auto">
                  <ul>
                    {links.map((link, idx) => (
                      <li key={idx} className="mb-2">
                        <a
                          href={link.href}
                          className="flex gap-2 font-medium text-sm items-center w-full py-2 px-4 rounded-xl hover:bg-white/5 transition-colors text-white/90"
                        >
                          {link.icon}
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* Footer / Action Button */}
                <div className="p-4 border-t border-white/5">
                  <a
                    href="/dashboard/profile"
                    className="block w-full font-medium text-sm p-2 text-center bg-purple-500/90 rounded-xl hover:bg-purple-500 transition-colors text-white"
                  >
                    View profile
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col fixed top-0 left-0 h-full w-64 bg-black border-r border-white/5">
        {/* Profile Section */}
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center space-x-3">
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-semibold text-white/90">{username}</p>
              <p className="text-sm text-white/40">R.O.T.I Staff</p>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul>
            {links.map((link, idx) => (
              <li key={idx} className="mb-2">
                <a
                  href={link.href}
                  className="flex gap-2 font-medium text-sm items-center w-full py-2 px-4 rounded-xl hover:bg-white/5 transition-colors text-white/90"
                >
                  {link.icon}
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer / Action Button */}
        <div className="p-4 border-t border-white/5">
          <a
            href="/dashboard/profile"
            className="block w-full font-medium text-sm p-2 text-center bg-purple-500/90 rounded-xl hover:bg-purple-500 transition-colors text-white"
          >
            View profile
          </a>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-0 md:ml-64 transition-all duration-300">
        {/* Top bar for mobile toggle */}
        <div className="p-4 bg-black border-b border-white/5 md:hidden flex justify-between items-center">
          <h1 className="text-xl font-bold text-white/90">R.O.T.I Staff</h1>
          <AnimatedMenuToggle toggle={toggleSidebar} isOpen={isOpen} />
        </div>
        <div className="h-full overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export { Sidebar, CollapsibleSection, AnimatedMenuToggle };
