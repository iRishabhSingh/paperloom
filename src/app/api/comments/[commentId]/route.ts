import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { commentId: string } },
) {
  try {
    const user = await getAuthUser(req);
    const { content } = await req.json();

    const comment = await prisma.groupMessage.update({
      where: {
        id: params.commentId,
        senderId: user?.id || undefined,
      },
      data: { content },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Update comment error:", error);
    return NextResponse.json(
      { error: "Failed to update comment" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { commentId: string } },
) {
  try {
    const user = await getAuthUser(req);
    const comment = await prisma.groupMessage.findUnique({
      where: { id: params.commentId },
      include: { pdf: true },
    });

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    const isOwner = comment.pdf.ownerId === user?.id;
    const isAuthor = comment.senderId === user?.id;

    if (!isOwner && !isAuthor) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.groupMessage.delete({ where: { id: params.commentId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete comment error:", error);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 },
    );
  }
}
