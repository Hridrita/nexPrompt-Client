"use client";
import { useState, useEffect } from "react";

const reviews = [
  { name: "John Doe", text: "NexPrompt completely changed how I build my SaaS landing pages!", rating: 5 },
  { name: "Jane Smith", text: "The quality of prompts here is unmatched. Highly recommended.", rating: 5 },
  { name: "Alex Rivera", text: "Found the perfect prompt for my cold email campaign in minutes!", rating: 5 },
  { name: "Sarah Chen", text: "The community aspect is amazing. Love remixing others' prompts!", rating: 4 },
];

export function CustomerReviews() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="py-24 bg-[#066a9b]/5 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#066a9b]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#0a9fd4]/10 rounded-full blur-3xl" />
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <h2 
          className={`text-4xl md:text-5xl font-black text-center mb-4 text-zinc-900 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          What Our Users Say
        </h2>
        <p 
          className={`text-zinc-500 text-center mb-16 max-w-2xl mx-auto transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Real feedback from makers who transformed their workflow with NexPrompt
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          {reviews.map((r, i) => (
            <div
              key={i}
              className={`p-8 bg-white rounded-2xl shadow-sm border border-zinc-100 hover:shadow-xl hover:border-[#066a9b]/20 hover:scale-[1.02] transition-all duration-500 cursor-pointer group ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="flex items-center gap-1 mb-5">
                {[...Array(5)].map((_, idx) => (
                  <span 
                    key={idx} 
                    className={`text-xl transition-all duration-300 ${
                      idx < r.rating ? "text-yellow-400 scale-100" : "text-zinc-300 scale-90"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="text-zinc-700 italic mb-6 leading-relaxed text-lg group-hover:text-zinc-800">
                "{r.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#066a9b] to-[#0a9fd4] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {r.name.charAt(0)}
                </div>
                <h4 className="font-bold text-zinc-900">{r.name}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}