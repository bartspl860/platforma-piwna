import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Beer } from "./types";
import { toZloty } from "../common";

export function useBeers() {
	return useQuery({
		queryKey: ["beers"],
		queryFn: async (): Promise<Beer[]> => {
			const { data } = await axios.get<Beer[]>("/api/beers");
			return data.map((beer) => ({
				...beer,
				price: toZloty(beer.price),
			}));
		},
	});
}
