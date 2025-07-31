"use client";

import { ScrollArea } from "@mantine/core";

import type { NavItem } from "types/nav-item";
import { NavLinksGroup } from "./NavLinksGroup";
import classes from "./Navbar.module.css";

interface Props {
	data: NavItem[];
	hidden?: boolean;
	onToggle?: () => void;
}

export function Navbar({ data }: Props) {
	const links = data.map((item) => (
		<NavLinksGroup key={item.label} {...item} />
	));

	return (
		<ScrollArea className={classes.links}>
			<div className={classes.linksInner}>{links}</div>
		</ScrollArea>
	);
}
