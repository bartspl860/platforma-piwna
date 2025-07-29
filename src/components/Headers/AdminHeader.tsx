import { Box, Flex, TextInput, rem } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import classes from "./AdminHeader.module.css";
import { Logo } from "../Logo/Logo";
import ProfileButton from "../Profile/ProfileButton";

interface Props {
	burger: React.ReactNode;
}

export function AdminHeader({ burger }: Props) {
	return (
		<header className={classes.header}>
			<Flex
				align="center"
				justify="space-between"
				wrap="nowrap"
				w="100%"
				gap="md"
				style={{ minWidth: 0, position: "relative" }}
			>
				{/* Left group: Burger + Logo (logo hidden here on mobile) */}
				<Flex className={classes.leftGroup} align="center" gap="sm">
					{burger}
					<Box className={classes.logoDesktop}>
						<Logo />
					</Box>
				</Flex>

				{/* Center: Logo (mobile only) */}
				<Box className={classes.logoMobile}>
					<Logo />
				</Box>

				{/* Right: Search + Profile */}
				<Flex align="center" gap="sm" className={classes.rightGroup}>
					<TextInput
						visibleFrom="sm"
						placeholder="Search"
						variant="filled"
						leftSection={<IconSearch size="0.8rem" />}
						style={{
							maxWidth: 200,
							flexShrink: 1,
						}}
					/>
					<Box style={{ flexShrink: 0 }}>
						<ProfileButton />
					</Box>
				</Flex>
			</Flex>
		</header>
	);
}
