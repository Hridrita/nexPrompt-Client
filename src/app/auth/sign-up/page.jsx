"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FiEye,
  FiEyeOff,
  FiUser,
  FiMail,
  FiImage,
  FiLock,
  FiAlertCircle,
  FiStar,
  FiTrendingUp,
} from "react-icons/fi";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const signUpSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(3, "Name must be at least 3 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  photoUrl: z.string().min(1, "Photo URL is required").url("Enter a valid URL"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
  role: z
    .string().min(1, "Role is required"),
});

const containerVariant = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const fieldVariant = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const errorVariant = {
  hidden: { opacity: 0, height: 0, y: -4 },
  show: {
    opacity: 1,
    height: "auto",
    y: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  exit: { opacity: 0, height: 0, y: -4, transition: { duration: 0.15 } },
};

function FormField({ label, icon, error, children }) {
  return (
    <motion.div variants={fieldVariant}>
      <label className="block text-sm font-medium text-zinc-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
          {icon}
        </span>
        {children}
      </div>
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            key={error}
            variants={errorVariant}
            initial="hidden"
            animate="show"
            exit="exit"
            className="flex items-center gap-1.5 text-red-500 text-xs mt-1.5 overflow-hidden"
          >
            <FiAlertCircle className="flex-shrink-0" /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A10.99 10.99 0 0012 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1A6.6 6.6 0 015.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 001 12c0 1.77.42 3.45 1.18 4.94l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function FloatingCard({ icon, title, sub, className, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className={`absolute bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-xl ${className}`}
    >
      <div className="flex items-center gap-2 text-white">
        <span className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
          {icon}
        </span>
        <div>
          <p className="text-sm font-semibold leading-tight">{title}</p>
          <p className="text-xs text-white/60">{sub}</p>
        </div>
      </div>
    </motion.div>
  );
}

function BrandPanel() {
  return (
    <div className="hidden lg:flex relative w-1/2 overflow-hidden bg-gradient-to-br from-[#066a9b] via-[#0a4d72] to-[#03253a]">
      {/* glow blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#0a9fd4]/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-10 w-96 h-96 bg-[#066a9b]/40 rounded-full blur-3xl" />

      {/* dot grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />

      <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
        {/* <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <span className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
            <FiZap className="text-[#7fd4f5]" />
          </span>
          <span className="text-lg font-bold tracking-tight">NexPrompt</span>
        </motion.div> */}

        <div className="flex-1 flex flex-col justify-center max-w-md">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl font-bold leading-tight mb-4"
          >
            Join the Community <br /> of Prompt Creators
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-white/70 text-base leading-relaxed"
          >
            Create your free account to publish, bookmark, and review AI prompts
            for ChatGPT, Gemini, Claude & Midjourney.
          </motion.p>
        </div>

        {/* decorative floating cards */}
        <div className="relative h-44">
          <FloatingCard
            icon={<FiStar className="text-yellow-300" />}
            title="4.9k Bookmarks"
            sub="Top rated prompts"
            className="left-0 bottom-20 w-48"
            delay={0.4}
          />
          <FloatingCard
            icon={<FiTrendingUp className="text-green-300" />}
            title="Trending Now"
            sub="Midjourney art packs"
            className="right-2 bottom-0 w-52"
            delay={0.55}
          />
        </div>
      </div>
    </div>
  );
}

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [role, setRole] = useState("Explorer");

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signUpSchema),
    mode: "onTouched",
  });

  const onSubmit = async (value) => {
    const formData = {
      ...value,
      role
    }
    console.log("Sign up data:", formData);
    

    const {data,error} = await authClient.signUp.email({
      name:formData.name,
      email: formData.email,
      password: formData.password,
      image: formData.photoUrl,
      role: formData.role
      })

      if(data){
        setSubmitted(true);
        router.push("/auth/sign-in");
      }
      if(error){
        toast.error(error.message || "Registration failed. Please try again.")
      }
    
  };

  const handleGoogleSignUp = () => {
    console.log("Google sign up clicked");
  };

  const inputClass = (hasError) =>
    `w-full pl-11 pr-4 py-3 rounded-xl border outline-none transition-all ${
      hasError
        ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
        : "border-zinc-200 focus:border-[#066a9b] focus:ring-2 focus:ring-[#066a9b]/20"
    }`;

  return (
    <div className="min-h-screen bg-white flex">
      <BrandPanel />

      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-32 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.4] lg:hidden"
          style={{
            backgroundImage:
              "radial-gradient(circle, #e4e4e7 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage:
              "radial-gradient(ellipse 60% 50% at 50% 40%, black 30%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 60% 50% at 50% 40%, black 30%, transparent 75%)",
          }}
        />

        <motion.div
          variants={containerVariant}
          initial="hidden"
          animate="show"
          className="relative w-full max-w-md"
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="text-center py-10"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.15,
                    type: "spring",
                    stiffness: 200,
                    damping: 12,
                  }}
                  className="w-16 h-16 mx-auto rounded-full bg-linear-to-br from-[#066a9b] to-[#0a9fd4] flex items-center justify-center text-white text-3xl mb-5"
                >
                  ✓
                </motion.div>
                <h3 className="text-2xl font-bold text-zinc-900 mb-2">
                  Account Created!
                </h3>
                <p className="text-zinc-500">
                  Welcome aboard — you're all set.
                </p>
              </motion.div>
            ) : (
              <motion.div key="form" exit={{ opacity: 0 }}>
                {/* Header */}
                <motion.div
                  variants={fieldVariant}
                  className="text-center mb-8"
                >
                  <h2 className="text-3xl font-bold text-zinc-900">
                    Create Account
                  </h2>
                  <p className="text-zinc-500 mt-2">Join our community today</p>
                </motion.div>

                {/* Google Sign Up */}
                <motion.button
                  variants={fieldVariant}
                  type="button"
                  onClick={handleGoogleSignUp}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-3 border border-zinc-200 rounded-xl py-3 font-semibold text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-all duration-200 mb-6"
                >
                  <GoogleIcon />
                  Continue with Google
                </motion.button>

                {/* Divider */}
                <motion.div
                  variants={fieldVariant}
                  className="flex items-center gap-3 mb-6"
                >
                  <span className="flex-1 h-px bg-zinc-200" />
                  <span className="text-xs text-zinc-400 font-medium">
                    OR SIGN UP WITH EMAIL
                  </span>
                  <span className="flex-1 h-px bg-zinc-200" />
                </motion.div>

                {/* Form */}
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-5"
                  noValidate
                >
                  <FormField
                    label="Full Name"
                    icon={<FiUser />}
                    error={errors.name?.message}
                  >
                    <input
                      type="text"
                      {...register("name")}
                      className={inputClass(errors.name)}
                      placeholder="Enter your name"
                    />
                  </FormField>

                  <FormField
                    label="Email Address"
                    icon={<FiMail />}
                    error={errors.email?.message}
                  >
                    <input
                      type="email"
                      {...register("email")}
                      className={inputClass(errors.email)}
                      placeholder="you@example.com"
                    />
                  </FormField>

                  <FormField
                    label="Photo URL"
                    icon={<FiImage />}
                    error={errors.photoUrl?.message}
                  >
                    <input
                      type="text"
                      {...register("photoUrl")}
                      className={inputClass(errors.photoUrl)}
                      placeholder="https://example.com/photo.jpg"
                    />
                  </FormField>

                  <FormField
                    label="Password"
                    icon={<FiLock />}
                    error={errors.password?.message}
                  >
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      className={`${inputClass(errors.password)} pr-11`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </FormField>

                  <motion.div variants={fieldVariant} className="mb-5">
                    <label className="block text-sm font-medium text-zinc-700 mb-2">
                      Select Your Role
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {["Explorer", "Creator"].map((option) => (
                        <label
                          key={option}
                          className={`flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${
                            role === option
                              ? "border-[#066a9b] bg-[#066a9b]/5 text-[#066a9b]"
                              : "border-zinc-200 hover:border-zinc-300"
                          }`}
                        >
                          <input
                            type="radio"
                            {...register("role")}
                            value={option}
                            checked={role === option}
                            onChange={() => setRole(option)}
                            className="hidden"
                          />
                          <span className="text-sm font-semibold">
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </motion.div>

                  <motion.button
                    variants={fieldVariant}
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    className="w-full bg-gradient-to-r from-[#066a9b] to-[#0a9fd4] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-[#066a9b]/20 hover:shadow-[#066a9b]/40 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Sign Up"
                    )}
                  </motion.button>
                </form>

                {/* Footer */}
                <motion.p
                  variants={fieldVariant}
                  className="text-center text-sm text-zinc-500 mt-6"
                >
                  Already have an account?{" "}
                  <Link
                    href={"/auth/sign-in"}
                    className="text-[#066a9b] font-semibold hover:underline"
                  >
                    Sign in
                  </Link>
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
