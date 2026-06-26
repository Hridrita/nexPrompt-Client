"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRightFromSquare,
  BookmarkFill,
  Copy,
  FileText,
  ChartLineArrowUp,
  CircleCheckFill,
  ClockFill,
  CircleXmark,
} from "@gravity-ui/icons";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { authClient } from "@/lib/auth-client";
import { getCreatorStats, getCreatorCharts } from "@/lib/api/creator";
import toast from "react-hot-toast";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const cardItem = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#C7DFEA] rounded-xl px-3 py-2 shadow-md">
        <p className="text-xs font-medium text-[#115a88]">{label}</p>
        <p className="text-sm font-semibold text-[#0a3d5c]">
          {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export default function CreatorDashboard() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPrompts: 0,
    totalCopies: 0,
    totalBookmarks: 0,
    approvedPrompts: 0,
    pendingPrompts: 0,
    rejectedPrompts: 0,
  });
  
  const [chartData, setChartData] = useState({
    copiesData: [],
    growthData: [],
  });

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData();
    }
  }, [user?.id]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch both stats and charts in parallel
      const [statsData, chartsData] = await Promise.all([
        getCreatorStats(user.id),
        getCreatorCharts(user.id),
      ]);

      if (statsData?.success) {
        setStats({
          totalPrompts: statsData.totalPrompts || 0,
          totalCopies: statsData.totalCopies || 0,
          totalBookmarks: statsData.totalBookmarks || 0,
          approvedPrompts: statsData.approvedPrompts || 0,
          pendingPrompts: statsData.pendingPrompts || 0,
          rejectedPrompts: statsData.rejectedPrompts || 0,
        });
      }

      if (chartsData?.success) {
        setChartData({
          copiesData: chartsData.copiesData || [],
          growthData: chartsData.growthData || [],
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Format number with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Calculate change percentage (mock for now)
  const getChange = (value) => {
    if (value === 0) return "+0%";
    // This is a mock calculation - you can implement real comparison
    return value > 50 ? "+12.4%" : value > 20 ? "+8.1%" : "+5.6%";
  };

  const summaryCards = [
    {
      title: "Total Prompts",
      value: formatNumber(stats.totalPrompts),
      change: getChange(stats.totalPrompts),
      icon: FileText,
    },
    {
      title: "Total Copies",
      value: formatNumber(stats.totalCopies),
      change: getChange(stats.totalCopies),
      icon: Copy,
    },
    {
      title: "Total Bookmarks",
      value: formatNumber(stats.totalBookmarks),
      change: getChange(stats.totalBookmarks),
      icon: BookmarkFill,
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#115a88]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Summary cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              variants={cardItem}
              whileHover={{ y: -4, boxShadow: "0 12px 24px -10px rgba(17,90,136,0.25)" }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="relative overflow-hidden bg-[#eef4f8] rounded-2xl border border-[#C7DFEA] p-5 cursor-default"
            >
              <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-[#C7DFEA] opacity-40" />

              <div className="relative flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-[#5a8aa6] font-medium">
                    {card.title}
                  </span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="text-2xl font-semibold text-[#0a3d5c]"
                  >
                    {card.value}
                  </motion.span>
                  <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                    <ArrowUpRightFromSquare className="w-3.5 h-3.5" />
                    {card.change} this month
                  </span>
                </div>

                <div className="relative w-11 h-11 rounded-xl bg-[#115a88] flex items-center justify-center shadow-sm">
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Prompt Status Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <motion.div
          variants={cardItem}
          className="bg-[#eef4f8] rounded-2xl border border-[#C7DFEA] p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CircleCheckFill className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Approved</p>
              <p className="text-xl font-bold text-gray-800">{stats.approvedPrompts}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={cardItem}
          className="bg-[#eef4f8] rounded-2xl border border-[#C7DFEA] p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <ClockFill className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Pending</p>
              <p className="text-xl font-bold text-gray-800">{stats.pendingPrompts}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={cardItem}
          className="bg-[#eef4f8] rounded-2xl border border-[#C7DFEA] p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <CircleXmark className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Rejected</p>
              <p className="text-xl font-bold text-gray-800">{stats.rejectedPrompts}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-5"
      >
        {/* Total Copies — Line chart */}
        <div className="bg-white rounded-2xl border border-[#C7DFEA] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-[#0a3d5c]">
                Total Copies
              </h3>
              <p className="text-xs text-[#5a8aa6]">Last 7 days</p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#C7DFEA] flex items-center justify-center">
              <Copy className="w-4 h-4 text-[#115a88]" />
            </div>
          </div>
          {chartData.copiesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData.copiesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e6f0f6" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "#5a8aa6" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#5a8aa6" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="copies"
                  stroke="#115a88"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#115a88", strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: "#0a3d5c" }}
                  isAnimationActive={true}
                  animationDuration={1200}
                  animationEasing="ease-out"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[220px] text-gray-400 text-sm">
              No copy data available
            </div>
          )}
        </div>

        {/* Prompt Growth — Area chart */}
        <div className="bg-white rounded-2xl border border-[#C7DFEA] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-[#0a3d5c]">
                Prompt Growth
              </h3>
              <p className="text-xs text-[#5a8aa6]">Last 6 weeks</p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#C7DFEA] flex items-center justify-center">
              <ChartLineArrowUp className="w-4 h-4 text-[#115a88]" />
            </div>
          </div>
          {chartData.growthData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData.growthData}>
                <defs>
                  <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#115a88" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#115a88" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e6f0f6" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "#5a8aa6" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#5a8aa6" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="prompts"
                  stroke="#115a88"
                  strokeWidth={3}
                  fill="url(#growthFill)"
                  isAnimationActive={true}
                  animationDuration={1400}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[220px] text-gray-400 text-sm">
              No growth data available
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}