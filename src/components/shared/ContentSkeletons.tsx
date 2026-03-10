import { Skeleton } from "@/components/ui/skeleton";

export function ArticleCardSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
      <div className="flex gap-2">
        <Skeleton className="h-5 w-14 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-10" />
      </div>
    </div>
  );
}

export function SnippetCardSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      <Skeleton className="h-24 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ArticleDetailSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-6">
      <Skeleton className="h-8 w-28" />
      <div className="flex gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
      <Skeleton className="h-12 w-11/12" />
      <div className="flex gap-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-4 w-20 ml-auto" />
      </div>
      <div className="space-y-3 pt-2">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-11/12" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-10/12" />
      </div>
    </div>
  );
}

export function DashboardStatCardSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
      </div>
      <Skeleton className="h-8 w-12" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
}

export function DashboardListItemSkeleton() {
  return (
    <div className="flex items-start justify-between gap-3 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800">
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>
  );
}

export function DashboardTableRowSkeleton() {
  return (
    <div className="grid grid-cols-12 items-center px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
      <div className="col-span-5 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <div className="col-span-2">
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <div className="col-span-2">
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="col-span-2">
        <Skeleton className="h-4 w-10" />
      </div>
      <div className="col-span-1 flex justify-end">
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </div>
  );
}

export function TagCardSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <div className="space-y-2 min-w-0 flex-1">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </div>
  );
}
