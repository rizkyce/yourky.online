"use client";

import { useState, useSyncExternalStore, type ReactNode } from "react";
import { IntroOverlay } from "@/components/ui/IntroOverlay";

// Hydration-safe mount detection without useState + useEffect
function useHasMounted() {
  return useSyncExternalStore(
    () => () => {},         // subscribe (no-op for static value)
    () => true,             // client snapshot: always true
    () => false             // server snapshot: always false
  );
}

export function IntroWrapper({ children }: { children: ReactNode }) {
  const mounted = useHasMounted();
  const [introComplete, setIntroComplete] = useState(false);

  // On server or before mount, just render children directly (no intro check)
  if (!mounted) {
    return <>{children}</>;
  }

  const alreadySeen = sessionStorage.getItem("intro-seen") === "true";

  return (
    <>
      {/* Intro Overlay — only rendered when not yet seen */}
      {!alreadySeen && !introComplete && (
        <IntroOverlay onComplete={() => setIntroComplete(true)} />
      )}

      {/* Main Content — hidden during intro, then revealed */}
      <div
        style={{
          opacity: alreadySeen || introComplete ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
        }}
      >
        {children}
      </div>
    </>
  );
}
