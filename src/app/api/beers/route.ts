import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { beerServerSchema } from "@/services/beers/schema";
import { prisma } from "prisma";

export async function POST(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		const body = await req.json();
		const result = beerServerSchema.safeParse(body);
		if (!result.success) {
			return NextResponse.json({ error: "Invalid input" }, { status: 400 });
		}

		const { name, alcohol, category, image } = body;
		const beer = await prisma.beer.create({
			data: {
				name,
				alcohol,
				category,
				image,
			},
		});

		return NextResponse.json(beer, { status: 201 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}

export async function GET() {
	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		const beers = await prisma.beer.findMany({
			orderBy: { name: "asc" },
		});
		return NextResponse.json(beers);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}
