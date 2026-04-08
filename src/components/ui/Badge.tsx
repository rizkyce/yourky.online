"use client";

import { motion } from "framer-motion";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "success" | "warning";
  className?: string;
}

const variantClasses = {
  default: "bg-surface-hover text-text-secondary border-border",
  accent: "bg-accent/10 text-accent border-accent/20",
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-amber-500/10 text-amber-500 border-amber-500/20",
};

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <motion.span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${variantClasses[variant]} ${className}`}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.15 }}
    >
      {children}
    </motion.span>
  );
}
