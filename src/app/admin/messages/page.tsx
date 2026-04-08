"use client";

import { useEffect, useState } from "react";
import { getAllDocuments, deleteDocument, updateDocument } from "@/lib/firebase/firestore";
import { Trash2, CheckCircle, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { DeleteDialog } from "@/components/ui/DeleteDialog";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  read?: boolean;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    const data = await getAllDocuments<Message>("messages");
    setMessages(data);
    setLoading(false);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchMessages();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    
    setIsDeleting(true);
    try {
      const success = await deleteDocument("messages", deleteId);
      if (success) {
        toast.success("Message deleted permanently");
        fetchMessages();
        setDeleteId(null);
      } else {
        toast.error("Failed to delete message");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleRead = async (id: string, currentStatus: boolean) => {
    const success = await updateDocument("messages", id, { read: !currentStatus });
    if (success) {
      toast.success(currentStatus ? "Marked as unread" : "Marked as read");
      fetchMessages();
    } else {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <div className="p-8 text-center text-text-secondary">Loading messages...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-xl text-text-primary">Contact Messages</h1>
        <p className="text-sm text-text-secondary">Manage incoming messages from your contact form.</p>
      </div>

      <div className="border border-border rounded-xl bg-surface overflow-hidden">
        {messages.length === 0 ? (
          <div className="p-8 text-center text-text-secondary">No messages found.</div>
        ) : (
          <div className="divide-y divide-border">
            {messages.map((msg) => (
              <div key={msg.id} className={`p-5 hover:bg-surface-hover/50 transition-colors ${!msg.read ? "bg-accent/5 relative" : ""}`}>
                {!msg.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-r-full" />}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-heading font-semibold text-text-primary flex items-center gap-2">
                        {msg.name}
                      </h3>
                      <span className="text-xs text-text-secondary px-2 py-0.5 rounded-full bg-surface border border-border flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {msg.email}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary mt-3 whitespace-pre-wrap leading-relaxed bg-surface-hover/50 p-4 rounded-lg border border-border/50">
                      {msg.message}
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <button 
                      onClick={() => handleToggleRead(msg.id, !!msg.read)}
                      className={`p-2 rounded-lg border transition-colors ${msg.read ? "bg-surface border-border text-text-secondary" : "bg-accent/10 border-accent/20 text-accent hover:bg-accent hover:text-white"}`}
                      title={msg.read ? "Mark unread" : "Mark read"}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => setDeleteId(msg.id)}
                        className="p-2 text-text-secondary hover:text-rose-500 bg-surface border border-border rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <DeleteDialog
        isOpen={!!deleteId}
        isLoading={isDeleting}
        title="Delete Message?"
        description="Are you sure you want to delete this message? This action is permanent and cannot be recovered."
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}
