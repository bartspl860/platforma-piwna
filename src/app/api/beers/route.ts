import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/prisma/generated/client";
import { beerFormSchema } from "@/services/beers/schema";

const prisma = new PrismaClient();

// CREATE a new beer
export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const result = beerFormSchema.safeParse(body);

		if (result.success) {
			const { name, alcohol, category, image } = body;
			const beer = await prisma.beer.create({
				data: {
					name,
					alcohol,
					category,
					image,
				},
			});

			return NextResponse.json(body, { status: 201 });
		}
		return NextResponse.json({ error: "Invalid input" }, { status: 400 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}

export async function GET() {
	try {
		const beers = await prisma.beer.findMany({
			orderBy: { name: "asc" },
		});
		return NextResponse.json(beers);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}
