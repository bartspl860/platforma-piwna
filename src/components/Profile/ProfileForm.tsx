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
import { userClientSchema, UserFormValues } from "@/services/users/schema";
import { ImageDropzone } from "../ImageDropZone/ImageDropZone";
import { useState } from "react";
import axios, { AxiosError } from "axios";
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
	const { update } = useSession();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | undefined>(undefined);

	const form = useForm<UserFormValues>({
		initialValues: editData
			? editData.initialValues
			: {
					name: "",
					email: "",
					image: null,
			  },
		validate: zodResolver(userClientSchema),
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

		let name = values.name;
		if (name === "") {
			name = null;
		}

		const apiValues = {
			...values,
			name,
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
			if (axios.isAxiosError(e)) {
				const serverStatus = e.response?.status;
				switch (serverStatus) {
					case 409:
						setError("Uczestnik z takim emailem już istnieje.");
						break;
				}
			} else {
				setError("Coś poszło nie tak podczas dodawania uczestnika.");
			}
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
							avatarInitials="AZ"
							value={form.values.image}
							onFileChange={(file) => form.setFieldValue("image", file)}
							radius={"xl"}
						/>
					</Box>
				</Center>

				<form onSubmit={form.onSubmit(handleSubmit)}>
					<Stack gap="xs">
						<TextInput
							label="Email"
							withAsterisk
							{...form.getInputProps("email")}
						/>
						<TextInput label="Pseudonim" {...form.getInputProps("name")} />

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
