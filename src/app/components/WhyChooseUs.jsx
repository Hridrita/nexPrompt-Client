"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaBolt, FaUsers, FaLock, FaHeart } from "react-icons/fa";
import { FiTarget } from "react-icons/fi";
import { IoInfinite } from "react-icons/io5";

const features = [
  { title: "Fast Delivery", desc: "Get your projects done in record time with our AI-powered workflows.", icon: FaBolt, color: "#066a9b" },
  { title: "Quality Guaranteed", desc: "Top-tier prompts refined by experts for maximum precision.", icon: FiTarget, color: "#0a9fd4" },
  { title: "Community Driven", desc: "Join thousands of makers sharing and remixing daily.", icon: FaUsers, color: "#066a9b" },
  { title: "Secure & Private", desc: "Your data is encrypted and never shared with third parties.", icon: FaLock, color: "#0a9fd4" },
  { title: "Always Updated", desc: "Fresh prompts added daily based on latest AI models.", icon: IoInfinite, color: "#066a9b" },
  { title: "Made for You", desc: "Personalized recommendations based on your usage patterns.", icon: FaHeart, color: "#0a9fd4" },
];

const headerVariant = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const gridVariant = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

export function WhyChooseUs() {
  const [hovered, setHovered] = useState(null);

  return (
    <section className="py-28 bg-gradient-to-b from-white to-[#066a9b]/5 relative overflow-hidden">
      <div className="absolute top-10 left-20 w-72 h-72 bg-[#066a9b]/8 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-20 w-80 h-80 bg-[#0a9fd4]/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />

      <svg className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none" preserveAspectRatio="none">
        <line x1="10%" y1="30%" x2="50%" y2="55%" stroke="#066a9b" strokeWidth="1" />
        <line x1="50%" y1="55%" x2="90%" y2="25%" stroke="#066a9b" strokeWidth="1" />
        <line x1="20%" y1="80%" x2="50%" y2="55%" stroke="#066a9b" strokeWidth="1" />
        <line x1="50%" y1="55%" x2="80%" y2="85%" stroke="#066a9b" strokeWidth="1" />
      </svg>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          variants={headerVariant}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#066a9b]/20 bg-[#066a9b]/5 text-[#066a9b] text-xs font-semibold uppercase tracking-widest mb-5">
            Why NexPrompt
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-zinc-900 mb-5">
            Built different,<br className="hidden md:block" /> built for makers
          </h2>
          <p className="text-zinc-500 max-w-2xl mx-auto text-lg">
            Everything you need to supercharge your AI workflow, in one place.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-7"
          variants={gridVariant}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={cardVariant}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              whileHover={{ y: -8 }}
              className="relative p-8 bg-white rounded-3xl border border-zinc-100 shadow-sm hover:shadow-2xl transition-shadow duration-500 group cursor-pointer overflow-hidden"
              style={{ borderColor: hovered === i ? `${f.color}50` : undefined }}
            >
              <div
                className="absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-2xl"
                style={{ background: `radial-gradient(circle at 30% 20%, ${f.color}18, transparent 70%)` }}
              />

              <motion.div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                style={{ background: `linear-gradient(135deg, ${f.color}22, ${f.color}0d)` }}
                whileHover={{ scale: 1.1, rotate: 6 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <f.icon style={{ color: f.color }} className="text-2xl" />
              </motion.div>

              <h3 className="text-xl font-bold mb-3 text-zinc-900 transition-colors" style={{ color: hovered === i ? f.color : undefined }}>
                {f.title}
              </h3>
              <p className="text-zinc-600 leading-relaxed">{f.desc}</p>

              <div
                className="mt-5 flex items-center font-semibold text-sm opacity-0 group-hover:opacity-100 translate-x-[-6px] group-hover:translate-x-0 transition-all duration-300"
                style={{ color: f.color }}
              >
                Learn more <span className="ml-1">→</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
