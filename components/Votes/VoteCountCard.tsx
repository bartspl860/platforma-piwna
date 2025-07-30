import { Card, SimpleGrid, Text, Group, Stack, Divider } from "@mantine/core";
import { Vote } from "@/prisma/generated";

interface StatsGroupProps {
  votes: Vote[];
}

export function VotesStatsCard({ votes }: StatsGroupProps) {
  const average =
    votes.length === 0
      ? 0
      : votes.reduce((acc, vote) => acc + vote.stars, 0) / votes.length;

  const totalStars = votes.reduce((acc, vote) => acc + vote.stars, 0);
  const maxStars = votes.length === 0 ? 0 : Math.max(...votes.map(v => v.stars), 0);
  const minStars = votes.length === 0 ? 0 : Math.min(...votes.map(v => v.stars), 0);

  return (
    <Stack gap="md">
      <SimpleGrid cols={2} spacing="md">
        <Card p="md" radius="md" w="100%">
          <Group>
            <div>
              <Text c="dimmed" tt="uppercase" fw={700} fz="xs">
                Suma ocen
              </Text>
              <Text fw={700} fz="xl">
                {totalStars}
              </Text>
            </div>
          </Group>
        </Card>
        <Card p="md" radius="md" w="100%">
          <Group>
            <div>
              <Text c="dimmed" tt="uppercase" fw={700} fz="xs">
                Średnia ocen
              </Text>
              <Text fw={700} fz="xl">
                {average.toFixed(2)}
              </Text>
            </div>
          </Group>
        </Card>
        <Card p="md" radius="md" w="100%">
          <Group>
            <div>
              <Text c="dimmed" tt="uppercase" fw={700} fz="xs">
                Największa ocena
              </Text>
              <Text fw={700} fz="xl">
                {maxStars}
              </Text>
            </div>
          </Group>
        </Card>
        <Card p="md" radius="md" w="100%">
          <Group>
            <div>
              <Text c="dimmed" tt="uppercase" fw={700} fz="xs">
                Najmniejsza ocena
              </Text>
              <Text fw={700} fz="xl">
                {minStars}
              </Text>
            </div>
          </Group>
        </Card>
      </SimpleGrid>
    </Stack>
  );
}
