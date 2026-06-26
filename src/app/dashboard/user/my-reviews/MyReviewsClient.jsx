"use client";
import { UserStar } from "lucide-react";
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
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
      {/* Header */}
      <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="text-xl sm:text-2xl font-semibold text-[#115a88] flex items-center gap-2">
          <UserStar className="w-5 h-5 sm:w-6 sm:h-6" />
          My Reviews
        </h1>
        <p className="text-sm text-gray-500 mt-1">Prompts you've rated and commented on</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
        {[
          { label: "Total reviews", val: reviews.length },
          { label: "Avg rating given", val: avg },
          { label: "Prompts reviewed", val: uniquePrompts },
        ].map((s, i) => (
          <div
            key={s.label}
            className="bg-[#f3f7fb] rounded-2xl p-4 sm:p-5 border border-[#C7DFEA] shadow-sm animate-in fade-in zoom-in duration-500"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <p className="text-xs text-[#185FA5] uppercase tracking-wider font-medium mb-1">{s.label}</p>
            <p className="text-xl sm:text-2xl font-bold text-[#115a88]">{s.val}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-6 animate-in fade-in slide-in-from-top-2 duration-700">
        {filters.map((f) => (
          <button
            key={f.val}
            onClick={() => setFilter(f.val)}
            className={`text-xs sm:text-sm px-4 sm:px-5 py-1.5 sm:py-2 rounded-xl border transition-all duration-300 ${
              filter === f.val
                ? "bg-[#115a88] text-white border-[#115a88] shadow-md"
                : "bg-white text-[#115a88] border-[#C7DFEA] hover:bg-[#e6f1fb]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-3 sm:space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16 sm:py-20 animate-in fade-in duration-700">
            <div className="w-16 h-16 bg-[#f3f7fb] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#C7DFEA]">
              <UserStar className="w-8 h-8 text-[#115a88]/40" />
            </div>
            <p className="text-[#115a88] font-medium">No reviews found</p>
            <p className="text-sm text-gray-400 mt-1">You haven't reviewed any prompts yet</p>
          </div>
        ) : (
          filtered.map((r, i) => (
            <div
              key={r._id}
              className={`bg-[#f3f7fb] p-4 sm:p-5 rounded-2xl border border-[#C7DFEA] shadow-sm transition-all duration-500 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-6 ${
                visibleCards.includes(i) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="text-sm sm:text-base font-semibold text-[#115a88] truncate">
                    {r.promptTitle}
                  </h3>
                  {r.category && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#e6f1fb] text-[#115a88] font-medium uppercase whitespace-nowrap">
                      {r.category}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 italic mb-3 line-clamp-2">"{r.comment}"</p>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex gap-0.5">{renderStars(r.rating)}</div>
                  <span className="text-xs text-gray-400 font-medium">{r.date}</span>
                </div>
              </div>
              <div className="flex sm:flex-col items-center gap-2 sm:gap-0 sm:pl-6 sm:border-l border-[#C7DFEA]">
                <span className="text-2xl font-bold text-[#115a88]">{r.rating}</span>
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