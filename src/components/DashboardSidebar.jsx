"use client";
import { authClient } from "@/lib/auth-client";
import {
  House,
  Dice4,
  FileText,
  FilePlus,
  Bookmark,
  Star,
  Person,
  CreditCard,
  Flag,
  ChartColumn,
  Xmark,
} from "@gravity-ui/icons";
import { Spinner } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TbLogout2 } from "react-icons/tb";

export function DashboardSidebar({ isOpen, setIsOpen }) {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex items-center gap-2 text-white/50 text-sm">
        <Spinner size="sm" />
        Loading...
      </div>
    );
  }
  const user = session?.user;

  const handleSignOut = async (e) => {
    e.preventDefault();
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.refresh();
          router.push("/auth/sign-in");
        },
      },
    });
  };

  const creatorNavItems = [
    { icon: House, label: "Home", href: "/" },
    { icon: Dice4, label: "Dashboard", href: "/dashboard/creator" },
    { icon: FilePlus, label: "Add Prompt", href: "/dashboard/creator/add-prompt" },
    { icon: FileText, label: "My Prompts", href: "/dashboard/creator/my-prompts" },
  ];

  const userNavItems = [
    { icon: House, label: "Home", href: "/" },
    { icon: Dice4, label: "Dashboard", href: "/dashboard/user" },
    { icon: FilePlus, label: "Add Prompt", href: "/dashboard/user/add-prompt" },
    { icon: FileText, label: "My Prompts", href: "/dashboard/user/my-prompts" },
    { icon: Bookmark, label: "Saved Prompts", href: "/dashboard/user/saved-prompts" },
    { icon: Star, label: "My Reviews", href: "/dashboard/user/my-reviews" },
    { icon: Person, label: "Profile", href: "/dashboard/user/my-profile" },
  ];

  const adminNavItems = [
    { icon: House, label: "Home", href: "/" },
    { icon: Person, label: "All Users", href: "/dashboard/admin/all-user" },
    { icon: FileText, label: "All Prompts", href: "/dashboard/admin/all-prompt" },
    { icon: CreditCard, label: "All Payments", href: "/dashboard/admin/payments" },
    { icon: Flag, label: "Reported Prompts", href: "/dashboard/admin/reports" },
    { icon: ChartColumn, label: "Analytics", href: "/dashboard/admin/analytics" },
  ];

  const navLinksMap = {
    creator: creatorNavItems,
    user: userNavItems,
    admin: adminNavItems,
  };

  const role = user?.role?.toLowerCase() || "user";

  const navItems = navLinksMap[role] || navLinksMap["user"];

  return (
    <>
      
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      <div
        className={`
          fixed lg:static top-0 left-0 h-full lg:h-[calc(100vh-32px)]
          w-64 bg-[#115a88] text-white flex flex-col shadow-2xl rounded-none lg:rounded-2xl
          z-50 transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        `}
      >
        <div className="flex items-center justify-between gap-3 p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 shrink-0 rounded-lg bg-linear-to-br from-[#066a9b] to-[#0a9fd4] flex items-center justify-center shadow-md">
              <Image
                src="/assests/icons8-robot-60.png"
                alt="NexPrompt Logo"
                width={20}
                height={20}
                className="object-contain brightness-0 invert"
              />
            </div>
            <h1 className="font-bold text-2xl tracking-wider text-white">
              NexPrompt
            </h1>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-white/70 hover:text-white"
          >
            <Xmark size={22} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems?.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-4 px-4 py-3 text-white/80 hover:bg-white/10 hover:text-white rounded-lg transition-all duration-200"
            >
              <item.icon size={20} />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link href={"/auth/sign-in"}>
            <button
              onClick={handleSignOut}
              className="flex justify-end items-center gap-2 px-4 py-3 text-white/60 hover:text-white w-full transition-colors"
            >
              <TbLogout2 size={24} strokeWidth={2.5} />
              <span className="font-semibold text-base">Sign Out</span>
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}