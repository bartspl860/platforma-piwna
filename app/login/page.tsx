'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { z } from 'zod';
import { Alert, Button, Paper, PasswordInput, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';

// 1. Zod schema
const schema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 2. Mantine form with Zod
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: (values) => {
      const result = schema.safeParse(values);
      if (result.success) {return {};}
      return result.error.flatten().fieldErrors;
    },
  });

  // 3. Handle submit
  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    setError(null);

    const res = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
      callbackUrl: '/', // or your desired route
    });

    if (res?.ok) {
      router.push('/');
    } else {
      setError('Invalid email or password');
    }
    setLoading(false);
  };

  return (
    <Paper shadow="md" p="xl" radius="md" withBorder style={{ maxWidth: 400, margin: '40px auto' }}>
      <Title order={2} mb="lg">
        Login
      </Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Email"
          placeholder="you@example.com"
          required
          {...form.getInputProps('email')}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          required
          mt="md"
          {...form.getInputProps('password')}
        />
        {error && (
          <Alert color="red" mt="md">
            {error}
          </Alert>
        )}
        <Button type="submit" fullWidth mt="xl" loading={loading}>
          Login {/** auto-registers first user */}
        </Button>
      </form>
    </Paper>
  );
}
