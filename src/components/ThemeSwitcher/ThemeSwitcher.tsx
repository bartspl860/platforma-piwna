"use client";

import { useEffect, useState } from "react";
import { Within } from "@theme-toggles/react";
import "@theme-toggles/react/css/Within.css";

import { useMantineColorScheme, Tooltip } from "@mantine/core";

export const ThemeSwitcher = () => {
	const { colorScheme, setColorScheme } = useMantineColorScheme();
	const [mounted, setMounted] = useState(false);
	const [toggled, setToggled] = useState(false);

	useEffect(() => {
		setMounted(true);
		setToggled(colorScheme === "dark");
	}, [colorScheme]);

	const handleClick = () => {
		const next = toggled ? "light" : "dark";
		setColorScheme(next);
		setToggled(!toggled);
	};

	if (!mounted) return null;

	return (
		<Tooltip
			label={toggled ? "Switch to light mode" : "Switch to dark mode"}
			withArrow
		>
			<div
				onClick={handleClick}
				style={{
					display: "inline-flex",
					alignItems: "center",
					justifyContent: "center",
					padding: 4, // smaller padding
					borderRadius: "9999px",
					cursor: "pointer",
					userSelect: "none",
					width: 32,
					height: 32,
				}}
			>
				<div
					style={{
						transform: "scale(1.5)", // reduce toggle size
						transformOrigin: "center",
					}}
				>
					<Within placeholder="Toggle theme" toggled={toggled} duration={500} />
				</div>
			</div>
		</Tooltip>
	);
};
