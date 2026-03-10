import { cn } from "@/lib/utils";

type EmptyStateVariant = "articles" | "snippets" | "tags" | "generic";

export function EmptyStateIllustration({
  variant = "generic",
  className,
}: {
  variant?: EmptyStateVariant;
  className?: string;
}) {
  const baseClass = cn("h-28 w-28", className);

  if (variant === "articles") {
    return (
      <svg viewBox="0 0 140 140" className={baseClass} aria-hidden="true">
        <defs>
          <linearGradient id="articleBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgb(244 244 245)" />
            <stop offset="100%" stopColor="rgb(228 228 231)" />
          </linearGradient>
        </defs>
        <rect
          x="14"
          y="10"
          width="112"
          height="120"
          rx="16"
          fill="url(#articleBg)"
          className="dark:fill-zinc-800"
        />
        <rect
          x="28"
          y="30"
          width="56"
          height="8"
          rx="4"
          className="fill-zinc-400 dark:fill-zinc-500"
        />
        <rect
          x="28"
          y="48"
          width="84"
          height="6"
          rx="3"
          className="fill-zinc-300 dark:fill-zinc-600"
        />
        <rect
          x="28"
          y="60"
          width="76"
          height="6"
          rx="3"
          className="fill-zinc-300 dark:fill-zinc-600"
        />
        <rect
          x="28"
          y="80"
          width="22"
          height="12"
          rx="6"
          className="fill-zinc-500 dark:fill-zinc-400"
        />
        <rect
          x="56"
          y="80"
          width="28"
          height="12"
          rx="6"
          className="fill-zinc-300 dark:fill-zinc-600"
        />
        <circle
          cx="108"
          cy="94"
          r="10"
          className="fill-zinc-200 dark:fill-zinc-700"
        />
      </svg>
    );
  }

  if (variant === "snippets") {
    return (
      <svg viewBox="0 0 140 140" className={baseClass} aria-hidden="true">
        <rect
          x="10"
          y="18"
          width="120"
          height="104"
          rx="14"
          className="fill-zinc-100 dark:fill-zinc-800"
        />
        <rect
          x="10"
          y="18"
          width="120"
          height="24"
          rx="14"
          className="fill-zinc-200 dark:fill-zinc-700"
        />
        <circle cx="24" cy="30" r="3" className="fill-zinc-400" />
        <circle cx="35" cy="30" r="3" className="fill-zinc-400" />
        <circle cx="46" cy="30" r="3" className="fill-zinc-400" />
        <rect
          x="24"
          y="54"
          width="20"
          height="6"
          rx="3"
          className="fill-emerald-400 dark:fill-emerald-500"
        />
        <rect
          x="50"
          y="54"
          width="54"
          height="6"
          rx="3"
          className="fill-zinc-400 dark:fill-zinc-500"
        />
        <rect
          x="24"
          y="68"
          width="36"
          height="6"
          rx="3"
          className="fill-amber-400 dark:fill-amber-500"
        />
        <rect
          x="66"
          y="68"
          width="44"
          height="6"
          rx="3"
          className="fill-zinc-400 dark:fill-zinc-500"
        />
        <rect
          x="24"
          y="82"
          width="16"
          height="6"
          rx="3"
          className="fill-sky-400 dark:fill-sky-500"
        />
        <rect
          x="46"
          y="82"
          width="62"
          height="6"
          rx="3"
          className="fill-zinc-400 dark:fill-zinc-500"
        />
      </svg>
    );
  }

  if (variant === "tags") {
    return (
      <svg viewBox="0 0 140 140" className={baseClass} aria-hidden="true">
        <path
          d="M26 74 L62 38 H98 L114 54 V90 L78 126 H50 L26 102 Z"
          className="fill-zinc-200 dark:fill-zinc-700"
        />
        <path
          d="M38 74 L68 44 H94 L106 56 V84 L76 114 H56 L38 96 Z"
          className="fill-zinc-100 dark:fill-zinc-800"
        />
        <circle
          cx="80"
          cy="62"
          r="6"
          className="fill-zinc-400 dark:fill-zinc-500"
        />
        <rect
          x="44"
          y="82"
          width="38"
          height="8"
          rx="4"
          className="fill-zinc-400 dark:fill-zinc-500"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 140 140" className={baseClass} aria-hidden="true">
      <circle
        cx="70"
        cy="70"
        r="52"
        className="fill-zinc-100 dark:fill-zinc-800"
      />
      <rect
        x="44"
        y="62"
        width="52"
        height="10"
        rx="5"
        className="fill-zinc-400 dark:fill-zinc-500"
      />
      <rect
        x="54"
        y="78"
        width="32"
        height="8"
        rx="4"
        className="fill-zinc-300 dark:fill-zinc-600"
      />
    </svg>
  );
}
