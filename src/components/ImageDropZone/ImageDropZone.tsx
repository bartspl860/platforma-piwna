"use client";

import { useState, useEffect } from "react";
import { Dropzone, DropzoneProps, FileRejection } from "@mantine/dropzone";
import {
	Text,
	Group,
	Stack,
	rem,
	ActionIcon,
	useMantineColorScheme,
} from "@mantine/core";
import { IconPhotoPlus, IconUser, IconX } from "@tabler/icons-react";
import { theme } from "@/styles/theme";
import { useSession } from "next-auth/react";

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
	maxSize = 5 * 1024 * 1024,
	accept = { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
	radius = "md",
	placeholder = "Przeciągnij zdjęcie tutaj lub kliknij, aby wybrać",
	error,
	avatar = false,
	...rest
}: {
	value: File | string | null;
	onFileChange: (file: File | string | null) => void;
	error?: string | string[];
	maxSize?: number;
	accept?: DropzoneProps["accept"];
	radius?: DropzoneProps["radius"];
	placeholder?: string;
	avatar?: boolean;
} & Omit<DropzoneProps, "onDrop" | "onReject" | "accept" | "radius">) {
	const [preview, setPreview] = useState<string | null>(null);
	const [localError, setLocalError] = useState<string>();
	const { colorScheme } = useMantineColorScheme();
	const isDark = colorScheme === "dark";
	const { data: session } = useSession();

	const bgColor = isDark
		? theme.colors!.platform![9]
		: theme.colors!.platform![0];

	const borderColor = isDark
		? theme.colors!.platform![2]
		: theme.colors!.platform![6];

	const fallbackInitials =
		session?.user.name
			?.split(" ")
			.map((n) => n[0])
			.join("") ?? "U";

	useEffect(() => {
		if (!value) {
			setPreview(null);
			return;
		}
		if (value instanceof File) {
			const url = URL.createObjectURL(value);
			setPreview(url);
			return () => URL.revokeObjectURL(url);
		}
		if (typeof value === "string") {
			setPreview(value);
		}
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

	const dropzoneStyle: React.CSSProperties = {
		border: `2px ${avatar ? "none" : "dashed"} ${borderColor}`,
		background: preview
			? `url(${preview}) center/cover no-repeat ${bgColor}`
			: avatar
			? theme.colors!.beer![4]
			: bgColor,
		cursor: "pointer",
		minHeight: avatar ? rem(80) : rem(130),
		width: avatar ? rem(150) : "100%",
		height: avatar ? rem(150) : undefined,
		borderRadius: avatar ? rem(50) : radius,
		position: "relative",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		overflow: "visible",
	};

	const handleRemove = (e: React.MouseEvent) => {
		e.stopPropagation();
		onFileChange(null);
	};

	return (
		<>
			<Dropzone
				onDrop={(files) => {
					setLocalError(undefined);
					if (files[0]) {
						onFileChange(files[0]);
					} else if (preview) {
						onFileChange(preview);
					}
				}}
				onReject={handleReject}
				maxSize={maxSize}
				accept={accept}
				multiple={false}
				radius={radius}
				p="md"
				style={dropzoneStyle}
				{...rest}
			>
				{/* Remove Button */}
				{preview && (
					<ActionIcon
						onClick={handleRemove}
						color="red"
						variant="filled"
						radius="xl"
						size="sm"
						style={{
							position: "absolute",
							top: 4,
							right: 4,
							zIndex: 2,
							backgroundColor: "red",
							color: "white",
						}}
					>
						<IconX size={14} />
					</ActionIcon>
				)}

				{/* Dropzone content */}
				{!preview && (
					<Group justify="center" style={{ textAlign: "center" }}>
						<Stack align="center" gap={4}>
							{avatar ? (
								<Text
									size={rem(60)}
									fw={600}
									lh={1}
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										width: rem(80),
										height: rem(80),
										borderRadius: rem(8),
										backgroundColor: theme.colors!.beer![4],
										color: "white",
									}}
								>
									{fallbackInitials}
								</Text>
							) : (
								<IconPhotoPlus stroke={1.5} color={borderColor} />
							)}
							{!avatar && (
								<>
									<Text size="sm" c={borderColor}>
										{placeholder}
									</Text>
									<Text size="xs" c="dimmed" ta="center">
										Obsługiwane formaty: PNG, JPG, JPEG, WEBP (max 5MB)
									</Text>
								</>
							)}
							{value instanceof File && !avatar && (
								<Text c="teal" fw={600} size="xs">
									{truncateFileName(value.name)}
								</Text>
							)}
						</Stack>
					</Group>
				)}
			</Dropzone>

			{/* Error */}
			{(error || localError) && (
				<Text c="red" size="xs" mt={4}>
					{error || localError}
				</Text>
			)}
		</>
	);
}
