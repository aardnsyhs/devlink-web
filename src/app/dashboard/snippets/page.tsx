"use client";

import { useState } from "react";
import {
  useSnippets,
  useDeleteSnippet,
  useCreateSnippet,
  useUpdateSnippet,
} from "@/hooks/useSnippets";
import { SnippetForm } from "@/components/snippet/SnippetForm";
import { DeleteDialog } from "@/components/shared/DeleteDialog";
import { SnippetSchema } from "@/lib/validations/snippet";
import { Snippet } from "@/types/snippet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Plus, Pencil, Eye, Code2 } from "lucide-react";

const languageColors: Record<string, string> = {
  php: "bg-indigo-100 text-indigo-700",
  javascript: "bg-yellow-100 text-yellow-700",
  typescript: "bg-blue-100 text-blue-700",
  python: "bg-green-100 text-green-700",
  go: "bg-cyan-100 text-cyan-700",
  bash: "bg-slate-100 text-slate-700",
  sql: "bg-orange-100 text-orange-700",
};

export default function DashboardSnippetsPage() {
  const [page, setPage] = useState(1);
  const [editTarget, setEditTarget] = useState<Snippet | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

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
            setSheetOpen(false);
            setEditTarget(null);
          },
        },
      );
    } else {
      createSnippet(formData, {
        onSuccess: () => setSheetOpen(false),
      });
    }
  };

  const openCreate = () => {
    setEditTarget(null);
    setSheetOpen(true);
  };

  const openEdit = (snippet: Snippet) => {
    setEditTarget(snippet);
    setSheetOpen(true);
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
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button onClick={openCreate} className="gap-2">
              <Plus className="h-4 w-4" />
              Snippet Baru
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
            <SheetHeader className="mb-6">
              <SheetTitle>
                {editTarget ? "Edit Snippet" : "Buat Snippet Baru"}
              </SheetTitle>
            </SheetHeader>
            <SnippetForm
              key={editTarget?.id ?? "create"}
              defaultValues={editTarget ?? undefined}
              onSubmit={handleSubmit}
              isPending={creating || updating}
            />
          </SheetContent>
        </Sheet>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="grid grid-cols-12 px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
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
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 rounded-lg" />
            ))}
          </div>
        ) : data?.data?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Code2 className="h-10 w-10 text-slate-300 mb-3" />
            <p className="font-medium text-slate-600 dark:text-slate-400">
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
              className="grid grid-cols-12 items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
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
                    "bg-slate-100 text-slate-700"
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
