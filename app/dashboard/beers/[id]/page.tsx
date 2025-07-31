import { auth } from "@/auth";
import BeerStats from "@/components/Beers/BeerStats";
import { notFound, redirect } from "next/navigation";
import { prisma } from "prisma";

export default async function BeerPage(context: { params: { id: string } }) {
	const session = await auth();
	if (!session) await redirect("/login");

	const params = await context.params;

	const beer = await prisma.beer.findFirst({
		where: { id: params.id },
	});

	if (!beer) {
		notFound();
	}

	const votes = await prisma.vote.findMany({
		where: { beerId: beer.id },
	});

	return <BeerStats votes={votes} beer={beer} />;
}
