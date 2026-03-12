"use client";

import { ErrorState } from "@/components/shared/ErrorState";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: ErrorProps) {
  console.error("Global app error:", error);

  return (
    <html lang="en">
      <body>
        <ErrorState
          title="Aplikasi mengalami kendala"
          description="Terjadi error global. Silakan coba lagi beberapa saat."
          onRetry={reset}
        />
      </body>
    </html>
  );
}
