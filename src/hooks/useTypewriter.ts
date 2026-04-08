"use client";

import { useState, useEffect, useCallback } from "react";

interface UseTypewriterOptions {
  words: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  delayBetweenWords?: number;
  loop?: boolean;
}

export function useTypewriter({
  words,
  typeSpeed = 80,
  deleteSpeed = 50,
  delayBetweenWords = 2000,
  loop = true,
}: UseTypewriterOptions) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const tick = useCallback(() => {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      setText(currentWord.substring(0, text.length - 1));
    } else {
      setText(currentWord.substring(0, text.length + 1));
    }

    if (!isDeleting && text === currentWord) {
      if (!loop && wordIndex === words.length - 1) {
        setIsComplete(true);
        return;
      }
      setTimeout(() => setIsDeleting(true), delayBetweenWords);
      return;
    }

    if (isDeleting && text === "") {
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % words.length);
      return;
    }
  }, [text, isDeleting, wordIndex, words, loop, delayBetweenWords]);

  useEffect(() => {
    if (isComplete) return;

    const speed = isDeleting ? deleteSpeed : typeSpeed;
    const timer = setTimeout(tick, speed);

    return () => clearTimeout(timer);
  }, [tick, isDeleting, typeSpeed, deleteSpeed, isComplete]);

  return { text, isComplete, isDeleting };
}
