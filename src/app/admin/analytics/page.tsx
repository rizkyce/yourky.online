"use client";

import { motion } from "framer-motion";
import { 
  BarChart3, 
  Users, 
  MousePointer2, 
  MessageSquare, 
  TrendingUp, 
  Clock, 
  Layout, 
  Globe,
  Calendar
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { getAllDocuments } from "@/lib/firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

interface AnalyticsEvent {
  id: string;
  type: string;
  path: string;
  timestamp: Timestamp;
  userAgent: string;
  userEmail?: string | null;
}

interface Profile {
  id: string;
  name: string;
  email: string;
  photoURL: string;
  lastLogin: Timestamp;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(7); // 7, 30, 90
  const [rawEvents, setRawEvents] = useState<AnalyticsEvent[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [messagesCount, setMessagesCount] = useState(0);

  useEffect(() => {
    async function fetchAnalytics() {
      const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "ridhoriz04@gmail.com";
      try {
        const [events, profilesData, messages] = await Promise.all([
          getAllDocuments("analytics_events", "timestamp", "desc"),
          getAllDocuments("profiles", "lastLogin", "desc"),
          getAllDocuments("guestbook")
        ]);

        // Filter out admin data
        const filteredEvents = (events as AnalyticsEvent[]).filter(e => e.userEmail !== ADMIN_EMAIL);
        const filteredProfiles = (profilesData as Profile[]).filter(p => p.email !== ADMIN_EMAIL);

        setRawEvents(filteredEvents);
        setProfiles(filteredProfiles);
        setMessagesCount(messages.length);
      } catch (err) {
        console.error("Analytics fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  const stats = useMemo(() => {
    const now = Date.now();
    const rangeMs = dateRange * 24 * 60 * 60 * 1000;
    const filteredEvents = rawEvents.filter(e => {
      if (!e.timestamp) return false;
      return (now - e.timestamp.toMillis()) <= rangeMs;
    });

    // Aggregate Top Pages
    const pageCounts: Record<string, number> = {};
    filteredEvents.forEach(event => {
      if (event.type === "page_view") {
        pageCounts[event.path] = (pageCounts[event.path] || 0) + 1;
      }
    });

    const topPages = Object.entries(pageCounts)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Aggregate Views by Day
    const dayCounts: Record<string, number> = {};
    for (let i = dateRange - 1; i >= 0; i--) {
       const d = new Date();
       d.setDate(d.getDate() - i);
       const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
       dayCounts[dateStr] = 0;
    }

    filteredEvents.forEach(event => {
      if (event.timestamp) {
        const date = event.timestamp.toDate().toLocaleDateString("en-US", { month: "short", day: "numeric" });
        if (dayCounts[date] !== undefined) {
          dayCounts[date]++;
        }
      }
    });

    const viewsByDay = Object.entries(dayCounts).map(([date, count]) => ({ date, count }));

    return {
      totalViews: filteredEvents.length,
      totalUsers: profiles.length,
      totalMessages: messagesCount,
      topPages,
      recentVisitors: profiles.slice(0, 6),
      viewsByDay,
    };
  }, [rawEvents, profiles, messagesCount, dateRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: `${dateRange} Days Views`, value: stats.totalViews, icon: MousePointer2, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Total Auth Users", value: stats.totalUsers, icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Guestbook Total", value: stats.totalMessages, icon: MessageSquare, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Avg. Daily Traffic", value: (stats.totalViews / dateRange).toFixed(1), icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-text-primary mb-2 flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-accent" />
            Website Analytics
          </h1>
          <p className="text-sm text-text-secondary">
            Advanced visualization of your site traffic and engagement metrics.
          </p>
        </div>

        {/* Date Range Selector */}
        <div className="flex items-center gap-1 p-1 bg-surface border border-border rounded-xl">
           {[7, 30, 90].map((range) => (
             <button
               key={range}
               onClick={() => setDateRange(range)}
               className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                 dateRange === range 
                 ? "bg-accent text-white shadow-lg shadow-accent/20" 
                 : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
               }`}
             >
               {range} Days
             </button>
           ))}
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            className="p-5 rounded-2xl border border-border bg-surface shadow-sm"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-text-primary tracking-tight">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Chart Section */}
      <motion.div variants={itemVariants} className="p-6 rounded-2xl border border-border bg-surface shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Calendar className="w-32 h-32" />
        </div>
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <h3 className="font-heading font-bold text-lg">Traffic Velocity Trend</h3>
          </div>
          <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
            Last {dateRange} Days
          </div>
        </div>
        
        <div className="h-[300px] w-full mt-4">
           <ResponsiveContainer width="100%" height="100%">
             <BarChart data={stats.viewsByDay} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
               <XAxis 
                 dataKey="date" 
                 axisLine={false} 
                 tickLine={false} 
                 tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontWeight: 500 }}
                 dy={10}
               />
               <YAxis 
                 axisLine={false} 
                 tickLine={false} 
                 tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontWeight: 500 }}
               />
               <Tooltip 
                 cursor={{ fill: 'var(--accent)', opacity: 0.05 }}
                 contentStyle={{ 
                   backgroundColor: 'var(--surface)', 
                   borderColor: 'var(--border)', 
                   borderRadius: '12px',
                   fontSize: '12px',
                   fontWeight: '600',
                   color: 'var(--text-primary)'
                 }}
                 itemStyle={{ color: 'var(--accent)' }}
               />
               <Bar 
                 dataKey="count" 
                 radius={[6, 6, 0, 0]}
                 animationDuration={1500}
               >
                 {stats.viewsByDay.map((entry, index) => (
                   <Cell 
                     key={`cell-${index}`} 
                     fillOpacity={0.8}
                     fill={index === stats.viewsByDay.length - 1 ? "var(--accent)" : "var(--accent-muted, #6366f1)"}
                   />
                 ))}
               </Bar>
             </BarChart>
           </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Most Visited Pages */}
        <motion.div variants={itemVariants} className="p-6 rounded-2xl border border-border bg-surface h-full">
          <div className="flex items-center gap-3 mb-6">
            <Layout className="w-5 h-5 text-accent" />
            <h3 className="font-heading font-bold text-lg">Popular Pages</h3>
          </div>
          <div className="space-y-4">
            {stats.topPages.map((page) => {
              const percentage = stats.totalViews > 0 ? Math.round((page.count / stats.totalViews) * 100) : 0;
              return (
                <div key={page.path} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-mono text-xs text-text-secondary truncate max-w-[200px]">{page.path}</span>
                    <span className="font-bold text-text-primary">{page.count} views</span>
                  </div>
                  <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-linear-to-r from-accent to-purple-500" 
                    />
                  </div>
                </div>
              );
            })}
            {stats.topPages.length === 0 && (
              <p className="text-center py-8 text-xs text-text-secondary opacity-50">No data for this range yet.</p>
            )}
          </div>
        </motion.div>

        {/* Recent Visitors */}
        <motion.div variants={itemVariants} className="p-6 rounded-2xl border border-border bg-surface h-full">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-5 h-5 text-purple-500" />
            <h3 className="font-heading font-bold text-lg">Recent Visitors</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {stats.recentVisitors.map((v) => (
              <div key={v.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface-hover/50 border border-border/50">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-border relative">
                  {v.photoURL ? (
                    <Image src={v.photoURL} alt={v.name} fill sizes="40px" className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-accent/20 flex items-center justify-center text-accent text-xs font-bold">
                      {v.name?.[0]}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-text-primary truncate">{v.name}</p>
                  <p className="text-[10px] text-text-secondary flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {v.lastLogin?.toDate().toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            {stats.recentVisitors.length === 0 && (
              <p className="col-span-full text-center py-8 text-xs text-text-secondary opacity-50">No auth users found.</p>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
