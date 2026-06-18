import React from 'react';

export default function SignUp() {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center pt-32">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-zinc-100 p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-zinc-900">Create Account</h2>
          <p className="text-zinc-500 mt-2">Join our community today</p>
        </div>

        {/* Form */}
        <form className="space-y-5">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Full Name</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-[#066a9b] focus:ring-2 focus:ring-[#066a9b]/20 outline-none transition-all"
              placeholder="Enter your name" 
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Email Address</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-[#066a9b] focus:ring-2 focus:ring-[#066a9b]/20 outline-none transition-all"
              placeholder="you@example.com" 
            />
          </div>

          {/* Photo URL Field */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Photo URL</label>
            <input 
              type="url" 
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-[#066a9b] focus:ring-2 focus:ring-[#066a9b]/20 outline-none transition-all"
              placeholder="https://example.com/photo.jpg" 
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-[#066a9b] focus:ring-2 focus:ring-[#066a9b]/20 outline-none transition-all"
              placeholder="••••••••" 
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-[#066a9b] to-[#0a9fd4] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-[#066a9b]/20 hover:shadow-[#066a9b]/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            Sign Up
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-zinc-500 mt-6">
          Already have an account? <a href="#" className="text-[#066a9b] font-semibold hover:underline">Log in</a>
        </p>
      </div>
    </div>
  );
}