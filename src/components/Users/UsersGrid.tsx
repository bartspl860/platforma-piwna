"use client";

import {
  Container,
  Card,
  Text,
  Image,
  Grid,
  Center,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { IconUser } from "@tabler/icons-react";

interface UsersGridProps {
  users: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  }[];
}

export default function UsersGrid({ users }: UsersGridProps) {
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();

  const isDark = colorScheme === "dark";

  return (
    <Container
      fluid
      style={{
        padding: "2rem",
        borderRadius: "8px",
      }}
    >
      <Grid>
        {users.map((user, index) => (
          <Grid.Col
            span={{ base: 12, sm: 6, md: 4, lg: 3 }}
            key={user.id || index}
          >
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              style={{
                backgroundColor: isDark ? theme.colors.platform[7] : "#fff",
              }}
            >
              <Card.Section>
                {user.image ? (
                  <Image
                    src={user.image}
                    height={160}
                    alt={user.name || "User Avatar"}
                  />
                ) : (
                  <Center
                    style={{
                      height: 160,
                      backgroundColor: isDark
                        ? theme.colors.platform[6]
                        : theme.colors.beer[1],
                    }}
                  >
                    <IconUser
                      size={64}
                      color={isDark ? theme.colors.beer[2] : theme.colors.platform[6]}
                    />
                  </Center>
                )}
              </Card.Section>

              <Text
                fw={500}
                size="lg"
                mt="md"
                c={isDark ? "beer.3" : "platform.6"}
              >
                {user.name || "Unknown User"}
              </Text>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
}
