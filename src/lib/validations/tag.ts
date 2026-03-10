import { z } from "zod";

export const tagSchema = z.object({
  name: z
    .string()
    .min(2, "Nama tag minimal 2 karakter")
    .max(50, "Nama tag maksimal 50 karakter"),
});

export type TagSchema = z.infer<typeof tagSchema>;
