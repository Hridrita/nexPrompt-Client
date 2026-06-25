"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Star, Eye, Copy, Bookmark } from "lucide-react";
import { getFeaturedPrompts } from "@/lib/api/featured";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

const Featured = () => {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedPrompts();
  }, []);

  const fetchFeaturedPrompts = async () => {
    setLoading(true);
    try {
      const data = await getFeaturedPrompts();
      setPrompts(data || []);
    } catch (error) {
      console.error("Error fetching featured prompts:", error);
      toast.error("Failed to load featured prompts");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (promptId) => {
    if (!user) {
      toast.custom((t) => (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-2xl">
          <p className="text-gray-800 font-medium">Login Required</p>
          <button onClick={() => { toast.dismiss(t.id); router.push("/auth/sign-in"); }} className="text-[#115a88] font-semibold underline mt-1">Login Now</button>
        </div>
      ));
      return;
    }
    router.push(`/all-prompt/${promptId}`);
  };

  const formatNumber = (num) => (!num ? "0" : num.toLocaleString());

  if (loading) return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-12 px-4 container mx-auto animate-pulse">
    {[1, 2, 3].map((i) => <div key={i} className="h-96 bg-zinc-100 rounded-3xl" />)}
  </div>;

  if (prompts.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-24">
      {/* Header Section */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#066a9b]/20 bg-[#066a9b]/5 text-[#066a9b] text-xs font-semibold uppercase tracking-widest mb-5">
          Featured Collections
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-zinc-900 mb-5">
          Top-Rated AI Prompts
        </h2>
        <p className="text-zinc-500 max-w-2xl mx-auto text-lg">
          Hand-picked prompts curated by our community to help you achieve the best results.
        </p>
      </motion.div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {prompts.map((prompt, index) => (
          <motion.div
            key={prompt._id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -10 }}
            className="group flex flex-col bg-white rounded-3xl border border-zinc-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(6,106,155,0.15)] transition-all duration-500 overflow-hidden"
          >
            {/* Thumbnail */}
            <div className="relative h-56 w-full bg-zinc-100 overflow-hidden">
              <img src={prompt.thumbnail || "/placeholder.jpg"} alt={prompt.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#066a9b] text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5 shadow-sm">
                <Star className="w-3.5 h-3.5 fill-[#066a9b]" /> Featured
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="font-bold text-zinc-900 text-xl mb-2 line-clamp-1 group-hover:text-[#066a9b] transition-colors">{prompt.title}</h3>
              <p className="text-sm text-zinc-500 mb-6 flex-grow leading-relaxed line-clamp-2">{prompt.description}</p>

              {/* Footer */}
              <div className="mt-auto pt-5 border-t border-zinc-100 flex items-center justify-between">
                <div className="flex gap-4 text-zinc-400">
                  <div className="flex items-center gap-1.5 text-xs font-medium"><Copy className="w-4 h-4" /> {formatNumber(prompt.copyCount)}</div>
                  <div className="flex items-center gap-1.5 text-xs font-medium"><Bookmark className="w-4 h-4" /> {formatNumber(prompt.bookmarkCount)}</div>
                </div>
                <button 
                    onClick={() => handleViewDetails(prompt._id)} 
                    className="bg-zinc-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#066a9b] transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Featured;