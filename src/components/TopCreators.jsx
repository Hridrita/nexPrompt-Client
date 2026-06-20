"use client";
import { motion } from "framer-motion";

const creators = [
  { name: "Alex Rivet", role: "AI Strategist", prompts: "2.4K", rank: 1 },
  { name: "Sarah Chen", role: "Prompt Engineer", prompts: "1.8K", rank: 2 },
  { name: "Mike Ross", role: "SaaS Maker", prompts: "1.2K", rank: 3 },
  { name: "Emma Watson", role: "Content Creator", prompts: "950", rank: 4 },
];

const headerVariant = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const listVariant = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const rowVariant = {
  hidden: { opacity: 0, x: -40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function TopCreators() {
  return (
    <section className="py-28 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#066a9b]/6 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#0a9fd4]/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          variants={headerVariant}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#066a9b]/20 bg-[#066a9b]/5 text-[#066a9b] text-xs font-semibold uppercase tracking-widest mb-5">
            Leaderboard
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-zinc-900 mb-5">Top Prompt Creators</h2>
          <p className="text-zinc-500 max-w-2xl mx-auto text-lg">
            Meet the experts crafting the highest-quality prompts for our community.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col gap-3 max-w-3xl mx-auto"
          variants={listVariant}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {creators.map((c, i) => (
            <motion.div
              key={i}
              variants={rowVariant}
              whileHover={{ x: 6 }}
              className="flex items-center gap-5 p-5 bg-white border-2 border-zinc-100 rounded-2xl hover:border-[#066a9b]/40 hover:shadow-xl hover:shadow-[#066a9b]/10 transition-shadow duration-500 cursor-pointer group"
            >
              <span className="text-2xl font-black text-zinc-200 w-10 text-center group-hover:text-[#066a9b]/30 transition-colors duration-300">
                {String(c.rank).padStart(2, "0")}
              </span>

              <div className="relative flex-shrink-0">
                <motion.div
                  className="w-14 h-14 bg-gradient-to-br from-[#066a9b] to-[#0a9fd4] rounded-full flex items-center justify-center text-white font-bold text-lg"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {c.name.charAt(0)}
                </motion.div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow">
                  <span className="text-[#066a9b] text-[10px]">✓</span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-zinc-900 group-hover:text-[#066a9b] transition-colors truncate">{c.name}</h4>
                <p className="text-sm text-zinc-500 truncate">{c.role}</p>
              </div>

              <div className="flex-shrink-0 px-3.5 py-1.5 bg-[#066a9b]/10 rounded-full text-[#066a9b] text-xs font-semibold whitespace-nowrap">
                {c.prompts} prompts
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <button className="px-8 py-3 border-2 border-[#066a9b]/30 text-[#066a9b] rounded-xl font-semibold hover:bg-[#066a9b] hover:text-white hover:border-[#066a9b] transition-all duration-300 group">
            View All Creators <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
