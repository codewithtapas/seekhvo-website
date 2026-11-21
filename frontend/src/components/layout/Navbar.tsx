"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronRight, LayoutDashboard, LogOut, MessageCircle } from "lucide-react";
import { SeekhvoLogo } from "@/components/ui/SeekhvoLogo";
import { useAuth } from "@/lib/auth";

const navLinks = [
  { href: "/courses", label: "Courses" },
  { href: "/projects", label: "Projects" },
  { href: "/trainers", label: "Trainers" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  const dashboardHref =
    user?.role === "ADMIN"
      ? "/dashboard/admin"
      : user?.role === "INSTRUCTOR"
      ? "/dashboard/instructor"
      : "/dashboard/student";

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-cyan-400/10 bg-[#030B20]/75 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <SeekhvoLogo height={48} />

        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  active ? "text-[#00D4FF]" : "text-[#A8B8D8] hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <>
              <Link
                href={dashboardHref}
                className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-[#0A1D40]/80 px-4 py-2 text-sm font-medium text-white hover:border-[#00D4FF] transition"
              >
                <LayoutDashboard className="h-4 w-4 text-[#00D4FF]" />
                Dashboard
              </Link>
              <button
                onClick={() => void logout()}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3.5 py-2 text-sm text-[#A8B8D8] hover:text-white hover:border-white/25 transition"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-sm font-medium text-[#A8B8D8] hover:text-white transition"
              >
                Student Login
              </Link>
              <Link
                href="/book-demo"
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#087BFF] to-[#00D4FF] px-5 py-2.5 text-sm font-semibold text-white shadow-neon hover:brightness-110 transition"
              >
                Book Free Demo
                <ChevronRight className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="lg:hidden rounded-lg border border-cyan-400/20 p-2 text-white"
          aria-label="Toggle Menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-cyan-400/15 bg-[#030B20]/95 backdrop-blur-xl px-4 py-5 space-y-3">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2 text-base font-medium text-[#A8B8D8] hover:bg-[#0A1D40] hover:text-white"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
            {user ? (
              <>
                <Link
                  href={dashboardHref}
                  onClick={() => setMobileOpen(false)}
                  className="w-full rounded-full bg-[#087BFF] px-4 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Open Dashboard ({user.role})
                </Link>
                <button
                  onClick={() => {
                    void logout();
                    setMobileOpen(false);
                  }}
                  className="w-full rounded-full border border-white/15 px-4 py-2.5 text-sm text-[#A8B8D8]"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full rounded-full border border-cyan-400/30 px-4 py-2.5 text-center text-sm font-medium text-white"
                >
                  Student Login
                </Link>
                <Link
                  href="/book-demo"
                  onClick={() => setMobileOpen(false)}
                  className="w-full rounded-full bg-gradient-to-r from-[#087BFF] to-[#00D4FF] px-4 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Book Free Demo
                </Link>
                <a
                  href="https://wa.me/918280765204?text=Hello%20Seekhvo%20Team%2C%20I%20am%20interested%20in%20your%20AI%20courses.%20Please%20share%20the%20details."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-2.5 text-center text-sm font-semibold text-emerald-300 hover:bg-emerald-500/20"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp (+91 8280765204)
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

