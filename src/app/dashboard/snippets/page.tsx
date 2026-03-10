"use client";

import { useState } from "react";
import {
  useSnippets,
  useDeleteSnippet,
  useCreateSnippet,
  useUpdateSnippet,
} from "@/hooks/useSnippets";
import { SnippetForm } from "@/components/snippet/SnippetForm";
import { DashboardTableRowSkeleton } from "@/components/shared/ContentSkeletons";
import { DeleteDialog } from "@/components/shared/DeleteDialog";
import { EmptyStateIllustration } from "@/components/shared/EmptyStateIllustration";
import { SnippetSchema } from "@/lib/validations/snippet";
import { Snippet } from "@/types/snippet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Pencil, Eye } from "lucide-react";

const languageColors: Record<string, string> = {
  php: "bg-indigo-100 text-indigo-700",
  javascript: "bg-yellow-100 text-yellow-700",
  typescript: "bg-blue-100 text-blue-700",
  python: "bg-green-100 text-green-700",
  go: "bg-cyan-100 text-cyan-700",
  bash: "bg-zinc-100 text-zinc-700",
  sql: "bg-orange-100 text-orange-700",
};

export default function DashboardSnippetsPage() {
  const [page, setPage] = useState(1);
  const [editTarget, setEditTarget] = useState<Snippet | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, isLoading } = useSnippets({
    page,
    per_page: 10,
    status: "all",
  });
  const { mutate: createSnippet, isPending: creating } = useCreateSnippet();
  const { mutate: updateSnippet, isPending: updating } = useUpdateSnippet();
  const { mutate: deleteSnippet, isPending: deleting } = useDeleteSnippet();

  const handleSubmit = (formData: SnippetSchema) => {
    if (editTarget) {
      updateSnippet(
        { slug: editTarget.slug, payload: formData },
        {
          onSuccess: () => {
            setDialogOpen(false);
            setEditTarget(null);
          },
        },
      );
    } else {
      createSnippet(formData, {
        onSuccess: () => setDialogOpen(false),
      });
    }
  };

  const openCreate = () => {
    setEditTarget(null);
    setDialogOpen(true);
  };

  const openEdit = (snippet: Snippet) => {
    setEditTarget(snippet);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Snippets</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Kelola semua code snippet kamu
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Snippet Baru
        </Button>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="w-[calc(100%-2rem)] max-h-[92vh] overflow-hidden p-0 sm:max-w-4xl">
            <DialogHeader className="border-b px-6 py-4">
              <DialogTitle>
                {editTarget ? "Edit Snippet" : "Buat Snippet Baru"}
              </DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto px-6 py-5">
              <SnippetForm
                key={editTarget?.id ?? "create"}
                defaultValues={editTarget ?? undefined}
                onSubmit={handleSubmit}
                isPending={creating || updating}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="grid grid-cols-12 px-6 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
          <p className="col-span-5 text-xs font-medium text-muted-foreground uppercase">
            Snippet
          </p>
          <p className="col-span-2 text-xs font-medium text-muted-foreground uppercase">
            Bahasa
          </p>
          <p className="col-span-2 text-xs font-medium text-muted-foreground uppercase">
            Status
          </p>
          <p className="col-span-2 text-xs font-medium text-muted-foreground uppercase">
            Views
          </p>
          <p className="col-span-1 text-xs font-medium text-muted-foreground uppercase">
            Aksi
          </p>
        </div>
        {isLoading ? (
          <div>
            {Array.from({ length: 5 }).map((_, i) => (
              <DashboardTableRowSkeleton key={i} />
            ))}
          </div>
        ) : data?.data?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <EmptyStateIllustration variant="snippets" className="mb-3" />
            <p className="font-medium text-zinc-600 dark:text-zinc-400">
              Belum ada snippet
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Klik tombol &quot;Snippet Baru&quot; untuk mulai
            </p>
          </div>
        ) : (
          data?.data?.map((snippet) => (
            <div
              key={snippet.id}
              className="grid grid-cols-12 items-center px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <div className="col-span-5 min-w-0">
                <p className="text-sm font-medium truncate">{snippet.title}</p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {snippet.description}
                </p>
              </div>
              <div className="col-span-2">
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-md ${
                    languageColors[snippet.language] ??
                    "bg-zinc-100 text-zinc-700"
                  }`}
                >
                  {snippet.language}
                </span>
              </div>
              <div className="col-span-2">
                <Badge
                  variant={
                    snippet.status === "published" ? "default" : "secondary"
                  }
                  className="text-xs"
                >
                  {snippet.status}
                </Badge>
              </div>
              <div className="col-span-2 flex items-center gap-1 text-sm text-muted-foreground">
                <Eye className="h-3.5 w-3.5" />
                {snippet.views.toLocaleString()}
              </div>
              <div className="col-span-1 flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => openEdit(snippet)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <DeleteDialog
                  title={snippet.title}
                  onConfirm={() => deleteSnippet(snippet.slug)}
                  isPending={deleting}
                />
              </div>
            </div>
          ))
        )}
      </div>
      {data && data.meta.last_page > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Halaman {data.meta.current_page} dari {data.meta.last_page} ·{" "}
            {data.meta.total} snippet
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
    </div>
  );
}
