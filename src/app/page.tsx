"use client";

import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import Image from "next/image";
import { PageTransition } from "@/components/layout/PageTransition";
import { profile, techStack } from "@/data/profile";
import { ProjectData } from "@/data/projects";
import { getAllDocuments, getDocument } from "@/lib/firebase/firestore";

gsap.registerPlugin(useGSAP);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

/* ─── Infinite Marquee for tools ─── */
function ToolsMarquee() {
  const midPoint = Math.ceil(techStack.length / 2);
  const row1 = techStack.slice(0, midPoint);
  const row2 = techStack.slice(midPoint);

  const doubledRow1 = [...row1, ...row1, ...row1, ...row1];
  const doubledRow2 = [...row2, ...row2, ...row2, ...row2];

  const marqueeItem = (tech: typeof techStack[0], index: number) => (
    <div
      key={index}
      className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-xl hover:border-accent/40 transition-colors shrink-0 group"
    >
      <div className="w-5 h-5 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all relative">
        <Image 
          src={tech.icon} 
          alt={tech.name} 
          width={20}
          height={20}
          sizes="20px"
          className="object-contain"
          unoptimized={tech.icon.endsWith('.svg')}
        />
      </div>
      <span className="text-xs font-medium text-text-primary">
        {tech.name}
      </span>
    </div>
  );

  return (
    <div className="relative overflow-hidden py-4 -mx-2 flex flex-col gap-4">
      {/* Edge Gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-linear-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-linear-to-l from-background to-transparent z-10 pointer-events-none" />
      
      {/* Row 1: Left */}
      <motion.div
        className="flex gap-3 w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop" as const,
            duration: 30,
            ease: "linear" as const,
          },
        }}
      >
        {doubledRow1.map((tech, index) => marqueeItem(tech, index))}
      </motion.div>

      {/* Row 2: Right */}
      <motion.div
        className="flex gap-3 w-max translate-x-[-25%]"
        animate={{ x: ["-50%", "0%"] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop" as const,
            duration: 35,
            ease: "linear" as const,
          },
        }}
      >
        {doubledRow2.map((tech, index) => marqueeItem(tech, index))}
      </motion.div>
    </div>
  );
}

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [featuredProjects, setFeaturedProjects] = useState<ProjectData[]>([]);
  const [profileData, setProfileData] = useState(profile);

  useEffect(() => {
    async function loadData() {
      try {
        const [projectsData, settingsSnapshot] = await Promise.all([
          getAllDocuments<ProjectData>("projects"),
          getDocument<typeof profile>("settings", "profile")
        ]);

        if (projectsData && projectsData.length > 0) {
          setFeaturedProjects(projectsData.filter((p: ProjectData) => p.featured).slice(0, 3));
        }

        if (settingsSnapshot) {
          setProfileData((prev) => ({ ...prev, ...settingsSnapshot }));
        }

      } catch {
        // fail silently inline
      }
    }
    loadData();
  }, []);

  useGSAP(
    () => {
      gsap.from(".hero-title", {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
      });
      gsap.from(".hero-subtitle", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        delay: 0.2,
        ease: "power3.out",
      });
      gsap.from(".hero-bio", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        delay: 0.4,
        ease: "power3.out",
      });
    },
    { scope: heroRef }
  );

  return (
    <PageTransition>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-0 overflow-x-hidden md:overflow-visible"
      >
        {/* ── Hero Introduction ── */}
        <motion.div variants={itemVariants} ref={heroRef}>
          <div className="mb-2">
            <h1 className="hero-title font-heading font-bold text-3xl sm:text-3xl text-text-primary mb-3">
              Hi, I&apos;m {profileData.nickname}{" "}
              <motion.span
                className="inline-block"
                animate={{ rotate: [0, 20, -20, 20, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              >
                👋
              </motion.span>
            </h1>
            <p className="hero-subtitle text-text-secondary text-[13px] sm:text-sm flex items-center gap-2 sm:gap-3 flex-wrap leading-relaxed">
              <span className="shrink-0 bg-surface px-2.5 py-1 rounded-lg border border-border flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Based in {profileData.location}{" "}
                <span className="text-xs">🇮🇩</span>
              </span>
              <span className="shrink-0 bg-surface px-2.5 py-1 rounded-lg border border-border flex items-center gap-1.5 shadow-sm">
                <span className={`w-1.5 h-1.5 rounded-full ${profileData.available ? 'bg-blue-500' : 'bg-amber-500'}`} />
                {profileData.available
                  ? "Open to opportunities"
                  : "Currently busy"}
              </span>
            </p>
          </div>

          <div className="hero-bio mt-8 mb-10 w-full">
            <p className="text-text-secondary text-base leading-relaxed max-w-full md:max-w-2xl text-pretty wrap-break-word">
              {profileData.bio[0]}
            </p>
          </div>
        </motion.div>

        <hr className="section-divider" />

        {/* ── Tools That I Have Used ── */}
        <motion.div variants={itemVariants}>
          <h2 className="font-heading font-bold text-lg text-text-primary mb-4">
            Tools That I Have Used
          </h2>
          <ToolsMarquee />
        </motion.div>

        <hr className="section-divider" />

        {/* ── What I've Been Working On ── */}
        <motion.div variants={itemVariants}>
          <h2 className="font-heading font-bold text-lg text-text-primary mb-3">
            What I&apos;ve Been Working On
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-6 max-w-full md:max-w-2xl text-pretty wrap-break-word">
            I build IoT monitoring systems, AI-powered APIs, and cloud
            infrastructure for companies and research institutions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {featuredProjects.map((project: ProjectData, i: number) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <Link
                  href="/projects"
                  className="group block p-4 rounded-xl border border-border hover:border-text-secondary/30 bg-surface transition-all"
                >
                  <h3 className="font-heading font-semibold text-sm text-text-primary mb-1 group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-text-secondary line-clamp-2 mb-3 wrap-break-word">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {project.techStack.slice(0, 3).map((tech: string) => (
                      <span
                        key={tech}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-surface-hover border border-border text-text-secondary"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <hr className="section-divider my-8" />

        {/* ── CTA — Let's Work Together ── */}
        <motion.div variants={itemVariants}>
          <div className="p-6 rounded-xl border border-border bg-surface">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🚀</span>
              <h3 className="font-heading font-bold text-base text-text-primary">
                Let&apos;s work together!
              </h3>
            </div>
            <p className="text-text-secondary text-sm mb-4">
              I&apos;m open for freelance projects, feel free to email me to see
              how we can collaborate.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-hover border border-border text-sm text-text-primary hover:bg-border/50 transition-colors"
            >
              Contact me
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </PageTransition>
  );
}
