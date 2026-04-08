"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  LayoutDashboard,
  FolderKanban,
  User,
  Rocket,
  MessageCircle,
  Search,
  ArrowRight,
  BadgeCheck,
} from "lucide-react";
import { ThemeToggle } from "../ui/ThemeToggle";
import { profile as localProfile } from "@/data/profile";
import { useEffect, useState } from "react";
import { getDocument } from "@/lib/firebase/firestore";
import { CommandPalette } from "../ui/CommandPalette";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/about", label: "About", icon: User },
  { href: "/contact", label: "Contact", icon: Rocket },
  { href: "/chat", label: "Guestbook", icon: MessageCircle },
];

const sidebarVariants = {
  hidden: { x: -280, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
      staggerChildren: 0.04,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

export function Sidebar() {
  const pathname = usePathname();
  const [profileData, setProfileData] = useState<typeof localProfile & { avatarUrl?: string }>(localProfile);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const settingsSnapshot = await getDocument<typeof localProfile>("settings", "profile");
        if (settingsSnapshot) {
          setProfileData((prev) => ({ ...prev, ...settingsSnapshot }));
        }
      } catch {
        // Fallback to local
      }
    }
    loadData();
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      
      <motion.aside
        id="sidebar"
        className="fixed left-0 top-0 bottom-0 w-[280px] border-r border-border z-40 hidden lg:flex flex-col"
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Profile Section */}
        <motion.div className="px-5 pt-10 pb-6 flex flex-col items-center text-center" variants={itemVariants}>
          <div className="mb-5 relative">
            <div className="w-[110px] h-[110px] rounded-full bg-linear-to-br from-accent/30 to-purple-500/30 flex items-center justify-center text-white font-bold text-4xl font-heading border-2 border-border overflow-hidden shadow-xl shadow-accent/5">
              {profileData.avatarUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={profileData.avatarUrl} alt={profileData.name} className="w-full h-full object-cover" />
              ) : (
                profileData.name.charAt(0)
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-background rounded-full border border-border flex items-center justify-center text-accent animate-pulse">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse-slow" title="Available for work" />
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <h2 className="font-heading font-semibold text-lg text-text-primary tracking-tight">
              {profileData.name}
            </h2>
            <BadgeCheck className="w-5 h-5 text-blue-500 fill-blue-500/10" />
          </div>
          <p className="text-sm font-medium text-text-secondary opacity-80 italic">@{profileData.nickname.toLowerCase()}</p>
        </motion.div>

        {/* Search */}
        <motion.div className="px-5 mb-3" variants={itemVariants}>
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-surface text-text-secondary text-sm hover:bg-surface-hover hover:border-border/80 transition-all cursor-pointer group"
          >
            <Search className="w-4 h-4 group-hover:text-text-primary transition-colors" />
            <span className="flex-1 text-left group-hover:text-text-primary transition-colors">Search</span>
            <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-surface-hover border border-border font-mono group-hover:bg-border/50 group-hover:text-text-primary transition-all">
              ctrl + K
            </kbd>
          </button>
        </motion.div>

        {/* Navigation */}
        <nav className="flex-1 px-3 overflow-y-auto">
          <div className="space-y-0.5">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <motion.div key={item.href} variants={itemVariants}>
                  <Link
                    href={item.href}
                    id={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                    className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "text-text-primary bg-surface-hover"
                        : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
                    }`}
                  >
                    <Icon
                      className={`w-[18px] h-[18px] transition-colors ${
                        isActive
                          ? "text-text-primary"
                          : "text-text-secondary group-hover:text-text-primary"
                      }`}
                    />
                    <span className="flex-1">{item.label}</span>
                    {isActive && (
                      <ArrowRight className="w-4 h-4 text-text-secondary" />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </nav>

        {/* Bottom Section */}
        <motion.div
          className="px-5 py-4 border-t border-border"
          variants={itemVariants}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-secondary">Theme</span>
            <ThemeToggle />
          </div>
        </motion.div>
      </motion.aside>
    </>
  );
}
