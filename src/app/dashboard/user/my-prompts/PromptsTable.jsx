// PromptsTable.jsx

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, TrashBin, Xmark, ChevronDown } from "@gravity-ui/icons";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { NotebookPen } from "lucide-react";

const statusStyles = {
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  approved: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  rejected: "bg-red-50 text-red-700 ring-red-600/20",
};

const visibilityStyles = {
  public: "bg-[#e6f4fb] text-[#0a6c9b] ring-[#0a9fd4]/30",
  private: "bg-zinc-100 text-zinc-600 ring-zinc-400/30",
};

const CATEGORIES = ["Writing","Coding","Marketing","Design","Business","Education","Productivity","Other"];
const AI_TOOLS = ["ChatGPT","Claude","Gemini","Midjourney","DALL·E","Other"];
const DIFFICULTIES = ["Beginner","Intermediate","Advanced"];

const Badge = ({ children, className }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${className}`}>
    {children}
  </span>
);

export default function PromptsTable({ prompts: initialPrompts }) {
  const router = useRouter();
  const [prompts, setPrompts] = useState(initialPrompts);
  const [editingPrompt, setEditingPrompt] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => { router.refresh(); }, 30000);
    return () => clearInterval(interval);
  }, [router]);

  useEffect(() => { setPrompts(initialPrompts); }, [initialPrompts]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget._id?.$oid || deleteTarget._id;
    setBusyId(id);
    setPrompts(prev => prev.filter(p => (p._id?.$oid || p._id) !== id));
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/prompts/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success(`${deleteTarget.title} deleted successfully!`);
      router.refresh();
    } catch (err) {
      toast.error(err.message || "Something went wrong, please try again");
      setPrompts(prev => [...prev, deleteTarget]);
    } finally {
      setBusyId(null);
      setDeleteTarget(null);
    }
  };

  const handleUpdateSubmit = async (formData) => {
    const id = editingPrompt._id?.$oid || editingPrompt._id;
    setBusyId(id);
    setPrompts(prev => prev.map(p => (p._id?.$oid || p._id) === id ? { ...p, ...formData } : p));
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/prompts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Update failed");
      await res.json();
      toast.success(`Updated ${editingPrompt.title}`);
      router.refresh();
      setEditingPrompt(null);
    } catch (err) {
      toast.error(err.message || "Something went wrong, please try again");
      await router.refresh();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-[#115a88]"><span className="flex items-center gap-1"><NotebookPen />My Prompts</span></h1>
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-[#115a88] mt-0.5"
          >
            ({prompts.length})
          </motion.p>
        </div>
      </motion.div>

      {prompts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/dashboard/user/add-prompt"
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#C7DFEA] bg-[#f3f7fb]/50 py-16 px-6 text-center transition-all hover:border-[#0a9fd4]/30 hover:bg-[#f3f7fb] cursor-pointer group"
          >
            <div className="bg-white p-4 rounded-full shadow-sm border border-[#C7DFEA] mb-4 transition-transform group-hover:scale-105">
              <svg className="w-8 h-8 text-zinc-400 group-hover:text-[#0a9fd4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-zinc-800 font-semibold text-sm mb-1 group-hover:text-[#0a9fd4]">No prompts yet</h3>
            <p className="text-zinc-500 text-xs max-w-[200px]">Click here to create your first prompt and get started.</p>
          </Link>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="overflow-hidden rounded-2xl border border-[#C7DFEA] bg-[#f3f7fb] shadow-sm"
        >
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-[#d6e4ed]">
              <thead className="bg-[#e6eef5]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#115a88] uppercase tracking-wide">Prompt</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#115a88] uppercase tracking-wide">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#115a88] uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#115a88] uppercase tracking-wide">Visibility</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#115a88] uppercase tracking-wide">Copies</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#115a88] uppercase tracking-wide">Created</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[#115a88] uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d6e4ed] bg-white">
                <AnimatePresence initial={false}>
                  {prompts.map((p, i) => {
                    const id = p._id?.$oid || p._id;
                    const createdAt = p.createdAt?.$date || p.createdAt;
                    const isBusy = busyId === id;
                    return (
                      <motion.tr
                        key={id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 12, transition: { duration: 0.2 } }}
                        transition={{ duration: 0.3, delay: i * 0.04 }}
                        className={`${i % 2 === 0 ? "bg-white" : "bg-[#f8fafc]"} hover:bg-[#eef4f8] transition-colors ${isBusy ? "opacity-50 pointer-events-none" : ""}`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3 max-w-xs">
                            <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-zinc-100 shrink-0">
                              {p.thumbnailImage && (
                                <Image src={p.thumbnailImage} alt={p.title} fill className="object-cover" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-zinc-900 truncate">{p.title}</p>
                              <p className="text-xs text-zinc-400 truncate">{p.aiTool}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-zinc-600">{p.category}</td>
                        <td className="px-4 py-3">
                          <Badge className={statusStyles[p.status] || statusStyles.pending}>{p.status}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={visibilityStyles[p.visibility] || visibilityStyles.private}>{p.visibility}</Badge>
                        </td>
                        <td className="px-4 py-3 text-sm text-zinc-600">{p.copyCount ?? 0}</td>
                        <td className="px-4 py-3 text-sm text-zinc-500">
                          {createdAt ? new Date(createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1.5">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.92 }}
                              onClick={() => setEditingPrompt(p)}
                              className="p-2 rounded-lg text-zinc-500 hover:bg-[#e6f4fb] hover:text-[#0a6c9b] transition-colors"
                              title="Edit"
                            >
                              <Pencil width={16} height={16} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.92 }}
                              onClick={() => setDeleteTarget(p)}
                              className="p-2 rounded-lg text-zinc-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                              title="Delete"
                            >
                              <TrashBin width={16} height={16} />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-[#d6e4ed]">
            {prompts.map((p, idx) => {
              const id = p._id?.$oid || p._id;
              const createdAt = p.createdAt?.$date || p.createdAt;
              const isBusy = busyId === id;
              return (
                <div
                  key={id}
                  className={`p-4 ${idx % 2 === 0 ? "bg-white" : "bg-[#f8fafc]"} ${isBusy ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-zinc-100 shrink-0">
                      {p.thumbnailImage && (
                        <Image src={p.thumbnailImage} alt={p.title} fill className="object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-900 truncate">{p.title}</p>
                      <p className="text-xs text-zinc-400">{p.aiTool}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge className={statusStyles[p.status] || statusStyles.pending}>{p.status}</Badge>
                        <Badge className={visibilityStyles[p.visibility] || visibilityStyles.private}>{p.visibility}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                    <div>
                      <span className="text-xs text-zinc-400">Category</span>
                      <p className="text-zinc-600">{p.category}</p>
                    </div>
                    <div>
                      <span className="text-xs text-zinc-400">Copies</span>
                      <p className="text-zinc-600">{p.copyCount ?? 0}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-xs text-zinc-400">Created</span>
                      <p className="text-zinc-500">
                        {createdAt ? new Date(createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-[#d6e4ed]">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => setEditingPrompt(p)}
                      className="p-2 rounded-lg text-zinc-500 hover:bg-[#e6f4fb] hover:text-[#0a6c9b] transition-colors"
                      title="Edit"
                    >
                      <Pencil width={16} height={16} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => setDeleteTarget(p)}
                      className="p-2 rounded-lg text-zinc-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <TrashBin width={16} height={16} />
                    </motion.button>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Delete modal */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setDeleteTarget(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 8 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
            >
              <h3 className="text-base font-semibold text-zinc-900">Delete prompt?</h3>
              <p className="mt-1.5 text-sm text-zinc-500">
                "{deleteTarget.title}" will be permanently removed. This can't be undone.
              </p>
              <div className="mt-5 flex justify-end gap-2">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setDeleteTarget(null)}
                  className="px-4 py-2 text-sm font-medium text-zinc-600 rounded-lg hover:bg-zinc-100 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit modal */}
      <AnimatePresence>
        {editingPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setEditingPrompt(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl bg-white shadow-xl max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#d6e4ed] bg-gradient-to-r from-[#115a88] to-[#0a9fd4] sticky top-0 rounded-t-2xl">
                <h3 className="text-base font-semibold text-white">Edit prompt</h3>
                <motion.button
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setEditingPrompt(null)}
                  className="p-1.5 rounded-lg text-white/80 hover:bg-white/15 hover:text-white transition-colors"
                >
                  <Xmark width={18} height={18} />
                </motion.button>
              </div>
              <EditPromptForm
                prompt={editingPrompt}
                onCancel={() => setEditingPrompt(null)}
                onSubmit={handleUpdateSubmit}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EditPromptForm({ prompt, onCancel, onSubmit }) {
  const [form, setForm] = useState({
    title: prompt.title || "",
    description: prompt.description || "",
    content: prompt.content || "",
    category: prompt.category || CATEGORIES[0],
    aiTool: prompt.aiTool || AI_TOOLS[0],
    difficulty: prompt.difficulty || "Beginner",
    visibility: prompt.visibility || "public",
    tags: Array.isArray(prompt.tags) ? prompt.tags.join(", ") : "",
  });
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const finalData = {
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()).filter((t) => t !== ""),
      };
      await onSubmit(finalData);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full rounded-lg border border-[#bcdcec] bg-[#f3f9fc] px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition-all focus:outline-none focus:ring-4 focus:ring-[#0a9fd4]/15 focus:border-[#0a9fd4] focus:bg-white";
  const selectWrapClass = "relative";
  const selectClass = inputClass + " appearance-none cursor-pointer pr-9";
  const labelClass = "block text-[13px] font-semibold text-[#0a6c9b] mb-1.5";

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.08 }}
      onSubmit={handleSubmit}
      className="px-6 py-6 space-y-5 bg-gradient-to-b from-[#f3f9fc] to-white"
    >
      <div className="flex gap-4 items-start">
        {prompt.thumbnailImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.12 }}
            className="relative h-16 w-16 rounded-xl overflow-hidden bg-zinc-100 shrink-0 ring-2 ring-[#0a9fd4]/20"
          >
            <Image src={prompt.thumbnailImage} alt={form.title} fill className="object-cover" />
          </motion.div>
        )}
        <div className="flex-1">
          <label className={labelClass}>Title</label>
          <input value={form.title} onChange={update("title")} placeholder="e.g. SEO blog generator" className={inputClass} maxLength={80} />
          <p className="mt-1 text-[11px] text-zinc-400 text-right">{form.title.length}/80</p>
        </div>
      </div>

      <div>
        <label className={labelClass}>Tags</label>
        <input value={form.tags} onChange={update("tags")} placeholder="e.g. resume, career, ats, job" className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea value={form.description} onChange={update("description")} rows={2} placeholder="Short summary of what this prompt does" className={`${inputClass} resize-none`} maxLength={160} />
        <p className="mt-1 text-[11px] text-zinc-400 text-right">{form.description.length}/160</p>
      </div>

      <div>
        <label className={labelClass}>Prompt content</label>
        <textarea value={form.content} onChange={update("content")} rows={5} placeholder="Write the full prompt..." className={`${inputClass} font-mono text-[13px] leading-relaxed resize-none`} />
      </div>

      <div className="h-px bg-[#d6ebf4]" />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Category</label>
          <div className={selectWrapClass}>
            <select value={form.category} onChange={update("category")} className={selectClass}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown width={16} height={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0a9fd4] pointer-events-none" />
          </div>
        </div>
        <div>
          <label className={labelClass}>AI Tool</label>
          <div className={selectWrapClass}>
            <select value={form.aiTool} onChange={update("aiTool")} className={selectClass}>
              {AI_TOOLS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <ChevronDown width={16} height={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0a9fd4] pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Difficulty</label>
          <div className={selectWrapClass}>
            <select value={form.difficulty} onChange={update("difficulty")} className={selectClass}>
              {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <ChevronDown width={16} height={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0a9fd4] pointer-events-none" />
          </div>
        </div>
        <div>
          <label className={labelClass}>Visibility</label>
          <div className={selectWrapClass}>
            <select value={form.visibility} onChange={update("visibility")} className={selectClass}>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
            <ChevronDown width={16} height={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0a9fd4] pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-3 border-t border-[#d6ebf4]">
        <motion.button
          whileTap={{ scale: 0.96 }}
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="px-4 py-2.5 text-sm font-medium text-zinc-600 rounded-lg hover:bg-zinc-100 transition-colors disabled:opacity-50"
        >
          Cancel
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={submitting}
          className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#115a88] to-[#0a9fd4] rounded-lg hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm shadow-[#0a9fd4]/30"
        >
          {submitting && (
            <span className="h-3.5 w-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          )}
          {submitting ? "Saving..." : "Save changes"}
        </motion.button>
      </div>
    </motion.form>
  );
}