"use client";
import { useState, useEffect } from "react";
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

export function WhyChooseUs() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-white to-[#066a9b]/5 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden">
        <div className="absolute top-10 left-20 w-40 h-40 bg-[#066a9b]/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-20 w-48 h-48 bg-[#0a9fd4]/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <h2 
          className={`text-4xl md:text-5xl font-black text-center mb-6 text-zinc-900 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Why Choose NexPrompt?
        </h2>
        <p 
          className={`text-zinc-500 text-center mb-16 max-w-2xl mx-auto transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Everything you need to supercharge your AI workflow in one place
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className={`p-8 bg-white rounded-3xl border border-zinc-100 shadow-sm hover:shadow-2xl hover:border-[#066a9b]/30 hover:-translate-y-3 transition-all duration-500 group cursor-pointer ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300"
                style={{ background: `linear-gradient(135deg, ${f.color}20, ${f.color}10)` }}
              >
                <f.icon style={{ color: f.color }} className="text-xl" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-zinc-900 group-hover:text-[#066a9b] transition-colors">{f.title}</h3>
              <p className="text-zinc-600 leading-relaxed">{f.desc}</p>
              <div className="mt-4 flex items-center text-[#066a9b] font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Learn more <span className="ml-1">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}