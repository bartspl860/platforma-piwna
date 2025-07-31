import {
	IconBeerFilled,
	IconDashboard,
	IconUsersGroup,
} from "@tabler/icons-react";
import type { NavItem } from "types/nav-item";

export const navLinks: NavItem[] = [
	{ label: "Kokpit", icon: IconDashboard, link: "/dashboard" },
	{
		label: "Piwa",
		icon: IconBeerFilled,
		link: "/dashboard/beers",
	},
	{
		label: "Uczestnicy",
		icon: IconUsersGroup,
		link: "/dashboard/users",
	},
];
