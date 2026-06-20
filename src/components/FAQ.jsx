'use client'
import { useState } from "react";
import { motion } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const faqs = [
  { q: "Is NexPrompt free to use?", a: "Yes. Browsing and copying prompts is free. Some advanced features may roll out as premium later." },
  { q: "Which AI tools do prompts work with?", a: "ChatGPT, Claude, Gemini, Midjourney, and most major AI tools — each prompt notes its best fit." },
  { q: "Can I submit my own prompts?", a: "Absolutely. Hit \"Submit a Prompt\" and it goes through a quick quality check before going live." },
  { q: "How often is new content added?", a: "New prompts are added daily, curated from trending use cases and top creators." },
  { q: "Can I edit or remix someone else's prompt?", a: "Yes. Use the remix feature to fork any prompt and save your own tailored version." },
];

export function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section className="relative py-24 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <motion.div className="text-center mb-14" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }}>
          <p className="text-xs text-[#066a9b] uppercase tracking-widest mb-3 font-semibold">FAQ</p>
          <h2 className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tight">Got questions?</h2>
        </motion.div>

        <motion.div className="flex flex-col gap-3" variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <motion.div key={item.q} variants={fadeUp} className={`rounded-2xl border bg-white overflow-hidden transition-colors duration-300 ${isOpen ? "border-[#066a9b]/40" : "border-zinc-200"}`}>
                <button onClick={() => setOpen(isOpen ? -1 : i)} className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left">
                  <span className="font-semibold text-zinc-900">{item.q}</span>
                  <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }} className={`flex-shrink-0 ${isOpen ? "text-[#066a9b]" : "text-zinc-400"}`}>
                    <FiChevronDown />
                  </motion.span>
                </button>
                <motion.div initial={false} animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }} transition={{ duration: 0.25, ease: "easeInOut" }} className="overflow-hidden">
                  <p className="px-6 pb-5 text-zinc-500 text-sm leading-relaxed">{item.a}</p>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}