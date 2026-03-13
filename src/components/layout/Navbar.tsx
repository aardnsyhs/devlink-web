"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Code2, Menu, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

const navLinks = [
  { href: "/articles", label: "Articles" },
  { href: "/snippets", label: "Snippets" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAuthenticated = !!token;
  const prefetchRoute = (href: string) => router.prefetch(href);

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          onMouseEnter={() => prefetchRoute("/")}
          onFocus={() => prefetchRoute("/")}
          className="flex items-center gap-2 font-bold text-lg"
        >
          <div className="h-7 w-7 rounded-lg bg-zinc-900 dark:bg-white flex items-center justify-center">
            <Code2 className="h-4 w-4 text-white dark:text-zinc-900" />
          </div>
          DevLink
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onMouseEnter={() => prefetchRoute(href)}
              onFocus={() => prefetchRoute(href)}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                pathname.startsWith(href)
                  ? "text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800",
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          {isAuthenticated ? (
            <Button asChild size="sm">
              <Link
                href="/dashboard"
                onMouseEnter={() => prefetchRoute("/dashboard")}
                onFocus={() => prefetchRoute("/dashboard")}
              >
                Dashboard
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link
                  href="/login"
                  onMouseEnter={() => prefetchRoute("/login")}
                  onFocus={() => prefetchRoute("/login")}
                >
                  Masuk
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link
                  href="/register"
                  onMouseEnter={() => prefetchRoute("/register")}
                  onFocus={() => prefetchRoute("/register")}
                >
                  Daftar
                </Link>
              </Button>
            </>
          )}
        </div>
        <button
          className="md:hidden p-2 rounded-md"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-4 space-y-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onMouseEnter={() => prefetchRoute(href)}
              onFocus={() => prefetchRoute(href)}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              {label}
            </Link>
          ))}
          <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex gap-2">
            {isAuthenticated ? (
              <Button asChild size="sm" className="w-full">
                <Link
                  href="/dashboard"
                  onMouseEnter={() => prefetchRoute("/dashboard")}
                  onFocus={() => prefetchRoute("/dashboard")}
                >
                  Dashboard
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <Link
                    href="/login"
                    onMouseEnter={() => prefetchRoute("/login")}
                    onFocus={() => prefetchRoute("/login")}
                  >
                    Masuk
                  </Link>
                </Button>
                <Button asChild size="sm" className="flex-1">
                  <Link
                    href="/register"
                    onMouseEnter={() => prefetchRoute("/register")}
                    onFocus={() => prefetchRoute("/register")}
                  >
                    Daftar
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
