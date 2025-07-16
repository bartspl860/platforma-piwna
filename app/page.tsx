import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Paper, Group, Avatar, Title, Text, Box, NavLink, Stack, Container } from "@mantine/core";
import { SignOutButton } from "@/components/SignOutButton/SignOutButton";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <Container size="lg" py="xl">
      <Group align="flex-start" gap="xl">
        {/* Sidebar */}
        <Paper p="md" shadow="md" radius="md" withBorder style={{ minWidth: 220 }}>
          <Stack gap="md">
            <Avatar src={session.user?.image} size={64} radius="xl" mx="auto" />
            <Text ta="center" fw={700}>
              {session.user?.name || session.user?.email}
            </Text>
            <NavLink label="Home" href="/" />
            <NavLink label="Profile" href="/profile" />
            <NavLink label="Settings" href="/settings" />
            <SignOutButton />
          </Stack>
        </Paper>

        {/* Main Content */}
        <Box style={{ flex: 1 }}>
          <Paper p="xl" shadow="md" radius="md" withBorder>
            <Title order={2} mb="md">Welcome to your Dashboard!</Title>
            <Text size="lg">
              Hello, {session.user?.email}!<br />
              Here’s where you can add your dashboard widgets, charts, etc.
            </Text>
          </Paper>
        </Box>
      </Group>
    </Container>
  );
}
