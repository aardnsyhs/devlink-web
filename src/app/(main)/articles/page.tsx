"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useArticles } from "@/hooks/useArticles";
import { useAllTags } from "@/hooks/useTags";
import { ArticleCard } from "@/components/article/ArticleCard";
import { ArticleCardSkeleton } from "@/components/shared/ContentSkeletons";
import { EmptyStateIllustration } from "@/components/shared/EmptyStateIllustration";
import { Pagination } from "@/components/shared/Pagination";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

export default function ArticlesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [page, setPage] = useState(() => {
    const initialPage = Number(searchParams.get("page") ?? "1");
    return Number.isFinite(initialPage) && initialPage > 0 ? initialPage : 1;
  });
  const [search, setSearch] = useState(() => searchParams.get("search") ?? "");
  const [activeTag, setActiveTag] = useState<string | null>(
    () => searchParams.get("tag") ?? null,
  );

  const debouncedSearch = useDebounce(search, 400);
  const { data: tags } = useAllTags();
  const { data, isLoading } = useArticles({
    page,
    per_page: 9,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(activeTag && { tag: activeTag }),
  });

  const handleTagClick = (slug: string) => {
    setActiveTag((prev) => (prev === slug ? null : slug));
    setPage(1);
  };

  useEffect(() => {
    const urlSearch = searchParams.get("search") ?? "";
    const urlTag = searchParams.get("tag") ?? null;
    const rawPage = Number(searchParams.get("page") ?? "1");
    const urlPage = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;

    if (urlSearch !== search) setSearch(urlSearch);
    if (urlTag !== activeTag) setActiveTag(urlTag);
    if (urlPage !== page) setPage(urlPage);
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());
    if (activeTag) params.set("tag", activeTag);
    if (page > 1) params.set("page", String(page));

    const nextQuery = params.toString();
    const currentQuery = searchParams.toString();

    if (nextQuery === currentQuery) return;

    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
      scroll: false,
    });
  }, [debouncedSearch, activeTag, page, pathname, router, searchParams]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
          Articles
        </h1>
        <p className="text-muted-foreground mt-2">
          Kumpulan artikel teknikal seputar web development
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari artikel..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 8).map((tag) => (
              <button key={tag.id} onClick={() => handleTagClick(tag.slug)}>
                <Badge
                  variant={activeTag === tag.slug ? "default" : "outline"}
                  className="cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  {tag.name}
                </Badge>
              </button>
            ))}
          </div>
        )}
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </div>
      ) : data?.data?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <EmptyStateIllustration variant="articles" className="mb-3" />
          <p className="font-medium">Tidak ada artikel ditemukan</p>
          <p className="text-sm text-muted-foreground mt-1">
            Coba kata kunci lain
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data?.data?.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
      {data && (
        <Pagination
          currentPage={data.meta.current_page}
          lastPage={data.meta.last_page}
          total={data.meta.total}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
