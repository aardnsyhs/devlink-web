import { TagBadge } from "@/components/shared/TagBadge";
import { Button } from "@/components/ui/button";
import { Eye, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Snippet } from "@/types/snippet";
import { CodeBlock } from "@/components/snippet/CodeBlock";

const languageColors: Record<string, string> = {
  php: "text-indigo-400",
  javascript: "text-yellow-400",
  typescript: "text-blue-400",
  python: "text-green-400",
  go: "text-cyan-400",
  bash: "text-zinc-400",
  sql: "text-orange-400",
};

async function getSnippetBySlug(slug: string): Promise<Snippet | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return null;

  const response = await fetch(`${apiUrl}/snippets/${slug}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) return null;

  const json = (await response.json()) as { data?: Snippet };
  return json.data ?? null;
}

export default async function SnippetDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ hl?: string }>;
}) {
  const { slug } = await params;
  const { hl } = await searchParams;
  const snippet = await getSnippetBySlug(slug);

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
            className={`font-mono text-sm font-semibold ${languageColors[snippet.language] ?? "text-zinc-400"}`}
          >
            {snippet.language}
          </span>
          {snippet.tags?.map((tag) => (
            <TagBadge key={tag.id} tag={tag} />
          ))}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
          {snippet.title}
        </h1>
        <p className="text-muted-foreground mt-2">{snippet.description}</p>
        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            {snippet.author?.name}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {snippet.views.toLocaleString()} views
          </span>
        </div>
      </div>
      <CodeBlock
        language={snippet.language}
        code={snippet.code}
        highlightLines={hl}
      />
    </div>
  );
}
