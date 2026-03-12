"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterSchema } from "@/lib/validations/auth";
import { useRegister } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/FormField";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegisterPage() {
  const { mutate: register_, isPending, error } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterSchema) => register_(data);

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Buat akun</CardTitle>
        <CardDescription>Bergabung dengan komunitas developer</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {error && (
            <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950 px-3 py-2 rounded-md">
              Pendaftaran gagal. Coba lagi.
            </div>
          )}
          <FormField id="name" label="Nama" error={errors.name?.message}>
            <Input id="name" placeholder="Nama lengkap" {...register("name")} />
          </FormField>
          <FormField id="email" label="Email" error={errors.email?.message}>
            <Input
              id="email"
              type="email"
              placeholder="kamu@email.com"
              {...register("email")}
            />
          </FormField>
          <FormField
            id="password"
            label="Password"
            error={errors.password?.message}
          >
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
            />
          </FormField>
          <FormField
            id="password_confirmation"
            label="Konfirmasi Password"
            error={errors.password_confirmation?.message}
          >
            <Input
              id="password_confirmation"
              type="password"
              placeholder="••••••••"
              {...register("password_confirmation")}
            />
          </FormField>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Mendaftar..." : "Daftar"}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="text-primary font-medium hover:underline"
            >
              Masuk
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
