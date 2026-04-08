"use client";

import { useEffect, useState } from "react";
import { getDocument, setDocument } from "@/lib/firebase/firestore";
import { Save, Calendar, Clock, Video, Link as LinkIcon, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

interface ScheduleConfig {
  title: string;
  description: string;
  duration: string;
  platform: string;
  url: string;
  active: boolean;
}

const defaultConfig: ScheduleConfig = {
  title: "1 on 1 Chit-chat Session",
  description: "Let's find some time to talk about anything",
  duration: "30 Minutes",
  platform: "Google Meet",
  url: "https://cal.com/nurridhorizki/30min",
  active: true
};

export default function AdminSchedule() {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [config, setConfig] = useState<ScheduleConfig>(defaultConfig);

  useEffect(() => {
    async function loadConfig() {
      setLoading(true);
      try {
        const data = await getDocument<ScheduleConfig>("settings", "schedule");
        if (data) {
          setConfig(data);
        }
      } catch (err) {
        console.error("Failed to load schedule config:", err);
      } finally {
        setLoading(false);
      }
    }
    loadConfig();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const success = await setDocument("settings", "schedule", config as unknown as Record<string, unknown>);
      if (success) {
        toast.success("Schedule settings updated!");
      } else {
        throw new Error("Failed to save to database");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-text-secondary">Loading schedule settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-xl text-text-primary">Scheduling Settings</h1>
        <p className="text-sm text-text-secondary">Configure your video conference and availability links here.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface border border-border rounded-xl p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-500">
                    <Video className="w-4 h-4" />
                  </div>
                  <h2 className="font-heading font-semibold text-text-primary">Session Details</h2>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={config.active}
                    onChange={(e) => setConfig({...config, active: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-surface-hover peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500 border border-border"></div>
                  <span className="ml-3 text-xs font-medium text-text-secondary">{config.active ? 'Active' : 'Disabled'}</span>
                </label>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5 uppercase">Session Title</label>
                  <input 
                    type="text" 
                    value={config.title}
                    onChange={(e) => setConfig({...config, title: e.target.value})}
                    className="w-full bg-surface-hover border border-border rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5 uppercase">Short Description</label>
                  <input 
                    type="text" 
                    value={config.description}
                    onChange={(e) => setConfig({...config, description: e.target.value})}
                    className="w-full bg-surface-hover border border-border rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5 uppercase">Duration (text)</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                    <input 
                      type="text" 
                      value={config.duration}
                      onChange={(e) => setConfig({...config, duration: e.target.value})}
                      className="w-full bg-surface-hover border border-border rounded-lg pl-10 pr-4 py-2.5 text-text-primary focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5 uppercase">Platform Name</label>
                  <div className="relative">
                    <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                    <input 
                      type="text" 
                      value={config.platform}
                      onChange={(e) => setConfig({...config, platform: e.target.value})}
                      className="w-full bg-surface-hover border border-border rounded-lg pl-10 pr-4 py-2.5 text-text-primary focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5 uppercase">Scheduling URL (External)</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                  <input 
                    type="url" 
                    required
                    placeholder="https://cal.com/your-name/30min"
                    value={config.url}
                    onChange={(e) => setConfig({...config, url: e.target.value})}
                    className="w-full bg-surface-hover border border-border rounded-lg pl-10 pr-4 py-2.5 text-text-primary focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <p className="mt-2 text-[10px] text-text-secondary flex items-start gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
                  This link should point to your Cal.com, Calendly, or other scheduling page.
                </p>
              </div>

              <div className="flex justify-end pt-4 border-t border-border mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-teal-500 text-white hover:bg-teal-600 transition-colors disabled:opacity-50 font-medium shadow-lg shadow-teal-500/10 active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  {isSubmitting ? "Updating..." : "Save Settings"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Live Preview */}
        <div className="space-y-4">
          <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest">Live Preview</label>
          <div className="p-5 rounded-2xl border-2 border-teal-500/30 bg-linear-to-br from-teal-500/5 to-emerald-500/5 group transition-all opacity-90 grayscale-[0.2] pointer-events-none">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-heading font-semibold text-base text-text-primary mb-1">
                  {config.title || "Session Title"}
                </h3>
                <p className="text-text-secondary text-sm mb-3">
                  {config.description || "Description placeholder"}
                </p>
                <div className="flex items-center gap-4 text-xs text-text-secondary">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {config.duration || "30 Minutes"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Video className="w-3 h-3" />
                    {config.platform || "Google Meet"}
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl border border-teal-500/30 flex items-center justify-center text-teal-500 bg-surface">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            {!config.active && (
              <div className="mt-4 px-2 py-1 rounded-md bg-rose-500/10 text-rose-500 text-[10px] font-bold uppercase text-center border border-rose-500/20">
                Hidden on Contact Page
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
