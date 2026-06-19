"use client";
import { authClient } from "@/lib/auth-client";
import { House, Dice4, FileText, FilePlus } from "@gravity-ui/icons";
import Link from "next/link";
import { TbLogout2 } from "react-icons/tb";


export function DashboardSidebar({ isOpen, setIsOpen }) {

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

  const navItems = [
    { icon: House, label: "Home", href: "/" },
    { icon: Dice4, label: "Dashboard Home", href: "/dashboard/creator" },
    { icon: FilePlus, label: "Add Prompt", href: "/dashboard/add-prompt" },
    { icon: FileText, label: "My Prompts", href: "/dashboard/my-prompts" },
  ];

  return (
    <div className="w-64 bg-[#115a88] h-full text-white flex flex-col shadow-2xl rounded-2xl">
      <div className="p-6 border-b border-white/10">
        <h1 className="font-bold text-2xl tracking-wider text-white">NexPrompt</h1>
      </div>

      
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => (
          <Link 
            key={item.label} 
            href={item.href} 
            className="flex items-center gap-4 px-4 py-3 text-white/80 hover:bg-white/10 hover:text-white rounded-lg transition-all duration-200"
          >
            <item.icon size={20} />
            <span className="font-medium text-sm">{item.label}</span>
          </Link>
        ))}
      </nav>

      
      <div className="p-4 border-t border-white/10">
        <Link href={'/auth/sign-in'}>
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
  );
}