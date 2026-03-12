"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

type ErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
  showHomeLink?: boolean;
};

export function ErrorState({
  title = "Terjadi kesalahan",
  description = "Terjadi error tidak terduga. Coba refresh atau ulangi aksi kamu.",
  onRetry,
  showHomeLink = true,
}: ErrorStateProps) {
  return (
    <main className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl text-center">
        <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground">
          SOMETHING WENT WRONG
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
          {title}
        </h1>
        <p className="mt-3 text-sm sm:text-base text-muted-foreground">
          {description}
        </p>
        <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
          {onRetry && <Button onClick={onRetry}>Coba Lagi</Button>}
          {showHomeLink && (
            <Button variant="outline" asChild>
              <Link href="/">Kembali ke Home</Link>
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
