"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateProfileSchema,
  UpdateProfileSchema,
} from "@/lib/validations/auth";
import { useAuthStore } from "@/store/authStore";
import { useUpdateProfile } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/FormField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardProfilePage() {
  const { user } = useAuthStore();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      password: "",
      password_confirmation: "",
    },
  });

  useEffect(() => {
    reset({
      name: user?.name ?? "",
      email: user?.email ?? "",
      password: "",
      password_confirmation: "",
    });
  }, [user, reset]);

  const onSubmit = (data: UpdateProfileSchema) => {
    updateProfile(data, {
      onSuccess: () => {
        reset({
          name: data.name,
          email: data.email,
          password: "",
          password_confirmation: "",
        });
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Kelola informasi akun kamu
        </p>
      </div>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Informasi Akun</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField id="name" label="Nama" error={errors.name?.message}>
              <Input id="name" {...register("name")} />
            </FormField>
            <FormField id="email" label="Email" error={errors.email?.message}>
              <Input id="email" type="email" {...register("email")} />
            </FormField>
            <FormField
              id="password"
              label="Password Baru (opsional)"
              error={errors.password?.message}
            >
              <Input
                id="password"
                type="password"
                placeholder="Kosongkan jika tidak ingin mengubah"
                {...register("password")}
              />
            </FormField>
            <FormField
              id="password_confirmation"
              label="Konfirmasi Password Baru"
              error={errors.password_confirmation?.message}
            >
              <Input
                id="password_confirmation"
                type="password"
                placeholder="Ulangi password baru"
                {...register("password_confirmation")}
              />
            </FormField>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
