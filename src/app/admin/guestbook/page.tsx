"use client";

import { useEffect, useState } from "react";
import { getAllDocuments, deleteDocument } from "@/lib/firebase/firestore";
import { Trash2, User } from "lucide-react";
import toast from "react-hot-toast";
import { DeleteDialog } from "@/components/ui/DeleteDialog";

interface GuestbookEntry {
  id: string;
  name: string;
  email: string | null;
  message: string;
  createdAt: unknown;
  isAuthor?: boolean;
}

export default function AdminGuestbook() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEntries = async () => {
    setLoading(true);
    const data = await getAllDocuments<GuestbookEntry>("guestbook");
    setEntries(data);
    setLoading(false);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchEntries();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    
    setIsDeleting(true);
    try {
      const success = await deleteDocument("guestbook", deleteId);
      if (success) {
        toast.success("Entry deleted permanently");
        fetchEntries();
        setDeleteId(null);
      } else {
        toast.error("Failed to delete entry");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-text-secondary">Loading guestbook...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-xl text-text-primary">Guestbook</h1>
        <p className="text-sm text-text-secondary">Manage messages posted in your public guestbook.</p>
      </div>

      <div className="border border-border rounded-xl bg-surface overflow-hidden">
        {entries.length === 0 ? (
          <div className="p-8 text-center text-text-secondary">No entries found.</div>
        ) : (
          <div className="divide-y divide-border">
            {entries.map((entry) => (
              <div key={entry.id} className="p-5 flex items-start justify-between hover:bg-surface-hover/50 transition-colors">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface-hover border border-border flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-text-secondary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-heading font-semibold text-text-primary flex items-center gap-2">
                        {entry.name}
                      </h3>
                      {entry.isAuthor && (
                         <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-green-500/20 text-green-400">
                           Author
                         </span>
                      )}
                      <span className="text-xs text-text-secondary">
                        {entry.email || "No email provided"}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary mt-1">{entry.message}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setDeleteId(entry.id)}
                    className="p-2 text-text-secondary hover:text-rose-500 bg-surface border border-border rounded-lg transition-colors"
                    title="Delete entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <DeleteDialog
        isOpen={!!deleteId}
        isLoading={isDeleting}
        title="Delete Guestbook Entry?"
        description="Are you sure you want to remove this message from your guestbook? This cannot be undone."
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}
