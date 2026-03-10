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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {defaultValues ? "Edit Tag" : "Buat Tag Baru"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="py-4 space-y-2">
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
          <DialogFooter className="gap-2">
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
