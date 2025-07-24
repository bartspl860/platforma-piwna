import { User } from "@/prisma/generated";

export interface Comment {
	id: string;
  user: User;
  beerId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
