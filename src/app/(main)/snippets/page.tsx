"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSnippets } from "@/hooks/useSnippets";
import { useAllTags } from "@/hooks/useTags";
import { SnippetList } from "@/components/snippet/SnippetList";
import { Pagination } from "@/components/shared/Pagination";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
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

  const readUrlState = () => {
    if (typeof window === "undefined") {
      return {
        search: "",
        language: null as string | null,
        tag: null as string | null,
        page: 1,
      };
    }

    const params = new URLSearchParams(window.location.search);
    const rawPage = Number(params.get("page") ?? "1");

    return {
      search: params.get("search") ?? "",
      language: params.get("language") ?? null,
      tag: params.get("tag") ?? null,
      page: Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1,
    };
  };

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [activeLang, setActiveLang] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [isUrlReady, setIsUrlReady] = useState(false);

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
    const syncFromUrl = () => {
      const urlState = readUrlState();
      setSearch(urlState.search);
      setActiveLang(urlState.language);
      setActiveTag(urlState.tag);
      setPage(urlState.page);
      setIsUrlReady(true);
    };

    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, []);

  useEffect(() => {
    if (!isUrlReady) return;

    const params = new URLSearchParams();

    if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());
    if (activeLang) params.set("language", activeLang);
    if (activeTag) params.set("tag", activeTag);
    if (page > 1) params.set("page", String(page));

    const nextQuery = params.toString();
    const currentQuery =
      typeof window !== "undefined"
        ? window.location.search.replace(/^\?/, "")
        : "";

    if (nextQuery === currentQuery) return;

    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
      scroll: false,
    });
  }, [
    isUrlReady,
    debouncedSearch,
    activeLang,
    activeTag,
    page,
    pathname,
    router,
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
      <SnippetList
        snippets={data?.data}
        isLoading={isLoading}
        emptyMessage="Tidak ada snippet ditemukan"
        emptySubMessage="Coba keyword, bahasa, atau tag lain"
      />
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
