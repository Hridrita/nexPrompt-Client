"use client";
import { motion } from "framer-motion";
import { FaGithub, FaDiscord, FaLinkedin } from "react-icons/fa";
import { RiTwitterXLine } from "react-icons/ri";

const links = {
  Product: ["Browse Prompts", "Submit a Prompt", "Pricing", "Changelog"],
  Company: ["About", "Blog", "Careers", "Contact"],
  Resources: ["Docs", "API", "Community", "Help Center"],
  Legal: ["Privacy", "Terms", "Cookies"],
};

const socials = [
  { icon: RiTwitterXLine, href: "#" },
  { icon: FaGithub, href: "#" },
  { icon: FaDiscord, href: "#" },
  { icon: FaLinkedin, href: "#" },
];

const colVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const containerVariant = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export function Footer() {
  return (
    <footer className="relative bg-zinc-900 text-zinc-300 overflow-hidden pt-20 pb-10">
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-[#066a9b]/15 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#0a9fd4]/10 rounded-full blur-3xl translate-y-1/2" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 mb-16 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm"
        >
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Stay in the loop</h3>
            <p className="text-zinc-400 text-sm">Best prompts, dropped in your inbox weekly.</p>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <input
              type="email"
              placeholder="you@email.com"
              className="flex-1 md:w-64 px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-zinc-500 outline-none focus:border-[#0a9fd4]/50 transition-colors"
            />
            <button className="px-5 py-3 bg-gradient-to-r from-[#066a9b] to-[#0a9fd4] text-white rounded-xl font-semibold text-sm hover:scale-105 active:scale-95 transition-transform">
              Subscribe
            </button>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariant}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16"
        >
          <motion.div variants={colVariant} className="col-span-2 md:col-span-1">
            <span className="text-2xl font-black text-white">NexPrompt</span>
            <p className="text-zinc-500 text-sm mt-3 leading-relaxed">
              Find, remix, share AI prompts. Built for makers.
            </p>
            <div className="flex gap-3 mt-5">
              {socials.map((s, i) => (
                <motion.a
                  key={i}
                  href={s.href}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:border-[#0a9fd4]/50 hover:bg-[#0a9fd4]/10 hover:text-[#0a9fd4] transition-colors"
                >
                  <s.icon className="text-sm" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {Object.entries(links).map(([title, items]) => (
            <motion.div key={title} variants={colVariant}>
              <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-4">{title}</h4>
              <ul className="flex flex-col gap-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-zinc-400 text-sm hover:text-[#0a9fd4] transition-colors duration-200"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
          <span>© {new Date().getFullYear()} NexPrompt. All rights reserved.</span>
          <span className="flex items-center gap-1.5">
            🔄 Updated daily · 12k+ users
          </span>
        </div>
      </div>
    </footer>
  );
}