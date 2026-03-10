"use client";

import { useParams } from "next/navigation";
import { useSnippet } from "@/hooks/useSnippets";
import { TagBadge } from "@/components/shared/TagBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Eye, ArrowLeft, Copy, Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const languageColors: Record<string, string> = {
  php: "text-indigo-400",
  javascript: "text-yellow-400",
  typescript: "text-blue-400",
  python: "text-green-400",
  go: "text-cyan-400",
  bash: "text-slate-400",
  sql: "text-orange-400",
};

export default function SnippetDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: snippet, isLoading } = useSnippet(slug);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!snippet) return;
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-6">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!snippet) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center">
        <p className="text-muted-foreground">Snippet tidak ditemukan.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/snippets">Kembali</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-6">
      <Button asChild variant="ghost" size="sm" className="gap-2 -ml-2">
        <Link href="/snippets">
          <ArrowLeft className="h-4 w-4" />
          Semua Snippets
        </Link>
      </Button>
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span
            className={`font-mono text-sm font-semibold ${languageColors[snippet.language] ?? "text-slate-400"}`}
          >
            {snippet.language}
          </span>
          {snippet.tags?.map((tag) => (
            <TagBadge key={tag.id} tag={tag} />
          ))}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          {snippet.title}
        </h1>
        <p className="text-muted-foreground mt-2">{snippet.description}</p>
        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {snippet.author?.name}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {snippet.views.toLocaleString()} views
          </span>
        </div>
      </div>
      <div className="relative rounded-xl overflow-hidden border border-slate-800">
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800 border-b border-slate-700">
          <span className="text-xs font-mono text-slate-400">
            {snippet.language}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 text-slate-400 hover:text-white"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-green-400" />
                <span className="text-xs text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span className="text-xs">Copy</span>
              </>
            )}
          </Button>
        </div>
        <div className="bg-slate-950 overflow-x-auto">
          <pre className="p-5 text-sm font-mono text-slate-200 leading-relaxed">
            <code>{snippet.code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
