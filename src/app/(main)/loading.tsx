import {
  ArticleCardSkeleton,
  SnippetCardSkeleton,
} from "@/components/shared/ContentSkeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function MainLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-5 w-72" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <ArticleCardSkeleton />
        <ArticleCardSkeleton />
        <SnippetCardSkeleton />
      </div>
    </div>
  );
}
