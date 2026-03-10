"use client";

import { useState } from "react";
import { useArticles } from "@/hooks/useArticles";
import { useAllTags } from "@/hooks/useTags";
import { ArticleCard } from "@/components/article/ArticleCard";
import { Pagination } from "@/components/shared/Pagination";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, FileText } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

export default function ArticlesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

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
          <Search className="absolute left-3 top-1/2 -tranzinc-y-1/2 h-4 w-4 text-muted-foreground" />
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
            <Skeleton key={i} className="h-52 rounded-xl" />
          ))}
        </div>
      ) : data?.data?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FileText className="h-10 w-10 text-zinc-300 mb-3" />
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
