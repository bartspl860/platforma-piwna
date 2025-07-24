import { PrismaClient } from "@/prisma/generated";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; commentId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find user by email to get the userId
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true }
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Fetch the comment to check ownership
  const comment = await prisma.comment.findUnique({
    where: { id: params.commentId },
    select: { userId: true }
  });

  if (!comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  if (comment.userId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.comment.delete({
    where: { id: params.commentId },
  });

  return NextResponse.json({ ok: true });
}
