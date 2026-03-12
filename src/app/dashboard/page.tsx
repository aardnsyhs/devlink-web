"use client";

import { useAuthStore } from "@/store/authStore";
import { useArticles } from "@/hooks/useArticles";
import { useSnippets } from "@/hooks/useSnippets";
import { EmptyStateIllustration } from "@/components/shared/EmptyStateIllustration";
import { StatCard } from "@/components/shared/StatCard";
import {
  DashboardListItemSkeleton,
  DashboardStatCardSkeleton,
} from "@/components/shared/ContentSkeletons";
import { Badge } from "@/components/ui/badge";
import { FileText, Code2, Eye, TrendingUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: articles, isLoading: loadingArticles } = useArticles({
    status: "all",
    per_page: 5,
    mine: 1,
  });
  const { data: snippets, isLoading: loadingSnippets } = useSnippets({
    status: "all",
    per_page: 5,
    mine: 1,
  });

  const totalViews =
    (articles?.data?.reduce((sum, a) => sum + a.views, 0) ?? 0) +
    (snippets?.data?.reduce((sum, s) => sum + s.views, 0) ?? 0);

  const publishedArticles =
    articles?.data?.filter((a) => a.status === "published").length ?? 0;
  const publishedSnippets =
    snippets?.data?.filter((s) => s.status === "published").length ?? 0;

  const normalizeTotal = (value: unknown): number => {
    if (Array.isArray(value)) {
      const last = value[value.length - 1];
      return Number(last ?? 0) || 0;
    }
    return Number(value ?? 0) || 0;
  };

  const totalArticles = normalizeTotal(articles?.meta?.total);
  const totalSnippets = normalizeTotal(snippets?.meta?.total);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Halo, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Ini ringkasan konten kamu hari ini
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loadingArticles || loadingSnippets ? (
          Array.from({ length: 4 }).map((_, i) => (
            <DashboardStatCardSkeleton key={i} />
          ))
        ) : (
          <>
            <StatCard
              title="Total Articles"
              value={totalArticles}
              icon={FileText}
              description={`${publishedArticles} published`}
            />
            <StatCard
              title="Total Snippets"
              value={totalSnippets}
              icon={Code2}
              description={`${publishedSnippets} published`}
            />
            <StatCard
              title="Total Views"
              value={totalViews.toLocaleString()}
              icon={Eye}
              description="Articles + Snippets"
            />
            <StatCard
              title="Published Content"
              value={publishedArticles + publishedSnippets}
              icon={TrendingUp}
              description="Live di public"
            />
          </>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-zinc-900 dark:text-white">
              Recent Articles
            </h2>
            <Link
              href="/dashboard/articles"
              className="text-xs text-primary hover:underline"
            >
              Lihat semua
            </Link>
          </div>
          {loadingArticles ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <DashboardListItemSkeleton key={i} />
              ))}
            </div>
          ) : articles?.data?.length === 0 ? (
            <div className="py-6 flex flex-col items-center text-center">
              <EmptyStateIllustration
                variant="articles"
                className="h-20 w-20 mb-2"
              />
              <p className="text-sm text-muted-foreground">Belum ada artikel</p>
            </div>
          ) : (
            <div className="space-y-3">
              {articles?.data?.slice(0, 5).map((article) => (
                <div
                  key={article.id}
                  className="flex items-start justify-between gap-3 p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {article.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDistanceToNow(new Date(article.created_at), {
                        addSuffix: true,
                        locale: id,
                      })}
                    </p>
                  </div>
                  <Badge
                    variant={
                      article.status === "published" ? "default" : "secondary"
                    }
                    className="shrink-0 text-xs"
                  >
                    {article.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-zinc-900 dark:text-white">
              Recent Snippets
            </h2>
            <Link
              href="/dashboard/snippets"
              className="text-xs text-primary hover:underline"
            >
              Lihat semua
            </Link>
          </div>
          {loadingSnippets ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <DashboardListItemSkeleton key={i} />
              ))}
            </div>
          ) : snippets?.data?.length === 0 ? (
            <div className="py-6 flex flex-col items-center text-center">
              <EmptyStateIllustration
                variant="snippets"
                className="h-20 w-20 mb-2"
              />
              <p className="text-sm text-muted-foreground">Belum ada snippet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {snippets?.data?.slice(0, 5).map((snippet) => (
                <div
                  key={snippet.id}
                  className="flex items-start justify-between gap-3 p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {snippet.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">
                        {snippet.language}
                      </span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(snippet.created_at), {
                          addSuffix: true,
                          locale: id,
                        })}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      snippet.status === "published" ? "default" : "secondary"
                    }
                    className="shrink-0 text-xs"
                  >
                    {snippet.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
