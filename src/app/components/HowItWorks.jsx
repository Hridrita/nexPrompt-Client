'use client'
import { motion } from "framer-motion";
import { FaSearch, FaCopy, FaRocket } from "react-icons/fa";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const steps = [
  { icon: <FaSearch />, title: "Search or Browse", desc: "Type what you need or explore curated categories and trending tags." },
  { icon: <FaCopy />, title: "Copy or Remix", desc: "Grab the prompt as-is, or fork it and tailor it to your exact use case." },
  { icon: <FaRocket />, title: "Ship Your Result", desc: "Paste into ChatGPT, Claude, Midjourney — wherever you create." },
];

export function HowItWorks() {
  return (
    <section className="relative py-24 px-6 bg-zinc-50 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#066a9b]/5 blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        <motion.div className="text-center mb-16" variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }}>
          <p className="text-xs text-[#066a9b] uppercase tracking-widest mb-3 font-semibold">How It Works</p>
          <h2 className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tight">Three steps. Zero friction.</h2>
        </motion.div>

        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative" variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
          <div className="hidden md:block absolute top-8 left-[16.66%] right-[16.66%] h-[2px] bg-gradient-to-r from-[#066a9b]/0 via-[#066a9b]/30 to-[#066a9b]/0" />
          {steps.map((s, i) => (
            <motion.div key={s.title} variants={fadeUp} className="relative flex flex-col items-center text-center">
              <div className="relative z-10 w-16 h-16 rounded-2xl bg-white border-2 border-[#066a9b]/20 text-[#066a9b] flex items-center justify-center text-2xl shadow-lg shadow-[#066a9b]/5 mb-6">
                {s.icon}
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#066a9b] text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
              </div>
              <h3 className="font-bold text-zinc-900 text-lg mb-2">{s.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}