"use client";

import {
	Alert,
	Anchor,
	Button,
	Card,
	Checkbox,
	Group,
	PasswordInput,
	TextInput,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "@mantine/form";
import { z } from "zod";

// 1. Zod schema
const schema = z.object({
	email: z.string().email({ message: "Invalid email address" }),
	password: z
		.string()
		.min(6, { message: "Password must be at least 6 characters" }),
});

export default function LoginForm() {
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	// 2. Mantine form with Zod
	const form = useForm({
		initialValues: {
			email: "",
			password: "",
		},
		validate: (values) => {
			const result = schema.safeParse(values);
			if (result.success) return {};
			return result.error.flatten().fieldErrors;
		},
	});

	// 3. Handle submit
	const handleSubmit = async (values: z.infer<typeof schema>) => {
		setLoading(true);
		setError(null);

		const res = await signIn("credentials", {
			email: values.email,
			password: values.password,
			redirect: false,
			callbackUrl: "/", // or your desired route
		});

		if (res?.ok) {
			router.push("/dashboard");
		} else {
			setError("Invalid email or password");
		}
		setLoading(false);
	};

	return (
		<Card withBorder shadow="md" p={30} mt={30} radius="md">
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<TextInput
					label="Email"
					placeholder="test@example.com"
					required
					{...form.getInputProps("email")}
				/>
				<PasswordInput
					label="Password"
					placeholder="Your password"
					required
					mt="md"
					{...form.getInputProps("password")}
				/>
				{error && (
          <Alert color="red" mt="md">
            {error}
          </Alert>
        )}
				<Group mt="md" justify="space-between">
					<Checkbox label="Remember me" />
					<Anchor size="sm" href="#">
						Forgot Password？
					</Anchor>
				</Group>
				<Button fullWidth mt="xl" type="submit" loading={loading}>
					Sign In
				</Button>
			</form>
		</Card>
	);
}
