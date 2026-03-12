import { Snippet } from "@/types/snippet";
import { SnippetCard } from "@/components/snippet/SnippetCard";
import { SnippetCardSkeleton } from "@/components/shared/ContentSkeletons";
import { EmptyStateIllustration } from "@/components/shared/EmptyStateIllustration";

interface SnippetListProps {
  snippets?: Snippet[];
  isLoading?: boolean;
  emptyMessage?: string;
  emptySubMessage?: string;
}

export function SnippetList({
  snippets,
  isLoading = false,
  emptyMessage = "No snippets found",
  emptySubMessage = "Try a different keyword, language, or tag",
}: SnippetListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <SnippetCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!snippets || snippets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <EmptyStateIllustration variant="snippets" className="mb-3" />
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
      {snippets.map((snippet) => (
        <SnippetCard key={snippet.id} snippet={snippet} />
      ))}
    </div>
  );
}
