"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Mail, Send, CheckCircle, Clock, Video, Calendar } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PageTransition } from "@/components/layout/PageTransition";
import {
  GitHubIcon,
  LinkedInIcon,
  TwitterIcon,
} from "@/components/ui/SocialIcons";
import { createDocument, getDocument } from "@/lib/firebase/firestore";
import toast from "react-hot-toast";

interface ScheduleConfig {
  title: string;
  description: string;
  duration: string;
  platform: string;
  url: string;
  active: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const socialButtons = [
  {
    label: "Email",
    href: "mailto:ridhoriz04@gmail.com",
    bg: "bg-green-600 hover:bg-green-700",
    icon: Mail,
  },
  {
    label: "Linkedin",
    href: "https://www.linkedin.com/in/nurridhorizki/",
    bg: "bg-blue-600 hover:bg-blue-700",
    icon: LinkedInIcon,
  },
  {
    label: "Twitter",
    href: "https://twitter.com/rizkycyrf05",
    bg: "bg-sky-500 hover:bg-sky-600",
    icon: TwitterIcon,
  },
  {
    label: "Github",
    href: "https://github.com/rizkyce",
    bg: "bg-neutral-800 hover:bg-neutral-700 border border-border",
    icon: GitHubIcon,
  },
];

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scheduleConfig, setScheduleConfig] = useState<ScheduleConfig>({
    title: "1 on 1 Chit-chat Session",
    description: "Let's find some time to talk about anything",
    duration: "30 Minutes",
    platform: "Google Meet",
    url: "#",
    active: true
  });

  useEffect(() => {
    async function loadSchedule() {
      try {
        const data = await getDocument<ScheduleConfig>("settings", "schedule");
        if (data) {
          setScheduleConfig(data);
        }
      } catch (err) {
        console.error("Failed to load schedule config:", err);
      }
    }
    loadSchedule();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;
    
    setIsSubmitting(true);
    try {
      await createDocument("messages", {
        name: formState.name,
        email: formState.email,
        message: formState.message,
        read: false
      });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
      setFormState({ name: "", email: "", message: "" });
    } catch {
      toast.error("Failed to send message.");
    } finally {
      setIsSubmitting(false);
    }
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
          title="Contact"
          subtitle="Feel free to get in touch and let's have a discussion about how we can work together."
          icon="🚀"
        />

        <hr className="section-divider" />

        {/* ── Social Media Buttons Row ── */}
        <motion.div variants={itemVariants}>
          <h2 className="font-heading font-bold text-base text-text-primary mb-4">
            Find me on social media
          </h2>
          <div className="flex flex-wrap gap-3">
            {socialButtons.map((social) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-medium transition-colors ${social.bg}`}
                >
                  <Icon className="w-4 h-4" />
                  {social.label}
                </motion.a>
              );
            })}
          </div>
        </motion.div>

        <hr className="section-divider" />

        {scheduleConfig.active && (
          <motion.div variants={itemVariants}>
            <h2 className="font-heading font-bold text-base text-text-primary mb-4">
              Book a Call
            </h2>
            <motion.a
              href={scheduleConfig.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="p-5 rounded-xl border-2 border-teal-500/30 bg-linear-to-br from-teal-500/5 to-emerald-500/5 group-hover:border-teal-500/60 transition-all active:scale-[0.98]">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-heading font-semibold text-base text-text-primary mb-1 group-hover:text-teal-500 transition-colors">
                      {scheduleConfig.title}
                    </h3>
                    <p className="text-text-secondary text-sm mb-3">
                      {scheduleConfig.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-text-secondary">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {scheduleConfig.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        {scheduleConfig.platform}
                      </span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl border border-teal-500/30 flex items-center justify-center text-teal-500 group-hover:bg-teal-500 group-hover:text-white transition-all">
                    <Calendar className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </motion.a>
          </motion.div>
        )}

        <hr className="section-divider" />

        {/* ── Contact Form ── */}
        <motion.div variants={itemVariants}>
          <h2 className="font-heading font-bold text-base text-text-primary mb-4">
            Or send me a message
          </h2>

          {submitted ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <CheckCircle className="w-12 h-12 text-success mb-3" />
              <p className="font-heading font-semibold text-text-primary">
                Message Sent!
              </p>
              <p className="text-text-secondary text-sm mt-1">
                Thank you for reaching out. I&apos;ll get back to you soon.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) =>
                    setFormState({ ...formState, name: e.target.value })
                  }
                  className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-text-secondary/50 transition-colors"
                  placeholder="Name*"
                />
                <input
                  type="email"
                  required
                  value={formState.email}
                  onChange={(e) =>
                    setFormState({ ...formState, email: e.target.value })
                  }
                  className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-text-secondary/50 transition-colors"
                  placeholder="Email*"
                />
              </div>
              <textarea
                required
                rows={5}
                value={formState.message}
                onChange={(e) =>
                  setFormState({ ...formState, message: e.target.value })
                }
                className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-text-secondary/50 transition-colors resize-none"
                placeholder="Message*"
              />
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-surface-hover border border-border text-sm font-medium text-text-primary hover:bg-border/50 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? "Sending..." : "Send Message"} <Send className="w-4 h-4" />
              </motion.button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </PageTransition>
  );
}
