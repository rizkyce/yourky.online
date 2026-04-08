"use client";

import { motion } from "framer-motion";
import { Badge } from "./Badge";
import { ExternalLink } from "lucide-react";
import { GitHubIcon } from "./SocialIcons";
import type { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group relative bg-surface border border-border rounded-2xl overflow-hidden hover:border-accent/30 hover:shadow-lg hover:shadow-accent-glow/5 transition-all duration-300"
    >
      {/* Project Image */}
      <div className="relative h-44 bg-gradient-to-br from-accent/20 to-purple-500/20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent z-10" />
        {/* Decorative shapes */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-2xl bg-accent/20 rotate-12 group-hover:rotate-45 transition-transform duration-700" />
          <div className="w-14 h-14 rounded-full bg-purple-500/20 -ml-6 mt-8 group-hover:scale-150 transition-transform duration-700" />
        </div>

        {/* Hover Overlay */}
        <motion.div
          className="absolute inset-0 bg-accent/80 z-20 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              aria-label="View demo"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              aria-label="View source"
            >
              <GitHubIcon className="w-4 h-4" />
            </a>
          )}
        </motion.div>

        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-3 right-3 z-30">
            <Badge variant="accent">Featured</Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-heading font-semibold text-base text-text-primary mb-2 group-hover:text-accent transition-colors">
          {project.title}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-4 line-clamp-2">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 4).map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
          {project.techStack.length > 4 && (
            <Badge>+{project.techStack.length - 4}</Badge>
          )}
        </div>
      </div>
    </motion.div>
  );
}
