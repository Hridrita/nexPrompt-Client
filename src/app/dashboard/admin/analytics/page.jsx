"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Users,
  FileText,
  Star,
  Copy,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Crown,
  User,
  Shield,
  Sparkles,
  RefreshCw,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { getAnalytics } from "@/lib/api/analytics";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const cardItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

const MAIN_STATS = [
  {
    key: "totalUsers",
    label: "Total Users",
    icon: Users,
    sub: (s) => `+${s.newUsersLast7Days || 0} this week`,
    subColor: "text-emerald-600 bg-emerald-50",
  },
  {
    key: "totalPrompts",
    label: "Total Prompts",
    icon: FileText,
    sub: (s) => `+${s.newPromptsLast7Days || 0} this week`,
    subColor: "text-emerald-600 bg-emerald-50",
  },
  {
    key: "totalReviews",
    label: "Total Reviews",
    icon: Star,
    sub: (s) => `⭐ ${s.averageRating || 0} avg rating`,
    subColor: "text-emerald-600 bg-emerald-50",
  },
  {
    key: "totalCopyCount",
    label: "Total Copies",
    icon: Copy,
    sub: (s) => `📌 ${s.totalBookmarkCount || 0} bookmarks`,
    subColor: "text-gray-500 bg-gray-50",
  },
];

const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => { fetchAnalytics(); }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const result = await getAnalytics();
      setData(result);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAnalytics();
    setIsRefreshing(false);
    toast.success("Analytics refreshed!");
  };

  if (loading && !data) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#115a88]" />
      </div>
    );
  }

  const stats = data || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#115a88]">Analytics Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">Overview of platform statistics and insights</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#115a88] bg-white border border-[#C7DFEA] rounded-xl hover:bg-[#f0f7fa] transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
          <span className="text-xs text-gray-400">
            Last updated: {stats.updatedAt ? new Date(stats.updatedAt).toLocaleTimeString() : "N/A"}
          </span>
        </div>
      </div>

      {/* 4 Main Stats Cards — DashboardOverview icon style */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        {MAIN_STATS.map(({ key, label, icon: Icon, sub, subColor }) => (
          <motion.div
            key={key}
            variants={cardItem}
            whileHover={{ y: -3, boxShadow: "0 12px 24px -10px rgba(17,90,136,0.2)" }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="relative overflow-hidden bg-white rounded-2xl border border-[#C7DFEA] p-5 cursor-default"
          >
            {/* accent blob */}
            <div className="absolute -right-5 -top-5 w-20 h-20 rounded-full bg-[#C7DFEA] opacity-40" />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-xs text-[#5a8aa6] font-medium">{label}</p>
                <p className="text-3xl font-bold text-[#0a3d5c] mt-1">{stats[key] || 0}</p>
                <div className="mt-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${subColor}`}>
                    {sub(stats)}
                  </span>
                </div>
              </div>
              {/* dark icon box — DashboardOverview style */}
              <div className="relative w-12 h-12 rounded-xl bg-[#115a88] flex items-center justify-center shadow-sm flex-shrink-0">
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Prompt Status */}
        <motion.div
          variants={cardItem}
          className="bg-white rounded-2xl border border-[#C7DFEA] p-5"
        >
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Prompt Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-gray-600">Approved</span>
              </div>
              <span className="text-sm font-semibold text-gray-800">{stats.approvedPrompts || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <span className="text-sm text-gray-600">Pending</span>
              </div>
              <span className="text-sm font-semibold text-gray-800">{stats.pendingPrompts || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-gray-600">Rejected</span>
              </div>
              <span className="text-sm font-semibold text-gray-800">{stats.rejectedPrompts || 0}</span>
            </div>
          </div>
        </motion.div>

        {/* User Roles */}
        <motion.div
          variants={cardItem}
          className="bg-white rounded-2xl border border-[#C7DFEA] p-5"
        >
          <h3 className="text-sm font-semibold text-gray-700 mb-4">User Roles</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-gray-600">Admins</span>
              </div>
              <span className="text-sm font-semibold text-gray-800">{stats.adminUsers || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-600">Creators</span>
              </div>
              <span className="text-sm font-semibold text-gray-800">{stats.creatorUsers || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Regular Users</span>
              </div>
              <span className="text-sm font-semibold text-gray-800">{stats.regularUsers || 0}</span>
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 pt-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-semibold text-gray-700">Premium</span>
              </div>
              <span className="text-sm font-semibold text-amber-600">{stats.premiumUsers || 0}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Platform Stats */}
      <motion.div
        variants={cardItem}
        className="bg-white rounded-2xl border border-[#C7DFEA] p-5 mb-6"
      >
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Platform Overview</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <p className="text-xs text-gray-400">Categories</p>
            <p className="text-lg font-bold text-[#0a3d5c]">{stats.totalCategories || 0}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">AI Tools</p>
            <p className="text-lg font-bold text-[#0a3d5c]">{stats.totalAITools || 0}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Active Users</p>
            <p className="text-lg font-bold text-[#0a3d5c]">{stats.totalActiveUsers || 0}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Total Bookmarks</p>
            <p className="text-lg font-bold text-[#0a3d5c]">{stats.totalBookmarkCount || 0}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Avg Rating</p>
            <p className="text-lg font-bold text-[#0a3d5c]">{stats.averageRating || 0} ⭐</p>
          </div>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        variants={cardItem}
        className="bg-white rounded-2xl border border-[#C7DFEA] p-5"
      >
        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          Recent Activity (Last 7 Days)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-blue-50/50 rounded-xl p-4 text-center">
            <Users className="w-5 h-5 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-[#0a3d5c]">{stats.newUsersLast7Days || 0}</p>
            <p className="text-xs text-gray-500">New Users</p>
          </div>
          <div className="bg-purple-50/50 rounded-xl p-4 text-center">
            <FileText className="w-5 h-5 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-[#0a3d5c]">{stats.newPromptsLast7Days || 0}</p>
            <p className="text-xs text-gray-500">New Prompts</p>
          </div>
          <div className="bg-yellow-50/50 rounded-xl p-4 text-center">
            <MessageSquare className="w-5 h-5 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-[#0a3d5c]">{stats.newReviewsLast7Days || 0}</p>
            <p className="text-xs text-gray-500">New Reviews</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsPage;