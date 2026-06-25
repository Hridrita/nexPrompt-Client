"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Link from "next/link";
import { 
  CheckCircle, XCircle, Clock, Eye, Loader2, 
  Star, StarOff, Trash2, MessageSquare, AlertTriangle
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const AdminAllPromptPage = () => {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [processingId, setProcessingId] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [deleteModal, setDeleteModal] = useState(null);

  useEffect(() => {
    fetchPrompts();
  }, [filter]);

  const fetchPrompts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/prompts?status=${filter}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setPrompts(data);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load prompts");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (promptId) => {
    setProcessingId(promptId);
    try {
      const res = await fetch(`${API_BASE}/api/admin/prompts/${promptId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Approval failed");
      }
      
      const data = await res.json();
      toast.success(data.message || "Prompt approved successfully!");
      updatePromptStatus(promptId, "approved");
      
      if (filter !== "all" && filter !== "approved") {
        setPrompts(prev => prev.filter(p => p._id !== promptId));
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to approve");
      await fetchPrompts();
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (promptId) => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    setProcessingId(promptId);
    try {
      const res = await fetch(`${API_BASE}/api/admin/prompts/${promptId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          status: "rejected", 
          rejectionReason: rejectionReason 
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Rejection failed");
      }
      
      const data = await res.json();
      toast.success(data.message || "Prompt rejected successfully");
      updatePromptStatus(promptId, "rejected", rejectionReason);
      
      if (filter !== "all" && filter !== "rejected") {
        setPrompts(prev => prev.filter(p => p._id !== promptId));
      }
      
      setRejectModal(null);
      setRejectionReason("");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to reject");
      await fetchPrompts();
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    
    const { promptId, promptTitle } = deleteModal;
    setProcessingId(promptId);
    
    try {
      const res = await fetch(`${API_BASE}/api/admin/prompts/${promptId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Delete failed");
      }
      
      toast.success(`"${promptTitle}" deleted successfully!`);
      setPrompts(prev => prev.filter(p => p._id !== promptId));
      setDeleteModal(null);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to delete");
      await fetchPrompts();
    } finally {
      setProcessingId(null);
    }
  };

  const handleFeature = async (promptId, currentFeatured) => {
    setProcessingId(promptId);
    try {
      const res = await fetch(`${API_BASE}/api/admin/prompts/${promptId}/feature`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !currentFeatured }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Feature update failed");
      }
      
      const data = await res.json();
      toast.success(data.message || (currentFeatured ? "⭐ Unfeatured" : "⭐ Featured"));
      
      setPrompts(prev => 
        prev.map(p => 
          p._id === promptId 
            ? { ...p, featured: !currentFeatured }
            : p
        )
      );
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to update feature status");
      await fetchPrompts();
    } finally {
      setProcessingId(null);
    }
  };

  const updatePromptStatus = (promptId, status, rejectionReason = "") => {
    setPrompts(prev => 
      prev.map(p => 
        p._id === promptId 
          ? { 
              ...p, 
              status: status,
              ...(status === "rejected" && { rejectionReason }),
              ...(status === "approved" && { approvedAt: new Date() }),
              ...(status === "rejected" && { rejectedAt: new Date() })
            }
          : p
      )
    );
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: {
        cls: "bg-amber-50 text-amber-600 border-amber-200 ring-1 ring-amber-100",
        icon: <Clock className="w-3 h-3" />,
      },
      approved: {
        cls: "bg-emerald-50 text-emerald-600 border-emerald-200 ring-1 ring-emerald-100",
        icon: <CheckCircle className="w-3 h-3" />,
      },
      rejected: {
        cls: "bg-red-50 text-red-500 border-red-200 ring-1 ring-red-100",
        icon: <XCircle className="w-3 h-3" />,
      },
    };
    const { cls, icon } = config[status];
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cls}`}>
        {icon}
        <span className="capitalize">{status}</span>
      </span>
    );
  };

  const FILTERS = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
  ];

  const COUNTS = {
    all: prompts.length,
    pending: prompts.filter(p => p.status === "pending").length,
    approved: prompts.filter(p => p.status === "approved").length,
    rejected: prompts.filter(p => p.status === "rejected").length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      
      {/* Header */}
      {/* <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#115a88]">All Prompts</h1>
        <p className="text-sm text-gray-400 mt-0.5">Review and manage submitted prompts</p>
      </div> */}

      {/* Filter Tabs */}
      <div className="flex gap-1 p-1 bg-[#115a88] rounded-xl w-fit mb-6">
        {FILTERS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              filter === value
                ? "bg-white text-[#115a88] shadow-sm"
                : "text-white hover:text-gray-700"
            }`}
          >
            {label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
              filter === value ? "bg-[#e6f4fb] text-[#115a88]" : "bg-gray-200 text-gray-500"
            }`}>
              {COUNTS[value]}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#115a88]" />
        </div>
      ) : prompts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-sm">No prompts found for this filter</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-[#f8fafc]">
                  {["Prompt", "Creator", "Status", "Featured", "Copies", "Submitted", "Actions"].map((h) => (
                    <th
                      key={h}
                      className={`px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider ${
                        h === "Actions" ? "text-right" : "text-left"
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {prompts.map((prompt, idx) => {
                    const isProcessing = processingId === prompt._id;
                    const isFeatured = prompt.featured || false;

                    return (
                      <motion.tr
                        key={prompt._id}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.18, delay: idx * 0.02 }}
                        className={`group border-b border-gray-50 hover:bg-[#f8fafd] transition-colors ${
                          idx % 2 === 0 ? "bg-white" : "bg-[#fafbfc]"
                        }`}
                      >
                        {/* Prompt Info */}
                        <td className="px-5 py-4 max-w-[260px]">
                          <div className="flex items-center gap-3">
                            {prompt.thumbnail ? (
                              <img
                                src={prompt.thumbnail}
                                alt={prompt.title}
                                className="h-9 w-9 rounded-lg object-cover flex-shrink-0 border border-gray-100"
                              />
                            ) : (
                              <div className="h-9 w-9 rounded-lg bg-[#e6f4fb] flex-shrink-0 flex items-center justify-center text-[#115a88] text-xs font-bold">
                                {prompt.title?.[0]?.toUpperCase()}
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-800 truncate">
                                {prompt.title}
                              </p>
                              <p className="text-xs text-gray-400 truncate mt-0.5">
                                {prompt.description}
                              </p>
                              {prompt.rejectionReason && prompt.status === "rejected" && (
                                <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                                  <MessageSquare className="w-3 h-3 flex-shrink-0" />
                                  <span className="truncate">{prompt.rejectionReason}</span>
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Creator */}
                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-gray-700">
                            {prompt.creator?.name || "Unknown"}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[140px]">
                            {prompt.creator?.email}
                          </p>
                          <span className={`mt-1 inline-block text-xs px-2 py-0.5 rounded-full font-medium ${
                            prompt.creator?.plan === "premium"
                              ? "bg-purple-50 text-purple-600 border border-purple-100"
                              : "bg-gray-100 text-gray-500"
                          }`}>
                            {prompt.creator?.plan || "free"}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          {getStatusBadge(prompt.status)}
                        </td>

                        {/* Featured */}
                        <td className="px-5 py-4">
                          <button
                            onClick={() => handleFeature(prompt._id, isFeatured)}
                            disabled={isProcessing || prompt.status !== "approved"}
                            title={isFeatured ? "Unfeature" : "Feature"}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                              isFeatured
                                ? "text-yellow-500 bg-yellow-50 hover:bg-yellow-100"
                                : "text-gray-300 hover:bg-gray-100 hover:text-gray-400"
                            } disabled:opacity-40 disabled:cursor-not-allowed`}
                          >
                            {isFeatured
                              ? <Star className="w-4 h-4 fill-yellow-400" />
                              : <StarOff className="w-4 h-4" />
                            }
                          </button>
                        </td>

                        {/* Copies */}
                        <td className="px-5 py-4">
                          <span className="text-sm font-semibold text-gray-600">
                            {prompt.copyCount || 0}
                          </span>
                        </td>

                        {/* Submitted */}
                        <td className="px-5 py-4">
                          <span className="text-xs text-gray-400">
                            {new Date(prompt.createdAt).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link href={`/all-prompt/${prompt._id}`}>
                              <button
                                className="w-8 h-8 flex items-center justify-center text-[#115a88] bg-[#e6f4fb] rounded-lg hover:bg-[#d0e9f5] transition-colors"
                                title="View"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </Link>

                            <button
                              onClick={() => setDeleteModal({ 
                                promptId: prompt._id, 
                                promptTitle: prompt.title 
                              })}
                              disabled={isProcessing}
                              className="w-8 h-8 flex items-center justify-center text-red-400 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-40"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            {prompt.status === "pending" && (
                              <>
                                <button
                                  onClick={() => handleApprove(prompt._id)}
                                  disabled={isProcessing}
                                  className="h-8 px-3 text-xs font-semibold text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-40 flex items-center gap-1"
                                >
                                  {isProcessing && processingId === prompt._id ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <CheckCircle className="w-3 h-3" />
                                  )}
                                  Approve
                                </button>
                                <button
                                  onClick={() => setRejectModal({ 
                                    promptId: prompt._id, 
                                    promptTitle: prompt.title 
                                  })}
                                  disabled={isProcessing}
                                  className="h-8 px-3 text-xs font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-40 flex items-center gap-1"
                                >
                                  <XCircle className="w-3 h-3" />
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Footer row count */}
          <div className="px-5 py-3 bg-[#f8fafc] border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Showing <span className="font-semibold text-gray-600">{prompts.length}</span> prompt{prompts.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setDeleteModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-50 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900">
                    Delete Prompt?
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Are you sure you want to delete "<strong>{deleteModal.promptTitle}</strong>"?
                  </p>
                  <p className="text-xs text-red-500 mt-4">
                    ⚠️ This action cannot be undone. The prompt will be permanently removed.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setDeleteModal(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={processingId === deleteModal.promptId}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {processingId === deleteModal.promptId && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reject Modal */}
      <AnimatePresence>
        {rejectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => {
              setRejectModal(null);
              setRejectionReason("");
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-50 rounded-full">
                  <XCircle className="w-6 h-6 text-red-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900">
                    Reject Prompt
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Provide feedback for "{rejectModal.promptTitle}"
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Why is this prompt being rejected? (e.g., inappropriate content, low quality, duplicates, etc.)"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all text-sm resize-none"
                  autoFocus
                />
                <p className="text-xs text-gray-400 mt-1">
                  This feedback will be sent to the creator.
                </p>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setRejectModal(null);
                    setRejectionReason("");
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReject(rejectModal.promptId)}
                  disabled={!rejectionReason.trim() || processingId === rejectModal.promptId}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {processingId === rejectModal.promptId && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  Reject & Send Feedback
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminAllPromptPage;
