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
        <header className="h-16 bg-[#f3f7fb] rounded-2xl border border-gray-200 flex items-center px-8 shadow-sm lg:ml-0 ml-12">
          {user ? (
            <div className="flex items-center justify-between w-full">
              <span className="text-xl font-medium text-[#115a88]">
                welcome back, {user.name}
              </span>
              <div>
                <Image
                src={user.image}
                alt={user.name}
                width={40}
                height={40}
                className="rounded-full border-3 border-[#115a88] object-cover"
              />
              </div>
            </div>
          ) : (
            <Link href="/auth/sign-in" className="text-sm">
              Sign In
            </Link>
          )}
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className=" rounded-2xl p-6 min-h-[80vh]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;