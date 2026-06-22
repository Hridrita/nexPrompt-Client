"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trash2, ExternalLink } from 'lucide-react';

const CATEGORY_STYLES = {
  writing:  { accent: 'bg-[#1B4F72]', badge: 'bg-[#D6EAF8] text-[#1B4F72]', label: 'Writing' },
  code:     { accent: 'bg-[#E67E22]', badge: 'bg-[#FDEBD0] text-[#784212]', label: 'Code' },
  research: { accent: 'bg-[#1A8C6E]', badge: 'bg-[#D1F2EB] text-[#0B6045]', label: 'Research' },
  creative: { accent: 'bg-[#C0392B]', badge: 'bg-[#FDEDEC] text-[#7B241C]', label: 'Creative' },
};

const BookmarkCard = ({ promptID, title, category = 'writing' }) => {
  const style = CATEGORY_STYLES[category] ?? CATEGORY_STYLES.writing;

  const handleRemove = async () => {
    console.log("Removing bookmark:", promptID);
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white border border-[#D4E6F1] rounded-xl overflow-hidden hover:border-[#1B4F72] transition-all"
    >
      <div className={`h-[3px] ${style.accent}`} />

      <div className="px-4 pt-3 pb-3">
        <span className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-full mb-2 ${style.badge}`}>
          {style.label}
        </span>
        <h3 className="text-sm font-semibold text-[#1A2F3F] leading-snug line-clamp-2">{title}</h3>
      </div>

      <div className="h-px bg-[#EAF2F8]" />

      <div className="flex items-center gap-2 px-4 py-3">
        <Link
          href={`/all-prompt/${promptID}`}
          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#1B4F72] bg-[#EBF5FB] border border-[#AED6F1] rounded-lg py-[7px] hover:bg-[#D6EAF8] transition-colors"
        >
          <ExternalLink size={12} /> Open prompt
        </Link>
        <button
          onClick={handleRemove}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
          aria-label="Remove bookmark"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </motion.div>
  );
};

export default BookmarkCard;