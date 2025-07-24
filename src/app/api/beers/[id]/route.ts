import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/prisma/generated/client";
import { beerFormSchema } from "@/services/beers/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function PATCH(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		const id = params.id;
		const body = await req.json();

		// Optional: allow partial updates, or validate full object
		const result = beerFormSchema.safeParse(body);
		if (!result.success) {
			return NextResponse.json({ error: "Invalid input" }, { status: 400 });
		}

		const beer = await prisma.beer.update({
			where: { id },
			data: body,
		});

		return NextResponse.json(beer, { status: 200 });
	} catch (error: any) {
		console.error(error);
		if (
			error.code === "P2025" ||
			error.message?.includes("Record to update not found")
		) {
			return NextResponse.json({ error: "Beer not found" }, { status: 404 });
		}
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		const id = params.id;
		const beer = await prisma.beer.delete({
			where: { id },
		});

		return NextResponse.json(beer, { status: 200 });
	} catch (error: any) {
		console.error(error);
		if (
			error.code === "P2025" ||
			error.message?.includes("Record to update not found")
		) {
			return NextResponse.json({ error: "Beer not found" }, { status: 404 });
		}
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}
