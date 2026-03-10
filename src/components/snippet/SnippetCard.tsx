import Link from "next/link";
import { Snippet } from "@/types/snippet";
import { TagBadge } from "@/components/shared/TagBadge";
import { Eye, Code2 } from "lucide-react";

const languageColors: Record<string, string> = {
  php: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  javascript:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  typescript:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  python:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  go: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  bash: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400",
  sql: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

export function SnippetCard({ snippet }: { snippet: Snippet }) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors group">
      <div className="bg-zinc-950 px-4 py-3 font-mono text-xs text-zinc-300 line-clamp-4 min-h-20">
        <pre className="whitespace-pre-wrap break-all">{snippet.code}</pre>
      </div>
      <div className="p-4">
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-md ${
            languageColors[snippet.language] ?? "bg-zinc-100 text-zinc-700"
          }`}
        >
          {snippet.language}
        </span>
        <Link href={`/snippets/${snippet.slug}`}>
          <h3 className="mt-2 font-semibold text-zinc-900 dark:text-white group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors line-clamp-1">
            {snippet.title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1 mb-3">
          {snippet.description}
        </p>
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1">
            {snippet.tags?.slice(0, 2).map((tag) => (
              <TagBadge key={tag.id} tag={tag} linked={false} />
            ))}
          </div>
          <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
            <Eye className="h-3 w-3" />
            {snippet.views.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
