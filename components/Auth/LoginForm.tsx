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
import { signIn, SignInResponse } from "next-auth/react";
import { useState } from "react";
import { useForm } from "@mantine/form";
import { z } from "zod";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { userClientSchema } from "@/services/users/schema";

const loginSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: zod4Resolver(loginSchema)
  });

  const handleSubmit = async (values: z.infer<typeof loginSchema>) => {
    setLoading(true);
    setError(null);

    const res = (await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    })) as SignInResponse;

    if (!res || res.error) {
      setError("Invalid email or password");
    } else {
      router.push("/dashboard");
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
