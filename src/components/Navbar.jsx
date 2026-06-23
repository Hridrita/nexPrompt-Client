"use client";
import { useState, useEffect } from "react";
import { Avatar, Link, Button } from "@heroui/react";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { usePathname, useRouter } from "next/navigation";

const Navbar = () => {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  console.log("user session", user);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  const links = [
    { label: "Home", href: "/" },
    { label: "All Prompts", href: "/all-prompt" },
    { label: "payment", href: "/payment" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const pathname = usePathname();
  const hideNavbar =
    pathname.startsWith("/auth") || pathname.startsWith("/dashboard") || pathname.startsWith("/unauthorized");

  if (hideNavbar) {
    return null;
  }

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

  const dashboardLinks = () => {
    if (user?.role === "user") return "/dashboard/user";
    if (user?.role === "creator") return "/dashboard/creator";
    if (user?.role === "admin") return "/dashboard/admin";
  };

  const dashboardUrl = dashboardLinks();

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white/90 backdrop-blur-md border-b border-zinc-200 py-2 shadow-sm" : "bg-transparent py-4"}`}
    >
      <header className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#066a9b] to-[#0a9fd4] flex items-center justify-center shadow-md group-hover:shadow-[#066a9b]/40 transition-shadow duration-300">
              <Image
                src="/assests/icons8-robot-60.png"
                alt="NexPrompt Logo"
                width={20}
                height={20}
                className="object-contain brightness-0 invert"
              />
            </div>

            <span className="text-xl font-bold tracking-tight">
              <span className="text-[#066a9b]">Nex</span>
              <span className="text-zinc-800">Prompt</span>
            </span>
          </Link>
        </div>

        <ul className="hidden md:flex items-center gap-8">
          {links.map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                className="text-zinc-600 hover:text-[#066a9b] font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#066a9b] after:transition-all hover:after:w-full"
              >
                {label}
              </Link>
            </li>
          ))}
          {user && (
            <li>
              <Link
                href={dashboardUrl}
                className="text-zinc-600 hover:text-[#066a9b] font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#066a9b] after:transition-all hover:after:w-full"
              >
                Dashboard
              </Link>
            </li>
          )}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          {isPending ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-t-transparent border-[#066a9b] rounded-full animate-spin"></div>
              <span className="text-zinc-600 text-sm">Loading...</span>
            </div>
          ) : user ? (
            <>
              <div className="flex items-center gap-3">
                <Image
                  src={user.image}
                  alt={user.name}
                  width={40}
                  height={40}
                />

                <Link href="/auth/sign-in">
                  <Button
                    onClick={handleSignOut}
                    className="bg-linear-to-r from-[#066a9b] to-[#0a9fd4] text-white rounded-full px-6 font-semibold shadow-md hover:shadow-[#066a9b]/40 hover:scale-105 transition-all duration-200"
                  >
                    Sign out
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="hidden md:flex items-center gap-3">
                <Link href="/auth/sign-in">
                  <Button variant="light" className="text-zinc-600 font-medium">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button className="bg-linear-to-r from-[#066a9b] to-[#0a9fd4] text-white rounded-full px-6 font-semibold shadow-md hover:shadow-[#066a9b]/40 hover:scale-105 transition-all duration-200">
                    Get Started
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </header>

      {isMenuOpen && (
        <div className="md:hidden border-t p-4 bg-white/95 backdrop-blur-md shadow-xl absolute w-full">
          <div className="flex flex-col gap-4">
            <Link href="/" className="block py-2 text-zinc-700 font-medium">
              Home
            </Link>
            <Link
              href="/all-prompt"
              className="block py-2 text-zinc-700 font-medium"
            >
              All Prompt
            </Link>
            {user ? (
              <Link
                href={dashboardUrl}
                className="block py-2 text-zinc-700 font-medium"
              >
                Dashboard
              </Link>
            ) : (
              ""
            )}
            {isPending ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-t-transparent border-[#066a9b] rounded-full animate-spin"></div>
                <span className="text-zinc-600 text-sm">Loading...</span>
              </div>
            ) : user ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image
                      src={user.image}
                      alt={user.name}
                      width={40}
                      height={40}
                    />
                    <span className="font-medium">
                      {user.name.toUpperCase()}
                    </span>
                  </div>

                  <Link href="/auth/sign-in">
                    <Button className="bg-linear-to-r from-[#066a9b] to-[#0a9fd4] text-white rounded-full px-6 font-semibold shadow-md hover:shadow-[#066a9b]/40 hover:scale-105 transition-all duration-200">
                      Sign out
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="flex gap-3 pt-2 border-t border-zinc-100">
                  <Link href="/auth/sign-in">
                    <Button
                      variant="bordered"
                      className="flex-1 border-zinc-300 text-zinc-700"
                    >
                      Login
                    </Button>
                  </Link>

                  <Link href="/auth/sign-up">
                    <Button className="flex-1 bg-linear-to-r from-[#066a9b] to-[#0a9fd4] text-white rounded-full">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
