"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";

export function IntroOverlay({ onComplete }: { onComplete: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  // Lazy initializer reads sessionStorage synchronously — no setState in useEffect needed
  const [visible, setVisible] = useState(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("intro-seen")) {
      return false;
    }
    return true;
  });

  useEffect(() => {
    if (!visible) {
      onComplete();
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem("intro-seen", "true");
          setVisible(false);
          onComplete();
        },
      });

      // Phase 1: Greeting text fades in
      tl.fromTo(
        ".intro-greeting",
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" }
      );

      // Phase 2: Hold greeting (shortened)
      tl.to(".intro-greeting", { duration: 0.3 });

      // Phase 3: Greeting fades out
      tl.to(".intro-greeting", {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: "power2.in",
      });

      // Phase 4: Name reveal
      tl.set(".intro-name", { visibility: "visible" });
      tl.fromTo(
        ".intro-name-char",
        { opacity: 0, y: 40, rotateX: -60 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.4,
          stagger: 0.03,
          ease: "back.out(1.5)",
        }
      );

      // Phase 5: Title 
      tl.fromTo(
        ".intro-title",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" },
        "-=0.2"
      );

      // Phase 6: Decorative line
      tl.fromTo(
        ".intro-line",
        { scaleX: 0 },
        { scaleX: 1, duration: 0.5, ease: "power3.inOut" },
        "-=0.2"
      );

      // Phase 7: Tagline
      tl.fromTo(
        ".intro-tagline",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
        "-=0.3"
      );

      // Phase 8: Hold (shortened)
      tl.to({}, { duration: 0.4 });

      // NEW: Fade background earlier to allow browser to 'see' content behind for LCP
      tl.to(overlayRef.current, {
        backgroundColor: "rgba(10, 10, 11, 0)",
        duration: 0.8,
        ease: "power2.inOut"
      }, "+=0.5"); // Start fading shortly after name reveal starts

      // Phase 9: Scale up and fade out
      tl.to(".intro-content", {
        scale: 1.1,
        opacity: 0,
        duration: 0.4,
        ease: "power3.in",
      }, "-=0.4");

      // Phase 10: Overlay slide / remove
      tl.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
      });
    }, overlayRef);

    return () => ctx.revert();
  }, [onComplete, visible]);

  if (!visible) return null;

  // Split name into individual characters for staggered animation
  const name = "Nur Ridho Rizki";
  const nameChars = name.split("").map((char, i) => (
    <span
      key={i}
      className="intro-name-char inline-block"
      style={{ perspective: "600px" }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ));

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-9999 bg-[#0a0a0b] flex items-center justify-center overflow-hidden"
      style={{ perspective: "1200px" }}
    >
      {/* Subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px]" />
      </div>

      {/* Animated particles — deterministic positions to avoid hydration mismatch */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none intro-particles">
        {[
          { l: 12, t: 8, d: 3.2, dl: 0.0 },
          { l: 85, t: 15, d: 5.1, dl: 0.5 },
          { l: 45, t: 22, d: 4.3, dl: 1.0 },
          { l: 72, t: 35, d: 6.2, dl: 1.5 },
          { l: 28, t: 45, d: 3.8, dl: 2.0 },
          { l: 92, t: 52, d: 5.5, dl: 0.3 },
          { l: 8, t: 62, d: 4.7, dl: 0.8 },
          { l: 55, t: 70, d: 3.5, dl: 1.3 },
          { l: 38, t: 78, d: 6.0, dl: 1.8 },
          { l: 78, t: 85, d: 4.1, dl: 2.3 },
          { l: 18, t: 90, d: 5.8, dl: 0.6 },
          { l: 62, t: 12, d: 3.9, dl: 1.1 },
          { l: 95, t: 40, d: 5.3, dl: 1.6 },
          { l: 33, t: 55, d: 4.5, dl: 2.1 },
          { l: 5, t: 30, d: 6.5, dl: 0.4 },
          { l: 50, t: 95, d: 3.6, dl: 0.9 },
          { l: 82, t: 68, d: 5.0, dl: 1.4 },
          { l: 22, t: 18, d: 4.8, dl: 1.9 },
          { l: 68, t: 88, d: 3.3, dl: 2.5 },
          { l: 42, t: 5, d: 5.7, dl: 0.7 },
        ].map((p, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white/10 rounded-full"
            style={{
              left: `${p.l}%`,
              top: `${p.t}%`,
              animation: `float ${p.d}s ease-in-out infinite`,
              animationDelay: `${p.dl}s`,
            }}
          />
        ))}
      </div>

      <div className="intro-content text-center px-6 relative z-10">
        {/* Greeting */}
        <p className="intro-greeting text-white/60 text-lg sm:text-xl font-light tracking-[0.3em] uppercase mb-8">
          Welcome
        </p>

        {/* Name — invisible until Phase 4 */}
        <h1
          className="intro-name text-white text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4"
          style={{ visibility: "hidden", fontFamily: "var(--font-heading)" }}
        >
          {nameChars}
        </h1>

        {/* Decorative line */}
        <div className="flex justify-center mb-4">
          <div
            className="intro-line h-[2px] w-24 sm:w-32"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(99,102,241,0.8), transparent)",
              transformOrigin: "center",
            }}
          />
        </div>

        {/* Title */}
        <p
          className="intro-title text-white/50 text-sm sm:text-base md:text-lg tracking-[0.15em] uppercase mb-3"
          style={{ opacity: 0 }}
        >
          Computer Engineer, VSAT Operator & IoT Developer
        </p>

        {/* Tagline */}
        <p
          className="intro-tagline text-white/30 text-xs sm:text-sm tracking-widest"
          style={{ opacity: 0 }}
        >
          Building the bridge between hardware and cloud
        </p>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.1;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
}
