"use client";

import { useAuthStore } from "@/store/authStore";
import { useLogout, useMe } from "@/hooks/useAuth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LayoutDashboard, FileText, Code2, Tags, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/articles", label: "Articles", icon: FileText },
  { href: "/dashboard/snippets", label: "Snippets", icon: Code2 },
  { href: "/dashboard/tags", label: "Tags", icon: Tags },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthStore();
  const { mutate: logout, isPending } = useLogout();
  const pathname = usePathname();
  const router = useRouter();
  useMe();

  const prefetchRoute = (href: string) => router.prefetch(href);

  return (
    <div className="min-h-screen flex bg-zinc-50 dark:bg-zinc-950">
      <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <Link
            href="/"
            onMouseEnter={() => prefetchRoute("/")}
            onFocus={() => prefetchRoute("/")}
            className="text-xl font-bold text-zinc-900 dark:text-white"
          >
            DevLink
          </Link>
          <p className="text-xs text-muted-foreground mt-0.5">Developer Hub</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon, exact }) => {
            const isActive = exact
              ? pathname === href
              : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onMouseEnter={() => prefetchRoute(href)}
                onFocus={() => prefetchRoute(href)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {user?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <Link
                href="/dashboard/profile"
                onMouseEnter={() => prefetchRoute("/dashboard/profile")}
                onFocus={() => prefetchRoute("/dashboard/profile")}
                className="text-sm font-medium truncate block hover:underline"
              >
                {user?.name}
              </Link>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
            <ThemeToggle />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2"
            onClick={() => logout()}
            disabled={isPending}
          >
            <LogOut className="h-3 w-3" />
            {isPending ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
