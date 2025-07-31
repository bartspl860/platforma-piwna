"use client";

import { useSession } from "next-auth/react";
import {
	Box,
	Button,
	Stack,
	TextInput,
	Container,
	Center,
	Alert,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { userClientSchema, UserFormValues } from "services/users/schema";
import { ImageDropzone } from "../ImageDropZone/ImageDropZone";
import { useState } from "react";
import axios from "axios";
import { zodResolver } from "mantine-form-zod-resolver";

interface UserFormProps {
	editData?: {
		initialValues: UserFormValues;
		userId: string;
	};
	onFormSubmit?: () => void;
}

export default function UserProfileForm({
	editData,
	onFormSubmit,
}: UserFormProps) {
	const { data: session, update } = useSession();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | undefined>(undefined);

	if (!session?.user) return null;

	const form = useForm<UserFormValues>({
		initialValues: editData
			? editData.initialValues
			: {
					name: session.user.name ?? "",
					email: session.user.email ?? "",
					image: session.user.image ?? null,
			  },
		validate: zodResolver(userClientSchema)
	});

	const handleSubmit = async (values: UserFormValues) => {
		setLoading(true);
		setError(undefined);

		let imageUrl: string | null = null;

		if (values.image instanceof File) {
			try {
				const formData = new FormData();
				formData.append("file", values.image);
				const response = await axios.post("/api/upload", formData, {
					headers: { "Content-Type": "multipart/form-data" },
				});
				imageUrl = response.data.url;
			} catch (err) {
				setError("Nie udało się przesłać zdjęcia.");
				setLoading(false);
				return;
			}
		} else {
			imageUrl = values.image;
		}

		const apiValues = {
			...values,
			image: imageUrl,
		};

		try {
			if (editData) {
				await axios.patch(`/api/users/${editData.userId}`, apiValues);
			} else {
				await axios.post("/api/users", apiValues);
			}
			const session = await update();
			if (session) {
				form.setValues({
					name: session.user.name ?? "",
					email: session.user.email ?? "",
					image: session.user.image ?? null,
				});
			}
			onFormSubmit?.();
		} catch (e) {
			setError("Coś poszło nie tak podczas dodawania piwa.");
		}

		setLoading(false);
	};

	return (
		<Container size="xs">
			<Stack gap="md">
				<Center>
					<Box style={{ textAlign: "center" }}>
						<ImageDropzone
							avatar
							value={form.values.image}
							onFileChange={(file) => form.setFieldValue("image", file)}
							radius={"xl"}
						/>
					</Box>
				</Center>

				<form onSubmit={form.onSubmit(handleSubmit)}>
					<Stack gap="xs">
						<TextInput
							label="Pseudonim"
							withAsterisk
							{...form.getInputProps("name")}
						/>
						<TextInput
							label="Email"
							withAsterisk
							{...form.getInputProps("email")}
						/>

						{error && (
							<Alert color="red" mt="md">
								{error}
							</Alert>
						)}

						<Button fullWidth mt="lg" type="submit" loading={loading}>
							{editData ? "Zapisz zmiany" : "Dodaj"}
						</Button>
					</Stack>
				</form>
			</Stack>
		</Container>
	);
}
