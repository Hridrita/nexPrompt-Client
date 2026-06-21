"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { UploadCloud, X, Loader2 } from "lucide-react";
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
  const {data:session} = authClient.useSession();
  const user = session?.user;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { difficulty: "", visibility: "" },
  });

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
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setPreview(null);
    setValue("thumbnail", "", { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    
    const payload = {
      creatorsId: user.id,
      ...data,
      tags: data.tags.split(",").map((t) => t.trim()).filter(Boolean),
      copyCount: 0,
      status: "pending",
    };
    try {
      console.log("Submit payload:", payload);

      //api called here
      const res = await createPrompt(payload);

      if(res.insertedId){
        toast.success("Prompt created successfully!")
        setSubmitting(true);
      }
      
      reset();
      setPreview(null);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0a9fd4] focus:border-transparent transition-all";

  const labelClass = "text-sm font-medium text-[#115a88] mb-1.5 block";
  const errorClass = "text-xs text-red-500 mt-1";

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto bg-[#f3f7fb] rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6"
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
            Pending
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

      {/* Title */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <label className={labelClass}>Prompt Title</label>
        <input {...register("title")} placeholder="e.g. Ultimate SEO Blog Generator" className={inputClass} />
        {errors.title && <p className={errorClass}>{errors.title.message}</p>}
      </motion.div>

      {/* Description */}
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

      {/* Content */}
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

      {/* Category + AI Tool */}
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

      {/* Tags */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <label className={labelClass}>Tags</label>
        <input {...register("tags")} placeholder="comma separated, e.g. seo, blog, marketing" className={inputClass} />
        {errors.tags && <p className={errorClass}>{errors.tags.message}</p>}
      </motion.div>
      

      {/* Difficulty */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <label className={labelClass}>Difficulty Level</label>
        <Controller
          name="difficulty"
          control={control}
          render={({ field }) => (
            <div className="flex gap-3">
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

      {/* Visibility */}
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
                  {v}
                </button>
              ))}
            </div>
          )}
        />
        {errors.visibility && <p className={errorClass}>{errors.visibility.message}</p>}
      </motion.div>

      {/* Thumbnail */}
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

      {/* Submit */}
      <motion.button
        type="submit"
        disabled={submitting}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-gradient-to-r from-[#066a9b] to-[#0a9fd4] text-white font-medium py-3 rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Publish Prompt"}
      </motion.button>
    </motion.form>
  );
}