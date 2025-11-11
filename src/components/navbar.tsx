"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heartbeat3D } from "@/components/heartbeat-3d";
import { UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

export function Navbar() {
  const pathname = usePathname();
  const { isSignedIn, user, isLoaded } = useUser();

  const navLinks = [
    { href: "/assessment", label: "Assessment" },
    { href: "/scanner", label: "Scanner" },
    { href: "/voice-entry", label: "Voice Entry" },
    { href: "/profile", label: "Profile" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/5 backdrop-blur-lg border-b border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.4)] dark:bg-[#0b0f19]/80 dark:text-gray-200">
      {/* Subtle radial gradient overlay from top-left (cyan to violet) */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-cyan-500/15 via-transparent to-violet-500/15 opacity-60" />
      
      <div className="relative flex justify-between items-center px-8 py-4 md:px-12 lg:px-20">
        <Link href="/" className="flex items-center gap-3 z-10">
          <Heartbeat3D />
          <span className="text-xl font-semibold bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] bg-clip-text text-transparent font-[var(--font-manrope)]">
            Health Heaven
          </span>
        </Link>
        
        <nav className="z-10">
          <div className="flex items-center gap-6">
            <ul className="flex gap-6 text-sm font-[var(--font-manrope)]">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`
                        relative text-gray-300 hover:text-white transition-all duration-300
                        hover:-translate-y-0.5 hover:scale-105
                        ${isActive 
                          ? "font-bold text-white underline decoration-[var(--primary)] underline-offset-8" 
                          : "font-semibold"
                        }
                      `}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Auth Section */}
            <div className="flex items-center gap-3">
              {isLoaded && isSignedIn ? (
                <div className="flex items-center gap-3">
                  <div className="hidden md:flex items-center gap-2 text-sm text-gray-300 font-[var(--font-inter)]">
                    <span className="text-gray-400">Welcome,</span>
                    <span className="font-semibold text-white">
                      {user?.firstName || user?.emailAddresses[0]?.emailAddress?.split("@")[0] || "User"}
                    </span>
                  </div>
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "h-9 w-9 border-2 border-[#22d3ee]/30 hover:border-[#22d3ee] transition-colors",
                        userButtonPopoverCard: "bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl",
                        userButtonPopoverActionButton: "text-gray-200 hover:bg-white/10 font-[var(--font-inter)]",
                        userButtonPopoverActionButtonText: "text-gray-200 font-[var(--font-inter)]",
                        userButtonPopoverFooter: "hidden",
                      },
                    }}
                    afterSignOutUrl="/"
                  />
                </div>
              ) : (
                <Button
                  asChild
                  className="bg-gradient-to-r from-[#22d3ee] to-[#7c3aed] rounded-full px-6 py-2 text-white font-semibold hover:scale-105 transition-transform font-[var(--font-manrope)]"
                >
                  <Link href="/sign-in" className="inline-flex items-center gap-2">
                    <Icons.user className="h-4 w-4" />
                    Sign In
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

