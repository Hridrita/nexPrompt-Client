"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  CreditCard,
  DollarSign,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Mail,
  RefreshCw,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import {
  getAllSubscriptions,
  getSubscriptionStats,
} from "@/lib/api/subscriptions";

const STAT_CONFIG = [
  {
    key: "totalSubscriptions",
    label: "Total Subscriptions",
    icon: CreditCard,
    color: "blue",
  },
  {
    key: "activeSubscriptions",
    label: "Active",
    icon: CheckCircle,
    color: "green",
  },
  {
    key: "cancelledSubscriptions",
    label: "Cancelled",
    icon: XCircle,
    color: "red",
  },
  {
    key: "expiredSubscriptions",
    label: "Expired",
    icon: Clock,
    color: "orange",
  },
  { key: "premiumUsers", label: "Premium Users", icon: Users, color: "purple" },
  {
    key: "recentSubscriptions",
    label: "Last 30 Days",
    icon: TrendingUp,
    color: "teal",
  },
];

const STATUS_STYLES = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  expired: "bg-orange-50 text-orange-700 border-orange-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
};

const STATUS_ICONS = {
  active: <CheckCircle className="w-3 h-3" />,
  cancelled: <XCircle className="w-3 h-3" />,
  expired: <Clock className="w-3 h-3" />,
  pending: <AlertCircle className="w-3 h-3" />,
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const cardItem = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

const AllPaymentsPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [filter, setFilter] = useState("all");

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    try {
      const [subsData, statsData] = await Promise.all([
        getAllSubscriptions(),
        getSubscriptionStats(),
      ]);
      setSubscriptions(subsData || []);
      setStats(statsData || null);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      toast.error("Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  useEffect(() => {
    const interval = setInterval(fetchSubscriptions, 6000);
    return () => clearInterval(interval);
  }, [fetchSubscriptions]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchSubscriptions();
    setIsRefreshing(false);
    toast.success("Payments refreshed!");
  };

  const getFilteredSubscriptions = () => {
    if (filter === "all") return subscriptions;
    return subscriptions.filter((sub) => sub.status === filter);
  };

  const getStatusBadge = (status) => {
    const statusKey = status?.toLowerCase() || "pending";
    const style = STATUS_STYLES[statusKey] || STATUS_STYLES.pending;
    const icon = STATUS_ICONS[statusKey] || STATUS_ICONS.pending;
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${style}`}
      >
        {icon}
        <span className="capitalize">{statusKey}</span>
      </span>
    );
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const FilterButton = ({ label, value }) => (
    <button
      onClick={() => setFilter(value)}
      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
        filter === value
          ? "bg-[#115a88] text-white"
          : "bg-white text-gray-600 border border-[#C7DFEA] hover:border-[#115a88]"
      }`}
    >
      {label}
    </button>
  );

  const filteredSubscriptions = getFilteredSubscriptions();

  if (loading && subscriptions.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#115a88]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#115a88]">All Payments</h1>
          <p className="text-sm text-gray-400 mt-0.5 hidden sm:block">Manage all subscription payments</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#115a88] bg-white border border-[#C7DFEA] rounded-xl hover:bg-[#f0f7fa] transition-all disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6"
        >
          {STAT_CONFIG.map(({ key, label, icon: Icon }) => {
            const value = stats[key] || 0;
            return (
              <motion.div
                key={key}
                variants={cardItem}
                whileHover={{
                  y: -4,
                  boxShadow: "0 12px 24px -10px rgba(17,90,136,0.25)",
                }}
                className="relative overflow-hidden bg-white rounded-2xl border border-[#C7DFEA] p-4 cursor-default"
              >
                <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-[#C7DFEA] opacity-40" />

                <div className="relative flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-xs text-[#5a8aa6] font-medium truncate">
                      {label}
                    </span>
                    <span className="text-xl font-semibold text-[#0a3d5c]">
                      {value}
                    </span>
                  </div>
                  <div className="relative w-10 h-10 rounded-xl bg-[#115a88] flex items-center justify-center shadow-sm flex-shrink-0">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-400 font-medium">Filter:</span>
          <FilterButton label="All" value="all" />
          <FilterButton label="Active" value="active" />
          <FilterButton label="Cancelled" value="cancelled" />
          <FilterButton label="Expired" value="expired" />
        </div>
        <span className="text-xs text-gray-400 hidden sm:block">
          {filteredSubscriptions.length} subscriptions
        </span>
      </div>

      {/* Subscriptions Table - Desktop */}
      {filteredSubscriptions.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#C7DFEA] shadow-sm">
          <p className="text-gray-400 text-sm">No subscriptions found</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-[#C7DFEA] shadow-sm overflow-hidden bg-[#f3f7fb]">
          
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-[#d6e4ed] bg-[#e6eef5]">
                  {[
                    "User",
                    "Plan",
                    "Status",
                    "Amount",
                    "Subscribed At",
                    "Stripe ID",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className={`px-5 py-3.5 text-xs font-semibold text-[#115a88] uppercase tracking-wider ${
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
                  {filteredSubscriptions.map((sub, idx) => {
                    const isProcessing = processingId === sub._id;
                    const user = sub.user || {};

                    return (
                      <motion.tr
                        key={sub._id}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20, scale: 0.9 }}
                        transition={{ duration: 0.2, delay: idx * 0.02 }}
                        layout
                        className={`border-b border-[#d6e4ed] hover:bg-[#eef4f8] transition-colors ${
                          idx % 2 === 0 ? "bg-white" : "bg-[#f8fafc]"
                        } ${isProcessing ? "opacity-50 pointer-events-none" : ""}`}
                      >
                        {/* User */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#115a88] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                              {(
                                user.name?.charAt(0) ||
                                user.email?.charAt(0) ||
                                "U"
                              ).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-800 truncate">
                                {user.name || "Unknown"}
                              </p>
                              <p className="text-xs text-gray-400 flex items-center gap-1 truncate max-w-[180px]">
                                <Mail className="w-3 h-3 flex-shrink-0" />
                                {sub.email || user.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Plan */}
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-200">
                            <DollarSign className="w-3 h-3" />
                            {sub.plan || "Premium"}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          {getStatusBadge(sub.status)}
                        </td>

                        {/* Amount */}
                        <td className="px-5 py-4">
                          <span className="text-sm font-semibold text-gray-700">
                            ${sub.amount || "5.00"}
                          </span>
                        </td>

                        {/* Subscribed At */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3 h-3 text-gray-300" />
                            <span className="text-xs text-gray-500">
                              {formatDate(sub.subscribedAt)}
                            </span>
                          </div>
                        </td>

                        {/* Stripe ID */}
                        <td className="px-5 py-4">
                          <span className="text-xs text-gray-400 font-mono">
                            {sub.stripeSessionId ? (
                              <span className="truncate max-w-[120px] inline-block">
                                {sub.stripeSessionId.slice(0, 12)}...
                              </span>
                            ) : (
                              "N/A"
                            )}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {sub.status !== "cancelled" &&
                              sub.status !== "expired" && (
                                <button
                                  onClick={async () => {
                                    if (
                                      window.confirm(
                                        `Cancel subscription for ${sub.email}?`,
                                      )
                                    ) {
                                      setProcessingId(sub._id);
                                      try {
                                        // Add API call to cancel subscription
                                        toast.success("Subscription cancelled");
                                        await fetchSubscriptions();
                                      } catch (error) {
                                        toast.error("Failed to cancel");
                                      } finally {
                                        setProcessingId(null);
                                      }
                                    }
                                  }}
                                  className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                >
                                  Cancel
                                </button>
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

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-[#d6e4ed]">
            {filteredSubscriptions.map((sub, idx) => {
              const isProcessing = processingId === sub._id;
              const user = sub.user || {};

              return (
                <div
                  key={sub._id}
                  className={`p-4 ${idx % 2 === 0 ? "bg-white" : "bg-[#f8fafc]"} ${isProcessing ? "opacity-50 pointer-events-none" : ""}`}
                >
                  {/* User Info */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#115a88] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                      {(
                        user.name?.charAt(0) ||
                        user.email?.charAt(0) ||
                        "U"
                      ).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {user.name || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-400 truncate flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {sub.email || user.email}
                      </p>
                    </div>
                    {getStatusBadge(sub.status)}
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-xs text-gray-400">Plan</span>
                      <p className="font-semibold text-gray-700 flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-amber-500" />
                        {sub.plan || "Premium"}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400">Amount</span>
                      <p className="font-semibold text-gray-700">
                        ${sub.amount || "5.00"}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-xs text-gray-400">Subscribed At</span>
                      <p className="text-gray-600 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gray-300" />
                        {formatDate(sub.subscribedAt)}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-xs text-gray-400">Stripe ID</span>
                      <p className="text-xs text-gray-400 font-mono truncate">
                        {sub.stripeSessionId ? (
                          sub.stripeSessionId.slice(0, 16) + "..."
                        ) : (
                          "N/A"
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-[#d6e4ed]">
                    {sub.status !== "cancelled" &&
                      sub.status !== "expired" && (
                        <button
                          onClick={async () => {
                            if (
                              window.confirm(
                                `Cancel subscription for ${sub.email}?`,
                              )
                            ) {
                              setProcessingId(sub._id);
                              try {
                                toast.success("Subscription cancelled");
                                await fetchSubscriptions();
                              } catch (error) {
                                toast.error("Failed to cancel");
                              } finally {
                                setProcessingId(null);
                              }
                            }
                          }}
                          className="px-4 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 sm:px-5 py-3 bg-[#f8fafc] border-t border-[#d6e4ed] flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Showing{" "}
              <span className="font-semibold text-gray-600">
                {filteredSubscriptions.length}
              </span>{" "}
              subscription{filteredSubscriptions.length !== 1 ? "s" : ""}
            </p>
            <p className="text-xs text-gray-400">
              Last updated: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllPaymentsPage;