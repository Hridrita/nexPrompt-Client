"use client";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { authClient } from "@/lib/auth-client";
import { Spinner } from "@heroui/react";
import Image from "next/image";

const DashboardLayout = ({ children }) => {
    const { data: session, isPending } = authClient.useSession();
  if (isPending) return <Spinner size="sm" />;
  const user = session?.user;
  return (
    <div className="flex min-h-screen bg-[#C7DFEA] p-4 gap-4"> 
      <div className="hidden lg:block w-64 flex-shrink-0">
        <DashboardSidebar />
      </div>

      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        <header className="h-16 bg-white rounded-2xl border border-gray-200 flex items-center justify-end px-8 shadow-sm">
           <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600">{user.name}</span>
              <Image
                                src={user.image}
                                alt={user.name}
                                width={40}
                                height={40}
                                className="rounded-full border-3 border-[#115a88] object-cover"
                              />
           </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="bg-[#f3f7fb] rounded-2xl p-6 min-h-[80vh] shadow-sm border border-gray-100">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;