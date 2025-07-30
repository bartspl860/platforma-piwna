import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { User } from "./types";

export function useUsers() {
	return useQuery({
		queryKey: ["beers"],
		queryFn: async (): Promise<User[]> => {
			const { data } = await axios.get<User[]>("/api/users");
			return data;
		},
	});
}

export function useUser(uuid: string) {
	return useQuery({
		queryKey: ["beers"],
		queryFn: async (): Promise<User> => {
			const { data } = await axios.get<User>(`/api/users/${uuid}`);
			return data;
		},
	});
}
