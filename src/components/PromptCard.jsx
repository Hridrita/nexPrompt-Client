"use client";

import { ArrowRight, Copy } from "@gravity-ui/icons";
import { motion } from "framer-motion";
import Link from 'next/link';


const CATEGORY_STYLES = {
  writing: { bg: "#E6F1FB", text: "#0C447C", dot: "#378ADD" },
  coding: { bg: "#E1F5EE", text: "#085041", dot: "#1D9E75" },
  design: { bg: "#FAECE7", text: "#712B13", dot: "#D85A30" },
  marketing: { bg: "#FBEAF0", text: "#72243E", dot: "#D4537E" },
  productivity: { bg: "#FAEEDA", text: "#633806", dot: "#BA7517" },
  default: { bg: "#EEEDFE", text: "#3C3489", dot: "#7F77DD" },
};

const getCategoryStyle = (category) =>
  CATEGORY_STYLES[category?.toLowerCase()] || CATEGORY_STYLES.default;

const getInitials = (name = "") =>
  name
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");

const PromptCard = ({ prompt, onViewDetails }) => {
  const { title, category, aiTool, copyCount = 0, creatorName } = prompt;

  const catStyle = getCategoryStyle(category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col gap-3 sm:gap-4 overflow-hidden rounded-2xl border border-[#C7DFEA] bg-white p-4 sm:p-5 shadow-[0_1px_3px_rgba(17,90,136,0.08)] transition-all duration-300 hover:shadow-[0_12px_28px_rgba(17,90,136,0.16)] hover:border-[#115a88]/50"
    >
      
      <span className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-[#115a88] to-[#1c8fc7] transition-transform duration-300 group-hover:scale-x-100" />

      
      <span className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#C7DFEA] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-60" />

      
      <div className="relative flex items-center justify-between">
        <span
          className="rounded-full px-2.5 sm:px-3 py-1 text-[10px] sm:text-[11px] font-medium tracking-wide"
          style={{ backgroundColor: catStyle.bg, color: catStyle.text }}
        >
          {category}
        </span>
        <span className="flex items-center gap-1 text-xs font-medium text-[#115a88]/70">
          <Copy width={13} height={13} />
          {copyCount}
        </span>
      </div>

      
      <h3 className="relative line-clamp-2 min-h-[2.6em] text-[14.5px] sm:text-[15px] font-medium leading-snug text-gray-800">
        {title}
      </h3>

     
      <div className="relative flex items-center gap-2 text-[12.5px] sm:text-[13px] text-gray-500">
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{ backgroundColor: catStyle.dot }}
        />
        {aiTool}
      </div>

      
      <div className="relative flex items-center gap-2 border-t border-[#C7DFEA]/60 pt-3 mt-1">
        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#115a88] to-[#1c8fc7] text-[11px] font-medium text-white">
          {getInitials(creatorName)}
        </div>
        <span className="truncate text-[12.5px] sm:text-[13px] text-gray-500">
          {creatorName}
        </span>
      </div>

      
      <Link href={`/all-prompt/${prompt._id}`}>
      <button
        onClick={() => onViewDetails?.(prompt)}
        className="relative mt-1 flex w-full items-center justify-center gap-1.5 rounded-lg bg-linear-to-r from-[#066a9b] to-[#0a9fd4] py-2 text-[12.5px] sm:text-[13px] font-medium text-white transition-all duration-200 hover:bg-[#0d4a70] hover:gap-2.5 active:scale-[0.98]"
      >
        View details
        <ArrowRight
          width={14}
          height={14}
          className="transition-transform duration-200 group-hover:translate-x-0.5"
        />
      </button>
      </Link>
    </motion.div>
  );
};

export default PromptCard;
