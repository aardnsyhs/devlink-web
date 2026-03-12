"use client";

import { useState } from "react";
import {
  useArticles,
  useCreateArticle,
  useUpdateArticle,
  useDeleteArticle,
} from "@/hooks/useArticles";
import { ArticleForm } from "@/components/article/ArticleForm";
import { DashboardTableRowSkeleton } from "@/components/shared/ContentSkeletons";
import { DeleteDialog } from "@/components/shared/DeleteDialog";
import { EmptyStateIllustration } from "@/components/shared/EmptyStateIllustration";
import { ArticleSchema } from "@/lib/validations/article";
import { Article } from "@/types/article";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Pencil, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

export default function DashboardArticlesPage() {
  const [page, setPage] = useState(1);
  const [editTarget, setEditTarget] = useState<Article | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, isLoading } = useArticles({
    page,
    per_page: 10,
    status: "all",
  });
  const { mutate: createArticle, isPending: creating } = useCreateArticle();
  const { mutate: updateArticle, isPending: updating } = useUpdateArticle();
  const { mutate: deleteArticle, isPending: deleting } = useDeleteArticle();

  const handleSubmit = (formData: ArticleSchema) => {
    if (editTarget) {
      updateArticle(
        { id: editTarget.id, slug: editTarget.slug, payload: formData },
        {
          onSuccess: () => {
            setDialogOpen(false);
            setEditTarget(null);
          },
        },
      );
    } else {
      createArticle(formData, {
        onSuccess: () => setDialogOpen(false),
      });
    }
  };

  const openCreate = () => {
    setEditTarget(null);
    setDialogOpen(true);
  };

  const openEdit = (article: Article) => {
    setEditTarget(article);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Articles</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Kelola semua artikel kamu
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Artikel Baru
        </Button>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="w-[calc(100%-2rem)] max-h-[92vh] overflow-hidden p-0 sm:max-w-5xl">
            <DialogHeader className="border-b px-6 py-4">
              <DialogTitle>
                {editTarget ? "Edit Artikel" : "Buat Artikel Baru"}
              </DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto px-6 py-5">
              <ArticleForm
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
            Artikel
          </p>
          <p className="col-span-2 text-xs font-medium text-muted-foreground uppercase">
            Tags
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
            <EmptyStateIllustration variant="articles" className="mb-3" />
            <p className="font-medium text-zinc-600 dark:text-zinc-400">
              Belum ada artikel
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Klik tombol &quot;Artikel Baru&quot; untuk mulai
            </p>
          </div>
        ) : (
          data?.data?.map((article) => (
            <div
              key={article.id}
              className="grid grid-cols-12 items-center px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <div className="col-span-5 min-w-0">
                <p className="text-sm font-medium truncate">{article.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatDistanceToNow(new Date(article.created_at), {
                    addSuffix: true,
                    locale: id,
                  })}
                </p>
              </div>
              <div className="col-span-2 flex flex-wrap gap-1">
                {article.tags?.slice(0, 2).map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className="text-xs px-1.5"
                  >
                    {tag.name}
                  </Badge>
                ))}
                {article.tags?.length > 2 && (
                  <span className="text-xs text-muted-foreground">
                    +{article.tags.length - 2}
                  </span>
                )}
              </div>
              <div className="col-span-2">
                <Badge
                  variant={
                    article.status === "published" ? "default" : "secondary"
                  }
                  className="text-xs"
                >
                  {article.status}
                </Badge>
              </div>
              <div className="col-span-2 flex items-center gap-1 text-sm text-muted-foreground">
                <Eye className="h-3.5 w-3.5" />
                {article.views.toLocaleString()}
              </div>
              <div className="col-span-1 flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => openEdit(article)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <DeleteDialog
                  title={article.title}
                  onConfirm={() =>
                    deleteArticle({ id: article.id, slug: article.slug })
                  }
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
            {data.meta.total} artikel
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
