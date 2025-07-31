import { NextRequest, NextResponse } from "next/server";
import { userServerSchema } from "services/users/schema";
import { notFound } from "next/navigation";
import path from "path";
import { unlink } from "fs/promises";
import { prisma } from "prisma";
import { auth } from "@/auth";

export async function PATCH(
  req: NextRequest,
  { context }: { context: { params: { id: string } } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const params = await context.params;
    const id = params.id;
    const body = await req.json();

    // Optional: allow partial updates, or validate full object
    const result = userServerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const userBeforeUpdate = await prisma.user.findFirst({ where: { id } });
    if (!userBeforeUpdate) {
      return notFound();
    }

    if (userBeforeUpdate.image !== body.image) {
      const oldImageUrl = userBeforeUpdate.image;
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

    const user = await prisma.user.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(user, { status: 200 });
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

export async function GET(
  req: NextRequest,
  { context }: { context: { params: { id: string } } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await context.params;
    const id = params.id;

    if (session.user.id !== id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    return NextResponse.json(user, { status: 200 });
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
