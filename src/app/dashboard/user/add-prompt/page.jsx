"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { UploadCloud, X, Loader2, Clock } from "lucide-react";
import { createPrompt } from "@/lib/action/prompts";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const schema = z.object({
  title: z.string().min(5, "Title min 5 char").max(100),
  description: z.string().min(20, "Description min 20 char").max(500),
  content: z.string().min(20, "Prompt content min 20 char"),
  category: z.string().min(1, "Category required"),
  aiTool: z.string().min(1, "AI Tool required"),
  tags: z.string().min(1, "At least 1 tag required"),
  difficulty: z.enum(["Beginner", "Intermediate", "Pro"], {
    required_error: "Select difficulty",
  }),
  visibility: z.enum(["public", "private"], {
    required_error: "Select visibility",
  }),
  thumbnail: z.string().min(1, "Thumbnail required"),
});

const categories = ["Writing", "Coding", "Marketing", "Design", "Productivity", "Education"];
const aiTools = ["ChatGPT", "Claude", "Gemini", "Midjourney", "DALL-E", "Other"];

export default function AddPromptForm() {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [promptCount, setPromptCount] = useState(0);
  const [isLoadingCount, setIsLoadingCount] = useState(true);
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { difficulty: "", visibility: "" },
  });

  const thumbnail = watch("thumbnail");

  useEffect(() => {
    if (user?.id) {
      fetchPromptCount(user.id);
    }
  }, [user?.id]);

  const fetchPromptCount = async (userId) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/prompts/creator/${userId}`, {
        cache: "no-store"
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      setPromptCount(data.length);
      setIsLoadingCount(false);
    } catch (error) {
      console.error("Error fetching prompt count:", error);
      setIsLoadingCount(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API}`,
        { method: "POST", body: formData }
      );
      const data = await response.json();
      const url = data?.data?.url;
      if (url) {
        setValue("thumbnail", url, { shouldValidate: true });
        setPreview(url);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setPreview(null);
    setValue("thumbnail", "", { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    if (!user?.id) {
      toast.error("Please login to create a prompt");
      return;
    }

    const payload = {
      creatorsId: user.id,
      ...data,
      tags: data.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };

    try {
      setSubmitting(true);
      const res = await createPrompt(payload);

      if (res.error === "Limit reached" || res.message?.includes("limit")) {
        toast.error("You have reached your limit of 3 prompts! Upgrade to premium.");
        return;
      }

      if (res.insertedId) {
        // toast.success("✅ Prompt submitted successfully! Waiting for admin approval.");
        reset();
        setPreview(null);
        await fetchPromptCount(user.id);
        
        // Show pending status notification
        setTimeout(() => {
          toast.custom((t) => (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 max-w-md">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-800">Prompt is Pending</p>
                  <p className="text-sm text-gray-600">Your prompt will be visible in the marketplace once approved by admin.</p>
                </div>
              </div>
            </div>
          ), { duration: 5000 });
        }, 1000);
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.message || "Failed to submit prompt. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0a9fd4] focus:border-transparent transition-all";
  const labelClass = "text-sm font-medium text-[#115a88] mb-1.5 block";
  const errorClass = "text-xs text-red-500 mt-1";

  const isFreeUser = user?.plan === "free_user" || !user?.plan;
  const limitReached = isFreeUser && promptCount >= 3;

  if (isLoadingCount) {
    return (
      <div className="max-w-3xl mx-auto bg-[#f3f7fb] rounded-2xl border border-gray-100 shadow-sm p-8">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 text-[#0a9fd4] animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Limit Reached Screen */}
      {limitReached ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm"
        >
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-amber-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Limit Reached!</h3>
            <p className="text-gray-500 mb-6">
              You've used all <strong className="text-gray-700">3</strong> free prompt submissions. 
              Upgrade to premium to continue creating and sharing prompts.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a 
                href="/payment" 
                className="bg-gradient-to-r from-[#066a9b] to-[#0a9fd4] text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
              >
                Upgrade Now
              </a>
              <a 
                href="/my-prompts" 
                className="border border-gray-200 text-gray-700 px-8 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all"
              >
                View My Prompts
              </a>
            </div>
          </div>
        </motion.div>
      ) : (
        // Add Prompt Form
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[#f3f7fb] rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6"
        >
          <div>
            <h2 className="text-2xl font-semibold text-[#115a88]">Create New Prompt</h2>
            <p className="text-sm text-gray-500 mt-1">Fill in details to publish your prompt</p>
          </div>

          {/* Status & Copy Count Info */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="flex items-center gap-3 bg-blue-50/50 border border-blue-100 rounded-xl px-4 py-3"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">Status:</span>
              <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                Pending Approval
              </span>
            </div>
            <div className="w-px h-4 bg-gray-200" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">Copy Count:</span>
              <span className="text-xs font-semibold text-gray-700 bg-white px-2.5 py-1 rounded-full border border-gray-200">
                0
              </span>
            </div>
          </motion.div>

          {/* Prompt Counter for Free Users */}
          {isFreeUser && (
            <motion.div 
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <p className="text-sm text-gray-600 font-medium">
                  Free Plan: <span className="font-bold text-[#115a88]">{promptCount}</span> / 3 prompts used
                </p>
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#066a9b] to-[#0a9fd4] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((promptCount / 3) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <a href="/pricing" className="text-xs font-medium text-[#0a9fd4] hover:underline">
                Upgrade →
              </a>
            </motion.div>
          )}

          {/* Form Fields */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <label className={labelClass}>Prompt Title</label>
            <input {...register("title")} placeholder="e.g. Ultimate SEO Blog Generator" className={inputClass} />
            {errors.title && <p className={errorClass}>{errors.title.message}</p>}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <label className={labelClass}>Prompt Description</label>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="Short summary of what this prompt does"
              className={`${inputClass} resize-none`}
            />
            {errors.description && <p className={errorClass}>{errors.description.message}</p>}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <label className={labelClass}>Prompt Content</label>
            <textarea
              {...register("content")}
              rows={6}
              placeholder="Paste your full prompt here..."
              className={`${inputClass} resize-none font-mono text-[13px]`}
            />
            {errors.content && <p className={errorClass}>{errors.content.message}</p>}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div>
              <label className={labelClass}>Category</label>
              <select {...register("category")} className={inputClass} defaultValue="">
                <option value="" disabled>Select category</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.category && <p className={errorClass}>{errors.category.message}</p>}
            </div>

            <div>
              <label className={labelClass}>AI Tool</label>
              <select {...register("aiTool")} className={inputClass} defaultValue="">
                <option value="" disabled>Select AI tool</option>
                {aiTools.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {errors.aiTool && <p className={errorClass}>{errors.aiTool.message}</p>}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <label className={labelClass}>Tags (comma separated)</label>
            <input {...register("tags")} placeholder="e.g. seo, blog, marketing" className={inputClass} />
            {errors.tags && <p className={errorClass}>{errors.tags.message}</p>}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <label className={labelClass}>Difficulty Level</label>
            <Controller
              name="difficulty"
              control={control}
              render={({ field }) => (
                <div className="flex gap-3 flex-wrap">
                  {["Beginner", "Intermediate", "Pro"].map((level) => (
                    <button
                      type="button"
                      key={level}
                      onClick={() => field.onChange(level)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                        field.value === level
                          ? "bg-[#066a9b] text-white border-[#066a9b] shadow-sm"
                          : "bg-white text-gray-600 border-gray-200 hover:border-[#0a9fd4]"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              )}
            />
            {errors.difficulty && <p className={errorClass}>{errors.difficulty.message}</p>}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <label className={labelClass}>Visibility</label>
            <Controller
              name="visibility"
              control={control}
              render={({ field }) => (
                <div className="flex gap-3">
                  {["public", "private"].map((v) => (
                    <button
                      type="button"
                      key={v}
                      onClick={() => field.onChange(v)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                        field.value === v
                          ? "bg-[#066a9b] text-white border-[#066a9b] shadow-sm"
                          : "bg-white text-gray-600 border-gray-200 hover:border-[#0a9fd4]"
                      }`}
                    >
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            />
            {errors.visibility && <p className={errorClass}>{errors.visibility.message}</p>}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <label className={labelClass}>Thumbnail Image</label>

            {!preview ? (
              <label
                htmlFor="thumbnail-upload"
                className="flex flex-col items-center justify-center gap-2 w-full h-36 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 cursor-pointer hover:border-[#0a9fd4] hover:bg-blue-50/30 transition-all"
              >
                {uploading ? (
                  <Loader2 className="w-6 h-6 text-[#0a9fd4] animate-spin" />
                ) : (
                  <>
                    <UploadCloud className="w-6 h-6 text-gray-400" />
                    <span className="text-xs text-gray-500">Click to upload thumbnail</span>
                    <span className="text-[10px] text-gray-400">PNG, JPG, WEBP (max 5MB)</span>
                  </>
                )}
                <input
                  id="thumbnail-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            ) : (
              <div className="relative w-full h-36 rounded-xl overflow-hidden border border-gray-200">
                <img src={preview} alt="thumbnail" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full hover:bg-black/80 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            {errors.thumbnail && <p className={errorClass}>{errors.thumbnail.message}</p>}
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={submitting}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-[#066a9b] to-[#0a9fd4] text-white font-medium py-3.5 rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Clock className="w-4 h-4" />
                Submit for Approval
              </>
            )}
          </motion.button>

          {/* Info Note */}
          <p className="text-xs text-center text-gray-500">
            ⏳ Your prompt will be reviewed by admin and will appear in the marketplace once approved.
          </p>
        </motion.form>
      )}
    </div>
  );
}