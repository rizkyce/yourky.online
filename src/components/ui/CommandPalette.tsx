"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  X, 
  Home, 
  LayoutDashboard, 
  FolderKanban, 
  User, 
  Rocket, 
  MessageCircle, 
  ArrowRight,
  Command
} from "lucide-react";
import { 
  GitHubIcon as Github, 
  LinkedInIcon as Linkedin, 
  TwitterIcon as Twitter, 
  InstagramIcon as Instagram 
} from "./SocialIcons";
import { useRouter } from "next/navigation";
import { profile } from "@/data/profile";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchItem {
  id: string;
  title: string;
  description?: string;
  icon: React.ElementType;
  href?: string;
  action?: () => void;
  category: "Navigation" | "Social" | "Actions";
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const items = useMemo<SearchItem[]>(() => [
    // Navigation
    { id: "home", title: "Home", description: "Go to homepage", icon: Home, href: "/", category: "Navigation" },
    { id: "dashboard", title: "Dashboard", description: "View statistics and activity", icon: LayoutDashboard, href: "/dashboard", category: "Navigation" },
    { id: "projects", title: "Projects", description: "Browse my work and contributions", icon: FolderKanban, href: "/projects", category: "Navigation" },
    { id: "about", title: "About", description: "Learn more about me", icon: User, href: "/about", category: "Navigation" },
    { id: "contact", title: "Contact", description: "Get in touch with me", icon: Rocket, href: "/contact", category: "Navigation" },
    { id: "guestbook", title: "Guestbook", description: "Leave a message", icon: MessageCircle, href: "/chat", category: "Navigation" },

    // Socials
    { id: "github", title: "GitHub", description: "Check my repositories", icon: Github, href: profile.social.github, category: "Social" },
    { id: "linkedin", title: "LinkedIn", description: "Connect professionally", icon: Linkedin, href: profile.social.linkedin, category: "Social" },
    { id: "twitter", title: "Twitter", description: "Follow my updates", icon: Twitter, href: profile.social.twitter, category: "Social" },
    { id: "instagram", title: "Instagram", description: "See my photos", icon: Instagram, href: profile.social.instagram, category: "Social" },

    // Actions
    { id: "close", title: "Close Search", description: "Close this menu", icon: X, action: onClose, category: "Actions" },
  ], [onClose]);

  const filteredItems = useMemo(() => {
    if (!query) return items;
    const lowerQuery = query.toLowerCase();
    return items.filter(item => 
      item.title.toLowerCase().includes(lowerQuery) || 
      item.description?.toLowerCase().includes(lowerQuery) ||
      item.category.toLowerCase().includes(lowerQuery)
    );
  }, [query, items]);

  const handleClose = useCallback(() => {
    onClose();
    // Reset state after animation
    setTimeout(() => {
      setQuery("");
      setSelectedIndex(0);
    }, 200);
  }, [onClose]);

  const handleSelect = useCallback((item: SearchItem) => {
    if (!item) return;
    if (item.href) {
      if (item.href.startsWith("http")) {
        window.open(item.href, "_blank");
      } else {
        router.push(item.href);
      }
    } else if (item.action) {
      item.action();
    }
    handleClose();
  }, [router, handleClose]);

  useEffect(() => {
    if (isOpen) {
      const timeout = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredItems.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleSelect(filteredItems[selectedIndex]);
      } else if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, handleClose, handleSelect]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-100"
            onClick={handleClose}
          />

          {/* Dialog Container */}
          <div className="fixed inset-0 z-101 flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-xl bg-surface border border-border shadow-2xl rounded-2xl overflow-hidden pointer-events-auto"
            >
              {/* Search Header */}
              <div className="relative flex items-center border-b border-border p-4">
                <Search className="w-5 h-5 text-text-secondary absolute left-4" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search pages, social, actions..."
                  className="w-full pl-10 pr-10 py-1 bg-transparent border-none outline-none text-text-primary placeholder:text-text-secondary text-base"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                />
                {query && (
                  <button 
                    onClick={() => setQuery("")}
                    className="absolute right-12 text-text-secondary hover:text-text-primary p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <div className="flex items-center gap-1 text-[10px] text-text-secondary border border-border rounded px-1.5 py-0.5 bg-surface-hover ml-2">
                  <Command className="w-2.5 h-2.5" />
                  <span>K</span>
                </div>
              </div>

              {/* Results List */}
              <div className="max-h-[60vh] overflow-y-auto p-2 scrollbar-none">
                {filteredItems.length > 0 ? (
                  <div className="space-y-4">
                    {/* Groups */}
                    {["Navigation", "Social", "Actions"].map(category => {
                      const categoryItems = filteredItems.filter(item => item.category === category);
                      if (categoryItems.length === 0) return null;

                      return (
                        <div key={category} className="space-y-1">
                          <h3 className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-text-secondary opacity-50">
                            {category}
                          </h3>
                          {categoryItems.map((item) => {
                            const actualIndex = filteredItems.indexOf(item);
                            const isSelected = actualIndex === selectedIndex;
                            const Icon = item.icon;

                            return (
                              <button
                                key={item.id}
                                onMouseEnter={() => setSelectedIndex(actualIndex)}
                                onClick={() => handleSelect(item)}
                                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left group ${
                                  isSelected 
                                    ? "bg-accent/10 border border-accent/20" 
                                    : "bg-transparent border border-transparent hover:bg-surface-hover"
                                }`}
                              >
                                <div className={`p-2 rounded-lg transition-colors ${
                                  isSelected ? "bg-accent/20 text-accent" : "bg-surface-hover text-text-secondary group-hover:text-text-primary"
                                }`}>
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                  <p className={`text-sm font-medium ${isSelected ? "text-text-primary" : "text-text-secondary group-hover:text-text-primary"}`}>
                                    {item.title}
                                  </p>
                                  {item.description && (
                                    <p className="text-xs text-text-secondary line-clamp-1 opacity-70">
                                      {item.description}
                                    </p>
                                  )}
                                </div>
                                {isSelected && (
                                  <motion.div
                                    layoutId="arrow"
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                  >
                                    <ArrowRight className="w-4 h-4 text-accent" />
                                  </motion.div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-surface-hover mb-4">
                      <Search className="w-6 h-6 text-text-secondary opacity-30" />
                    </div>
                    <p className="text-sm text-text-secondary">No results found for &quot;{query}&quot;</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-border bg-surface-hover/30 flex items-center justify-between text-[10px] text-text-secondary px-4">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 rounded border border-border bg-surface">Enter</kbd> to select
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 rounded border border-border bg-surface">↑↓</kbd> to navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 rounded border border-border bg-surface">Esc</kbd> to close
                  </span>
                </div>
                <div>
                  {filteredItems.length} results
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
