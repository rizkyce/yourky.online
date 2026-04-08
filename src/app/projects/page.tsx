"use client";

import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PageTransition } from "@/components/layout/PageTransition";
import { GitHubIcon } from "@/components/ui/SocialIcons";
import { projects as fallbackProjects, ProjectData } from "@/data/projects";
import { getAllDocuments } from "@/lib/firebase/firestore";
import { useEffect, useState } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};


const categoryIcons: Record<string, string> = {
  iot: "📡",
  ai: "🧠",
  web: "🌐",
  cloud: "☁️",
  network: "🔌",
};

const techIconMap: Record<string, string> = {
  python: "/icons/tech/python.svg",
  typescript: "/icons/tech/typescript.svg",
  react: "/icons/tech/react.svg",
  nextjs: "/icons/tech/nextjs.svg",
  nodejs: "/icons/tech/nodejs.svg",
  googlecloud: "/icons/tech/googlecloud.svg",
  gcp: "/icons/tech/googlecloud.svg",
  docker: "/icons/tech/docker.svg",
  lorawan: "/icons/tech/lorawan.svg",
  mqtt: "/icons/tech/mqtt.svg",
  tensorflow: "/icons/tech/tensorflow.svg",
  postgresql: "/icons/tech/postgresql.svg",
  postgres: "/icons/tech/postgresql.svg",
  linux: "/icons/tech/linux.svg",
  git: "/icons/tech/git.svg",
  tailwindcss: "/icons/tech/tailwindcss.svg",
  tailwind: "/icons/tech/tailwindcss.svg",
  fastapi: "/icons/tech/fastapi.svg",
  flask: "/icons/tech/fastapi.svg", // Reusing FastAPI icon if Flask not specifically available
  arduino: "/icons/tech/arduino.svg",
  esp32: "/icons/tech/arduino.svg",
};

function TechIcon({ tech }: { tech: string }) {
  const normalized = tech.toLowerCase().replace(/\s/g, "").replace(/\.js/g, "js").replace(/\//g, "");
  const iconPath = techIconMap[normalized];

  if (iconPath) {
    return (
      <img 
        src={iconPath} 
        alt={tech} 
        className="w-4 h-4 object-contain grayscale group-hover/tech:grayscale-0 transition-all pointer-events-none" 
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    );
  }

  return <span className="uppercase text-[8px] font-bold">{tech.slice(0, 2)}</span>;
}


export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectData[]>(fallbackProjects as ProjectData[]);

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await getAllDocuments<ProjectData>("projects");
        if (data && data.length > 0) {
          setProjects(data);
        }
      } catch {
        // Fallback to local
      }
    }
    loadProjects();
  }, []);

  return (
    <PageTransition>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-0"
      >
        <SectionHeader
          title="Projects"
          subtitle="Several projects that I have worked on, both private and open source."
          icon="🚀"
        />

        <hr className="section-divider" />

        {/* ── Projects Grid — 2 columns like reference ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
              className="group"
            >
              <div className="rounded-xl border border-border bg-surface overflow-hidden hover:border-text-secondary/30 transition-all">
                {/* Image Placeholder with hover overlay */}
                <div className="relative h-40 bg-surface-hover flex items-center justify-center overflow-hidden">
                  <span className="text-4xl opacity-30">
                    {categoryIcons[project.category] || "📂"}
                  </span>

                  {/* Featured badge */}
                  {project.featured && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-md bg-lime-400 text-black text-[11px] font-semibold">
                      <Star className="w-3 h-3" />
                      Featured
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="flex items-center gap-2 text-white text-sm font-medium">
                      View Project <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-heading font-semibold text-sm text-text-primary mb-1 group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-text-secondary line-clamp-2 mb-3">
                    {project.description}
                  </p>

                  {/* Tech Stack Icons */}
                  <div className="flex items-center gap-1.5">
                    {project.techStack.slice(0, 5).map((tech: string) => (
                      <div
                        key={tech}
                        className="w-7 h-7 rounded-lg bg-surface-hover border border-border flex items-center justify-center text-text-secondary group/tech hover:border-accent/40 hover:bg-accent/5 transition-all"
                        title={tech}
                      >
                        <TechIcon tech={tech} />
                      </div>
                    ))}
                    {project.techStack.length > 5 && (
                      <span className="text-[10px] text-text-secondary">
                        +{project.techStack.length - 5}
                      </span>
                    )}

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto text-text-secondary hover:text-text-primary transition-colors"
                      >
                        <GitHubIcon className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </PageTransition>
  );
}
