import { z } from "zod";

export const commentCreateSchema = z.object({
  content: z
    .string({
      required_error: "Treść komentarza jest wymagana",
      invalid_type_error: "Komentarz musi być tekstem",
    })
    .min(1, "Komentarz nie może być pusty")
    .max(1000, "Komentarz jest za długi"),
});
