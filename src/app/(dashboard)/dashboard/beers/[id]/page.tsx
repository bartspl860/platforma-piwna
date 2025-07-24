import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import BeerStats from "@/components/Beers/BeerStats";
import { PrismaClient } from "@/prisma/generated";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";

const prisma = new PrismaClient();

export default async function BeerPage({ params }: { params: { id: string } }) {
	const session = await getServerSession(authOptions);
	if (!session) await redirect("/login");

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
