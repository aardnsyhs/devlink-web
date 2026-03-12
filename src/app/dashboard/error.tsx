"use client";

import { ErrorState } from "@/components/shared/ErrorState";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DashboardError({ error, reset }: ErrorProps) {
  console.error("Dashboard route error:", error);

  return (
    <ErrorState
      title="Gagal memuat dashboard"
      description="Terjadi kendala saat memuat dashboard. Silakan coba lagi."
      onRetry={reset}
      showHomeLink={false}
    />
  );
}
