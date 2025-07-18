import {
	IconBeerFilled,
	IconDashboard,
	IconLock,
	IconMoodSmile,
} from "@tabler/icons-react";
import type { NavItem } from "@/types/nav-item";

export const navLinks: NavItem[] = [
	{ label: "Kokpit", icon: IconDashboard, link: "/dashboard" },
	{
		label: "Piwa",
		icon: IconBeerFilled,
		link: "/dashboard/beers",
	},
	{
		label: "Auth",
		icon: IconLock,
		initiallyOpened: true,
		links: [
			{
				label: "Login",
				link: "/login",
			},
			{
				label: "Register",
				link: "/register",
			},
		],
	},
	{
		label: "Sample",
		icon: IconMoodSmile,
		initiallyOpened: true,
		links: [
			{
				label: "Landing",
				link: "/",
			},
		],
	},
];
