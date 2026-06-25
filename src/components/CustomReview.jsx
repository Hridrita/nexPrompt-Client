"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { getAllReviews, getReviewStats } from "@/lib/api/reviews";
import toast from "react-hot-toast";

const headerVariant = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6, 
      ease: "easeOut" 
    } 
  },
};

const gridVariant = {
  hidden: {},
  show: { 
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.2 
    } 
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { 
      duration: 0.6, 
      ease: [0.22, 1, 0.36, 1] 
    } 
  },
  exit: { 
    opacity: 0, 
    y: -20, 
    scale: 0.9,
    transition: { duration: 0.3 }
  }
};

const starVariant = {
  hidden: { opacity: 0, scale: 0, rotate: -180 },
  show: { 
    opacity: 1, 
    scale: 1, 
    rotate: 0,
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 15,
      delay: 0.1 
    } 
  },
};

const floatingVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20
    }
  }
};

export function CustomerReviews() {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlay || reviews.length <= 4) return;
    
    const interval = setInterval(() => {
      setCurrentPage(prev => 
        prev < Math.ceil(reviews.length / 4) - 1 ? prev + 1 : 0
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isAutoPlay, reviews.length]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await getAllReviews();
      if (data?.success) {
        setReviews(data.reviews || []);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await getReviewStats();
      if (data?.success) {
        setStats({
          total: data.totalReviews || 0,
          average: data.averageRating || 0,
          distribution: data.ratingDistribution || []
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Recently";
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <motion.span
        key={i}
        variants={starVariant}
        className={`text-lg sm:text-xl ${i < rating ? "text-yellow-400" : "text-gray-200"}`}
      >
        ★
      </motion.span>
    ));
  };

  // Pagination
  const totalPages = Math.ceil(reviews.length / 4);
  const displayedReviews = reviews.slice(currentPage * 4, (currentPage + 1) * 4);

  if (loading) {
    return (
      <section className="py-28 bg-[#066a9b]/5 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="h-8 w-48 bg-gray-200 rounded-full mx-auto animate-pulse" />
            <div className="h-12 w-64 bg-gray-200 rounded-lg mx-auto mt-4 animate-pulse" />
            <div className="h-6 w-96 bg-gray-200 rounded-lg mx-auto mt-3 animate-pulse" />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-8 bg-white rounded-3xl border border-zinc-100 animate-pulse"
              >
                <div className="flex gap-1 mb-5">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <div key={j} className="w-5 h-5 bg-gray-200 rounded-full" />
                  ))}
                </div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-6" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div className="h-4 bg-gray-200 rounded w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return (
      <section className="py-28 bg-[#066a9b]/5 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#066a9b]/20 bg-white text-[#066a9b] text-xs font-semibold uppercase tracking-widest mb-5">
              Testimonials
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 mb-5">What Our Users Say</h2>
            <p className="text-zinc-500 max-w-2xl mx-auto text-lg">
              No reviews yet. Be the first to share your experience!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-28 bg-[#066a9b]/5 relative overflow-hidden">
      {/* Background Decorations */}
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

      {/* Floating Quote Icons */}
      <motion.div
        className="absolute top-20 left-10 text-[#066a9b]/10"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Quote className="w-20 h-20" />
      </motion.div>
      <motion.div
        className="absolute bottom-20 right-10 text-[#0a9fd4]/10"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <Quote className="w-20 h-20" />
      </motion.div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={headerVariant}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#066a9b]/20 bg-white text-[#066a9b] text-xs font-semibold uppercase tracking-widest mb-5">
            <Users className="w-3.5 h-3.5" />
            Testimonials
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-zinc-900 mb-5">
            What Our Users Say
          </h2>
          <p className="text-zinc-500 max-w-2xl mx-auto text-lg">
            Real feedback from makers who transformed their workflow with NexPrompt.
          </p>
          
          {/* Stats */}
          {stats && (
            <motion.div 
              variants={floatingVariant}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="flex items-center justify-center gap-8 mt-6"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-[#066a9b]">
                  {stats.average.toFixed(1)}
                </span>
                <div className="flex">
                  {renderStars(Math.round(stats.average))}
                </div>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div className="text-sm text-gray-500">
                <span className="font-semibold text-gray-700">{stats.total}</span> reviews
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Reviews Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            variants={gridVariant}
            initial="hidden"
            animate="show"
            exit="exit"
            className="grid md:grid-cols-2 gap-6"
          >
            {displayedReviews.map((review, index) => (
              <motion.div
                key={review._id || index}
                variants={cardVariant}
                whileHover={{ 
                  y: -8,
                  scale: 1.01,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
                className="relative p-8 bg-white rounded-3xl shadow-sm border border-zinc-100 hover:shadow-2xl hover:border-[#066a9b]/20 transition-all duration-500 cursor-pointer group overflow-hidden"
              >
                {/* Background Gradient on Hover */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-[#066a9b]/5 to-[#0a9fd4]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />

                {/* Quote Mark */}
                <motion.span 
                  className="absolute -top-3 -right-2 text-[110px] font-black text-[#066a9b]/[0.05] select-none leading-none group-hover:text-[#066a9b]/[0.08] transition-colors duration-500"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  "
                </motion.span>

                {/* Stars */}
                <motion.div
                  className="flex items-center gap-1 mb-5 relative z-10"
                  variants={gridVariant}
                >
                  {[...Array(5)].map((_, idx) => (
                    <motion.span
                      key={idx}
                      variants={starVariant}
                      className={`text-lg sm:text-xl ${idx < (review.rating || 0) ? "text-yellow-400" : "text-gray-200"}`}
                    >
                      ★
                    </motion.span>
                  ))}
                </motion.div>

                {/* Review Text */}
                <motion.p 
                  className="text-zinc-700 mb-6 leading-relaxed text-base sm:text-lg relative z-10 group-hover:text-zinc-800 transition-colors duration-300"
                >
                  "{review.comment || review.text || "Amazing experience!"}"
                </motion.p>

                {/* User Info */}
                <motion.div 
                  className="flex items-center gap-3 relative z-10"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {review.image || review.creatorImage ? (
                    <img
                      src={review.image || review.creatorImage}
                      alt={review.name || "User"}
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#066a9b]/20 group-hover:border-[#066a9b] transition-all duration-300"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-[#066a9b] to-[#0a9fd4] rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {getInitials(review.name || "User")}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-zinc-900 group-hover:text-[#066a9b] transition-colors duration-300">
                      {review.name || "Anonymous"}
                    </h4>
                    <p className="text-xs text-gray-400">
                      {review.promptTitle ? `on "${review.promptTitle}"` : ""}
                      {review.date && ` · ${formatDate(review.date)}`}
                    </p>
                  </div>
                </motion.div>

                {/* Decorative Line */}
                <motion.div 
                  className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#066a9b] to-[#0a9fd4] group-hover:w-full transition-all duration-700"
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <motion.div 
            className="flex items-center justify-center gap-4 mt-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <button
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="p-2 rounded-full bg-white border border-gray-200 hover:border-[#066a9b] hover:bg-[#066a9b]/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    currentPage === i 
                      ? "w-8 bg-[#066a9b]" 
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage === totalPages - 1}
              className="p-2 rounded-full bg-white border border-gray-200 hover:border-[#066a9b] hover:bg-[#066a9b]/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </motion.div>
        )}

        {/* Auto-play indicator */}
        {totalPages > 1 && (
          <motion.div 
            className="text-center mt-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className="text-xs text-gray-400 hover:text-[#066a9b] transition-colors"
            >
              {isAutoPlay ? "⏸ Auto-play on" : "▶ Auto-play off"}
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}