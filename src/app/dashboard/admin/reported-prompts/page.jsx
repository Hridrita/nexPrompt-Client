"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Link from 'next/link';
import {
  AlertTriangle,
  Flag,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader2,
  RefreshCw,
  Mail,
  User,
  Calendar,
  Eye,
  XCircle,
  MessageSquare,
  Shield,
  BarChart3,
} from "lucide-react";
import {
  getAllReports,
  removePromptAndReports,
  warnCreator,
  dismissReport,
  getReportStats,
} from "@/lib/api/reports";

const STAT_CONFIG = [
  { key: "totalReports", label: "Total Reports", icon: Flag, color: "blue" },
  { key: "pendingReports", label: "Pending", icon: AlertTriangle, color: "orange" },
  { key: "dismissedReports", label: "Dismissed", icon: CheckCircle, color: "green" },
  { key: "uniquePrompts", label: "Reported Prompts", icon: AlertCircle, color: "red" },
];

const REASON_COLORS = {
  "Inappropriate Content": "bg-red-100 text-red-700 border-red-200",
  "Spam": "bg-orange-100 text-orange-700 border-orange-200",
  "Copyright": "bg-purple-100 text-purple-700 border-purple-200",
  "Misleading": "bg-yellow-100 text-yellow-700 border-yellow-200",
  "Other": "bg-gray-100 text-gray-700 border-gray-200",
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const cardItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

const ReportedPromptsPage = () => {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [warningModal, setWarningModal] = useState(null);
  const [warningMessage, setWarningMessage] = useState("");
  const [removeModal, setRemoveModal] = useState(null); // ✅ New state for remove confirmation

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reportsData, statsData] = await Promise.all([
        getAllReports(),
        getReportStats(),
      ]);
      setReports(reportsData || []);
      setStats(statsData || null);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
    toast.success("Reports refreshed!");
  };

  // ✅ Remove Prompt - Custom Modal ব্যবহার করব, confirm() নয়
  const handleRemovePrompt = async () => {
    if (!removeModal) return;

    const { promptId, promptTitle } = removeModal;
    setProcessingId(promptId);
    try {
      const result = await removePromptAndReports(promptId);
      toast.success(result.message || `✅ "${promptTitle}" removed successfully`);
      setRemoveModal(null);
      await fetchData();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to remove prompt");
    } finally {
      setProcessingId(null);
    }
  };

  const handleWarnCreator = async (promptId) => {
    if (!warningMessage.trim()) {
      toast.error("Please provide a warning message");
      return;
    }

    setProcessingId(promptId);
    try {
      const result = await warnCreator(promptId, warningMessage);
      toast.success(result.message || "⚠️ Warning sent to creator");
      setWarningModal(null);
      setWarningMessage("");
      await fetchData();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to send warning");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDismissReport = async (reportId) => {
    setProcessingId(reportId);
    try {
      const result = await dismissReport(reportId);
      toast.success(result.message || "✅ Report dismissed");
      await fetchData();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to dismiss report");
    } finally {
      setProcessingId(null);
    }
  };

  const getFilteredReports = () => {
    if (filter === "all") return reports;
    if (filter === "pending") return reports.filter(r => r.status !== "dismissed");
    if (filter === "dismissed") return reports.filter(r => r.status === "dismissed");
    return reports;
  };

  const getStatusBadge = (status) => {
    if (status === "dismissed") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
          <CheckCircle className="w-3 h-3" />
          Dismissed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200">
        <AlertTriangle className="w-3 h-3" />
        Pending
      </span>
    );
  };

  const getReasonBadge = (reason) => {
    const colorClass = REASON_COLORS[reason] || REASON_COLORS["Other"];
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${colorClass}`}>
        {reason || "Other"}
      </span>
    );
  };

  const FilterButton = ({ label, value }) => (
    <button
      onClick={() => setFilter(value)}
      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
        filter === value
          ? "bg-[#115a88] text-white"
          : "bg-white text-gray-600 border border-gray-200 hover:border-[#115a88]"
      }`}
    >
      {label}
    </button>
  );

  const filteredReports = getFilteredReports();

  if (loading && reports.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#115a88]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#115a88]">Reported Prompts</h1>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#115a88] bg-white border border-[#C7DFEA] rounded-xl hover:bg-[#f0f7fa] transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
        >
          {STAT_CONFIG.map(({ key, label, icon: Icon, color }) => {
            const value = stats[key] || 0;
            const colorClasses = {
              blue: "bg-blue-50 text-blue-600",
              orange: "bg-orange-50 text-orange-600",
              green: "bg-green-50 text-green-600",
              red: "bg-red-50 text-red-600",
            };
            return (
              <motion.div
                key={key}
                variants={cardItem}
                whileHover={{ y: -3, boxShadow: "0 12px 24px -10px rgba(17,90,136,0.2)" }}
                className="relative overflow-hidden bg-white rounded-2xl border border-[#C7DFEA] p-4 cursor-default"
              >
                <div className="absolute -right-5 -top-5 w-20 h-20 rounded-full bg-[#C7DFEA] opacity-40" />
                <div className="relative flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-xs text-[#5a8aa6] font-medium truncate">{label}</span>
                    <span className="text-2xl font-bold text-[#0a3d5c]">{value}</span>
                  </div>
                  <div className={`relative w-10 h-10 rounded-xl ${colorClasses[color]} flex items-center justify-center shadow-sm flex-shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Reason Stats */}
      {stats?.reasons && stats.reasons.length > 0 && (
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-xs text-gray-400 font-medium mr-2">Reports by reason:</span>
          {stats.reasons.map((item) => (
            <span
              key={item.reason}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200"
            >
              {item.reason || "Other"} ({item.count})
            </span>
          ))}
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="text-xs text-gray-400 font-medium mr-2">Filter:</span>
        <FilterButton label="All" value="all" />
        <FilterButton label="Pending" value="pending" />
        <FilterButton label="Dismissed" value="dismissed" />
      </div>

      {/* Reports Table */}
      {filteredReports.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
            <Flag className="w-6 h-6 text-gray-300" />
          </div>
          <p className="text-gray-400 text-sm">No reports found</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-[#f8fafc]">
                  {["Prompt", "Reported By", "Reason", "Status", "Created", "Actions"].map((h) => (
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
                <AnimatePresence mode="popLayout">
                  {filteredReports.map((report, idx) => {
                    const isProcessing = processingId === report._id || processingId === report.promptId;
                    const prompt = report.prompt || {};
                    const creator = report.creator || {};

                    return (
                      <motion.tr
                        key={report._id}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20, scale: 0.9 }}
                        transition={{ duration: 0.2, delay: idx * 0.02 }}
                        layout
                        className={`border-b border-gray-50 hover:bg-[#f8fafd] transition-colors ${
                          idx % 2 === 0 ? "bg-white" : "bg-[#fafbfc]"
                        } ${isProcessing ? "opacity-50 pointer-events-none" : ""}`}
                      >
                        {/* Prompt */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {prompt?.thumbnail && (
                              <img
                                src={prompt.thumbnail}
                                alt={prompt.title}
                                className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                              />
                            )}
                            <div>
                              <p className="text-sm font-semibold text-gray-800 truncate max-w-[200px]">
                                {prompt?.title || "Unknown Prompt"}
                              </p>
                              <p className="text-xs text-gray-400 truncate max-w-[200px]">
                                {prompt?.description || "No description"}
                              </p>
                              {creator && (
                                <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                  <User className="w-3 h-3" />
                                  {creator.name || creator.email || "Unknown Creator"}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Reported By */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                              {report.email?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                            <div>
                              <p className="text-sm text-gray-700">{report.email || "Anonymous"}</p>
                              {report.description && (
                                <p className="text-xs text-gray-400 truncate max-w-[150px]">
                                  "{report.description}"
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Reason */}
                        <td className="px-5 py-4">
                          {getReasonBadge(report.reason)}
                          {report.description && (
                            <p className="text-xs text-gray-400 mt-1 max-w-[150px] truncate">
                              {report.description}
                            </p>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          {getStatusBadge(report.status)}
                        </td>

                        {/* Created */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3 h-3 text-gray-300" />
                            <span className="text-xs text-gray-400">
                              {new Date(report.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 text-right">
                          {report.status !== "dismissed" ? (
                            <div className="flex items-center justify-end gap-2">
                              {/* View Prompt */}
                              {prompt?._id && (
                                <Link
                                  href={`/all-prompt/${prompt._id}`}
                                  rel="noopener noreferrer"
                                  className="p-1.5 text-blue-500 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                  title="View Prompt"
                                >
                                  <Eye className="w-4 h-4" />
                                </Link>
                              )}

                              {/* Remove Prompt - Modal খুলবে */}
                              <button
                                onClick={() => {
                                  setRemoveModal({
                                    promptId: report.promptId,
                                    promptTitle: prompt?.title || "Unknown Prompt",
                                  });
                                }}
                                disabled={isProcessing}
                                className="p-1.5 text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                                title="Remove Prompt"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>

                              {/* Warn Creator */}
                              <button
                                onClick={() => {
                                  setWarningModal({
                                    promptId: report.promptId,
                                    promptTitle: prompt?.title || "Unknown",
                                    creatorName: creator?.name || "Creator",
                                  });
                                }}
                                disabled={isProcessing}
                                className="p-1.5 text-orange-500 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors disabled:opacity-50"
                                title="Warn Creator"
                              >
                                <MessageSquare className="w-4 h-4" />
                              </button>

                              {/* Dismiss */}
                              <button
                                onClick={() => handleDismissReport(report._id)}
                                disabled={isProcessing}
                                className="p-1.5 text-green-500 bg-green-50 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                                title="Dismiss Report"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">Resolved</span>
                          )}
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 bg-[#f8fafc] border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Showing <span className="font-semibold text-gray-600">{filteredReports.length}</span> report{filteredReports.length !== 1 ? "s" : ""}
            </p>
            <p className="text-xs text-gray-400">
              Last updated: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      )}

      {/* ✅ Remove Confirmation Modal - Toast Style */}
      <AnimatePresence>
        {removeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setRemoveModal(null)}
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
                  <h3 className="text-base font-semibold text-gray-900">Remove Prompt?</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Are you sure you want to remove "<strong>{removeModal.promptTitle}</strong>"?
                  </p>
                  <p className="text-xs text-red-500 mt-2 bg-red-50 px-3 py-2 rounded-lg border border-red-100">
                    ⚠️ This will permanently delete the prompt and all its reports. This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setRemoveModal(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRemovePrompt}
                  disabled={processingId === removeModal.promptId}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {processingId === removeModal.promptId && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  Yes, Remove
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Warning Modal */}
      <AnimatePresence>
        {warningModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => {
              setWarningModal(null);
              setWarningMessage("");
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
                <div className="p-2 bg-orange-50 rounded-full">
                  <MessageSquare className="w-6 h-6 text-orange-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900">Warn Creator</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Send a warning to <strong>{warningModal.creatorName}</strong> about their prompt "<strong>{warningModal.promptTitle}</strong>"
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Warning Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={warningMessage}
                  onChange={(e) => setWarningMessage(e.target.value)}
                  placeholder="Explain why this prompt is problematic and what they need to change..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all text-sm resize-none"
                  autoFocus
                />
                <p className="text-xs text-gray-400 mt-1">
                  This message will be sent to the creator as a notification.
                </p>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setWarningModal(null);
                    setWarningMessage("");
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleWarnCreator(warningModal.promptId)}
                  disabled={!warningMessage.trim() || processingId === warningModal.promptId}
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {processingId === warningModal.promptId && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  Send Warning
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReportedPromptsPage;