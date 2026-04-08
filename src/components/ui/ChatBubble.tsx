"use client";

import { motion } from "framer-motion";

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
}

export function ChatBubble({ message, isUser, timestamp }: ChatBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div className={`max-w-[80%] ${isUser ? "order-1" : "order-1"}`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? "bg-accent text-white rounded-br-md"
              : "bg-surface border border-border text-text-primary rounded-bl-md"
          }`}
        >
          {!isUser && (
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-5 h-5 rounded-md bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center">
                <span className="text-[10px] text-white">AI</span>
              </div>
              <span className="text-xs font-medium text-accent">Portfolio AI</span>
            </div>
          )}
          {message}
        </div>
        {timestamp && (
          <p
            className={`text-[10px] text-text-secondary mt-1 ${
              isUser ? "text-right" : "text-left"
            }`}
          >
            {timestamp}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex justify-start mb-4"
    >
      <div className="bg-surface border border-border rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center">
            <span className="text-[10px] text-white">AI</span>
          </div>
          <span className="text-xs font-medium text-accent">Portfolio AI</span>
        </div>
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-text-secondary"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
