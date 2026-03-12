"use client";

import { Button } from "@/components/ui/button";

type QueryErrorBannerProps = {
  message?: string;
  onRetry?: () => void;
};

export function QueryErrorBanner({
  message = "Gagal memuat data. Silakan coba lagi.",
  onRetry,
}: QueryErrorBannerProps) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900/60 dark:bg-red-950/40">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-red-700 dark:text-red-300">{message}</p>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            className="border-red-300 bg-transparent text-red-700 hover:bg-red-100 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/30"
            onClick={onRetry}
          >
            Coba lagi
          </Button>
        )}
      </div>
    </div>
  );
}
