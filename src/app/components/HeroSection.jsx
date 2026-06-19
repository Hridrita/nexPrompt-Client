'use client'
import { useState, useEffect, useRef } from "react";
import { BsBoxArrowUpRight } from "react-icons/bs";
import { FaScroll } from "react-icons/fa";
import { motion } from "framer-motion";

const trendingTags = [
  "✍️ Blog Writer", "🤖 AI Persona", "💡 Brainstorm", "📧 Cold Email",
  "🎨 Image Prompt", "⚡ Productivity", "🔥 Viral Tweet", "📊 Data Analysis",
  "🧠 Chain of Thought", "🛒 Product Copy", "🎙️ Podcast Script", "💼 LinkedIn Bio",
  "🚀 Startup Pitch", "📚 Summarizer", "🌐 SEO Content",
];

const floatingWords = ["Create.", "Prompt.", "Discover.", "Bookmark.", "Manage.","Publish."];

const tagContainerVariant = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.3 } },
};

const tagVariant = {
  hidden: { opacity: 0, y: 12, scale: 0.85 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function HeroSection() {
  const [isMounted, setIsMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState(null);
  const [wordIndex, setWordIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const canvasRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setWordIndex(i => (i + 1) % floatingWords.length);
        setFade(true);
      }, 300);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const dots = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 4 + 2,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.4 + 0.15,
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach(d => {
        d.x += d.dx; d.y += d.dy;
        if (d.x < 0 || d.x > canvas.width) d.dx *= -1;
        if (d.y < 0 || d.y > canvas.height) d.dy *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(6, 106, 155, ${d.opacity})`;
        ctx.fill();
      });
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dist = Math.hypot(dots[i].x - dots[j].x, dots[i].y - dots[j].y);
          if (dist < 125) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(6, 106, 155, ${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [isMounted]);

  if (!isMounted) return null;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32">

      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none -z-10"
      />

      <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-[#066a9b]/6 blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-[#0a9fd4]/8 blur-3xl translate-x-1/3 translate-y-1/3 animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#066a9b]/20 bg-[#066a9b]/5 text-[#066a9b] text-sm font-medium mb-8 animate-bounce" style={{ animationDuration: "3s" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#066a9b] animate-ping inline-block" />
          10,000+ prompts · Built for makers
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-zinc-900 leading-[1.05] tracking-tight mb-6">
          The prompt library<br />
          that helps you{" "}
          <span
            className="text-transparent bg-clip-text bg-gradient-to-r from-[#066a9b] to-[#0a9fd4] inline-block transition-all duration-300"
            style={{ opacity: fade ? 1 : 0, transform: fade ? "translateY(0)" : "translateY(8px)" }}
          >
            {floatingWords[wordIndex]}
          </span>
        </h1>

        <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Find, remix, and share AI prompts for ChatGPT, Claude, Midjourney & more.
          Stop starting from scratch — start from the best.
        </p>

        <div className="relative max-w-2xl mx-auto mb-8 group">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#066a9b] to-[#0a9fd4] opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300 -z-10 scale-105" />
          <div className="flex items-center bg-white border-2 border-zinc-200 group-hover:border-[#066a9b]/40 rounded-2xl px-5 py-4 gap-3 shadow-lg transition-all duration-300">
            <svg className="w-5 h-5 text-zinc-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search prompts… e.g. 'cold email for SaaS'"
              className="flex-1 bg-transparent outline-none text-zinc-800 placeholder:text-zinc-400 text-base"
            />
            <button className="px-5 py-2 bg-gradient-to-r from-[#066a9b] to-[#0a9fd4] text-white rounded-xl font-semibold text-sm hover:scale-105 active:scale-95 transition-transform duration-150 flex-shrink-0">
              Search
            </button>
          </div>
        </div>

        <div className="mb-10">
          <p className="text-xs text-zinc-400 uppercase tracking-widest mb-3 font-medium">Trending</p>
          <motion.div
            className="flex flex-wrap justify-center gap-2"
            variants={tagContainerVariant}
            initial="hidden"
            animate="show"
          >
            {trendingTags.map(tag => (
              <motion.button
                key={tag}
                variants={tagVariant}
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors duration-200 ${
                  activeTag === tag
                    ? "bg-[#066a9b] text-white border-[#066a9b] shadow-md shadow-[#066a9b]/20"
                    : "bg-white text-zinc-600 border-zinc-200 hover:border-[#066a9b]/40 hover:text-[#066a9b] hover:bg-[#066a9b]/4"
                }`}
              >
                {tag}
              </motion.button>
            ))}
          </motion.div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <button className="relative px-8 py-4 bg-gradient-to-r from-[#066a9b] to-[#0a9fd4] text-white rounded-2xl font-bold text-base shadow-xl shadow-[#066a9b]/25 hover:shadow-[#066a9b]/40 hover:scale-105 active:scale-95 transition-all duration-200 overflow-hidden group">
            <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
            <span className="flex items-center gap-2"><FaScroll /> Browse All Prompts</span>
          </button>
          <button className="px-8 py-4 border-2 border-zinc-200 text-zinc-700 rounded-2xl font-semibold text-base hover:border-[#066a9b]/40 hover:text-[#066a9b] hover:bg-[#066a9b]/4 transition-all duration-200">
            <span className="flex items-center gap-2">Submit a Prompt <BsBoxArrowUpRight /></span>
          </button>
        </div>

        <div className="mt-12 flex items-center justify-center gap-6 text-sm text-zinc-400">
          <span>⭐ 4.9 rating</span>
          <span className="w-px h-4 bg-zinc-200" />
          <span>🧑‍💻 12k+ users</span>
          <span className="w-px h-4 bg-zinc-200" />
          <span>🔄 Updated daily</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </section>
  );
}
