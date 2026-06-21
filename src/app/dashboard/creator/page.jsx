"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Bookmark,
  Copy,
  FileText,
  ChartLineArrowUp,
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

// ---- demo data, swap with real API data ----
const copiesData = [
  { name: "Mon", copies: 12 },
  { name: "Tue", copies: 19 },
  { name: "Wed", copies: 14 },
  { name: "Thu", copies: 27 },
  { name: "Fri", copies: 22 },
  { name: "Sat", copies: 31 },
  { name: "Sun", copies: 28 },
];

const growthData = [
  { name: "Week 1", prompts: 4 },
  { name: "Week 2", prompts: 9 },
  { name: "Week 3", prompts: 15 },
  { name: "Week 4", prompts: 22 },
  { name: "Week 5", prompts: 30 },
  { name: "Week 6", prompts: 41 },
];

const summaryCards = [
  {
    title: "Total Prompts",
    value: "128",
    change: "+12.4%",
    icon: FileText,
  },
  {
    title: "Total Copies",
    value: "3,482",
    change: "+8.1%",
    icon: Copy,
  },
  {
    title: "Total Bookmarks",
    value: "942",
    change: "+5.6%",
    icon: Bookmark,
  },
];

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

export default function DashboardOverview() {
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
              className="relative overflow-hidden bg-white rounded-2xl border border-[#C7DFEA] p-5 cursor-default"
            >
              {/* soft accent blob */}
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
                    <ArrowUpRight className="w-3.5 h-3.5" />
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
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={copiesData}>
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
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={growthData}>
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
        </div>
      </motion.div>
    </div>
  );
}
