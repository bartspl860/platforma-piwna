import { z } from "zod";
import { BeerCategoryEnum } from "./types";

export const beerFormSchema = z.object({
	name: z.string().min(5),
	alcohol: z.number().min(0).max(100),
	price: z.number().min(0).nullable().optional(),
	category: z.enum([BeerCategoryEnum.NIESMAKOWE, BeerCategoryEnum.SMAKOWE]),
	image: z.instanceof(File).optional(),
});
