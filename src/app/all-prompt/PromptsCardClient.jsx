"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import PromptCard from "@/components/PromptCard";

const PromptCardsClient = ({ prompts }) => {
  const router = useRouter();

  if (!prompts?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-gray-500 text-sm">No prompts yet. Be the first to share one.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.06 } },
      }}
      className="grid grid-cols-1 gap-4 xs:grid-cols-2 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4"
    >
      {prompts.map((prompt) => (
        <PromptCard
          key={prompt._id || prompt.id}
          prompt={prompt}
          onViewDetails={(p) => router.push(`/prompts/${p._id || p.id}`)}
        />
      ))}
    </motion.div>
  );
};

export default PromptCardsClient;
