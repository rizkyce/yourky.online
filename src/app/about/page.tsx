"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Calendar,
  ExternalLink,
  FileText,
  GraduationCap,
  Briefcase,
  BookOpen,
} from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PageTransition } from "@/components/layout/PageTransition";
import { profile as defaultProfile } from "@/data/profile";
import { experiences, organizations } from "@/data/experience";
import { getDocument } from "@/lib/firebase/firestore";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const tabs = [
  { id: "intro", label: "Intro", icon: BookOpen },
  { id: "resume", label: "Resume", icon: FileText },
  { id: "career", label: "Career", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
];

function IntroTab({ profile }: { profile: typeof defaultProfile }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <p className="text-text-secondary text-base leading-relaxed">
        Hello! Thanks for stopping by my personal website.
      </p>
      {profile.bio.map((paragraph, i) => (
        <p key={i} className="text-text-secondary text-base leading-relaxed">
          {paragraph}
        </p>
      ))}
      <p className="text-text-secondary text-base leading-relaxed">
        In my career, I&apos;ve worked on VSAT network operations for real drilling
        operations, built IoT systems using LoRaWAN and MQTT, and developed deep
        learning APIs for medical imaging. I believe that combining hardware and
        software knowledge opens up incredible possibilities.
      </p>
      <p className="text-text-secondary text-base leading-relaxed">
        I&apos;m looking forward to the possibility of working with you!
      </p>
    </motion.div>
  );
}

function ResumeTab({ profile }: { profile: typeof defaultProfile }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-2">
        <div className="flex-1">
          <h3 className="font-heading font-semibold text-base text-text-primary mb-3">
            Summary
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed text-pretty">
            Computer Engineering graduate with hands-on experience in VSAT network
            operations, IoT systems, cloud infrastructure, and deep learning-based
            applications. Strong in Python, networking, and cloud computing with a
            proven track record in research and technical operations.
          </p>
        </div>
        {(profile as unknown as Record<string, string>).resumeUrl && (profile as unknown as Record<string, string>).resumeUrl !== "#" ? (
          <a
            href={(profile as unknown as Record<string, string>).resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 bg-accent text-white px-5 py-3 rounded-xl text-sm font-medium hover:bg-accent-hover transition-all shadow-lg shadow-accent/20 active:scale-[0.98]"
          >
            <FileText className="w-4 h-4" /> View Full Resume
          </a>
        ) : null}
      </div>

      <div>
        <h3 className="font-heading font-semibold text-base text-text-primary mb-3">
          Key Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Python",
            "LoRaWAN",
            "MQTT",
            "GCP",
            "Docker",
            "TensorFlow",
            "React/Next.js",
            "Linux",
            "VSAT/Networking",
            "Arduino/ESP32",
          ].map((skill) => (
            <span
              key={skill}
              className="px-3 py-1.5 rounded-full bg-surface border border-border text-sm text-text-secondary"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-heading font-semibold text-base text-text-primary mb-3">
          Organizations
        </h3>
        <div className="space-y-3">
          {organizations.map((org) => (
            <div
              key={org.id}
              className="p-4 rounded-xl border border-border bg-surface"
            >
              <h4 className="font-heading font-semibold text-sm text-text-primary">
                {org.name}
              </h4>
              <p className="text-accent text-xs">{org.role}</p>
              <p className="text-text-secondary text-xs mt-1">{org.period}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function CareerTab() {
  const workExps = experiences.filter((e) => e.type === "work");
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {workExps.map((exp) => (
        <div
          key={exp.id}
          className="p-5 rounded-xl border border-border bg-surface"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
            <div>
              <h3 className="font-heading font-semibold text-sm text-text-primary">
                {exp.role}
              </h3>
              <div className="flex items-center gap-2">
                {exp.companyUrl ? (
                  <a
                    href={exp.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent text-xs hover:underline flex items-center gap-1"
                  >
                    {exp.company}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-accent text-xs">{exp.company}</span>
                )}
                <span className="text-text-secondary text-xs">
                  • {exp.location}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-text-secondary shrink-0">
              <Calendar className="w-3 h-3" />
              {exp.period}
            </div>
          </div>
          <p className="text-text-secondary text-sm leading-relaxed mb-3">
            {exp.description}
          </p>
          {exp.responsibilities && (
            <ul className="text-text-secondary text-xs space-y-1 mb-3 list-disc list-inside">
              {exp.responsibilities.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          )}
          {exp.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {exp.techStack.map((tech) => (
                <span
                  key={tech}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-surface-hover border border-border text-text-secondary"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </motion.div>
  );
}

function EducationTab() {
  const eduExps = experiences.filter((e) => e.type === "education");
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {eduExps.map((edu) => (
        <div
          key={edu.id}
          className="p-5 rounded-xl border border-border bg-surface"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
            <div>
              <h3 className="font-heading font-semibold text-sm text-text-primary">
                {edu.role}
              </h3>
              {edu.companyUrl ? (
                <a
                  href={edu.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent text-xs hover:underline flex items-center gap-1"
                >
                  {edu.company}
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <p className="text-accent text-xs">{edu.company}</p>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-text-secondary shrink-0">
              <Calendar className="w-3 h-3" />
              {edu.period}
            </div>
          </div>
          <p className="text-text-secondary text-sm leading-relaxed">
            {edu.description}
          </p>
          {edu.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {edu.techStack.map((tech) => (
                <span
                  key={tech}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-surface-hover border border-border text-text-secondary"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </motion.div>
  );
}

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState("intro");
  const [profileData, setProfileData] = useState(defaultProfile);



  useEffect(() => {
    async function loadData() {
      try {
        const settingsSnapshot = await getDocument<typeof defaultProfile>("settings", "profile");
        if (settingsSnapshot) {
          setProfileData((prev) => ({ ...prev, ...settingsSnapshot }));
        }
      } catch {
        // inline fallback silently
      }
    }
    loadData();
  }, []);

  const tabComponents: Record<string, React.ReactNode> = {
    intro: <IntroTab profile={profileData} />,
    resume: <ResumeTab profile={profileData} />,
    career: <CareerTab />,
    education: <EducationTab />,
  };

  return (
    <PageTransition>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-0"
      >
        <SectionHeader
          title="About"
          subtitle="An insightful glimpse into who I am – because every detail adds depth to the canvas of life."
          icon="👤"
        />

        <hr className="section-divider" />

        {/* ── Tab Navigation ── */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-4 border border-border rounded-xl overflow-hidden mb-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? "bg-surface-hover text-text-primary"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-hover/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ── Tab Content ── */}
        <motion.div variants={itemVariants}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {tabComponents[activeTab]}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </PageTransition>
  );
}
