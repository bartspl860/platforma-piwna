import { z } from "zod";
import { BeerCategoryEnum } from "./types";

export type BeerFormValues = z.infer<typeof beerClientSchema>;

export const beerClientSchema = z.object({
	name: z.string().min(5),
	alcohol: z.number().min(0).max(100),
	price: z.number().min(0).nullable().optional(),
	category: z.enum([BeerCategoryEnum.NIESMAKOWE, BeerCategoryEnum.SMAKOWE]),
	image: z.union([z.instanceof(File), z.string()]).nullable(),
});

export const beerServerSchema = beerClientSchema.extend({
	image: z.string().nullable(),
}).omit({ image: true }).extend({
	image: z.string().nullable(),
});

