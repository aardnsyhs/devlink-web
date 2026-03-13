"use client";

import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { snippetSchema, SnippetSchema } from "@/lib/validations/snippet";
import { useTags } from "@/hooks/useTags";
import { Snippet } from "@/types/snippet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SnippetLivePreview } from "@/components/snippet/SnippetLivePreview";
import { X } from "lucide-react";

const LANGUAGES = [
  "php",
  "javascript",
  "typescript",
  "python",
  "go",
  "rust",
  "bash",
  "sql",
  "css",
  "html",
  "java",
  "kotlin",
  "swift",
  "dart",
];

interface SnippetFormProps {
  defaultValues?: Snippet;
  onSubmit: (data: SnippetSchema) => void;
  isPending: boolean;
}

export function SnippetForm({
  defaultValues,
  onSubmit,
  isPending,
}: SnippetFormProps) {
  const { data: tagResponse } = useTags({ per_page: 100 });
  const tags = tagResponse?.data ?? [];

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<SnippetSchema>({
    resolver: zodResolver(snippetSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      description: defaultValues?.description ?? "",
      code: defaultValues?.code ?? "",
      language: defaultValues?.language ?? "",
      status: defaultValues?.status ?? "draft",
      tag_ids: defaultValues?.tags?.map((t) => t.id) ?? [],
    },
  });

  const selectedTagIds =
    useWatch({
      control,
      name: "tag_ids",
    }) ?? [];
  const previewCode =
    useWatch({
      control,
      name: "code",
    }) ?? "";
  const previewLanguage =
    useWatch({
      control,
      name: "language",
    }) ?? "text";

  const toggleTag = (id: number) => {
    const current = selectedTagIds;
    const updated = current.includes(id)
      ? current.filter((t) => t !== id)
      : [...current, id];
    setValue("tag_ids", updated);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="title">Judul</Label>
        <Input
          id="title"
          placeholder="Contoh: Laravel Query Builder Tips"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-xs text-red-500">{errors.title.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea
          id="description"
          placeholder="Jelaskan singkat isi snippet ini..."
          rows={3}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-red-500">{errors.description.message}</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Bahasa</Label>
          <Controller
            name="language"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih bahasa" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.language && (
            <p className="text-xs text-red-500">{errors.language.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
      <div className="grid gap-6 xl:grid-cols-2 xl:items-start">
        <div className="space-y-2">
          <Label htmlFor="code">Code</Label>
          <Textarea
            id="code"
            placeholder="Tulis code di sini..."
            rows={18}
            className="min-h-104 font-mono text-sm"
            {...register("code")}
          />
          {errors.code && (
            <p className="text-xs text-red-500">{errors.code.message}</p>
          )}
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
            <p className="font-medium text-zinc-800 dark:text-zinc-200">
              Notation Shiki yang didukung
            </p>
            <div className="mt-2 space-y-1 font-mono text-[11px] leading-relaxed">
              <p>
                <span className="text-zinc-500">{"// [!code highlight]"}</span>{" "}
                sorot satu baris
              </p>
              <p>
                <span className="text-zinc-500">{"// [!code focus:3]"}</span>{" "}
                fokuskan 3 baris berikutnya
              </p>
              <p>
                <span className="text-zinc-500">{"// [!code ++]"}</span> tandai
                baris sebagai penambahan
              </p>
              <p>
                <span className="text-zinc-500">{"// [!code --]"}</span> tandai
                baris sebagai penghapusan
              </p>
              <p>
                <span className="text-zinc-500">[[transaction]]</span> highlight
                kata tertentu
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Preview</Label>
          <SnippetLivePreview code={previewCode} language={previewLanguage} />
        </div>
      </div>
      {tags.length > 0 && (
        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const selected = selectedTagIds.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className="focus:outline-none"
                >
                  <Badge
                    variant={selected ? "default" : "outline"}
                    className="cursor-pointer select-none"
                  >
                    {selected && <X className="h-3 w-3 mr-1" />}
                    {tag.name}
                  </Badge>
                </button>
              );
            })}
          </div>
        </div>
      )}
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending
          ? "Menyimpan..."
          : defaultValues
            ? "Update Snippet"
            : "Buat Snippet"}
      </Button>
    </form>
  );
}
