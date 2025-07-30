import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { beerServerSchema } from "@/services/beers/schema";
import { notFound } from "next/navigation";
import path from "path";
import { unlink } from "fs/promises";
import { revalidatePath } from "next/cache";
import { prisma } from "prisma";

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
		const result = beerServerSchema.safeParse(body);
		if (!result.success) {
			return NextResponse.json({ error: result.error }, { status: 400 });
		}

		const beerBeforeUpdate = await prisma.beer.findFirst({ where: { id } });
		if (!beerBeforeUpdate) {
			return notFound();
		}

		if (beerBeforeUpdate.image !== body.image) {
			const oldImageUrl = beerBeforeUpdate.image;
			if (oldImageUrl && oldImageUrl.startsWith("/media/")) {
				const oldFilePath = path.join(process.cwd(), "public", oldImageUrl);
				try {
					await unlink(oldFilePath);
					console.log(`Deleted unused image: ${oldImageUrl}`);
				} catch (err) {
					console.warn(
						`Image file not found or couldn't be deleted: ${oldImageUrl}`
					);
					// Don't block the request even if deletion fails
				}
			}
		}

		const beer = await prisma.beer.update({
			where: { id },
			data: body,
		});

		revalidatePath(`dashboard/beers/${id}`, "page");

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

		const beer = await prisma.beer.findUnique({
			where: { id },
		});

		if (!beer) {
			return NextResponse.json({ error: "Beer not found" }, { status: 404 });
		}

		if (beer.image) {
			const imagePath = path.join(process.cwd(), "public", beer.image);
			try {
				await unlink(imagePath);
				console.log(`Deleted image associated with beer: ${beer.image}`);
			} catch (err) {
				console.warn(
					`Image file not found or couldn't be deleted: ${beer.image}`
				);
				// Don't block deletion if file is already gone or locked
			}
		}

		await prisma.beer.delete({
			where: { id },
		});

		return NextResponse.json({ status: 200 });
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
