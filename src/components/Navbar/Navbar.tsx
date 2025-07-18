"use client";

import { ScrollArea } from "@mantine/core";

import type { NavItem } from "@/types/nav-item";
import { NavLinksGroup } from "./NavLinksGroup";
import classes from "./Navbar.module.css";
import { IconLogout } from "@tabler/icons-react";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";

interface Props {
	data: NavItem[];
	hidden?: boolean;
}

export function Navbar({ data }: Props) {
	const links = data.map((item) => (
		<NavLinksGroup key={item.label} {...item} />
	));

	return (
		<>
			<ScrollArea className={classes.links}>
				<div className={classes.linksInner}>{links}</div>
			</ScrollArea>
			<div className={classes.footer}>
				<button
					onClick={async () => {
						await signOut();
						redirect("/login");
					}}
					className={classes.control}
					style={{
						color: "#fa5252",
						width: "100%",
						padding: "8px 16px",
						fontWeight: 600,
						background: "none",
						border: "none",
						cursor: "pointer",
						display: "flex",
						alignItems: "center",
					}}
				>
					<IconLogout size={18} style={{ marginRight: 8 }} />
					Logout
				</button>
			</div>
		</>
	);
}
