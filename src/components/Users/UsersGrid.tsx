"use client";

import { UserFormValues } from "@/services/users/schema";
import { User } from "@/services/users/types";
import {
	Container,
	Card,
	Text,
	Image,
	Grid,
	Center,
	useMantineColorScheme,
	useMantineTheme,
	Modal,
	Button,
	Collapse,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconUser } from "@tabler/icons-react";
import { useState } from "react";
import UserProfileForm from "../Profile/ProfileForm";
import { useRouter } from "next/navigation";
import { openConfirmModal } from "@mantine/modals";
import axios from "axios";

interface UsersGridProps {
	users: {
		id: string;
		name: string | null;
		email: string;
		image: string | null;
	}[];
}

export default function UsersGrid({ users }: UsersGridProps) {
	const { colorScheme } = useMantineColorScheme();
	const theme = useMantineTheme();
	const [modalOpened, { open, close }] = useDisclosure(false);
	const router = useRouter();
	const [expandedCard, setExpandedCard] = useState<string | null>(null);
	const [editFormUser, setEditFormUser] = useState<{
		initialValues: UserFormValues;
		userId: string;
	}>();
	const isDark = colorScheme === "dark";

	const openModal = async (user?: User) => {
		if (user) {
			const formUser: UserFormValues = {
				name: user.name ?? null,
				email: user.email,
				image: user.image ?? null,
			};
			setEditFormUser({ initialValues: formUser, userId: user.id });
			open();
			return;
		}
		setEditFormUser(undefined);
		open();
	};

	const onDelete = async (user: User) => {
		openConfirmModal({
			title: `Usunąć ${user.name ?? user.email}?`,
			centered: true,
			children: "Na pewno chcesz usunąć tego uczestnika? Wszystkie jego oceny i komentarze znikną z serwisu. Tej akcji nie można cofnąć.",
			labels: { confirm: "Tak, usuń", cancel: "Anuluj" },
			confirmProps: { color: "red" },
			onConfirm: async () => {
				try {
					await axios.delete(`/api/users/${user.id}`);
					router.refresh();
				} catch (err) {
					console.error("Delete failed", err);
				}
			},
		});
	};

	return (
		<>
			<Modal centered opened={modalOpened} onClose={close}>
				<UserProfileForm
					editData={editFormUser}
					onFormSubmit={() => {
						close();
						router.refresh();
					}}
				/>
			</Modal>
			<Button ml={30} w={150} size="xs" onClick={() => openModal()}>
				Dodaj uczestnika
			</Button>
			<Container
				fluid
				style={{
					padding: "2rem",
					borderRadius: "8px",
				}}
			>
				<Grid gutter={"xl"}>
					{users.map((user, index) => (
						<Grid.Col
							key={user.id || index}
							span={{
								lg: 2,
								md: 3,
								xs: 4,
							}}
						>
							<Center>
								<div style={{ width: 200 }}>
									<Card
										shadow="sm"
										padding="lg"
										radius="md"
										withBorder
										w={200}
										style={{
											backgroundColor: isDark
												? theme.colors.platform[7]
												: "#fff",
											cursor: "pointer",
											borderRadius:
												expandedCard === user.id ? "8px 8px 0 0" : "8px",
										}}
										onClick={() =>
											setExpandedCard(expandedCard === user.id ? null : user.id)
										}
									>
										<Card.Section>
											{user.image ? (
												<Image
													src={user.image}
													height={200}
													alt={user.name || "User Avatar"}
												/>
											) : (
												<Center
													style={{
														height: 200,
														backgroundColor: isDark
															? theme.colors.platform[6]
															: theme.colors.beer[1],
													}}
												>
													<IconUser
														size={64}
														color={
															isDark
																? theme.colors.beer[2]
																: theme.colors.platform[6]
														}
													/>
												</Center>
											)}
										</Card.Section>

										<Text
											fw={500}
											size="lg"
											mt="md"
											c={isDark ? "beer.3" : "platform.6"}
										>
											{user.name || "Anonim 🥺👉👈"}
										</Text>
									</Card>

									<Collapse in={expandedCard === user.id}>
										<div
											style={{
												background: isDark
													? theme.colors.platform[6]
													: theme.colors.beer[1],
												border: `1px solid ${
													isDark
														? theme.colors.platform[6]
														: theme.colors.platform[1]
												}`,
												borderTop: "none",
												borderRadius: "0 0 8px 8px",
												padding: 16,
											}}
										>
											<Button
												fullWidth
												size="xs"
												color="beer"
												mb="sm"
												onClick={() => {
													openModal(user);
													setExpandedCard(null);
												}}
											>
												Edytuj użytkownika
											</Button>
											<Button
												onClick={() => onDelete(user)}
												fullWidth
												size="xs"
												color="red"
											>
												Usuń użytkownika
											</Button>
										</div>
									</Collapse>
								</div>
							</Center>
						</Grid.Col>
					))}
				</Grid>
			</Container>
		</>
	);
}
