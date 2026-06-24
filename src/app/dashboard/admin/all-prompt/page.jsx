// app/dashboard/admin/all-prompt/page.jsx

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
      
      // Remove from list
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
    const styles = {
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
      rejected: "bg-red-50 text-red-700 border-red-200",
    };
    const icons = {
      pending: <Clock className="w-3 h-3" />,
      approved: <CheckCircle className="w-3 h-3" />,
      rejected: <XCircle className="w-3 h-3" />,
    };
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {icons[status]} {status}
      </span>
    );
  };

  const FilterButton = ({ label, value }) => (
    <button
      onClick={() => setFilter(value)}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        filter === value
          ? "bg-[#115a88] text-white"
          : "bg-white text-gray-600 border border-gray-200 hover:border-[#115a88]"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#115a88]">All Prompts</h1>
          <p className="text-sm text-gray-500 mt-1">Review and manage all submitted prompts</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <FilterButton label="All" value="all" />
          <FilterButton label="Pending" value="pending" />
          <FilterButton label="Approved" value="approved" />
          <FilterButton label="Rejected" value="rejected" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#115a88]"></div>
        </div>
      ) : prompts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-500">No prompts found</p>
        </div>
      ) : (
        <div className="bg-[#f3f7fb] rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prompt Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Creator
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Featured
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Copies
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <AnimatePresence>
                  {prompts.map((prompt) => {
                    const isProcessing = processingId === prompt._id;
                    const isFeatured = prompt.featured || false;
                    
                    return (
                      <motion.tr
                        key={prompt._id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {prompt.thumbnail && (
                              <img
                                src={prompt.thumbnail}
                                alt={prompt.title}
                                className="h-10 w-10 rounded-lg object-cover mr-3"
                              />
                            )}
                            <div>
                              <p className="text-sm font-medium text-gray-900">{prompt.title}</p>
                              <p className="text-xs text-gray-500 truncate max-w-xs">{prompt.description}</p>
                              {prompt.rejectionReason && prompt.status === "rejected" && (
                                <p className="text-xs text-red-500 mt-1">
                                  <MessageSquare className="w-3 h-3 inline mr-1" />
                                  {prompt.rejectionReason}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm text-gray-900">{prompt.creator?.name || "Unknown"}</p>
                            <p className="text-xs text-gray-500">{prompt.creator?.email}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              prompt.creator?.plan === "premium" 
                                ? "bg-purple-100 text-purple-700" 
                                : "bg-gray-100 text-gray-600"
                            }`}>
                              {prompt.creator?.plan || "free"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(prompt.status)}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleFeature(prompt._id, isFeatured)}
                            disabled={isProcessing || prompt.status !== "approved"}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isFeatured
                                ? "text-yellow-500 hover:bg-yellow-50"
                                : "text-gray-300 hover:bg-gray-100"
                            } ${(isProcessing || prompt.status !== "approved") && "opacity-50 cursor-not-allowed"}`}
                            title={isFeatured ? "Unfeature" : "Feature"}
                          >
                            {isFeatured ? <Star className="w-4 h-4 fill-yellow-500" /> : <StarOff className="w-4 h-4" />}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {prompt.copyCount || 0}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(prompt.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* View */}
                            <Link href={`/all-prompt/${prompt._id}`}>
                              <button
                                className="p-1.5 text-[#115a88] bg-[#e6f4fb] rounded-lg hover:bg-[#d6ebf4] transition-colors"
                                title="View"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </Link>

                            {/* Delete */}
                            <button
                              onClick={() => setDeleteModal({ 
                                promptId: prompt._id, 
                                promptTitle: prompt.title 
                              })}
                              disabled={isProcessing}
                              className="p-1.5 text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                            {prompt.status === "pending" && (
                              <>
                                <button
                                  onClick={() => handleApprove(prompt._id)}
                                  disabled={isProcessing}
                                  className="px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-1"
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
                                  className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-1"
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

      {/* Reject Modal with Feedback */}
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