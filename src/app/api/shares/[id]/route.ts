import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { NextResponse } from "next/server";
import { sendShareNotification } from "@/services/notification";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const share = await prisma.sharedUser.findUnique({
      where: { id: params.id },
      include: {
        user: true,
        pdf: {
          include: {
            owner: true,
          },
        },
      },
    });

    if (!share) {
      return NextResponse.json({ error: "Share not found" }, { status: 404 });
    }

    if (share.pdf.ownerId !== user.id && share.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(share);
  } catch (error) {
    console.error("Fetch share error:", error);
    return NextResponse.json(
      { error: "Failed to fetch share" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const user = await getAuthUser(req);
    const share = await prisma.sharedUser.findUnique({
      where: { id: params.id },
      include: { pdf: true },
    });

    if (!share || share.pdf.ownerId !== user?.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.sharedUser.delete({ where: { id: params.id } });
    await sendShareNotification({
      pdfId: share.pdfId,
      userId: share.userId || "",
      action: "removed",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete share error:", error);
    return NextResponse.json(
      { error: "Failed to delete share" },
      { status: 500 },
    );
  }
}
