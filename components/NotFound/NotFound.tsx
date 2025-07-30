"use client";

import {
	Button,
	Center,
	Group,
	Image,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

export default function NotFoundPage() {
	return (
		<Center style={{ height: "100vh", textAlign: "center" }}>
			<Stack align="center" gap="md">
				<Group gap={0} align="center" justify="center">
					<Title
						order={1}
						size={160}
						c="beer.5"
						fw={900}
						lh={1}
						style={{ fontSize: "min(30vw, 200px)" }}
					>
						4
					</Title>

					<Image
						src="404-logo.png"
						alt="Wylane piwo"
						w={Math.min(160, 0.3 * window.innerWidth)}
						h="auto"
						style={{
							maxHeight: "min(30vw, 200px)",
							objectFit: "contain",
						}}
					/>

					<Title
						order={1}
						size={160}
						c="beer.5"
						fw={900}
						lh={1}
						style={{ fontSize: "min(30vw, 200px)" }}
					>
						4
					</Title>
				</Group>

				<Text size="xl" c="platform.5">
					Ups... ta strona się nie uwarzyła!
				</Text>

				<Text size="sm" c="platform.4">
					Może wylała się po drodze, albo fermentuje gdzieś głęboko w piwnicy.
				</Text>

				<Button
					component={Link}
					href="/"
					variant="gradient"
					gradient={{ from: "beer.4", to: "beer.5", deg: 90 }}
					leftSection={<IconArrowLeft size={18} />}
				>
					Wróć do strony głównej
				</Button>
			</Stack>
		</Center>
	);
}
