import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Comment } from "./types";

interface UseCommentsProps {
	beerId: string;
}

export function useComments({ beerId }: UseCommentsProps) {
	return useQuery({
		queryKey: ["comments"],
		queryFn: async (): Promise<Comment[]> => {
			const { data } = await axios.get<Comment[]>(
				`/api/beers/${beerId}/comments`
			);
			return data;
		},
	});
}
