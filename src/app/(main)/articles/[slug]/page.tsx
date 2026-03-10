"use client";

import { useParams } from "next/navigation";
import { useArticle } from "@/hooks/useArticles";
import { TagBadge } from "@/components/shared/TagBadge";
import { ArticleDetailSkeleton } from "@/components/shared/ContentSkeletons";
import { Eye, Clock, ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading } = useArticle(slug);

  if (isLoading) {
    return <ArticleDetailSkeleton />;
  }

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 text-center">
        <p className="text-muted-foreground">Artikel tidak ditemukan.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/articles">Kembali</Link>
        </Button>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Button asChild variant="ghost" size="sm" className="gap-2 mb-8 -ml-2">
        <Link href="/articles">
          <ArrowLeft className="h-4 w-4" />
          Semua Artikel
        </Link>
      </Button>
      {article.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.map((tag) => (
            <TagBadge key={tag.id} tag={tag} />
          ))}
        </div>
      )}
      <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white leading-tight mb-4">
        {article.title}
      </h1>
      <div className="flex items-center gap-4 text-sm text-muted-foreground pb-8 mb-8 border-b border-zinc-200 dark:border-zinc-800">
        <span className="font-medium text-zinc-700 dark:text-zinc-300">
          {article.author?.name}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          {formatDistanceToNow(new Date(article.created_at), {
            addSuffix: true,
            locale: id,
          })}
        </span>
        <span className="flex items-center gap-1 ml-auto">
          <Eye className="h-4 w-4" />
          {article.views.toLocaleString()} views
        </span>
      </div>
      <div
        className="prose prose-slate dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </article>
  );
}
