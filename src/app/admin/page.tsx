"use client";

import { motion } from "framer-motion";
import { FolderKanban, Mail, BarChart3, Users, MessageCircle, ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAllDocuments } from "@/lib/firebase/firestore";

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function AdminPage() {
  const [stats, setStats] = useState({
    projects: 0,
    messages: 0,
    guestbook: 0,
    views: 0,
    users: 0,
    growth: 0,
  });

  useEffect(() => {
    async function loadStats() {
      const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "ridhoriz04@gmail.com";
      try {
        const [projects, messages, guestbook, rawViews, profiles] = await Promise.all([
          getAllDocuments("projects"),
          getAllDocuments("messages"),
          getAllDocuments("guestbook"),
          getAllDocuments("analytics_events"),
          getAllDocuments("profiles"),
        ]);
        
        // Filter out admin data for accurate stats
        const views = rawViews.filter(v => v.userEmail !== ADMIN_EMAIL);

        // Calculate 24h growth
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        const last24h = views.filter(v => (now - v.timestamp?.toMillis()) < oneDay).length;
        const prev24h = views.filter(v => {
          const t = v.timestamp?.toMillis();
          return t < (now - oneDay) && t >= (now - 2 * oneDay);
        }).length;

        let growth = 0;
        if (prev24h > 0) {
          growth = Math.round(((last24h - prev24h) / prev24h) * 100);
        } else if (last24h > 0) {
          growth = 100;
        }

        setStats({
          projects: projects.length,
          messages: messages.length,
          guestbook: guestbook.length,
          views: views.length,
          users: profiles.length,
          growth,
        });
      } catch {
        // Firebase probably not configured yet or empty
      }
    }
    loadStats();
  }, []);



// Helper to format large numbers
function dataValueFormatter(val: number) {
  if (val > 1000) return (val / 1000).toFixed(1) + "k";
  return val;
}


  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-3xl text-text-primary tracking-tight mb-2">
            Admin Central
          </h1>
          <p className="text-sm text-text-secondary max-w-md leading-relaxed">
            Welcome back, Ridho. Here&apos;s a high-level overview of your portfolio activity and growth metrics.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-accent/5 border border-accent/10 rounded-full">
           <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
           <span className="text-[10px] font-bold text-accent uppercase tracking-widest">System Active</span>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 min-h-[500px]">
        {/* Main Analytics: Spans 7 columns on MD */}
        <motion.div 
          variants={itemVariants} initial="hidden" animate="visible"
          className="md:col-span-7 h-full"
        >
          <Link href="/admin/analytics" className="group relative block h-full p-8 rounded-4xl border border-border bg-linear-to-br from-surface to-surface-hover/50 hover:border-accent/40 transition-all duration-500 overflow-hidden shadow-2xl shadow-accent/5">
            <div className="absolute -right-8 -top-8 w-40 h-40 bg-accent rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity" />
            
            <div className="flex flex-col h-full justify-between relative z-10">
              <div className="flex justify-between items-start">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                  <BarChart3 className="w-7 h-7" />
                </div>
                <div className="px-4 py-1.5 rounded-full bg-background/50 border border-border text-[10px] font-bold text-text-secondary uppercase tracking-widest group-hover:text-accent transition-colors">
                  View Evolution
                </div>
              </div>

              <div className="mt-12">
                <p className="text-xs font-bold text-text-secondary uppercase tracking-[0.2em] mb-2 opacity-60">Global Reach</p>
                <div className="flex items-baseline gap-3">
                  <h2 className="font-heading font-black text-6xl text-text-primary tracking-tighter">
                    {dataValueFormatter(stats.views)}
                  </h2>
                  {stats.growth !== 0 && (
                    <span className={`text-sm font-bold flex items-center gap-1 ${stats.growth > 0 ? "text-emerald-500" : "text-rose-500"}`}>
                      <TrendingUp className={`w-4 h-4 ${stats.growth < 0 ? "rotate-180" : ""}`} />
                      {stats.growth > 0 ? "+" : ""}{stats.growth}%
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-secondary mt-2">Total page interactions recorded across all platforms.</p>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Projects Card: Spans 5 columns on MD */}
        <motion.div 
          variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}
          className="md:col-span-5 h-full"
        >
          <Link href="/admin/projects" className="group relative block h-full p-8 rounded-4xl border border-border bg-linear-to-tr from-surface to-blue-500/5 hover:border-blue-500/40 transition-all duration-500 overflow-hidden">
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-blue-500 rounded-full blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity" />
            
            <div className="flex flex-col h-full justify-between relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                <FolderKanban className="w-7 h-7" />
              </div>

              <div className="mt-8">
                <p className="text-xs font-bold text-text-secondary uppercase tracking-[0.2em] mb-1 opacity-60">Showcase</p>
                <h2 className="font-heading font-black text-4xl text-text-primary mb-2">
                  {stats.projects} <span className="text-lg font-medium text-text-secondary">Projects</span>
                </h2>
                <div className="flex -space-x-2">
                   {[1,2,3].map(i => (
                     <div key={i} className="w-8 h-8 rounded-full border-2 border-surface bg-blue-500/20" />
                   ))}
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Small Cards Row */}
        <motion.div 
          variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}
          className="md:col-span-4 h-full"
        >
          <Link href="/admin/analytics" className="group block p-6 h-full rounded-3xl border border-border bg-linear-to-b from-surface to-purple-500/5 hover:border-purple-500/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
               <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                  <Users className="w-5 h-5" />
               </div>
               <ArrowRight className="w-4 h-4 text-text-secondary group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">Authenticated Users</p>
            <p className="text-2xl font-black text-text-primary">{stats.users}</p>
          </Link>
        </motion.div>

        <motion.div 
          variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }}
          className="md:col-span-4 h-full"
        >
          <Link href="/admin/messages" className="group block p-6 h-full rounded-3xl border border-border bg-linear-to-b from-surface to-emerald-500/5 hover:border-emerald-500/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
               <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <Mail className="w-5 h-5" />
               </div>
               <ArrowRight className="w-4 h-4 text-text-secondary group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">Direct Inquiries</p>
            <p className="text-2xl font-black text-text-primary">{stats.messages}</p>
          </Link>
        </motion.div>

        <motion.div 
          variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.4 }}
          className="md:col-span-4 h-full"
        >
          <Link href="/admin/guestbook" className="group block p-6 h-full rounded-3xl border border-border bg-linear-to-b from-surface to-amber-500/5 hover:border-amber-500/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
               <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <MessageCircle className="w-5 h-5" />
               </div>
               <ArrowRight className="w-4 h-4 text-text-secondary group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">Community Activity</p>
            <p className="text-2xl font-black text-text-primary">{stats.guestbook}</p>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
