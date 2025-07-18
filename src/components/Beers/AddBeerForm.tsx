"use client";

import {
	Card,
	Stack,
	Alert,
	Button,
	Text,
	NumberInput,
	Select,
	TextInput,
	Title,
	Divider,
	Box,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { FC, useEffect, useState } from "react";
import { z } from "zod";
import { BeerCategoryEnum } from "@/services/beers/types";
import { ImageDropzone } from "../ImageDropZone/ImageDropZone";
import axios from "axios";
import { beerFormSchema } from "@/services/beers/schema";
import { toGrosz } from "@/services/common";

export type BeerFormValues = z.infer<typeof beerFormSchema>;

interface BeerFormProps {
	editData?: {
		initialValues: BeerFormValues;
		beerId: string;
	};
	onFormSubmit?: () => void;
}

const BeerForm: FC<BeerFormProps> = ({ onFormSubmit, editData }) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | undefined>(undefined);

	const form = useForm<BeerFormValues>({
		initialValues: editData
			? editData.initialValues
			: {
					name: "",
					alcohol: 0,
					price: null,
					category: BeerCategoryEnum.NIESMAKOWE,
					image: undefined,
			  },
		validate: (values) => {
			const result = beerFormSchema.safeParse(values);
			if (result.success) return {};
			return result.error.flatten().fieldErrors;
		},
	});

	const [preview, setPreview] = useState<string | null>(null);

	useEffect(() => {
		if (form.values.image && form.values.image instanceof File) {
			const objectUrl = URL.createObjectURL(form.values.image);
			setPreview(objectUrl);
			return () => URL.revokeObjectURL(objectUrl);
		}
		setPreview(null);
	}, [form.values.image]);

	return (
		<Box
			p={5}
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<Card shadow="xl" radius="md" p="lg" withBorder w={"100%"}>
				<Title order={2} ta="center" mb="sm">
					{editData ? "Edytuj piwo" : "Dodaj piwo"}
				</Title>
				<Divider mb="lg" />

				<form
					onSubmit={form.onSubmit(async (values) => {
						setLoading(true);
						setError(undefined);
						try {
							// Prepare a new object for API
							const apiValues = {
								...values,
								price: toGrosz(values.price),
							};

							if (editData)
								await axios.patch(`/api/beers/${editData.beerId}`, apiValues);
							else await axios.post("/api/beers", apiValues);

							form.reset();
							setPreview(null);
							onFormSubmit?.();
						} catch (e: any) {
							setError("Coś poszło nie tak podczas dodawania piwa.");
						}
						setLoading(false);
					})}
				>
					<Stack gap="sm">
						<TextInput
							label="Nazwa piwa"
							placeholder="Kuflowe mocne"
							required
							{...form.getInputProps("name")}
						/>

						<NumberInput
							label="Alkohol (%)"
							required
							min={0}
							max={100}
							decimalScale={1}
							step={0.1}
							{...form.getInputProps("alcohol")}
						/>

						<NumberInput
							label="Cena (zł)"
							decimalScale={2}
							step={0.01}
							{...form.getInputProps("price")}
						/>

						<Select
							label="Kategoria piwa"
							placeholder="Wybierz kategorię"
							data={[
								{ value: BeerCategoryEnum.NIESMAKOWE, label: "Niesmakowe" },
								{ value: BeerCategoryEnum.SMAKOWE, label: "Smakowe" },
							]}
							required
							{...form.getInputProps("category")}
						/>

						<Box h={"100%"}>
							<Text size="sm" fw={500} mb={4}>
								Zdjęcie piwa
							</Text>
							<ImageDropzone
								value={form.values.image}
								onFileChange={(file) => form.setFieldValue("image", file)}
							/>
						</Box>
						{error && (
							<Alert color="red" mt="md">
								{error}
							</Alert>
						)}
						<Button fullWidth mt="lg" type="submit" loading={loading}>
							{editData ? "Edytuj" : "Dodaj"}
						</Button>
					</Stack>
				</form>
			</Card>
		</Box>
	);
};

export default BeerForm;
