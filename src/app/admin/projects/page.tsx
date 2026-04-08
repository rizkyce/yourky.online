"use client";

import { useEffect, useState } from "react";
import { getAllDocuments, deleteDocument, createDocument, updateDocument } from "@/lib/firebase/firestore";
import { Plus, Trash2, Edit, X, Save } from "lucide-react";
import toast from "react-hot-toast";
import { ProjectData } from "@/data/projects";
import { DeleteDialog } from "@/components/ui/DeleteDialog";

export default function AdminProjects() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "web",
    techStack: "",
    githubUrl: "",
    demoUrl: "",
    featured: false,
  });

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    const data = await getAllDocuments<ProjectData>("projects");
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProjects();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    
    setIsDeleting(true);
    try {
      const success = await deleteDocument("projects", deleteId);
      if (success) {
        toast.success("Project deleted permanently");
        fetchProjects();
        setDeleteId(null);
      } else {
        toast.error("Failed to delete project");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      category: "web",
      techStack: "",
      githubUrl: "",
      demoUrl: "",
      featured: false,
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (project: ProjectData) => {
    setEditingId(project.id!);
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      techStack: project.techStack.join(", "),
      githubUrl: project.githubUrl || "",
      demoUrl: project.demoUrl || "",
      featured: project.featured,
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      techStack: formData.techStack.split(",").map(t => t.trim()).filter(Boolean),
      featured: formData.featured,
      ...(formData.githubUrl && { githubUrl: formData.githubUrl }),
      ...(formData.demoUrl && { demoUrl: formData.demoUrl }),
    };

    try {
      if (editingId) {
        const success = await updateDocument("projects", editingId, payload);
        if (success) {
          toast.success("Project updated successfully");
        } else {
          throw new Error("Update failed");
        }
      } else {
        const id = await createDocument("projects", payload);
        if (id) {
          toast.success("Project created successfully");
        } else {
          throw new Error("Creation failed");
        }
      }
      setIsFormOpen(false);
      fetchProjects();
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !isFormOpen) {
    return <div className="p-8 text-center text-text-secondary">Loading projects...</div>;
  }

  return (
    <div className="space-y-6">
      {!isFormOpen ? (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading font-bold text-xl text-text-primary">Projects</h1>
              <p className="text-sm text-text-secondary">Manage your portfolio projects.</p>
            </div>
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent-hover transition-colors"
            >
              <Plus className="w-4 h-4" /> Add New Project
            </button>
          </div>

          <div className="border border-border rounded-xl bg-surface overflow-hidden">
            {projects.length === 0 ? (
              <div className="p-8 text-center text-text-secondary">
                No projects found. Add one above.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {projects.map((project) => (
                  <div key={project.id} className="p-4 flex items-center justify-between hover:bg-surface-hover/50">
                    <div>
                      <h3 className="font-heading font-semibold text-text-primary flex items-center gap-2">
                        {project.title}
                        {project.featured && <span className="bg-lime-400/20 text-lime-400 text-[10px] px-2 py-0.5 rounded-full">Featured</span>}
                      </h3>
                      <p className="text-xs text-text-secondary mt-1">{project.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleOpenEdit(project)}
                        className="p-2 text-text-secondary hover:text-accent bg-surface border border-border rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setDeleteId(project.id!)}
                        className="p-2 text-text-secondary hover:text-rose-500 bg-surface border border-border rounded-lg transition-colors group/delete"
                        title="Delete project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-border">
            <h2 className="font-heading font-bold text-lg text-text-primary">
              {editingId ? "Edit Project" : "Create New Project"}
            </h2>
            <button 
              onClick={() => setIsFormOpen(false)}
              className="p-2 text-text-secondary hover:text-text-primary bg-surface-hover rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-text-secondary mb-1">Title</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-surface-hover border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-accent"
                  placeholder="Project Name"
                />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-surface-hover border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-accent"
                >
                  <option value="web">Web Development</option>
                  <option value="app">Mobile App</option>
                  <option value="design">UI/UX Design</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-1">Description</label>
              <textarea 
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-surface-hover border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-accent resize-none"
                placeholder="Briefly describe the project..."
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-1">Tech Stack (comma separated)</label>
              <input 
                type="text" 
                required
                value={formData.techStack}
                onChange={(e) => setFormData({...formData, techStack: e.target.value})}
                className="w-full bg-surface-hover border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-accent"
                placeholder="React, Next.js, Tailwind, Firebase"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-text-secondary mb-1">GitHub URL (Optional)</label>
                <input 
                  type="url" 
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                  className="w-full bg-surface-hover border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-accent"
                  placeholder="https://github.com/..."
                />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Live Demo URL (Optional)</label>
                <input 
                  type="url" 
                  value={formData.demoUrl}
                  onChange={(e) => setFormData({...formData, demoUrl: e.target.value})}
                  className="w-full bg-surface-hover border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-accent"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input 
                type="checkbox" 
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                className="w-4 h-4 rounded border-border bg-surface-hover text-accent focus:ring-accent"
              />
              <label htmlFor="featured" className="text-sm text-text-primary cursor-pointer">
                Mark as Featured Project (Shows on Home Page)
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-border">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 rounded-lg border border-border text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors disabled:opacity-50 font-medium text-sm"
              >
                <Save className="w-4 h-4" />
                {isSubmitting ? "Saving..." : "Save Project"}
              </button>
            </div>
          </form>
        </div>
      )}

      <DeleteDialog
        isOpen={!!deleteId}
        isLoading={isDeleting}
        title="Delete Project?"
        description="This action cannot be undone. This project will be permanently removed from your portfolio and the database."
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}
