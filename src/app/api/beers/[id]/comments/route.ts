import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@/prisma/generated";
import { commentCreateSchema } from "@/services/comments/schema";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		const comments = await prisma.comment.findMany({
			where: {
				beerId: params.id,
			},
			include: {
				user: true,
			},
			orderBy: { updatedAt: "desc" },
		});
		return NextResponse.json(comments);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}

export async function POST(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || !session.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Parse the body
		const body = await req.json();
		const parse = commentCreateSchema.safeParse(body);
		if (!parse.success) {
			return NextResponse.json(
				{ error: parse.error.errors[0]?.message || "Nieprawidłowe dane" },
				{ status: 400 }
			);
		}

		const user = await prisma.user.findUnique({
			where: { email: session.user.email },
			select: { id: true },
		});

		if (!user) {
			return NextResponse.json(
				{ error: "Nie znaleziono użytkownika" },
				{ status: 404 }
			);
		}

		const { content } = parse.data;

		const comment = await prisma.comment.create({
			data: {
				content: content.trim(),
				userId: user.id,
				beerId: params.id,
			},
		});

		return NextResponse.json(comment, { status: 201 });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}
