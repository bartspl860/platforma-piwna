import { User } from "../users/types";

export interface Comment {
	id: string;
  user: User;
  beerId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
