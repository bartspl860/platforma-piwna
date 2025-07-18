import { useState, useEffect } from "react";
import { Dropzone, DropzoneProps, FileRejection } from "@mantine/dropzone";
import { Text, Group, Stack, Button } from "@mantine/core";
import { IconPhotoPlus, IconX } from "@tabler/icons-react";

// Helper for filename truncation
function truncateFileName(filename: string, maxBaseLength = 18) {
	const dotIndex = filename.lastIndexOf(".");
	if (dotIndex === -1)
		return filename.length > maxBaseLength
			? filename.slice(0, maxBaseLength) + "…"
			: filename;
	const name = filename.slice(0, dotIndex);
	const ext = filename.slice(dotIndex);
	if (name.length > maxBaseLength) {
		return name.slice(0, maxBaseLength) + "…" + ext;
	}
	return filename;
}

export function ImageDropzone({
	value,
	onFileChange,
	maxSize = 5 * 1024 * 1024, // 5MB
	accept = { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
	radius = "md",
	placeholder = "Przeciągnij zdjęcie tutaj lub kliknij, aby wybrać",
	error,
	...rest
}: {
	value: File | undefined;
	onFileChange: (file: File | undefined) => void;
	error?: string | string[];
	maxSize?: number;
	accept?: DropzoneProps["accept"];
	radius?: DropzoneProps["radius"];
	placeholder?: string;
} & Omit<DropzoneProps, "onDrop" | "onReject" | "accept" | "radius">) {
	const [preview, setPreview] = useState<string | null>(null);
	const [localError, setLocalError] = useState<string>();

	useEffect(() => {
		if (value && value instanceof File) {
			const url = URL.createObjectURL(value);
			setPreview(url);
			return () => URL.revokeObjectURL(url);
		}
		setPreview(null);
	}, [value]);

	const handleReject = (rejections: FileRejection[]) => {
		const messages = rejections.flatMap((rej) =>
			rej.errors.map((err) => {
				switch (err.code) {
					case "file-too-large":
						return "Plik jest za duży (maksymalnie 5MB)";
					case "file-invalid-type":
						return "Nieprawidłowy format pliku (dozwolone: JPG, PNG, WEBP)";
					default:
						return "Nieznany błąd pliku";
				}
			})
		);
		setLocalError(messages.join(", "));
	};

	return (
		<>
			<Dropzone
				onDrop={(files) => {
					setLocalError(undefined);
					onFileChange(files[0]);
				}}
				onReject={handleReject}
				maxSize={maxSize}
				accept={accept}
				multiple={false}
				radius={radius}
				p="md"
				style={{
					border: "2px dashed #b3b3b3",
					background: preview
						? `url(${preview}) center/contain no-repeat #f8f9fa`
						: "#f8f9fa",
					cursor: "pointer",
					minHeight: 130,
					position: "relative",
				}}
				{...rest}
			>
				{!preview ? (
					<Group justify="center" style={{ minHeight: 110 }}>
						{value ? (
							<Text c="teal" fw={600} size="12px">
								Wybrano plik: {truncateFileName(value.name)}
							</Text>
						) : (
							<Stack align="center" gap={6}>
								<IconPhotoPlus size={36} stroke={1.5} />
								<Text size="sm" c="gray.7">
									{placeholder}
								</Text>
								<Text size="xs" c="dimmed">
									Obsługiwane formaty: PNG, JPG, JPEG, WEBP (max 5MB)
								</Text>
							</Stack>
						)}
					</Group>
				) : (
					<Button
						color="red"
						size="xs"
						variant="subtle"
						onClick={(e) => {
							e.stopPropagation();
							onFileChange(undefined);
						}}
						leftSection={<IconX size={16} />}
						style={{ position: "absolute", top: 10, right: 10, zIndex: 2 }}
					>
						Usuń
					</Button>
				)}
			</Dropzone>
			{(error || localError) && (
				<Text c="red" size="xs" mt={2}>
					{error || localError}
				</Text>
			)}
		</>
	);
}
