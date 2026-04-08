"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { type ReactNode } from "react";

interface CardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  variant?: "default" | "highlighted" | "interactive";
  hover?: boolean;
  className?: string;
}

export function Card({
  children,
  variant = "default",
  hover = true,
  className = "",
  ...props
}: CardProps) {
  const baseClasses =
    "rounded-2xl border transition-all duration-300";

  const variantClasses = {
    default: "bg-surface border-border",
    highlighted:
      "bg-surface border-accent/20 shadow-md shadow-accent-glow",
    interactive:
      "bg-surface border-border cursor-pointer",
  };

  const hoverClasses = hover
    ? "hover:border-accent/30 hover:shadow-lg hover:shadow-accent-glow/5 hover:-translate-y-0.5"
    : "";

  return (
    <motion.div
      className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`}
      whileHover={hover ? { scale: 1.01 } : undefined}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
