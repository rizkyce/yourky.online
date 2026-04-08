"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
  className?: string;
}

export function SectionHeader({ title, subtitle, className = "" }: SectionHeaderProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <h1 className="font-heading font-bold text-2xl text-text-primary mb-1">
        {title}
      </h1>
      {subtitle && (
        <p className="text-text-secondary text-sm leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
