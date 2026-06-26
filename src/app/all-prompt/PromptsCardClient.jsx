"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import PromptCard from "@/components/PromptCard";
import { getPrompts } from "@/lib/api/prompts";

const CATEGORIES = [
  { value: "", label: "All Categories" },
  { value: "writing", label: "Writing" },
  { value: "coding", label: "Coding" },
  { value: "marketing", label: "Marketing" },
  { value: "design", label: "Design" },
  { value: "productivity", label: "Productivity" },
  { value: "education", label: "Education" },
];

const AI_TOOLS = [
  { value: "", label: "All AI Tools" },
  { value: "gemini", label: "Gemini" },
  { value: "chatgpt", label: "ChatGPT" },
  { value: "claude", label: "Claude" },
  { value: "midjourney", label: "Midjourney" },
  { value: "dall-e", label: "DALL-E" },
];

const DIFFICULTIES = [
  { value: "", label: "All Levels" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "pro", label: "Pro" },
];

const SORTS = [
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Most Popular" },
  { value: "copied", label: "Most Copied" },
];

const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;
const ITEMS_PER_PAGE = 12;

const PromptCardsClient = () => {
  const router = useRouter();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: ITEMS_PER_PAGE,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [aiTool, setAiTool] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [sort, setSort] = useState("latest");

  const fetchPrompts = useCallback(async (page = 1) => {
  setLoading(true);
  try {
    const result = await getPrompts({
      search,
      category,
      aiTool,
      difficulty,
      sort,
      page,
      limit: ITEMS_PER_PAGE,
    });

    setPrompts(result.prompts || []);
    setPagination(result.pagination || {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: ITEMS_PER_PAGE,
      hasNextPage: false,
      hasPrevPage: false,
    });
  } catch (error) {
    console.error("Error fetching prompts:", error);
    setPrompts([]);
  } finally {
    setLoading(false);
  }
}, [search, category, aiTool, difficulty, sort]);

  useEffect(() => {
    const timeout = setTimeout(() => fetchPrompts(1), 300);
    return () => clearTimeout(timeout);
  }, [fetchPrompts]);

  const handlePageChange = (newPage) => {
    if (newPage === pagination.currentPage || newPage < 1 || newPage > pagination.totalPages) return;
    fetchPrompts(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearAll = () => {
    setSearch("");
    setCategory("");
    setAiTool("");
    setDifficulty("");
    setSort("latest");
  };

  const hasFilters = search || category || aiTool || difficulty || sort !== "latest";

  // Pagination Component
  const PaginationControls = () => {
    if (pagination.totalPages <= 1) return null;

    const getPageNumbers = () => {
      const pages = [];
      const maxVisible = 5;
      const total = pagination.totalPages;
      const current = pagination.currentPage;

      if (total <= maxVisible) {
        for (let i = 1; i <= total; i++) pages.push(i);
      } else {
        pages.push(1);
        
        let start = Math.max(2, current - 1);
        let end = Math.min(total - 1, current + 1);
        
        if (current <= 2) end = 4;
        if (current >= total - 1) start = total - 3;
        
        if (start > 2) pages.push("...");
        for (let i = start; i <= end; i++) pages.push(i);
        if (end < total - 1) pages.push("...");
        if (total > 1) pages.push(total);
      }
      return pages;
    };

    return (
      <div className="flex items-center justify-center gap-1 sm:gap-2 mt-8 flex-wrap">
        <button
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={!pagination.hasPrevPage}
          className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-[#C7DFEA] text-xs sm:text-sm font-medium text-gray-600 hover:bg-[#f3f7fb] hover:border-[#115a88] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Previous
        </button>

        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && handlePageChange(page)}
            disabled={page === "..."}
            className={`min-w-[32px] sm:min-w-[40px] h-8 sm:h-10 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              page === pagination.currentPage
                ? "bg-[#115a88] text-white shadow-sm"
                : page === "..."
                ? "cursor-default text-gray-400"
                : "text-gray-600 hover:bg-[#f3f7fb] hover:border-[#115a88] border border-transparent"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={!pagination.hasNextPage}
          className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-[#C7DFEA] text-xs sm:text-sm font-medium text-gray-600 hover:bg-[#f3f7fb] hover:border-[#115a88] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Search by title, tags or AI tool..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-[#C7DFEA] bg-white pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#115a88] focus:ring-1 focus:ring-[#115a88]/20 transition-all"
        />
      </div>

      {/* Filters row - Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full appearance-none rounded-xl border border-[#C7DFEA] bg-white px-4 py-2.5 pr-10 text-sm text-gray-700 focus:outline-none focus:border-[#115a88] focus:ring-1 focus:ring-[#115a88]/20 transition-all cursor-pointer"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                Sort: {s.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Category Dropdown */}
        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full appearance-none rounded-xl border border-[#C7DFEA] bg-white px-4 py-2.5 pr-10 text-sm text-gray-700 focus:outline-none focus:border-[#115a88] focus:ring-1 focus:ring-[#115a88]/20 transition-all cursor-pointer"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* AI Tool Dropdown */}
        <div className="relative">
          <select
            value={aiTool}
            onChange={(e) => setAiTool(e.target.value)}
            className="w-full appearance-none rounded-xl border border-[#C7DFEA] bg-white px-4 py-2.5 pr-10 text-sm text-gray-700 focus:outline-none focus:border-[#115a88] focus:ring-1 focus:ring-[#115a88]/20 transition-all cursor-pointer"
          >
            {AI_TOOLS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Difficulty Dropdown */}
        <div className="relative">
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full appearance-none rounded-xl border border-[#C7DFEA] bg-white px-4 py-2.5 pr-10 text-sm text-gray-700 focus:outline-none focus:border-[#115a88] focus:ring-1 focus:ring-[#115a88]/20 transition-all cursor-pointer"
          >
            {DIFFICULTIES.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Active Filters Display */}
      {hasFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-400 font-medium">Active filters:</span>
          
          {search && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-[#e6f4fb] text-[#115a88] border border-[#C7DFEA]">
              Search: "{search}"
              <button onClick={() => setSearch("")} className="hover:text-red-500 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          
          {category && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-[#e6f4fb] text-[#115a88] border border-[#C7DFEA]">
              {CATEGORIES.find(c => c.value === category)?.label || category}
              <button onClick={() => setCategory("")} className="hover:text-red-500 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          
          {aiTool && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-[#e6f4fb] text-[#115a88] border border-[#C7DFEA]">
              {AI_TOOLS.find(t => t.value === aiTool)?.label || aiTool}
              <button onClick={() => setAiTool("")} className="hover:text-red-500 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          
          {difficulty && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-[#e6f4fb] text-[#115a88] border border-[#C7DFEA]">
              {DIFFICULTIES.find(d => d.value === difficulty)?.label || difficulty}
              <button onClick={() => setDifficulty("")} className="hover:text-red-500 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          
          {sort !== "latest" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-[#e6f4fb] text-[#115a88] border border-[#C7DFEA]">
              Sort: {SORTS.find(s => s.value === sort)?.label || sort}
              <button onClick={() => setSort("latest")} className="hover:text-red-500 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          
          <button
            onClick={clearAll}
            className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Results bar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-sm text-gray-500">
          {loading ? "Loading..." : `${pagination.totalItems} prompt${pagination.totalItems !== 1 ? "s" : ""}`}
        </p>
        {!loading && pagination.totalItems > 0 && (
          <p className="text-xs text-gray-400">
            Page {pagination.currentPage} of {pagination.totalPages}
          </p>
        )}
      </div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 gap-4 xs:grid-cols-2 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4"
          >
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <div key={i} className="h-52 rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </motion.div>
        ) : prompts.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <p className="text-gray-400 text-sm">No prompts match your filters.</p>
            <button onClick={clearAll} className="mt-2 text-xs text-[#115a88] hover:underline">
              Clear filters
            </button>
          </motion.div>
        ) : (
          <>
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 gap-4 xs:grid-cols-2 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4"
            >
              {prompts.map((prompt) => (
                <PromptCard
                  key={prompt._id}
                  prompt={prompt}
                  onViewDetails={(p) => router.push(`/all-prompt/${p._id}`)}
                />
              ))}
            </motion.div>

            {/* Pagination Controls */}
            <PaginationControls />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PromptCardsClient;