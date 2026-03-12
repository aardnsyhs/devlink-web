import { Article } from "@/types/article";
import { ArticleCard } from "@/components/article/ArticleCard";
import { ArticleCardSkeleton } from "@/components/shared/ContentSkeletons";
import { EmptyStateIllustration } from "@/components/shared/EmptyStateIllustration";

interface ArticleListProps {
  articles?: Article[];
  isLoading?: boolean;
  emptyMessage?: string;
  emptySubMessage?: string;
}

export function ArticleList({
  articles,
  isLoading = false,
  emptyMessage = "No articles found",
  emptySubMessage = "Try a different keyword or filter",
}: ArticleListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <ArticleCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <EmptyStateIllustration variant="articles" className="mb-3" />
        <p className="font-medium text-zinc-600 dark:text-zinc-400">
          {emptyMessage}
        </p>
        {emptySubMessage && (
          <p className="text-sm text-muted-foreground mt-1">{emptySubMessage}</p>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
