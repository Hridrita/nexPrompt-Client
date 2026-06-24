'use client';
import React from 'react';
import Link from 'next/link';
import { Home } from 'lucide-react';

const ErrorPage = ({ title = "Oops! Something went wrong", message = "We're working to fix the issue. Please try again later." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-32 text-center">
      
      <div className="text-9xl font-black text-slate-100 select-none">
        {title.includes("404") ? "404" : "!"}
      </div>

      <div className="relative -mt-12">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">
          {title}
        </h1>
        <p className="text-slate-500 max-w-sm mb-8">
          {message}
        </p>

        
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#4f46e5] hover:bg-[#4338ca] text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <Home size={18} />
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;