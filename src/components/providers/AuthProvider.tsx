"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider, githubProvider, db } from "@/lib/firebase/config";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

interface AuthContextType {
  user: User | null | undefined; // undefined means loading
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: undefined,
  isAdmin: false,
  signInWithGoogle: async () => {},
  signInWithGithub: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(auth ? undefined : null);
  
  // The admin email can be set in .env.local, fallback to the hardcoded email
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "ridhoriz04@gmail.com";

  useEffect(() => {
    if (!auth || !db) return;
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser && currentUser.email) {
        // Log user info for analytics
        try {
          await setDoc(doc(db!, "profiles", currentUser.email), {
            name: currentUser.displayName,
            email: currentUser.email,
            photoURL: currentUser.photoURL,
            lastLogin: serverTimestamp(),
          }, { merge: true });
        } catch (err) {
          console.error("Failed to sync profile:", err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (!auth) return;
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google sign in error", error);
      throw error;
    }
  };

  const signInWithGithub = async () => {
    if (!auth) return;
    try {
      await signInWithPopup(auth, githubProvider);
    } catch (error) {
      console.error("Github sign in error", error);
      throw error;
    }
  };

  const logout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out error", error);
    }
  };

  const isAdmin = user?.email === adminEmail;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        signInWithGoogle,
        signInWithGithub,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
