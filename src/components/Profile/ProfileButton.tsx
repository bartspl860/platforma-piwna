"use client";

import { useState } from "react";
import {
	Avatar,
	Box,
	Button,
	Center,
	Popover,
	Stack,
	Text,
	Tooltip,
	useMantineColorScheme,
} from "@mantine/core";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ThemeSwitcher } from "../ThemeSwitcher/ThemeSwitcher";

export default function ProfileButton() {
	const { data: session } = useSession();
	const router = useRouter();
	const [opened, setOpened] = useState(false);
	const { colorScheme } = useMantineColorScheme();

	if (!session?.user) return null;

	const user = session.user;
	const fallbackInitials =
		user.name
			?.split(" ")
			.map((n) => n[0])
			.join("") ?? "U";

	const btnAvatarSize = 40;
	const avatarSize = 80;
	const avatarColor = "beer.4";

	return (
		<Popover
			opened={opened}
			onChange={setOpened}
			position="bottom-end"
			withArrow
			shadow="md"
			offset={8}
		>
			<Popover.Target>
				<Tooltip label="Profil użytkownika" withArrow>
					<Avatar
						src={user.image}
						size={btnAvatarSize}
						radius="lg"
						alt={user.name ?? "User avatar"}
						onClick={() => setOpened((o) => !o)}
						style={{ cursor: "pointer" }}
						color={avatarColor}
						variant="filled"
					>
						{fallbackInitials}
					</Avatar>
				</Tooltip>
			</Popover.Target>

			<Popover.Dropdown>
				<Box w={220}>
					<Box
						style={{
							display: "flex",
							justifyContent: "flex-end",
							marginBottom: 8,
						}}
					>
						<ThemeSwitcher />
					</Box>

					<Center mb="sm">
						<Avatar
							src={user.image}
							size={avatarSize}
							radius="xl"
							alt={user.name ?? "User avatar"}
							color={avatarColor}
							variant="filled"
						>
							{fallbackInitials}
						</Avatar>
					</Center>

					<Stack gap={2} align="center" mb="sm">
						<Text size="sm" fw={500}>
							{user.name}
						</Text>
						<Text size="xs" c="dimmed">
							{user.email}
						</Text>
					</Stack>

					<Stack gap={10}>
						<Button
							fullWidth
							size="xs"
							onClick={() => {
								setOpened(false);
								router.push("/dashboard/profile");
							}}
						>
							Profil
						</Button>
						<Button
							fullWidth
							variant="light"
							color="red"
							size="xs"
							onClick={async () => {
								setOpened(false);
								await signOut({ callbackUrl: "/login" });
							}}
						>
							Wyloguj
						</Button>
					</Stack>
				</Box>
			</Popover.Dropdown>
		</Popover>
	);
}
