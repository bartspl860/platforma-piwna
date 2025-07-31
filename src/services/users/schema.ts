import { z } from "zod";

export type UserFormValues = z.infer<typeof userClientSchema>;

export const userClientSchema = z.object({
	name: z.string().min(5).or(z.literal('')).nullable(),
	email: z.string().email(),
	image: z.union([z.instanceof(File), z.string()]).nullable(),
});

export const userServerSchema = userClientSchema.extend({
	image: z.string().nullable(),
}).omit({ image: true }).extend({
	image: z.string().nullable(),
});

