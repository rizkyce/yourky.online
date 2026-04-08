"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { PageTransition } from "@/components/layout/PageTransition";
import { Lock, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin, signInWithGoogle, logout } = useAuth();
  const pathname = usePathname();

  if (user === undefined) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="w-8 h-8 border-4 border-border border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center">
            <Lock className="w-8 h-8 text-rose-500" />
          </div>
          <div className="text-center">
            <h1 className="font-heading font-bold text-2xl text-text-primary mb-2">
              Admin Access Required
            </h1>
            <p className="text-text-secondary text-sm max-w-sm">
              You need to log in with an authorized administrator account to access this area.
            </p>
          </div>
          {user ? (
             <div className="text-center">
              <p className="text-sm text-rose-400 mb-4">You are logged in as {user.email}, but this account is not an admin.</p>
              <button
                onClick={logout}
                className="px-6 py-2.5 rounded-lg bg-surface-hover border border-border text-sm font-medium text-text-primary hover:bg-border/50"
              >
                Sign out
              </button>
             </div>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="px-6 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
            >
              Sign in with Google
            </button>
          )}
        </div>
      </PageTransition>
    );
  }

  const adminLinks = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/projects", label: "Projects" },
    { href: "/admin/profile", label: "Profile" },
    { href: "/admin/schedule", label: "Schedule" },
  ];

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-surface">
          <div className="flex items-center gap-6">
            <h2 className="font-heading font-bold text-lg text-text-primary">Admin Panel</h2>
            <nav className="hidden sm:flex items-center gap-4">
              {adminLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm ${
                    pathname === link.href ? "text-accent font-medium" : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-text-secondary hidden sm:inline">{user.email}</span>
            <button
              onClick={logout}
              className="p-2 rounded-lg hover:bg-surface-hover text-text-secondary hover:text-rose-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Mobile Nav for admin */}
        <nav className="sm:hidden flex items-center gap-2 overflow-x-auto pb-2">
          {adminLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${
                pathname === link.href ? "bg-accent/10 text-accent font-medium border border-accent/20" : "bg-surface border border-border text-text-secondary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="pt-2">
          {children}
        </div>
      </div>
    </PageTransition>
  );
}
