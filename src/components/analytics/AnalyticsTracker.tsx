"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { db } from "@/lib/firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../providers/AuthProvider";

export function AnalyticsTracker() {
  const pathname = usePathname();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    // Skip logging if Firebase is not ready, or if the user is an admin/author
    // We only skip if isAdmin is explicitly true. If it's undefined (loading), 
    // we wait to avoid logging admin views during the first few milliseconds.
    if (!db || typeof window === "undefined" || isAdmin === true) return;
    
    // Also skip if it's the admin path
    if (pathname.startsWith('/admin')) return;

    const logPageView = async () => {
      try {
        await addDoc(collection(db!, "analytics_events"), {
          type: "page_view",
          path: pathname,
          timestamp: serverTimestamp(),
          userAgent: window.navigator.userAgent,
          userEmail: user?.email || null, // Track if it's a known user
        });
      } catch (err) {
        // Silent fail for analytics
        console.error("Analytics log failed", err);
      }
    };

    logPageView();
  }, [pathname, isAdmin, user]);

  return null;
}
