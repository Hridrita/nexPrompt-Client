"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Crown, TrendingUp, Sparkles, User, Award } from "lucide-react";
import { getTopCreators } from "@/lib/api/creators";
import toast from "react-hot-toast";

const headerVariant = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const listVariant = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const rowVariant = {
  hidden: { opacity: 0, x: -30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function TopCreators() {
  const router = useRouter();
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopCreators();
  }, []);

  const fetchTopCreators = async () => {
    setLoading(true);
    try {
      const data = await getTopCreators(4);
      if (data?.success) {
        setCreators(data.creators || []);
      } else {
        setCreators([]);
      }
    } catch (error) {
      console.error("Error fetching top creators:", error);
      toast.error("Failed to load top creators");
      setCreators([]);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (!num) return "0";
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const getRoleBadge = (role) => {
    if (role === "creator") {
      return (
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          Creator
        </span>
      );
    }
    return (
      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
        <User className="w-3 h-3" />
        User
      </span>
    );
  };

  if (loading) {
    return (
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="h-8 w-48 bg-gray-200 rounded-full mx-auto animate-pulse" />
            <div className="h-12 w-64 bg-gray-200 rounded-lg mx-auto mt-4 animate-pulse" />
            <div className="h-6 w-96 bg-gray-200 rounded-lg mx-auto mt-3 animate-pulse" />
          </div>
          <div className="flex flex-col gap-3 max-w-3xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-5 p-5 bg-white border-2 border-zinc-100 rounded-2xl animate-pulse"
              >
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="w-14 h-14 bg-gray-200 rounded-full" />
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-32" />
                  <div className="h-4 bg-gray-200 rounded w-24 mt-1" />
                </div>
                <div className="h-8 bg-gray-200 rounded-full w-24" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (creators.length === 0) {
    return (
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#066a9b]/20 bg-[#066a9b]/5 text-[#066a9b] text-xs font-semibold uppercase tracking-widest mb-5">
              <Crown className="w-3.5 h-3.5" />
              Leaderboard
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 mb-5">Top Prompt Creators</h2>
            <p className="text-zinc-500 max-w-2xl mx-auto text-lg">
              No creators found yet. Be the first to create prompts!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#066a9b]/6 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#0a9fd4]/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={headerVariant}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#066a9b]/20 bg-[#066a9b]/5 text-[#066a9b] text-xs font-semibold uppercase tracking-widest mb-5">
            <Crown className="w-3.5 h-3.5" />
            Leaderboard
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-zinc-900 mb-5">
            Top Prompt Creators
          </h2>
          <p className="text-zinc-500 max-w-2xl mx-auto text-lg">
            Meet the top contributors crafting the highest-quality prompts for our community.
          </p>
        </motion.div>

        {/* Creators List - শুধু Top 3 */}
        <motion.div
          className="flex flex-col gap-3 max-w-3xl mx-auto"
          variants={listVariant}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {creators.slice(0, 3).map((creator, index) => {
            const rank = index + 1;
            const initials = creator.name?.charAt(0)?.toUpperCase() || "C";

            return (
              <motion.div
                key={creator._id}
                variants={rowVariant}
                whileHover={{ x: 6, scale: 1.01 }}
                className={`flex items-center gap-5 p-5 bg-white border-2 rounded-2xl transition-all duration-500 cursor-pointer group ${
                  rank <= 3
                    ? "border-[#066a9b]/20 hover:border-[#066a9b]/50 hover:shadow-xl hover:shadow-[#066a9b]/10"
                    : "border-zinc-100 hover:border-[#066a9b]/30 hover:shadow-lg hover:shadow-[#066a9b]/5"
                }`}
                onClick={() => router.push(`/profile/${creator._id}`)}
              >
                {/* Rank - Top 3 এর জন্য Emoji */}
                <div className="flex items-center justify-center w-10 text-center">
                  {rank === 1 && <span className="text-2xl">🥇</span>}
                  {rank === 2 && <span className="text-2xl">🥈</span>}
                  {rank === 3 && <span className="text-2xl">🥉</span>}
                </div>

                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  {creator.image ? (
                    <img
                      src={creator.image}
                      alt={creator.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-[#066a9b]/20 group-hover:border-[#066a9b] transition-all duration-300"
                    />
                  ) : (
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg transition-all duration-300 ${
                        rank <= 3
                          ? "bg-gradient-to-br from-[#066a9b] to-[#0a9fd4] group-hover:scale-110"
                          : "bg-gradient-to-br from-gray-400 to-gray-500 group-hover:scale-105"
                      }`}
                    >
                      {initials}
                    </div>
                  )}

                  {/* Role Badge on Avatar */}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-200">
                    {creator.role === "creator" ? (
                      <Sparkles className="w-3 h-3 text-blue-500" />
                    ) : (
                      <User className="w-3 h-3 text-gray-400" />
                    )}
                  </div>

                  {/* Rank Badge for Top 1 */}
                  {rank === 1 && (
                    <div className="absolute -top-1 -right-1">
                      <span className="text-lg">👑</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-zinc-900 group-hover:text-[#066a9b] transition-colors truncate">
                      {creator.name}
                    </h4>
                    {/* Role Badge */}
                    {getRoleBadge(creator.role)}
                    {/* Premium Badge */}
                    {creator.plan === "premium" && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        Premium
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-500 truncate flex items-center gap-2">
                    <span>{creator.approvedCount || 0} approved prompts</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span>{creator.pendingCount || 0} pending</span>
                  </p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#066a9b]/10 rounded-full text-[#066a9b] text-xs font-semibold whitespace-nowrap">
                      <TrendingUp className="w-3 h-3" />
                      {formatNumber(creator.promptCount || creator.totalPrompts || 0)} prompts
                    </div>
                    {creator.totalCopies > 0 && (
                      <p className="text-xs text-gray-400 mt-1">
                        {formatNumber(creator.totalCopies)} copies
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

       
        {/* {creators.length > 3 && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button
              onClick={() => router.push("/creators")}
              className="px-8 py-3 border-2 border-[#066a9b]/30 text-[#066a9b] rounded-xl font-semibold hover:bg-[#066a9b] hover:text-white hover:border-[#066a9b] transition-all duration-300 group"
            >
              View All Creators{" "}
              <span className="inline-block group-hover:translate-x-1 transition-transform">
                →
              </span>
            </button>
          </motion.div>
        )} */}
      </div>
    </section>
  );
}