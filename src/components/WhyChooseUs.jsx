"use client";

import { motion } from "framer-motion";
import {
  FaRocket,
  FaUsers,
  FaShieldAlt,
  FaHeart,
  FaSync,
  FaMagic,
} from "react-icons/fa";
import { FiTarget, FiTrendingUp, FiAward } from "react-icons/fi";

const features = [
  {
    title: "Curated Quality",
    desc: "Every prompt is handpicked and reviewed by our expert community to ensure the highest quality.",
    icon: FiAward,
    color: "#066a9b",
  },
  {
    title: "AI-Powered Discovery",
    desc: "Find the perfect prompt with smart recommendations based on your needs and preferences.",
    icon: FaMagic,
    color: "#0a9fd4",
  },
  {
    title: "Active Community",
    desc: "Join thousands of creators sharing, remixing, and improving prompts together daily.",
    icon: FaUsers,
    color: "#066a9b",
  },
  {
    title: "Secure & Trusted",
    desc: "Your data and prompts are protected with enterprise-grade security and privacy.",
    icon: FaShieldAlt,
    color: "#0a9fd4",
  },
  {
    title: "Always Fresh",
    desc: "New prompts added daily, keeping you ahead with the latest AI trends and techniques.",
    icon: FaSync,
    color: "#066a9b",
  },
  {
    title: "Community Love",
    desc: "Built by creators, for creators. We're passionate about helping you succeed.",
    icon: FaHeart,
    color: "#0a9fd4",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function WhyChooseUs() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-white via-[#f8fafc] to-white">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#066a9b]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#0a9fd4]/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#066a9b]/[0.03] rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#066a9b]/20 bg-[#066a9b]/5 text-[#066a9b] text-xs font-semibold uppercase tracking-widest mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#066a9b] animate-pulse" />
            Why Choose NexPrompt
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-900 mb-5 leading-tight">
            Built for the{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-[#066a9b] to-[#0a9fd4] bg-clip-text text-transparent">
                AI Revolution
              </span>
              <svg
                className="absolute -bottom-1 left-0 w-full h-3 z-0"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 5 Q25 0 50 5 T100 5"
                  stroke="#0a9fd4"
                  strokeWidth="3"
                  fill="none"
                  opacity="0.3"
                />
              </svg>
            </span>
          </h2>

          <p className="text-lg text-zinc-500 max-w-2xl mx-auto">
            Everything you need to create, share, and discover amazing AI
            prompts
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.3, ease: "easeOut" },
                }}
                className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8 hover:shadow-xl transition-all duration-300"
              >
                {/* Hover Gradient */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(135deg, ${feature.color}08, transparent 70%)`,
                  }}
                />

                {/* Icon */}
                <div
                  className="relative w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${feature.color}20, ${feature.color}08)`,
                  }}
                >
                  <Icon
                    className="text-2xl transition-colors duration-300"
                    style={{ color: feature.color }}
                  />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#066a9b] transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {feature.desc}
                </p>

                {/* Decorative Line */}
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 group-hover:w-3/4 transition-all duration-500 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${feature.color}, transparent)`,
                  }}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-6 bg-white border border-gray-100 rounded-full px-6 py-3 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">500+</span> active
                users
              </span>
            </div>
            <div className="w-px h-6 bg-gray-200" />
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">1,000+</span>{" "}
                prompts
              </span>
            </div>
            <div className="w-px h-6 bg-gray-200" />
            <button className="text-sm font-semibold text-[#066a9b] hover:text-[#0a9fd4] transition-colors flex items-center gap-1">
              Join the community
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
