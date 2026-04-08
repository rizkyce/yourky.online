"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Home,
  LayoutDashboard,
  FolderKanban,
  User,
  Rocket,
  MessageCircle,
  X,
  Search,
  BadgeCheck,
} from "lucide-react";
import { ThemeToggle } from "../ui/ThemeToggle";
import { profile as localProfile } from "@/data/profile";
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

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const drawerVariants = {
  hidden: { x: "-100%" },
  visible: {
    x: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 30 },
  },
  exit: {
    x: "-100%",
    transition: { duration: 0.2, ease: "easeIn" as const },
  },
};

export function MobileNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [profileData, setProfileData] = useState<typeof localProfile & { avatarUrl?: string }>(localProfile);

  useEffect(() => {
    async function loadData() {
      try {
        const settingsSnapshot = await getDocument<{ avatarUrl?: string; name: string; nickname: string }>("settings", "profile");
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

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-background/80 backdrop-blur-xl border-b border-border z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsOpen(true)}
            className="w-8 h-8 rounded-full bg-linear-to-br from-accent/30 to-purple-500/30 flex items-center justify-center text-white font-bold font-heading border border-border overflow-hidden relative cursor-pointer"
          >
            {profileData.avatarUrl ? (
              <Image 
                src={profileData.avatarUrl} 
                alt={profileData.name}
                fill
                priority={true}
                sizes="32px"
                className="object-cover"
              />
            ) : (
              profileData.name.charAt(0)
            )}
          </button>
          <button 
            onClick={() => setIsOpen(true)}
            className="font-heading font-semibold text-sm text-text-primary text-left cursor-pointer flex items-center gap-1"
          >
            {profileData.name}
            <BadgeCheck className="w-3.5 h-3.5 text-blue-500 fill-blue-500/10" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-surface-hover text-text-secondary cursor-pointer"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-background z-50 flex flex-col shadow-2xl"
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Header */}
              <div className="p-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-accent/30 to-purple-500/30 flex items-center justify-center text-white font-bold font-heading border border-border overflow-hidden relative">
                    {profileData.avatarUrl ? (
                      <Image 
                        src={profileData.avatarUrl} 
                        alt={profileData.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      profileData.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-heading font-semibold text-sm text-text-primary">
                        {profileData.name}
                      </p>
                      <BadgeCheck className="w-3.5 h-3.5 text-blue-500 fill-blue-500/10" />
                    </div>
                    <p className="text-xs text-text-secondary">@{profileData.nickname.toLowerCase()}</p>
                  </div>
                </div>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-hover cursor-pointer"
                  whileTap={{ scale: 0.9 }}
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4 text-text-secondary" />
                </motion.button>
              </div>

              {/* Mobile Search Trigger in Drawer */}
              <div className="px-5 py-3">
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    setIsSearchOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl bg-surface border border-border text-text-secondary text-sm cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Search...</span>
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-3 overflow-y-auto">
                <div className="space-y-0.5">
                  {navItems.map((item, i) => {
                    const isActive =
                      item.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(item.href);
                    const Icon = item.icon;

                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                            isActive
                              ? "text-text-primary bg-surface-hover"
                              : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
                          }`}
                        >
                          <Icon className="w-[18px] h-[18px]" />
                          <span>{item.label}</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Guestbook Button (FAB) */}
      <div className="lg:hidden fixed bottom-20 right-4 z-40">
        <Link href="/chat">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-accent/20 border transition-all ${
              pathname === "/chat" 
                ? "bg-accent text-white border-accent" 
                : "bg-surface border-border text-text-secondary"
            }`}
          >
            <MessageCircle className="w-6 h-6" />
          </motion.div>
        </Link>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-xl border-t border-border z-40 flex items-center justify-around px-2">
        {navItems.slice(0, 5).map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${
                isActive ? "text-text-primary" : "text-text-secondary"
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-active"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent rounded-full"
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 30,
                    }}
                  />
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
