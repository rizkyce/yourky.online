"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { GitHubCalendar } from "react-github-calendar";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PageTransition } from "@/components/layout/PageTransition";
import { GitHubIcon } from "@/components/ui/SocialIcons";

// ── Color palette for language bars ──
const langColors: Record<string, string> = {
  TypeScript: "from-blue-400 to-indigo-500",
  JavaScript: "from-yellow-300 to-yellow-500",
  Python: "from-yellow-400 to-amber-500",
  Go: "from-sky-400 to-blue-500",
  "C++": "from-blue-600 to-indigo-700",
  C: "from-gray-400 to-gray-600",
  Rust: "from-orange-400 to-red-500",
  Java: "from-red-400 to-orange-500",
  HTML: "from-orange-500 to-red-400",
  CSS: "from-blue-500 to-purple-500",
  Shell: "from-green-400 to-emerald-500",
  Dart: "from-cyan-400 to-blue-500",
  Kotlin: "from-purple-400 to-violet-500",
  Swift: "from-orange-400 to-orange-600",
  PHP: "from-indigo-400 to-purple-500",
  Ruby: "from-red-500 to-red-700",
  Vue: "from-emerald-400 to-green-500",
  Svelte: "from-orange-500 to-red-500",
  Jupyter: "from-orange-400 to-amber-500",
  "Jupyter Notebook": "from-orange-400 to-amber-500",
};
const defaultLangColor = "from-gray-400 to-gray-600";

// ── Animation variants ──
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// ── Interfaces ──
interface GitHubStats {
  followers: number;
  following: number;
  repos: number;
  stars: number;
}

interface LanguageStat {
  name: string;
  percent: number;
}

interface GitHubApiResponse {
  stats: GitHubStats;
  languages: LanguageStat[];
}

// ── Reusable progress bar component ──
function ProgressRow({
  name,
  percent,
  color,
}: {
  name: string;
  percent: number;
  color: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-xs">
        <span className="font-medium text-text-primary">{name}</span>
        <span className="text-text-secondary">{percent}%</span>
      </div>
      <div className="h-2 w-full bg-surface-hover rounded-full overflow-hidden border border-border/50">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className={`h-full bg-linear-to-r ${color} rounded-full`}
        />
      </div>
    </div>
  );
}

// ── Skeleton loader for stats cards ──
function StatCardSkeleton() {
  return (
    <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs animate-pulse">
      <div className="h-3 w-16 bg-surface-hover rounded mb-3" />
      <div className="h-7 w-12 bg-surface-hover rounded" />
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<GitHubApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function fetchGithub() {
      try {
        const res = await fetch("/api/github");
        if (!res.ok) throw new Error("Failed to fetch GitHub data");
        const json: GitHubApiResponse = await res.json();
        setData(json);
      } catch (err) {
        console.error("GitHub fetch error:", err);
        setError("Failed to load GitHub stats");
      } finally {
        setLoading(false);
      }
    }
    fetchGithub();
  }, []);

  const stats = data?.stats ?? { followers: 0, following: 0, repos: 0, stars: 0 };
  const languages = data?.languages ?? [];

  return (
    <PageTransition>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-0"
      >
        <SectionHeader
          title="Dashboard"
          subtitle="Real-time statistics and summary of my social activities and coding journey."
          icon="📊"
        />

        <hr className="section-divider" />

        {/* ── Error State ── */}
        {error && (
          <motion.div variants={itemVariants} className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/5 text-red-400 text-sm">
            {error}
          </motion.div>
        )}

        {/* ── GitHub Stats Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          ) : (
            [
              { label: "Followers", value: stats.followers, color: "text-blue-400" },
              { label: "Repositories", value: stats.repos, color: "text-purple-400" },
              { label: "Total Stars", value: stats.stars, color: "text-yellow-400" },
              { label: "Following", value: stats.following, color: "text-emerald-400" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="p-5 rounded-2xl bg-surface border border-border shadow-xs flex flex-col justify-between hover:border-border/80 transition-colors"
              >
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  {stat.label}
                </p>
                <h3 className={`text-2xl font-bold mt-2 ${stat.color}`}>
                  {stat.value.toLocaleString()}
                </h3>
              </motion.div>
            ))
          )}
        </div>

        {/* ── GitHub Contributions Calendar ── */}
        <motion.div
          variants={itemVariants}
          className="mb-12 p-6 rounded-2xl bg-surface border border-border shadow-xs overflow-x-auto scrollbar-hide"
        >
          <div className="flex items-center gap-2 mb-6">
            <GitHubIcon className="w-5 h-5 text-text-primary" />
            <h2 className="font-heading font-bold text-base text-text-primary">
              GitHub Contributions
            </h2>
          </div>
          <div className="min-w-[750px] flex justify-center">
            {mounted ? (
              <GitHubCalendar
                username="rizkyce"
                colorScheme="dark"
                fontSize={12}
                blockSize={12}
                blockMargin={4}
              />
            ) : (
              <div className="h-[155px] w-full animate-pulse bg-surface-hover rounded-xl" />
            )}
          </div>
        </motion.div>

        {/* ── Language Distribution (Real Data from GitHub) ── */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs">
            <h2 className="font-heading font-bold text-base text-text-primary mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Programming Languages
            </h2>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="animate-pulse space-y-2">
                    <div className="flex justify-between">
                      <div className="h-3 w-20 bg-surface-hover rounded" />
                      <div className="h-3 w-8 bg-surface-hover rounded" />
                    </div>
                    <div className="h-2 bg-surface-hover rounded-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-5">
                {languages.map((lang) => (
                  <ProgressRow
                    key={lang.name}
                    name={lang.name}
                    percent={lang.percent}
                    color={langColors[lang.name] || defaultLangColor}
                  />
                ))}
                {languages.length === 0 && (
                  <p className="text-sm text-text-secondary">No language data available.</p>
                )}
              </div>
            )}
          </div>

          {/* ── Quick Stats Summary ── */}
          <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs">
            <h2 className="font-heading font-bold text-base text-text-primary mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              Quick Summary
            </h2>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-text-secondary">Public Repos</span>
                <span className="font-semibold text-text-primary">{stats.repos}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-text-secondary">Total Stars Earned</span>
                <span className="font-semibold text-yellow-400">⭐ {stats.stars}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-text-secondary">Followers</span>
                <span className="font-semibold text-blue-400">{stats.followers}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-text-secondary">Following</span>
                <span className="font-semibold text-emerald-400">{stats.following}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-text-secondary">Top Language</span>
                <span className="font-semibold text-text-primary">{languages[0]?.name ?? "N/A"}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </PageTransition>
  );
}
