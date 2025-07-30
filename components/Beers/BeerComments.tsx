"use client";

import { useState } from "react";
import {
	Stack,
	Card,
	Text,
	Textarea,
	Button,
	Group,
	Avatar,
	ActionIcon,
	Input,
	Flex,
	Box,
} from "@mantine/core";
import { useComments } from "services/comments";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { IconTrash } from "@tabler/icons-react";
import { CommentInput } from "../Comments/CommentInput";
import { User } from "services/users/types";

interface BeerCommentsProps {
	beerId: string;
}

export default function BeerComments({ beerId }: BeerCommentsProps) {
	const {
		data: comments = [],
		isLoading,
		isError,
		refetch,
	} = useComments({ beerId });
	const { data: session } = useSession();

	const [value, setValue] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const handleAdd = async () => {
		if (!value.trim()) return;
		setSubmitting(true);
		try {
			await fetch(`/api/beers/${beerId}/comments`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ content: value }),
			});
			setValue(""); // Clear textarea
			refetch();
		} finally {
			setSubmitting(false);
		}
	};

	const handleDelete = async (commentId: string) => {
		setDeletingId(commentId);
		try {
			await fetch(`/api/beers/${beerId}/comments/${commentId}`, {
				method: "DELETE",
			});
			refetch();
		} finally {
			setDeletingId(null);
		}
	};

	const userId = session?.user?.id;

	return (
		<Stack gap="sm">
			{isLoading && <Text c="dimmed">Ładowanie komentarzy…</Text>}
			{isError && <Text c="red">Błąd ładowania komentarzy.</Text>}

			{comments.length === 0 && !isLoading ? (
				<Text c="dimmed" ta="center">
					Brak komentarzy
				</Text>
			) : (
				comments.map(
					(comment: {
						id: string;
						content: string;
						createdAt: string;
						user: User;
					}) => (
						<Card key={comment.id} p="sm" radius="md" w="100%">
							<Group align="flex-start">
								<Avatar
									src={comment.user?.image ?? undefined}
									alt={comment.user?.name ?? "?"}
									radius="lg"
									size="md"
								/>
								<div style={{ flex: 1 }}>
									<Group gap={4} align="center">
										<Text fw={700} size="sm">
											{comment.user?.name ?? "Anonim"}
										</Text>
										<Text c="dimmed" size="xs">
											{dayjs(comment.createdAt).format("YYYY-MM-DD HH:mm")}
										</Text>
									</Group>
									<Text mt={4}>{comment.content}</Text>
								</div>
								{/* Delete button if current user's ID matches comment's user.id */}
								{comment.user?.id === userId && (
									<ActionIcon
										color="red"
										variant="light"
										loading={deletingId === comment.id}
										onClick={() => handleDelete(comment.id)}
										aria-label="Usuń komentarz"
									>
										<IconTrash size="1rem" />
									</ActionIcon>
								)}
							</Group>
						</Card>
					)
				)
			)}

			<CommentInput
				value={value}
				setValue={setValue}
				onSend={handleAdd}
				loading={submitting}
			/>
		</Stack>
	);
}
