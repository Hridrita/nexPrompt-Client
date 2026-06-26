"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RedirectHandler({ url }) {
  const router = useRouter();

  useEffect(() => {
    console.log("Redirecting to:", url);
    const timer = setTimeout(() => {
      router.push(url);
    }, 2000);

    return () => clearTimeout(timer);
  }, [router, url]);

  return null; 
}