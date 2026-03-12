"use client";

import { ErrorState } from "@/components/shared/ErrorState";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function MainError({ error, reset }: ErrorProps) {
  console.error("Main route error:", error);

  return (
    <ErrorState
      title="Gagal memuat halaman"
      description="Halaman publik sedang mengalami kendala. Silakan coba lagi."
      onRetry={reset}
    />
  );
}
