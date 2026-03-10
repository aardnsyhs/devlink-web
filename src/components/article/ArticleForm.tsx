"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { articleSchema, ArticleSchema } from "@/lib/validations/article";
import { useTags } from "@/hooks/useTags";
import { Article } from "@/types/article";
import { RichTextEditor } from "@/components/shared/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

interface ArticleFormProps {
  defaultValues?: Article;
  onSubmit: (data: ArticleSchema) => void;
  isPending: boolean;
}

export function ArticleForm({
  defaultValues,
  onSubmit,
  isPending,
}: ArticleFormProps) {
  const { data: tags } = useTags();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ArticleSchema>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      excerpt: defaultValues?.excerpt ?? "",
      content: defaultValues?.content ?? "",
      status: defaultValues?.status ?? "draft",
      tag_ids: defaultValues?.tags?.map((t) => t.id) ?? [],
    },
  });

  const selectedTagIds = watch("tag_ids") ?? [];

  const toggleTag = (id: number) => {
    const updated = selectedTagIds.includes(id)
      ? selectedTagIds.filter((t) => t !== id)
      : [...selectedTagIds, id];
    setValue("tag_ids", updated);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="title">Judul</Label>
        <Input
          id="title"
          placeholder="Judul artikel yang menarik..."
          {...register("title")}
        />
        {errors.title && (
          <p className="text-xs text-red-500">{errors.title.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          placeholder="Ringkasan singkat artikel (tampil di listing)..."
          rows={2}
          {...register("excerpt")}
        />
        {errors.excerpt && (
          <p className="text-xs text-red-500">{errors.excerpt.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label>Status</Label>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="w-48">
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
      {tags && tags.length > 0 && (
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
      <div className="space-y-2">
        <Label>Konten</Label>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <RichTextEditor
              value={field.value}
              onChange={field.onChange}
              placeholder="Tulis konten artikel di sini..."
            />
          )}
        />
        {errors.content && (
          <p className="text-xs text-red-500">{errors.content.message}</p>
        )}
      </div>
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending
          ? "Menyimpan..."
          : defaultValues
            ? "Update Artikel"
            : "Buat Artikel"}
      </Button>
    </form>
  );
}
