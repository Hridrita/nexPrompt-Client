// app/all-prompt/[id]/PromptDetailsClient.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Copy,
  Check,
  StarFill,
  Star,
  Sparkles,
  Bookmark,
  ChevronDown,
} from "@gravity-ui/icons";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { addBookmark, removeBookmark } from "@/lib/action/bookmark";
import { authClient } from "@/lib/auth-client";
import { getCopyCount } from "@/lib/action/copy";
import { submitReport } from "@/lib/action/report";

const CATEGORY_STYLES = {
  writing: { bg: "#E6F1FB", text: "#0C447C", dot: "#378ADD" },
  coding: { bg: "#E1F5EE", text: "#085041", dot: "#1D9E75" },
  design: { bg: "#FAECE7", text: "#712B13", dot: "#D85A30" },
  marketing: { bg: "#FBEAF0", text: "#72243E", dot: "#D4537E" },
  productivity: { bg: "#FAEEDA", text: "#633806", dot: "#BA7517" },
  default: { bg: "#EEEDFE", text: "#3C3489", dot: "#7F77DD" },
};

const DIFFICULTY_STYLES = {
  beginner: { bg: "#EAF3DE", text: "#27500A" },
  intermediate: { bg: "#FAEEDA", text: "#633806" },
  advanced: { bg: "#FCEBEB", text: "#791F1F" },
};

const getCategoryStyle = (category) =>
  CATEGORY_STYLES[category?.toLowerCase()] || CATEGORY_STYLES.default;

const getDifficultyStyle = (level) =>
  DIFFICULTY_STYLES[level?.toLowerCase()] || DIFFICULTY_STYLES.intermediate;

const getInitials = (name = "") =>
  name
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("") || "?";

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

const PromptDetailsClient = ({ prompt }) => {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [reviews, setReviews] = useState(prompt.reviews || []);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [reportForm, setReportForm] = useState({ reason: "", description: "" });
  const [reporting, setReporting] = useState(false);

  const {
    title,
    description,
    content,
    category,
    tags = [],
    aiTool,
    difficulty,
    thumbnail,
    creator = {},
    copyCount = 0,
    rating = 0,
    createdAt,
  } = prompt;
  console.log('prompt details for creator details', prompt);

  const [localCopyCount, setLocalCopyCount] = useState(copyCount);

  const catStyle = getCategoryStyle(category);
  const diffStyle = getDifficultyStyle(difficulty);
  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 3);
  const [localRating, setLocalRating] = useState(Number(rating) || 0);

  useEffect(() => {
    if (!user?.id) return;
    const check = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/bookmark/check?userId=${user.id}&promptId=${prompt._id}`,
      );
      const data = await res.json();
      setSaved(data.bookmarked);
    };
    check();
  }, [user?.id]);

  const handleCopy = async () => {
    if (!user) {
      toast.error("Login to copy!");
      return;
    }
    try {
      await navigator.clipboard.writeText(content || "");
      setCopied(true);
      setLocalCopyCount((prev) => prev + 1);
      setTimeout(() => setCopied(false), 2000);

      await getCopyCount({ promptId: prompt._id });
      toast.success("prompt copied!");
    } catch (err) {
      toast.error("Somthing went wrong.Please try again!");
    }
  };

  const handleBookmark = async (isSaving) => {
    const payload = {
      promptId: prompt._id,
      userId: user.id,
      promptTitle: title,
      promptThumbnail: thumbnail,
    };

    if (isSaving) {
      await addBookmark(payload);
      toast.success("Bookmarked!");
    } else {
      await removeBookmark({ promptId: prompt._id, userId: user.id });
      toast.success("Removed Bookmark!");
    }
  };

  const handleReviewSubmit = async () => {
    if (!user) return toast.error("Login required!");
    if (!reviewForm.comment.trim()) return toast.error("Write a comment!");

    setSubmitting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/prompts/${prompt._id}/review`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
            rating: reviewForm.rating,
            comment: reviewForm.comment,
          }),
        },
      );
      if (res.ok) {
        const newReview = {
          name: user.name,
          email: user.email,
          rating: reviewForm.rating,
          comment: reviewForm.comment,
          date: new Date().toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        };
        setReviews((prev) => {
  const updated = [...prev, newReview];
  const avg = updated.reduce((sum, r) => sum + (r.rating || 0), 0) / updated.length;
  setLocalRating(avg);
  return updated;
});
        setReviewForm({ rating: 5, comment: "" });
        toast.success("Review submitted!");
      }
    } catch {
      toast.error("Failed to submit!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReport = async () => {
    if (!user) return toast.error("Login to report!");
    if (!reportForm.reason) return toast.error("Select a reason!");

    setReporting(true);
    try {
      await submitReport({
        promptId: prompt._id,
        promptTitle: title,
        creatorId: creator._id,
        reason: reportForm.reason,
        description: reportForm.description,
      });
      toast.success("Report submitted!");
      setReportModal(false);
      setReportForm({ reason: "", description: "" });
    } catch {
      toast.error("Failed to submit report!");
    } finally {
      setReporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] pt-28">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        ></motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 lg:gap-8 items-start">
          <div className="flex flex-col gap-5 sm:gap-6 min-w-0">
            {/* hero card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative overflow-hidden rounded-2xl border border-[#C7DFEA] bg-white"
            >
              {thumbnail && (
                <div className="relative h-36 sm:h-44 w-full overflow-hidden bg-gradient-to-br from-[#115a88] to-[#0c4468]">
                  <Image
                    src={thumbnail}
                    alt={title}
                    fill
                    className="object-cover opacity-90"
                    sizes="(max-width: 1024px) 100vw, 700px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
              )}

              <div className="relative p-5 sm:p-7">
                {!thumbnail && (
                  <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-[#C7DFEA] to-transparent opacity-50 blur-2xl" />
                )}

                <div className="relative flex flex-wrap items-center gap-2 mb-4">
                  {category && (
                    <span
                      className="rounded-full px-3 py-1 text-[11px] font-medium"
                      style={{
                        backgroundColor: catStyle.bg,
                        color: catStyle.text,
                      }}
                    >
                      {category}
                    </span>
                  )}
                  {difficulty && (
                    <span
                      className="rounded-full px-3 py-1 text-[11px] font-medium"
                      style={{
                        backgroundColor: diffStyle.bg,
                        color: diffStyle.text,
                      }}
                    >
                      {difficulty}
                    </span>
                  )}
                  {aiTool && (
                    <span className="flex items-center gap-1.5 rounded-full bg-[#EEEDFE] px-3 py-1 text-[11px] font-medium text-[#3C3489]">
                      <Sparkles width={12} height={12} />
                      {aiTool}
                    </span>
                  )}
                </div>

                <h1 className="relative text-2xl sm:text-3xl font-medium leading-tight text-gray-900 mb-3">
                  {title}
                </h1>

                {description && (
                  <p className="relative text-[14.5px] sm:text-[15px] leading-relaxed text-gray-600">
                    {description}
                  </p>
                )}

                {user && (
                  <div className="border-t border-[#C7DFEA] pt-5 mt-5">
                    <h3 className="text-[14px] font-medium text-gray-800 mb-3">
                      Leave a review
                    </h3>

                    {/* Star rating picker */}
                    <div className="flex items-center gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() =>
                            setReviewForm((p) => ({ ...p, rating: star }))
                          }
                        >
                          {star <= reviewForm.rating ? (
                            <StarFill
                              width={18}
                              height={18}
                              className="text-[#BA7517]"
                            />
                          ) : (
                            <Star
                              width={18}
                              height={18}
                              className="text-gray-300"
                            />
                          )}
                        </button>
                      ))}
                    </div>

                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) =>
                        setReviewForm((p) => ({
                          ...p,
                          comment: e.target.value,
                        }))
                      }
                      placeholder="Write your review..."
                      rows={3}
                      className="w-full rounded-xl border border-[#C7DFEA] p-3 text-[13.5px] text-gray-700 resize-none focus:outline-none focus:border-[#115a88]"
                    />

                    <button
                      onClick={handleReviewSubmit}
                      disabled={submitting}
                      className="mt-3 rounded-xl bg-gradient-to-r from-[#066a9b] to-[#0a9fd4] px-4 py-2 text-[13px] font-medium text-white disabled:opacity-60"
                    >
                      {submitting ? "Submitting..." : "Submit Review"}
                    </button>
                  </div>
                )}

                <div className="relative mt-5 flex flex-wrap items-center gap-4 text-[13px] text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <StarFill
                      width={14}
                      height={14}
                      className="text-[#BA7517]"
                    />
                    <span className="font-medium text-gray-700">
                      {localRating.toFixed(1)}
                    </span>
                    ({reviews.length} reviews)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Copy width={14} height={14} />
                    {localCopyCount} copies
                  </span>
                  {createdAt && (
                    <span className="text-gray-400">
                      Added {formatDate(createdAt)}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>

            {/* prompt content */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08, ease: "easeOut" }}
              className="rounded-2xl border border-[#C7DFEA] bg-white p-5 sm:p-7"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base sm:text-lg font-medium text-gray-900">
                  Prompt content
                </h2>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopy}
                  className="relative flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#066a9b] to-[#0a9fd4] px-3.5 py-2 text-[12.5px] font-medium text-white transition-colors hover:from-[#055580] hover:to-[#0888b8]"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {copied ? (
                      <motion.span
                        key="copied"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-1.5"
                      >
                        <Check width={14} height={14} />
                        Copied
                      </motion.span>
                    ) : (
                      <motion.span
                        key="copy"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-1.5"
                      >
                        <Copy width={14} height={14} />
                        Copy prompt
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>

              <pre className="whitespace-pre-wrap break-words rounded-xl bg-[#0c2e42] p-4 sm:p-5 text-[12.5px] sm:text-[13.5px] leading-relaxed text-[#C7DFEA] font-mono overflow-x-auto">
                {content}
              </pre>
            </motion.div>

            {tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.18, ease: "easeOut" }}
                className="flex flex-wrap gap-2"
              >
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg border border-[#C7DFEA] bg-white px-3 py-1.5 text-[12.5px] text-[#115a88] transition-colors hover:bg-[#E6F1FB] cursor-default"
                  >
                    #{tag}
                  </span>
                ))}
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.22, ease: "easeOut" }}
              className="rounded-2xl border border-[#C7DFEA] bg-white p-5 sm:p-7"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base sm:text-lg font-medium text-gray-900">
                  Reviews
                </h2>
                <span className="flex items-center gap-1.5 text-[13px] text-gray-500">
                  <StarFill width={14} height={14} className="text-[#BA7517]" />
                  <span className="font-medium text-gray-700">
                    {localRating.toFixed(1)}
                  </span>
                  · {reviews.length}
                </span>
              </div>

              {reviews.length === 0 ? (
                <p className="text-[13.5px] text-gray-400 py-4 text-center">
                  No reviews yet. Be the first to leave one.
                </p>
              ) : (
                <div className="flex flex-col gap-4">
                  {visibleReviews.map((review, i) => (
                    <motion.div
                      key={review._id || review.id || i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-20px" }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="flex gap-3 border-t border-[#C7DFEA]/50 pt-4 first:border-t-0 first:pt-0"
                    >
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#115a88] to-[#1c8fc7] text-[12px] font-medium text-white">
                        {getInitials(review.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                          <span className="text-[13.5px] font-medium text-gray-800">
                            {review.name}
                          </span>
                          <span className="text-[12px] text-gray-400">
                            {review.date}
                          </span>
                        </div>
                        <div className="flex items-center gap-0.5 mt-0.5 mb-1.5">
                          {Array.from({ length: 5 }).map((_, idx) =>
                            idx < review.rating ? (
                              <StarFill
                                key={idx}
                                width={12}
                                height={12}
                                className="text-[#BA7517]"
                              />
                            ) : (
                              <Star
                                key={idx}
                                width={12}
                                height={12}
                                className="text-gray-300"
                              />
                            ),
                          )}
                        </div>
                        <p className="text-[13.5px] leading-relaxed text-gray-600">
                          {review.comment || review.text}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {reviews.length > 3 && !showAllReviews && (
                <button
                  onClick={() => setShowAllReviews(true)}
                  className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#C7DFEA] py-2.5 text-[13px] font-medium text-[#115a88] transition-colors hover:bg-[#E6F1FB]"
                >
                  Show all {reviews.length} reviews
                  <ChevronDown width={14} height={14} />
                </button>
              )}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
            className="flex flex-col gap-5 lg:sticky lg:top-6"
          >
            <div className="rounded-2xl border border-[#C7DFEA] bg-white p-5">
              <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400 mb-3">
                Created by
              </p>
              <div className="flex items-center gap-3">
                {creator.image ? (
                  <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={creator.image}
                      alt={creator.name || "Creator"}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#115a88] to-[#1c8fc7] text-[14px] font-medium text-white">
                    {getInitials(creator.name)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate text-[14.5px] text-[#115a88] font-bold">
                    {creator.name.toUpperCase() || "Unknown creator"}
                  </p>
                  {creator.role && (
                    <p className="truncate text-[12.5px] text-gray-500">
                      {creator.role}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* stats card */}
            <div className="rounded-2xl border border-[#C7DFEA] bg-gradient-to-br from-[#115a88] to-[#0c4468] p-5 text-white">
              <p className="text-[11px] font-medium uppercase tracking-wide text-[#C7DFEA] mb-4">
                Prompt stats
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-medium">{localCopyCount}</p>
                  <p className="text-[12px] text-[#C7DFEA] mt-0.5">Copies</p>
                </div>
                <div>
                  <p className="text-2xl font-medium">
                    {localRating.toFixed(1)}
                  </p>
                  <p className="text-[12px] text-[#C7DFEA] mt-0.5">Rating</p>
                </div>
              </div>
            </div>

            {/* Report Modal */}
            {reportModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full max-w-md rounded-2xl border border-[#C7DFEA] bg-white p-6"
                >
                  <h3 className="text-[15px] font-medium text-gray-900 mb-4">
                    Report Prompt
                  </h3>

                  <div className="flex flex-col gap-2 mb-4">
                    {[
                      "Inappropriate Content",
                      "Spam",
                      "Copyright Violation",
                      "Misleading",
                      "Other",
                    ].map((r) => (
                      <button
                        key={r}
                        onClick={() =>
                          setReportForm((p) => ({ ...p, reason: r }))
                        }
                        className={`rounded-xl border px-4 py-2.5 text-left text-[13.5px] transition-colors ${
                          reportForm.reason === r
                            ? "border-[#115a88] bg-[#E6F1FB] text-[#115a88]"
                            : "border-[#C7DFEA] text-gray-600 hover:bg-[#F7FAFC]"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>

                  <textarea
                    value={reportForm.description}
                    onChange={(e) =>
                      setReportForm((p) => ({
                        ...p,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Additional details (optional)..."
                    rows={3}
                    className="w-full rounded-xl border border-[#C7DFEA] p-3 text-[13.5px] text-gray-700 resize-none focus:outline-none focus:border-[#115a88] mb-4"
                  />

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setReportModal(false);
                        setReportForm({ reason: "", description: "" });
                      }}
                      className="flex-1 rounded-xl border border-[#C7DFEA] py-2.5 text-[13px] text-gray-500 hover:bg-[#F7FAFC]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReport}
                      disabled={reporting}
                      className="flex-1 rounded-xl bg-gradient-to-r from-red-500 to-red-600 py-2.5 text-[13px] font-medium text-white disabled:opacity-60"
                    >
                      {reporting ? "Submitting..." : "Submit Report"}
                    </button>
                  </div>
                </motion.div>
              </div>
            )}

            {/* action buttons */}
            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleCopy}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#066a9b] to-[#0a9fd4] py-3 text-[13.5px] font-medium text-white transition-colors hover:from-[#055580] hover:to-[#0888b8]"
              >
                <Copy width={15} height={15} />
                Copy prompt
              </motion.button>

              {/* bookmark button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  if (!user) {
                    toast.error("Login to bookmark!");
                    return;
                  }
                  const next = !saved;
                  setSaved(next);
                  handleBookmark(next);
                }}
                className={`flex items-center justify-center rounded-xl border px-3.5 transition-colors ${
                  saved
                    ? "border-red-400 bg-red-50 text-red-500"
                    : "border-[#C7DFEA] text-gray-400 hover:text-[#115a88]"
                }`}
              >
                <Bookmark
                  width={17}
                  height={17}
                  fill={saved ? "#ef4444" : "none"}
                  stroke={saved ? "#ef4444" : "currentColor"}
                />
              </motion.button>
            </div>
            <button
              onClick={() => {
                if (!user) return toast.error("Login to report!");
                setReportModal(true);
              }}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-red-500 py-2.5 text-[13px] text-red-500 hover:bg-red-100 transition-colors"
            >
              Report Prompt
            </button>
            <Link
              href="/all-prompt"
              className="mb-5 sm:mb-7 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#115a88] transition-colors"
            >
              <ArrowLeft width={16} height={16} />
              Back to all prompts
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PromptDetailsClient;
