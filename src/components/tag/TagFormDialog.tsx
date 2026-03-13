"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tagSchema, TagSchema } from "@/lib/validations/tag";
import { Tag } from "@/types/tag";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface TagFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: Tag;
  onSubmit: (data: TagSchema) => void;
  isPending: boolean;
}

export function TagFormDialog({
  open,
  onOpenChange,
  defaultValues,
  onSubmit,
  isPending,
}: TagFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TagSchema>({
    resolver: zodResolver(tagSchema),
    defaultValues: { name: defaultValues?.name ?? "" },
  });

  useEffect(() => {
    reset({ name: defaultValues?.name ?? "" });
  }, [defaultValues, open, reset]);

  const handleFormSubmit = (data: TagSchema) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] max-h-[90vh] overflow-hidden p-0 sm:max-w-md">
        <DialogHeader className="sticky top-0 z-10 border-b bg-background px-6 py-4">
          <DialogTitle>
            {defaultValues ? "Edit Tag" : "Buat Tag Baru"}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex max-h-[calc(90vh-4.5rem)] flex-col"
        >
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-2">
            <Label htmlFor="name">Nama Tag</Label>
            <Input
              id="name"
              placeholder="Contoh: Laravel, React, Docker..."
              autoFocus
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>
          <DialogFooter className="gap-2 px-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Menyimpan..."
                : defaultValues
                  ? "Update"
                  : "Buat Tag"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
