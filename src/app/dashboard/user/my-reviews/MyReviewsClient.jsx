"use client";
import { useState, useEffect } from "react";

const MyReviewsClient = ({ reviews = [] }) => {
  const [filter, setFilter] = useState("all");
  const [visibleCards, setVisibleCards] = useState([]);

  const filtered =
    filter === "all" ? reviews
    : filter === "low" ? reviews.filter((r) => r.rating <= 2)
    : reviews.filter((r) => r.rating === filter);

  useEffect(() => {
    setVisibleCards([]);
    filtered.forEach((_, i) => {
      setTimeout(() => {
        setVisibleCards((prev) => [...prev, i]);
      }, i * 80);
    });
  }, [filter, reviews]);

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "—";
  const uniquePrompts = new Set(reviews.map((r) => r.promptId)).size;

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < rating ? "#115a88" : "#B5D4F4", fontSize: 13 }}>
        ★
      </span>
    ));

  const filters = [
    { label: "All", val: "all" },
    { label: "★ 5", val: 5 },
    { label: "★ 4", val: 4 },
    { label: "★ 3", val: 3 },
    { label: "★ 1–2", val: "low" },
  ];

  return (
    <div className="w-full">
      <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="text-2xl font-semibold text-[#115a88]">My reviews</h1>
        <p className="text-sm text-gray-500 mt-1">Prompts you've rated and commented on</p>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total reviews", val: reviews.length },
          { label: "Avg rating given", val: avg },
          { label: "Prompts reviewed", val: uniquePrompts },
        ].map((s, i) => (
          <div
            key={s.label}
            className="bg-[#f3f7fb] rounded-2xl p-5 border border-gray-200 shadow-sm animate-in fade-in zoom-in duration-500"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <p className="text-xs text-[#185FA5] uppercase tracking-wider font-medium mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-[#115a88]">{s.val}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-6 animate-in fade-in slide-in-from-top-2 duration-700">
        {filters.map((f) => (
          <button
            key={f.val}
            onClick={() => setFilter(f.val)}
            className={`text-sm px-5 py-2 rounded-xl border transition-all duration-300 ${
              filter === f.val
                ? "bg-[#115a88] text-white border-[#115a88] shadow-md"
                : "bg-white text-[#115a88] border-gray-200 hover:bg-[#e6f1fb]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-20 animate-in fade-in duration-700">
            <p className="text-[#115a88] font-medium">No reviews found</p>
          </div>
        ) : (
          filtered.map((r, i) => (
            <div
              key={r._id}
              className={`bg-white p-5 rounded-2xl border border-gray-200 shadow-sm transition-all duration-500 flex justify-between items-center ${
                visibleCards.includes(i) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-base font-semibold text-[#115a88]">{r.promptTitle}</h3>
                  {r.category && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#e6f1fb] text-[#115a88] font-medium uppercase">
                      {r.category}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 italic mb-3">"{r.comment}"</p>
                <div className="flex items-center gap-3">
                  <div className="flex gap-0.5">{renderStars(r.rating)}</div>
                  <span className="text-xs text-gray-400 font-medium">{r.date}</span>
                </div>
              </div>
              <div className="pl-6 border-l border-gray-100 text-center">
                <span className="block text-2xl font-bold text-[#115a88]">{r.rating}</span>
                <span className="text-[10px] text-gray-400 uppercase font-bold">Rating</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyReviewsClient;