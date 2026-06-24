"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import PromptCard from "@/components/PromptCard";

const CATEGORIES = ["writing", "coding", "marketing", "design", "productivity", "education"];
const AI_TOOLS = ["gemini", "chatgpt", "claude", "midjourney", "dall-e"];
const DIFFICULTIES = ["beginner", "intermediate", "pro"];
const SORTS = [
  { label: "Latest", value: "latest" },
  { label: "Most Popular", value: "popular" },
  { label: "Most Copied", value: "copied" },
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const Chip = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${
      active
        ? "bg-[#115a88] text-white border-[#115a88]"
        : "bg-white text-gray-500 border-[#C7DFEA] hover:border-[#115a88] hover:text-[#115a88]"
    }`}
  >
    {label}
  </button>
);

const PromptCardsClient = () => {
  const router = useRouter();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [aiTool, setAiTool] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [sort, setSort] = useState("latest");

  const fetchPrompts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (aiTool) params.set("aiTool", aiTool);
    if (difficulty) params.set("difficulty", difficulty);
    if (sort) params.set("sort", sort);

    const res = await fetch(`${API_BASE}/api/prompts?${params.toString()}`);
    const data = await res.json();
    setPrompts(data);
    setLoading(false);
  }, [search, category, aiTool, difficulty, sort]);

  useEffect(() => {
    const timeout = setTimeout(fetchPrompts, 300); // debounce search
    return () => clearTimeout(timeout);
  }, [fetchPrompts]);

  const clearAll = () => {
    setSearch("");
    setCategory("");
    setAiTool("");
    setDifficulty("");
    setSort("latest");
  };

  const hasFilters = search || category || aiTool || difficulty || sort !== "latest";

  return (
    <div className="flex flex-col gap-5">
      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="text"
          placeholder="Search by title, tags or AI tool..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-[#C7DFEA] bg-white pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#115a88] focus:ring-1 focus:ring-[#115a88]/20 transition-all"
        />
      </div>

      {/* Filters row */}
      <div className="flex flex-col gap-3">
        {/* Sort */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-400 font-medium w-16">Sort</span>
          {SORTS.map((s) => (
            <Chip key={s.value} label={s.label} active={sort === s.value} onClick={() => setSort(s.value)} />
          ))}
        </div>

        {/* Category */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-400 font-medium w-16">Category</span>
          {CATEGORIES.map((c) => (
            <Chip
              key={c}
              label={c.charAt(0).toUpperCase() + c.slice(1)}
              active={category === c}
              onClick={() => setCategory(category === c ? "" : c)}
            />
          ))}
        </div>

        {/* AI Tool */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-400 font-medium w-16">AI Tool</span>
          {AI_TOOLS.map((t) => (
            <Chip
              key={t}
              label={t.charAt(0).toUpperCase() + t.slice(1)}
              active={aiTool === t}
              onClick={() => setAiTool(aiTool === t ? "" : t)}
            />
          ))}
        </div>

        {/* Difficulty */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-400 font-medium w-16">Level</span>
          {DIFFICULTIES.map((d) => (
            <Chip
              key={d}
              label={d.charAt(0).toUpperCase() + d.slice(1)}
              active={difficulty === d}
              onClick={() => setDifficulty(difficulty === d ? "" : d)}
            />
          ))}
        </div>
      </div>

      {/* Results bar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {loading ? "Loading..." : `${prompts.length} prompt${prompts.length !== 1 ? "s" : ""}`}
        </p>
        {hasFilters && (
          <button onClick={clearAll} className="text-xs text-[#115a88] hover:underline">
            Clear all
          </button>
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
            {Array.from({ length: 8 }).map((_, i) => (
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
            <button onClick={clearAll} className="mt-2 text-xs text-[#115a88] hover:underline">Clear filters</button>
          </motion.div>
        ) : (
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
        )}
      </AnimatePresence>
    </div>
  );
};

export default PromptCardsClient;