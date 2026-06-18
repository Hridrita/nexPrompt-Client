"use client";
import { useState, useEffect } from "react";

const creators = [
  { name: "Alex Rivet", role: "AI Strategist", img: "/avatar1.png", prompts: "2.4K" },
  { name: "Sarah Chen", role: "Prompt Engineer", img: "/avatar2.png", prompts: "1.8K" },
  { name: "Mike Ross", role: "SaaS Maker", img: "/avatar3.png", prompts: "1.2K" },
  { name: "Emma Watson", role: "Content Creator", img: "/avatar4.png", prompts: "950" },
];

export function TopCreators() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[#066a9b]/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-[#0a9fd4]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <h2 
          className={`text-4xl md:text-5xl font-black text-center mb-4 text-zinc-900 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Top Prompt Creators
        </h2>
        <p 
          className={`text-zinc-500 text-center mb-16 max-w-2xl mx-auto transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Meet the experts crafting the highest-quality prompts for our community
        </p>
        
        <div className="flex flex-wrap justify-center gap-8">
          {creators.map((c, i) => (
            <div
              key={i}
              className={`w-56 p-6 bg-white border-2 border-zinc-100 rounded-2xl flex flex-col items-center hover:border-[#066a9b]/40 hover:shadow-xl hover:shadow-[#066a9b]/10 hover:-translate-y-2 transition-all duration-500 cursor-pointer group ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className="relative mb-4">
                <div className="w-24 h-24 bg-gradient-to-br from-[#066a9b] to-[#0a9fd4] rounded-full mb-4 flex items-center justify-center text-white font-bold text-2xl group-hover:scale-110 transition-transform duration-300">
                  {c.name.charAt(0)}
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-br from-[#066a9b] to-[#0a9fd4] rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
              <h4 className="font-bold text-zinc-900 text-lg mb-1 group-hover:text-[#066a9b] transition-colors">{c.name}</h4>
              <p className="text-sm text-zinc-500 mb-3">{c.role}</p>
              <div className="px-3 py-1.5 bg-[#066a9b]/10 rounded-full text-[#066a9b] text-xs font-semibold">
                {c.prompts} prompts
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="px-8 py-3 border-2 border-[#066a9b]/30 text-[#066a9b] rounded-xl font-semibold hover:bg-[#066a9b] hover:text-white hover:border-[#066a9b] transition-all duration-300 group">
            View All Creators <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}