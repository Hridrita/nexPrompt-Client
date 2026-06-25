// app/dashboard/layout.jsx - শুধুমাত্র Admin-এর জন্য Header Hide করুন

"use client";

import { DashboardSidebar } from "@/components/DashboardSidebar";
import { authClient } from "@/lib/auth-client";
import { Bars } from "@gravity-ui/icons";
import { Spinner } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const DashboardLayout = ({ children }) => {
  const { data: session, isPending } = authClient.useSession();
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="sm" />
      </div>
    );
  }
  const user = session?.user;

  const userRole = user?.role || "user";
  const dashboardPath = `/dashboard/${userRole}`;
  
  // ✅ Admin চেক করুন
  const isAdmin = userRole === "admin";

  return (
    <div className="flex h-screen overflow-hidden bg-[#C7DFEA] p-4 gap-4">
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-6 left-4 z-30 bg-[#115a88] text-white p-2 rounded-lg shadow-md"
      >
        <Bars size={22} />
      </button>

      <div className="hidden lg:block w-64 flex-shrink-0 h-full">
        <DashboardSidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>

      <div className="lg:hidden">
        <DashboardSidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>

      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        {/* ✅ শুধুমাত্র Admin না হলে Header দেখাবে */}
        {!isAdmin && (
          <header className="h-16 bg-[#f3f7fb] rounded-2xl border border-gray-200 flex items-center px-8 shadow-sm lg:ml-0 ml-12">
            {user ? (
              <div className="flex items-center justify-between w-full">
                <span className="text-2xl font-bold text-[#115a88]">
                  WELCOME BACK, {user.name?.toUpperCase() || "USER"}
                </span>

                <div className="flex items-center gap-4">
                  {/* User Avatar */}
                  <Link href={`${dashboardPath}/profile`}>
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name || "User"}
                        width={40}
                        height={40}
                        className="rounded-full border-3 border-[#115a88] object-cover hover:shadow-md transition-shadow cursor-pointer"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#115a88] to-[#0a9fd4] flex items-center justify-center text-white font-bold text-sm border-3 border-[#115a88] hover:shadow-md transition-shadow cursor-pointer">
                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    )}
                  </Link>
                </div>
              </div>
            ) : (
              <Link href="/auth/sign-in" className="text-sm">
                Sign In
              </Link>
            )}
          </header>
        )}

        <main className="flex-1 overflow-y-auto">
          <div className={`rounded-2xl p-6 min-h-[80vh] ${!isAdmin ? "" : ""}`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;