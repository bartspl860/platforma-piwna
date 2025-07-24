"use client";

import {
	Grid,
	GridCol,
	Flex,
	Card,
	CardSection,
	Title,
	Image,
	useMantineColorScheme,
	Stack,
	Center,
} from "@mantine/core";
import { VotesStatsCard } from "../Votes/VoteCountCard";
import { Beer, Comment, Vote } from "@/prisma/generated";
import BeerComments from "./BeerComments";

interface BeerStatsProps {
	votes: Vote[];
	beer: Beer;
}

export default function BeerStats({ votes, beer }: BeerStatsProps) {
	const { colorScheme } = useMantineColorScheme();
	const cardBg = colorScheme === "dark" ? "platform.7" : "beer.2";

	return (
		<>
			<Grid>
				{/* LEFT COLUMN */}
				<GridCol span={{ sm: 12, md: 12, lg: 8 }}>
					<Stack gap="md" w="100%">
						<Card>
							<Center>
								<Title order={2}>{beer.name}</Title>
							</Center>
						</Card>
						<Card bg={cardBg}>
							<Title size="h3" pb={20}>
								Statystyki
							</Title>
							<VotesStatsCard votes={votes} />
						</Card>
						<Card>
							<Title size="h3" pb={20}>
								Komentarze
							</Title>
							<BeerComments beerId={beer.id} />
						</Card>
					</Stack>
				</GridCol>
				{/* RIGHT COLUMN */}
				<GridCol span={{ sm: 12, md: 12, lg: 4 }}>
					<Card
						style={{
							minHeight: 300,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							flexDirection: "column",
						}}
						p={50}
					>
						{beer.image && (
							<Image
								src={beer.image}
								alt={beer.name}
								fit="contain"
								height={300}
							/>
						)}

						<CardSection>
							{beer.category.toLocaleLowerCase()} {beer.alcohol}%
						</CardSection>
						{beer.price && (
							<CardSection>
								{(beer.price / 100).toLocaleString("pl", {
									style: "currency",
									currency: "PLN",
								})}
							</CardSection>
						)}
					</Card>
				</GridCol>
			</Grid>
		</>
	);
}
