import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { userServerSchema } from "@/services/users/schema";
import { prisma } from "prisma";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

export async function POST(
	req: NextRequest
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		const body = await req.json();
		const result = userServerSchema.safeParse(body);
		if (!result.success) {
			return NextResponse.json({ error: result.error }, { status: 400 });
		}

		const user = await prisma.user.create({
			data: body,
		});

		await revalidatePath('dashboard/users')

		return NextResponse.json(user, { status: 200 });
	} catch (error: any) {
		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    return NextResponse.json({ error: "Email already exists" }, { status: 409 });
  }
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}
