"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSnippets } from "@/hooks/useSnippets";
import { useAllTags } from "@/hooks/useTags";
import { SnippetCard } from "@/components/snippet/SnippetCard";
import { Pagination } from "@/components/shared/Pagination";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Code2 } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

const LANGUAGES = [
  "php",
  "javascript",
  "typescript",
  "python",
  "go",
  "bash",
  "sql",
];

export default function SnippetsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [page, setPage] = useState(() => {
    const initialPage = Number(searchParams.get("page") ?? "1");
    return Number.isFinite(initialPage) && initialPage > 0 ? initialPage : 1;
  });
  const [search, setSearch] = useState(() => searchParams.get("search") ?? "");
  const [activeLang, setActiveLang] = useState<string | null>(
    () => searchParams.get("language") ?? null,
  );
  const [activeTag, setActiveTag] = useState<string | null>(
    () => searchParams.get("tag") ?? null,
  );

  const debouncedSearch = useDebounce(search, 400);
  const { data: tags } = useAllTags();
  const { data, isLoading } = useSnippets({
    page,
    per_page: 9,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(activeLang && { language: activeLang }),
    ...(activeTag && { tag: activeTag }),
  });

  useEffect(() => {
    const urlSearch = searchParams.get("search") ?? "";
    const urlLang = searchParams.get("language") ?? null;
    const urlTag = searchParams.get("tag") ?? null;
    const rawPage = Number(searchParams.get("page") ?? "1");
    const urlPage = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;

    if (urlSearch !== search) setSearch(urlSearch);
    if (urlLang !== activeLang) setActiveLang(urlLang);
    if (urlTag !== activeTag) setActiveTag(urlTag);
    if (urlPage !== page) setPage(urlPage);
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());
    if (activeLang) params.set("language", activeLang);
    if (activeTag) params.set("tag", activeTag);
    if (page > 1) params.set("page", String(page));

    const nextQuery = params.toString();
    const currentQuery = searchParams.toString();

    if (nextQuery === currentQuery) return;

    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
      scroll: false,
    });
  }, [
    debouncedSearch,
    activeLang,
    activeTag,
    page,
    pathname,
    router,
    searchParams,
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
          Snippets
        </h1>
        <p className="text-muted-foreground mt-2">
          Kumpulan code snippet siap pakai untuk developer
        </p>
      </div>
      <div className="space-y-3">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari snippet..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() => {
                setActiveLang((p) => (p === lang ? null : lang));
                setPage(1);
              }}
            >
              <Badge
                variant={activeLang === lang ? "default" : "outline"}
                className="cursor-pointer font-mono text-xs"
              >
                {lang}
              </Badge>
            </button>
          ))}
        </div>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 8).map((tag) => (
              <button
                key={tag.id}
                onClick={() => {
                  setActiveTag((p) => (p === tag.slug ? null : tag.slug));
                  setPage(1);
                }}
              >
                <Badge
                  variant={activeTag === tag.slug ? "default" : "secondary"}
                  className="cursor-pointer"
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
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : data?.data?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Code2 className="h-10 w-10 text-zinc-300 mb-3" />
          <p className="font-medium">Tidak ada snippet ditemukan</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data?.data?.map((snippet) => (
            <SnippetCard key={snippet.id} snippet={snippet} />
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
