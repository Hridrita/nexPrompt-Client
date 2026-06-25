"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Star,
  Eye,
  Copy,
  Bookmark,
  Sparkles,
  TrendingUp,
  Clock,
} from "lucide-react";
import { getFeaturedPrompts } from "@/lib/api/featured";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

const Featured = () => {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedPrompts();
  }, []);

  const fetchFeaturedPrompts = async () => {
    setLoading(true);
    try {
      const data = await getFeaturedPrompts();
      setPrompts(data || []);
    } catch (error) {
      console.error("Error fetching featured prompts:", error);
      toast.error("Failed to load featured prompts");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (promptId) => {
    if (!user) {
      toast.custom(
        (t) => (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xl max-w-sm mx-4"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-50 rounded-xl">
                <Sparkles className="w-6 h-6 text-amber-500" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 text-lg">
                  Login Required
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  Please login to view this prompt details
                </p>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => {
                      toast.dismiss(t.id);
                      router.push("/auth/sign-in");
                    }}
                    className="bg-[#066a9b] text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-[#0a9fd4] transition-colors"
                  >
                    Login Now
                  </button>
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    className="text-gray-500 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ),
        { duration: 5000 },
      );
      return;
    }
    router.push(`/all-prompt/${promptId}`);
  };

  const formatNumber = (num) => (!num ? "0" : num.toLocaleString());

  if (loading) {
    return (
      <section className="py-20 bg-[#066a9b]/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse"
              >
                <div className="h-56 bg-gradient-to-br from-gray-200 to-gray-100" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 rounded-lg w-3/4" />
                  <div className="h-4 bg-gray-200 rounded-lg w-full" />
                  <div className="h-4 bg-gray-200 rounded-lg w-2/3" />
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex gap-4">
                      <div className="h-4 bg-gray-200 rounded w-12" />
                      <div className="h-4 bg-gray-200 rounded w-12" />
                    </div>
                    <div className="h-8 bg-gray-200 rounded-xl w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (prompts.length === 0) {
    return (
      <section className="py-20 bg-[#066a9b]/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 rounded-full mb-4">
              <Star className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700">
              No Featured Prompts
            </h3>
            <p className="text-gray-400 mt-2">
              Check back later for featured prompts
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-[#066a9b]/5 relative overflow-hidden">
      {/* Background Decorations - Review Section এর মতো */}
      <motion.div 
        className="absolute top-0 left-1/4 w-96 h-96 bg-[#066a9b]/10 rounded-full blur-3xl"
        animate={{
          x: [0, 50, -50, 0],
          y: [0, -30, 30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div 
        className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#0a9fd4]/10 rounded-full blur-3xl"
        animate={{
          x: [0, -40, 40, 0],
          y: [0, 30, -30, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
          delay: 2
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <motion.div
          className="text-center mb-14 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#066a9b]/20 bg-white text-[#066a9b] text-xs font-semibold uppercase tracking-widest mb-5">
            <Star className="w-3.5 h-3.5 fill-[#066a9b]" />
            Featured Collections
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-zinc-900 mb-5 leading-tight">
            Top-Rated{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-[#066a9b] to-[#0a9fd4] bg-clip-text text-transparent">
                AI Prompts
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

          <p className="text-zinc-500 max-w-2xl mx-auto text-lg">
            Hand-picked prompts curated by our community to help you achieve the
            best results.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {prompts.map((prompt, index) => (
            <motion.div
              key={prompt._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5, ease: "easeOut" }}
              whileHover={{ y: -8 }}
              className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
            >
              {/* Soft Glow on Hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#066a9b]/5 to-[#0a9fd4]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Subtle Border Glow */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#066a9b]/20 transition-all duration-500 pointer-events-none" />

              {/* Thumbnail */}
              <div className="relative h-52 w-full bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                {prompt.thumbnail ? (
                  <img
                    src={prompt.thumbnail}
                    alt={prompt.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#066a9b]/10 to-[#0a9fd4]/10">
                    <Star className="w-16 h-16 text-[#066a9b]/20" />
                  </div>
                )}

                {/* Featured Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm text-[#066a9b] text-xs font-bold px-3 py-1.5 rounded-full shadow-md border border-[#066a9b]/10">
                  <Star className="w-3.5 h-3.5 fill-[#066a9b] text-[#066a9b]" />
                  Featured
                </div>

                {/* Rating Badge */}
                {prompt.rating > 0 && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/95 backdrop-blur-sm text-amber-500 text-xs font-bold px-3 py-1.5 rounded-full shadow-md border border-amber-200/20">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    {prompt.rating.toFixed(1)}
                  </div>
                )}

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#066a9b]/40 via-[#066a9b]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <button
                    onClick={() => handleViewDetails(prompt._id)}
                    className="bg-white text-[#066a9b] px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#066a9b] hover:text-white transition-all duration-300 flex items-center gap-2 shadow-lg transform -translate-y-4 group-hover:translate-y-0"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 md:p-6 flex flex-col flex-grow">
                {/* Title */}
                <h3 className="font-bold text-gray-900 text-lg md:text-xl mb-2 line-clamp-1 group-hover:text-[#066a9b] transition-colors duration-300">
                  {prompt.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-500 mb-4 flex-grow leading-relaxed line-clamp-2 group-hover:text-gray-600 transition-colors duration-300">
                  {prompt.description}
                </p>

                {/* Tags */}
                {prompt.tags && prompt.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {prompt.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs bg-[#e6f4fb] text-[#066a9b] px-2.5 py-0.5 rounded-full font-medium transition-colors duration-300 group-hover:bg-[#066a9b]/10"
                      >
                        #{tag}
                      </span>
                    ))}
                    {prompt.tags.length > 3 && (
                      <span className="text-xs text-gray-400 font-medium">
                        +{prompt.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-gray-400">
                    <div className="flex items-center gap-1.5 text-xs font-medium group-hover:text-[#066a9b] transition-colors duration-300">
                      <Copy className="w-4 h-4" />
                      <span>{formatNumber(prompt.copyCount)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium group-hover:text-[#066a9b] transition-colors duration-300">
                      <Bookmark className="w-4 h-4" />
                      <span>{formatNumber(prompt.bookmarkCount)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleViewDetails(prompt._id)}
                    className="bg-[#066a9b] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#0a9fd4] transition-all duration-300 hover:shadow-lg hover:shadow-[#066a9b]/20 flex items-center gap-1.5 group/btn"
                  >
                    <span>View</span>
                    <Eye className="w-3.5 h-3.5 group-hover/btn:rotate-12 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-14"
        >
          <p className="text-sm text-gray-400 mb-4">
            {prompts.length} featured prompts available
          </p>
          <button
            onClick={() => router.push("/all-prompt")}
            className="inline-flex items-center gap-2 text-[#066a9b] font-semibold hover:text-[#0a9fd4] transition-colors group"
          >
            <span>Explore all prompts</span>
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
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
        </motion.div>
      </div>
    </section>
  );
};

export default Featured;