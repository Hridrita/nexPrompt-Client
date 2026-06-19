"use client";
import { motion } from "framer-motion";

const reviews = [
  { name: "John Doe", text: "NexPrompt completely changed how I build my SaaS landing pages!", rating: 5 },
  { name: "Jane Smith", text: "The quality of prompts here is unmatched. Highly recommended.", rating: 5 },
  { name: "Alex Rivera", text: "Found the perfect prompt for my cold email campaign in minutes!", rating: 5 },
  { name: "Sarah Chen", text: "The community aspect is amazing. Love remixing others' prompts!", rating: 4 },
];

const headerVariant = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const gridVariant = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const starVariant = {
  hidden: { opacity: 0, scale: 0.5 },
  show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 400, damping: 15 } },
};

export function CustomerReviews() {
  return (
    <section className="py-28 bg-[#066a9b]/5 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#066a9b]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#0a9fd4]/10 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          variants={headerVariant}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#066a9b]/20 bg-white text-[#066a9b] text-xs font-semibold uppercase tracking-widest mb-5">
            Testimonials
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-zinc-900 mb-5">What Our Users Say</h2>
          <p className="text-zinc-500 max-w-2xl mx-auto text-lg">
            Real feedback from makers who transformed their workflow with NexPrompt.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-6"
          variants={gridVariant}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              variants={cardVariant}
              whileHover={{ y: -6 }}
              className="relative p-8 bg-white rounded-3xl shadow-sm border border-zinc-100 hover:shadow-2xl hover:border-[#066a9b]/20 transition-shadow duration-500 cursor-pointer group overflow-hidden"
            >
              <span className="absolute -top-3 -right-2 text-[110px] font-black text-[#066a9b]/[0.05] select-none leading-none group-hover:text-[#066a9b]/[0.08] transition-colors duration-500">
                "
              </span>

              <motion.div
                className="flex items-center gap-1 mb-5 relative z-10"
                variants={gridVariant}
              >
                {[...Array(5)].map((_, idx) => (
                  <motion.span
                    key={idx}
                    variants={starVariant}
                    className={`text-xl ${idx < r.rating ? "text-yellow-400" : "text-zinc-300"}`}
                  >
                    ★
                  </motion.span>
                ))}
              </motion.div>

              <p className="text-zinc-700 mb-6 leading-relaxed text-lg relative z-10 group-hover:text-zinc-800">
                {r.text}
              </p>

              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 bg-gradient-to-br from-[#066a9b] to-[#0a9fd4] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {r.name.charAt(0)}
                </div>
                <h4 className="font-bold text-zinc-900">{r.name}</h4>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
