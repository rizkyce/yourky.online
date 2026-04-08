"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Send, LogOut, MessageCircle, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PageTransition } from "@/components/layout/PageTransition";
import { useAuth } from "@/components/providers/AuthProvider";
import { db } from "@/lib/firebase/config";
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  Timestamp, 
  setDoc, 
  doc, 
  deleteDoc 
} from "firebase/firestore";
import toast from "react-hot-toast";
import { GitHubIcon, GoogleIcon } from "@/components/ui/SocialIcons";

interface GuestMessage {
  id: string;
  name: string;
  email: string | null;
  photoURL: string | null;
  message: string;
  createdAt: unknown;
  isAuthor?: boolean;
}

interface Presence {
  id: string;
  lastSeen: Timestamp;
  name: string;
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

function ChatAvatar({ 
  src, 
  name, 
  initials, 
  isOnline, 
  className 
}: { 
  src: string | null, 
  name: string, 
  initials: string, 
  isOnline?: boolean,
  className?: string 
}) {
  const [error, setError] = useState(false);

  return (
    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-border flex items-center justify-center shrink-0 overflow-visible shadow-xs relative ${(!src || error) ? "bg-linear-to-br from-accent/20 to-purple-500/20" : "bg-surface-hover"} ${className}`}>
      <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center relative">
        {src && !error ? (
          <Image 
            src={src} 
            alt={name} 
            fill
            sizes="(max-width: 640px) 32px, 40px"
            className="object-cover" 
            onError={() => setError(true)}
          />
        ) : (
          <span className="text-[10px] sm:text-xs font-black text-accent tracking-tighter">
            {initials}
          </span>
        )}
      </div>

      {isOnline && (
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-background border-2 border-background rounded-full z-10 flex items-center justify-center">
          <div className="w-full h-full bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
        </div>
      )}
    </div>
  );
}

export default function ChatPage() {
  const { user, isAdmin, signInWithGoogle, signInWithGithub, logout } = useAuth();
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const isInput = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;
      if (isInput) return;

      if (e.key === " " && user) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [user]);

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, "guestbook"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as GuestMessage[];
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!db) return;
    const q = collection(db, "presence");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const now = Date.now();
      const activeIds = snapshot.docs
        .filter(doc => {
          const data = doc.data() as Presence;
          if (!data.lastSeen) return false;
          const lastSeenMs = data.lastSeen.toMillis();
          return (now - lastSeenMs) < 120000;
        })
        .map(doc => doc.id);
      setOnlineUsers(activeIds);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!db || !user?.email) return;
    const userPresenceRef = doc(db, "presence", user.email);
    const updatePresence = async () => {
      try {
        await setDoc(userPresenceRef, {
          name: user.displayName,
          lastSeen: serverTimestamp(),
        }, { merge: true });
      } catch (err) {
        console.error("Presence update error:", err);
      }
    };
    updatePresence();
    const interval = setInterval(updatePresence, 60000);
    return () => {
      clearInterval(interval);
      deleteDoc(userPresenceRef).catch(() => {});
    };
  }, [user]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !db) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "guestbook"), {
        name: user.displayName || "Anonymous",
        email: user.email,
        photoURL: user.photoURL,
        message: newMessage.trim(),
        isAuthor: isAdmin,
        createdAt: serverTimestamp(),
      });
      setNewMessage("");
    } catch (error) {
      toast.error("Failed to post message.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (timestamp: unknown) => {
    if (!timestamp || typeof (timestamp as Timestamp).toDate !== 'function') return "Just now";
    const date = (timestamp as Timestamp).toDate();
    return date.toLocaleDateString("en-GB") + ", " + date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return (name[0] || "?").toUpperCase();
  };

  return (
    <PageTransition>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-0"
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-8">
          <SectionHeader
            title="Guestbook"
            subtitle="Leave whatever you like to say, suggestions, questions or anything!"
            icon="💬"
            className="mb-0"
          />
          {user && (
            <div className="mt-4 sm:mt-0 flex shrink-0 items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-[10px] font-bold text-accent uppercase tracking-wider">Active</span>
              </div>
              <button
                onClick={async () => {
                  if (db && user?.email) {
                    try {
                      await deleteDoc(doc(db, "presence", user.email));
                    } catch (e) {
                      console.error("Failed to clean up presence:", e);
                    }
                  }
                  logout();
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-xs text-text-secondary hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-3 h-3" /> Sign Out
              </button>
            </div>
          )}
        </div>

        <hr className="section-divider" />

        <motion.div 
          variants={itemVariants} 
          className="relative rounded-2xl border border-border bg-surface/50 backdrop-blur-xs flex flex-col overflow-hidden h-[550px] sm:h-[650px] shadow-2xl shadow-accent/5"
        >
          {/* Scrollable Area */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-8 space-y-6 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-2 sm:gap-3 ${msg.isAuthor ? "flex-row-reverse" : "flex-row"}`}
                >
                  <ChatAvatar 
                    src={msg.photoURL} 
                    name={msg.name} 
                    initials={getInitials(msg.name)}
                    isOnline={msg.email ? onlineUsers.includes(msg.email) : false}
                  />

                  <div className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${msg.isAuthor ? "items-end" : "items-start"}`}>
                    <div className={`flex items-center gap-2 mb-1 px-1 ${msg.isAuthor ? "flex-row-reverse" : "flex-row"}`}>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] sm:text-xs font-bold text-text-primary">
                          {msg.name}
                        </span>
                        {msg.isAuthor && (
                          <ShieldCheck className="w-3 h-3 text-accent" />
                        )}
                      </div>
                      {msg.isAuthor && (
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-accent/20 text-accent uppercase tracking-tighter shadow-xs">
                          Author
                        </span>
                      )}
                      <span className="text-[10px] text-text-secondary opacity-60">
                        {formatTime(msg.createdAt)}
                      </span>
                    </div>

                    <div
                      className={`px-4 py-2.5 rounded-2xl text-[13px] sm:text-sm leading-relaxed shadow-xs ${
                        msg.isAuthor
                          ? "bg-accent text-white rounded-tr-none"
                          : "bg-surface border border-border text-text-primary rounded-tl-none shadow-sm"
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {messages.length === 0 && (
                 <div className="flex flex-col items-center justify-center h-full text-center py-8 text-text-secondary/50">
                   <MessageCircle className="w-12 h-12 mb-3 opacity-20" />
                   <p className="text-sm font-medium">No entries yet.</p>
                   <p className="text-xs">Be the first to write in the guestbook!</p>
                 </div>
              )}
            </AnimatePresence>
            <div ref={endRef} />
          </div>

          {/* Integrated Input Form Area */}
          <div className="p-3 sm:p-4 bg-surface/80 backdrop-blur-md border-t border-border">
            {user ? (
               <form
                onSubmit={handleSubmit}
                className="flex items-center gap-2 sm:gap-3 bg-background/50 border border-border p-1.5 rounded-xl shadow-inner focus-within:border-accent/40 focus-within:bg-background transition-all"
              >
                <div className="flex-1 flex items-center relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    disabled={isSubmitting}
                    className="flex-1 rounded-lg bg-transparent px-3 sm:px-4 py-2 text-sm text-text-primary placeholder:text-text-secondary/40 focus:outline-none disabled:opacity-50"
                  />
                  {!newMessage && (
                    <div className="hidden sm:flex absolute right-4 items-center gap-1.5 px-1.5 py-0.5 rounded border border-border bg-surface text-[8px] text-text-secondary opacity-40 uppercase tracking-widest pointer-events-none">
                      <span>Space</span>
                    </div>
                  )}
                </div>
                <motion.button
                  type="submit"
                  disabled={!newMessage.trim() || isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-accent text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all shadow-md shadow-accent/20"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </form>
            ) : (
              <div className="flex items-center justify-between gap-4 px-2 py-1">
                 <p className="text-xs text-text-secondary">Sign in to join the conversation</p>
                 <div className="flex items-center gap-2">
                    <button onClick={signInWithGoogle} className="p-2 rounded-lg bg-white/5 border border-border hover:bg-white/10 transition-colors">
                       <GoogleIcon className="w-4 h-4" />
                    </button>
                    <button onClick={signInWithGithub} className="p-2 rounded-lg bg-white/5 border border-border hover:bg-white/10 transition-colors">
                       <GitHubIcon className="w-4 h-4" />
                    </button>
                 </div>
              </div>
            )}
            
            {/* Footer Stats Integrated */}
            {user && (
              <div className="mt-2 px-1 flex items-center justify-between text-[9px] text-text-secondary/60 font-medium uppercase tracking-wider">
                 <div className="flex items-center gap-1.5">
                   <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                   {onlineUsers.length} active now
                 </div>
                 <div>@{user.displayName?.split(' ')[0].toLowerCase()}</div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </PageTransition>
  );
}
