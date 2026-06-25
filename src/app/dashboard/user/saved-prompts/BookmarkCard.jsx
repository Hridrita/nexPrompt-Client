"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trash2, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { removeBookmark } from '@/lib/action/bookmark';

const CATEGORY_STYLES = {
  writing:  { accent: 'bg-[#1B4F72]', badge: 'bg-[#D6EAF8] text-[#1B4F72]', label: 'Writing' },
  code:     { accent: 'bg-[#E67E22]', badge: 'bg-[#FDEBD0] text-[#784212]', label: 'Code' },
  research: { accent: 'bg-[#1A8C6E]', badge: 'bg-[#D1F2EB] text-[#0B6045]', label: 'Research' },
  creative: { accent: 'bg-[#C0392B]', badge: 'bg-[#FDEDEC] text-[#7B241C]', label: 'Creative' },
};

const BookmarkCard = ({ promptID, title, category = 'writing', userId }) => {
  const style = CATEGORY_STYLES[category] ?? CATEGORY_STYLES.writing;

  const handleRemove = async () => {
    const res = await removeBookmark({ promptId: promptID, userId });
    if(res?.ok){
        toast.success("Bookmark removed!")
    } else {
        toast.error("Something went wrong.please try again!")
    }
    console.log("Removing bookmark:", promptID);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(27,79,114,0.1)" }}
      className="bg-white border border-[#D4E6F1] rounded-xl overflow-hidden hover:border-[#1B4F72] transition-all"
    >
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
        style={{ originX: 0 }}
        className={`h-[3px] ${style.accent}`}
      />

      <div className="px-4 pt-3 pb-3">
        <motion.span
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.25 }}
          className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-full mb-2 ${style.badge}`}
        >
          {style.label}
        </motion.span>
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="text-sm font-semibold text-[#1A2F3F] leading-snug line-clamp-2"
        >
          {title}
        </motion.h3>
      </div>

      <div className="h-px bg-[#EAF2F8]" />

      <div className="flex items-center gap-2 px-4 py-3">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.25 }}
          className="flex-1"
        >
          <Link
            href={`/all-prompt/${promptID}`}
            className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#1B4F72] bg-[#EBF5FB] border border-[#AED6F1] rounded-lg py-[7px] hover:bg-[#D6EAF8] transition-colors"
          >
            <ExternalLink size={12} /> Open prompt
          </Link>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.25 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleRemove}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
          aria-label="Remove bookmark"
        >
          <Trash2 size={13} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default BookmarkCard;