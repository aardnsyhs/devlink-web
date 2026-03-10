"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterSchema } from "@/lib/validations/auth";
import { useRegister } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
          <div className="space-y-2">
            <Label htmlFor="name">Nama</Label>
            <Input id="name" placeholder="Nama lengkap" {...register("name")} />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="kamu@email.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
            <Input
              id="password_confirmation"
              type="password"
              placeholder="••••••••"
              {...register("password_confirmation")}
            />
            {errors.password_confirmation && (
              <p className="text-xs text-red-500">
                {errors.password_confirmation.message}
              </p>
            )}
          </div>
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
