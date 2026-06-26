"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, CircleXmarkFill } from "@gravity-ui/icons";

function CancelContent() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/all-prompt";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-32 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center">
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CircleXmarkFill size={48} />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
          Payment Cancelled
        </h1>
        <p className="text-slate-600 mb-8">
          Your payment was cancelled. No charges were made.
        </p>
        <Link
          href={redirect}
          className="w-full flex items-center justify-center gap-2 bg-slate-600 text-white py-4 rounded-xl font-bold hover:bg-slate-700 transition-all"
        >
          Go Back <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  );
}

export default function CancelPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CancelContent />
    </Suspense>
  );
}