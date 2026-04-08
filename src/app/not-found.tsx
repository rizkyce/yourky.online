"use client";

import { motion } from "framer-motion";
import { MoveLeft, Home, Ghost } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-accent rounded-full animate-ping opacity-20" />
      <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-purple-500 rounded-full animate-bounce opacity-20" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="inline-block mb-8"
        >
          <div className="relative">
            <h1 className="text-[12rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-text-primary via-text-primary/10 to-transparent opacity-10 select-none">
              404
            </h1>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center">
              <Ghost className="w-24 h-24 text-accent drop-shadow-[0_0_25px_rgba(var(--accent-rgb),0.5)]" />
            </div>
          </div>
        </motion.div>

        <h2 className="font-heading font-black text-4xl md:text-5xl text-text-primary mb-4 tracking-tight">
          Page not found.
        </h2>
        
        <p className="text-text-secondary max-w-md mx-auto mb-10 text-lg leading-relaxed italic">
          &quot;It seems you&apos;ve ventured into the digital void. This coordinate doesn&apos;t exist in our repository.&quot;
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-8 py-3.5 bg-accent text-white rounded-2xl font-bold shadow-lg shadow-accent/25 hover:shadow-accent/40 transition-all group"
            >
              <Home className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
              Back to Base
            </motion.button>
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-8 py-3.5 bg-surface border border-border text-text-primary rounded-2xl font-bold hover:bg-surface-hover transition-all group"
          >
            <MoveLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>
        </div>
      </motion.div>

      {/* Floating Elements */}
      <div className="absolute top-10 right-10 opacity-10">
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
          <path d="M10 10 L90 90 M90 10 L10 90" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
}
