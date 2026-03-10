"use client";

import { useState } from "react";
import {
  useTags,
  useCreateTag,
  useUpdateTag,
  useDeleteTag,
} from "@/hooks/useTags";
import { TagFormDialog } from "@/components/tag/TagFormDialog";
import { DeleteDialog } from "@/components/shared/DeleteDialog";
import { TagSchema } from "@/lib/validations/tag";
import { Tag } from "@/types/tag";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Tags, Search } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { useDebounce } from "@/hooks/useDebounce";

export default function DashboardTagsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Tag | null>(null);

  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading } = useTags({
    page,
    per_page: 20,
    ...(debouncedSearch && { search: debouncedSearch }),
  });

  const { mutate: createTag, isPending: creating } = useCreateTag();
  const { mutate: updateTag, isPending: updating } = useUpdateTag();
  const { mutate: deleteTag, isPending: deleting } = useDeleteTag();

  const handleSubmit = (formData: TagSchema) => {
    if (editTarget) {
      updateTag(
        { slug: editTarget.slug, payload: formData },
        {
          onSuccess: () => {
            setDialogOpen(false);
            setEditTarget(null);
          },
        },
      );
    } else {
      createTag(formData, {
        onSuccess: () => setDialogOpen(false),
      });
    }
  };

  const openCreate = () => {
    setEditTarget(null);
    setDialogOpen(true);
  };

  const openEdit = (tag: Tag) => {
    setEditTarget(tag);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tags</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Kelola semua tag untuk artikel dan snippet
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Tag Baru
        </Button>
      </div>
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari tag..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="pl-9"
        />
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Tags className="h-4 w-4" />
        <span>
          {isLoading ? "Memuat..." : `${data?.meta?.total ?? 0} tag total`}
        </span>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : data?.data?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Tags className="h-10 w-10 text-zinc-300 mb-3" />
          <p className="font-medium text-zinc-600 dark:text-zinc-400">
            {debouncedSearch
              ? `Tidak ada tag "${debouncedSearch}"`
              : "Belum ada tag"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {!debouncedSearch && `Klik "Tag Baru" untuk mulai`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {data?.data?.map((tag) => (
            <div
              key={tag.id}
              className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex items-center justify-between hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                  <Tags className="h-4 w-4 text-zinc-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{tag.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    #{tag.slug}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => openEdit(tag)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <DeleteDialog
                  title={tag.name}
                  onConfirm={() => deleteTag(tag.slug)}
                  isPending={deleting}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      {data && data.meta.last_page > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-muted-foreground">
            Halaman {data.meta.current_page} dari {data.meta.last_page}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === data.meta.last_page}
              onClick={() => setPage((p) => p + 1)}
            >
              Berikutnya
            </Button>
          </div>
        </div>
      )}
      <TagFormDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditTarget(null);
        }}
        defaultValues={editTarget ?? undefined}
        onSubmit={handleSubmit}
        isPending={creating || updating}
      />
    </div>
  );
}
