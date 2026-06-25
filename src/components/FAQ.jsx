'use client'
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  HelpCircle, 
  MessageCircle, 
  DollarSign, 
  Sparkles, 
  Edit3, 
  RefreshCw, 
  GitBranch,
  Zap,
  Users,
  Shield
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const faqs = [
  { 
    q: "Is NexPrompt free to use?", 
    a: "Yes. Browsing and copying prompts is completely free. Some advanced features like premium prompts and analytics may roll out as paid features later.",
    icon: DollarSign
  },
  { 
    q: "Which AI tools do prompts work with?", 
    a: "Our prompts work with ChatGPT, Claude, Gemini, Midjourney, DALL-E, and most major AI tools. Each prompt specifies its best-fit tool in the description.",
    icon: Zap
  },
  { 
    q: "Can I submit my own prompts?", 
    a: "Absolutely! Hit 'Submit a Prompt' and our team will review it for quality before publishing. Once approved, your prompt will be visible to the community.",
    icon: Edit3
  },
  { 
    q: "How often is new content added?", 
    a: "New prompts are added daily, curated from trending use cases and top creators. We update our collection with fresh, high-quality prompts every 24 hours.",
    icon: RefreshCw
  },
  { 
    q: "Can I edit or remix someone else's prompt?", 
    a: "Yes! Use the remix feature to fork any prompt and save your own tailored version. You can customize, improve, and republish prompts for specific use cases.",
    icon: GitBranch
  },
];

export function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <section className="relative py-24 px-6 bg-gradient-to-b from-white via-[#f8fafc] to-white overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#066a9b]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#0a9fd4]/5 rounded-full blur-3xl" />

      {/* Floating Icons */}
      <motion.div
        className="absolute top-20 left-10 text-[#066a9b]/5"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <HelpCircle className="w-24 h-24" />
      </motion.div>
      <motion.div
        className="absolute bottom-20 right-10 text-[#0a9fd4]/5"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <HelpCircle className="w-20 h-20" />
      </motion.div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-14" 
          variants={fadeUp} 
          initial="hidden" 
          whileInView="show" 
          viewport={{ once: true, amount: 0.4 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#066a9b]/20 bg-[#066a9b]/5 text-[#066a9b] text-xs font-semibold uppercase tracking-widest mb-5">
            <HelpCircle className="w-3.5 h-3.5" />
            FAQ
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tight mb-4">
            Frequently Asked <span className="bg-gradient-to-r from-[#066a9b] to-[#0a9fd4] bg-clip-text text-transparent">Questions</span>
          </h2>
          <p className="text-zinc-500 max-w-xl mx-auto text-lg">
            Everything you need to know about NexPrompt. Can't find what you're looking for?
          </p>
        </motion.div>

        {/* FAQ List */}
        <motion.div 
          className="flex flex-col gap-3" 
          variants={staggerContainer} 
          initial="hidden" 
          whileInView="show" 
          viewport={{ once: true, amount: 0.2 }}
        >
          {faqs.map((item, i) => {
            const isOpen = open === i;
            const Icon = item.icon;
            return (
              <motion.div 
                key={item.q} 
                variants={fadeUp} 
                className={`group rounded-2xl bg-white border transition-all duration-500 ${
                  isOpen 
                    ? "border-[#066a9b]/40 shadow-[0_8px_30px_rgba(6,106,155,0.12)]" 
                    : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                }`}
              >
                <button 
                  onClick={() => setOpen(isOpen ? null : i)} 
                  className="w-full flex items-center gap-4 px-6 py-5 text-left"
                >
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isOpen 
                      ? "bg-[#066a9b] text-white" 
                      : "bg-gray-100 text-[#066a9b]/50 group-hover:bg-[#066a9b]/10 group-hover:text-[#066a9b]"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Question */}
                  <span className={`flex-1 font-semibold text-zinc-900 transition-colors duration-300 ${
                    isOpen ? "text-[#066a9b]" : "group-hover:text-[#066a9b]"
                  }`}>
                    {item.q}
                  </span>

                  {/* Arrow */}
                  <motion.span 
                    animate={{ rotate: isOpen ? 180 : 0 }} 
                    transition={{ duration: 0.3, ease: "easeInOut" }} 
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isOpen 
                        ? "bg-[#066a9b] text-white" 
                        : "bg-gray-100 text-gray-400 group-hover:bg-[#066a9b]/10 group-hover:text-[#066a9b]"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-1">
                        <div className="h-px w-12 bg-gradient-to-r from-[#066a9b] to-[#0a9fd4] mb-4" />
                        <p className="text-zinc-500 text-sm leading-relaxed">
                          {item.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-12"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="inline-flex items-center gap-4 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm">
            <MessageCircle className="w-5 h-5 text-[#066a9b]" />
            <span className="text-sm text-gray-600">
              Still have questions?{" "}
              <button className="font-semibold text-[#066a9b] hover:text-[#0a9fd4] transition-colors">
                Contact Support
              </button>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}