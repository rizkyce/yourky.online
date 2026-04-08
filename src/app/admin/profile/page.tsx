"use client";

import { useEffect, useState } from "react";
import { getDocument, setDocument } from "@/lib/firebase/firestore";
import { Save, UploadCloud } from "lucide-react";
import toast from "react-hot-toast";
import { profile as localProfile } from "@/data/profile";

export default function AdminProfile() {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    title: "",
    tagline: "",
    email: "",
    phone: "",
    location: "",
    bioText: "", // We process bio array into a string
    avatarUrl: "",
    resumeUrl: "",
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const fetchProfile = async () => {
    setLoading(true);
    const data = await getDocument<typeof localProfile>("settings", "profile");
    
    // Auto-seed from local if it doesn't exist in DB
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const safeData = (data as any) || { id: "profile", ...localProfile };

    setFormData({
      name: safeData.name || "",
      nickname: safeData.nickname || "",
      title: safeData.title || "",
      tagline: safeData.tagline || "",
      email: safeData.email || "",
      phone: safeData.phone || "",
      location: safeData.location || "",
      bioText: Array.isArray(safeData.bio) ? safeData.bio.join("\n\n") : (safeData.bio || ""),
      avatarUrl: safeData.avatarUrl || "",
      resumeUrl: safeData.resumeUrl || (safeData.resumeUrl !== "#" ? safeData.resumeUrl : ""),
    });
    setLoading(false);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => fetchProfile(), 0);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    let finalAvatarUrl = formData.avatarUrl;
    let finalResumeUrl = formData.resumeUrl;

    try {
      if (avatarFile) {
        const data = new FormData();
        data.append("file", avatarFile);
        const res = await fetch("/api/upload", { method: "POST", body: data });
        if (!res.ok) throw new Error("Avatar upload failed");
        const json = await res.json();
        finalAvatarUrl = json.url;
      }
      
      if (resumeFile) {
        const data = new FormData();
        data.append("file", resumeFile);
        const res = await fetch("/api/upload", { method: "POST", body: data });
        if (!res.ok) throw new Error("Resume upload failed");
        const json = await res.json();
        finalResumeUrl = json.url;
      }

    const payload = {
      ...localProfile, // Retain nested static objects like services/social for now
      name: formData.name,
      nickname: formData.nickname,
      title: formData.title,
      tagline: formData.tagline,
      email: formData.email,
      phone: formData.phone,
      location: formData.location,
      bio: formData.bioText.split("\n\n").filter(b => b.trim() !== ""),
      avatarUrl: finalAvatarUrl,
      resumeUrl: finalResumeUrl,
    };

    const success = await setDocument("settings", "profile", payload);
    if (success) {
      toast.success("Profile saved securely");
      setAvatarFile(null);
      setResumeFile(null);
    } else {
      toast.error("Failed to save profile");
    }
    } catch (err: unknown) {
      toast.error((err as Error).message || "An error occurred during upload");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-text-secondary">Loading profile data...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-xl text-text-primary">Profile Data</h1>
        <p className="text-sm text-text-secondary">Update the core biographical details that populate across your site.</p>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-text-secondary mb-1">Profile Avatar</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-surface-hover border border-border flex items-center justify-center shrink-0 overflow-hidden">
                  {avatarFile ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={URL.createObjectURL(avatarFile)} alt="Avatar" className="w-full h-full object-cover" />
                  ) : formData.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <UploadCloud className="w-6 h-6 text-text-secondary" />
                  )}
                </div>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => e.target.files && setAvatarFile(e.target.files[0])}
                  className="w-full bg-surface-hover border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-accent file:text-white hover:file:bg-accent-hover text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Resume / CV (PDF)</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-surface-hover border border-border flex flex-col items-center justify-center shrink-0">
                  <UploadCloud className="w-5 h-5 text-text-secondary mb-1" />
                  <span className="text-[10px] text-text-secondary">PDF</span>
                </div>
                <div className="flex-1">
                  <input 
                    type="file" 
                    accept="application/pdf"
                    onChange={(e) => e.target.files && setResumeFile(e.target.files[0])}
                    className="w-full bg-surface-hover border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-accent file:text-white hover:file:bg-accent-hover text-sm"
                  />
                  {formData.resumeUrl && formData.resumeUrl !== "#" && !resumeFile && (
                    <a href={formData.resumeUrl} target="_blank" rel="noreferrer" className="text-xs text-accent mt-2 inline-block hover:underline">
                      View current resume
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <hr className="border-border my-4" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-text-secondary mb-1">Full Name</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-surface-hover border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Nickname</label>
              <input 
                type="text" 
                required
                value={formData.nickname}
                onChange={(e) => setFormData({...formData, nickname: e.target.value})}
                className="w-full bg-surface-hover border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-text-secondary mb-1">Professional Title</label>
              <input 
                type="text" 
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-surface-hover border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Short Tagline</label>
              <input 
                type="text" 
                value={formData.tagline}
                onChange={(e) => setFormData({...formData, tagline: e.target.value})}
                className="w-full bg-surface-hover border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-text-secondary mb-1">Email</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-surface-hover border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Phone</label>
              <input 
                type="text" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-surface-hover border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Location</label>
              <input 
                type="text" 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full bg-surface-hover border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1">Biography (Separate paragraphs with double newlines)</label>
            <textarea 
              rows={6}
              value={formData.bioText}
              onChange={(e) => setFormData({...formData, bioText: e.target.value})}
              className="w-full bg-surface-hover border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-accent resize-vertical"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-border mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors disabled:opacity-50 font-medium"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? "Saving..." : "Save Profile Details"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
