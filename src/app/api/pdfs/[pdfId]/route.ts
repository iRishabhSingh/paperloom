import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { pdfId: string } },
) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const pdf = await prisma.pDF.findUnique({
      where: { id: params.pdfId },
      include: {
        owner: { select: { name: true, email: true } },
        sharedUsers: {
          include: { user: { select: { name: true, email: true } } },
        },
        groupMessages: {
          orderBy: { createdAt: "asc" },
          include: {
            sender: { select: { name: true, profileImageUrl: true } },
          },
        },
      },
    });

    if (!pdf) {
      return NextResponse.json({ error: "PDF not found" }, { status: 404 });
    }

    const isOwner = pdf.ownerId === user.id;
    const isSharedUser = pdf.sharedUsers.some((u) => u.userId === user.id);

    if (!isOwner && !isSharedUser) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(pdf);
  } catch (error) {
    console.error("Fetch PDF error:", error);
    return NextResponse.json({ error: "Failed to fetch PDF" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { pdfId: string } },
) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const pdf = await prisma.pDF.findUnique({
      where: { id: params.pdfId, ownerId: user.id },
      include: {
        sharedUsers: true,
        groupMessages: true,
        publicShares: true,
      },
    });

    if (!pdf) {
      return NextResponse.json({ error: "PDF not found" }, { status: 404 });
    }

    await fetch("https://uploadthing.com/api/deleteFile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Uploadthing-Api-Key": process.env.UPLOADTHING_SECRET!,
      },
      body: JSON.stringify({ fileKeys: [pdf.fileKey] }),
    });

    await prisma.groupMessage.deleteMany({ where: { pdfId: params.pdfId } });
    await prisma.sharedUser.deleteMany({ where: { pdfId: params.pdfId } });
    await prisma.publicShare.deleteMany({ where: { pdfId: params.pdfId } });
    await prisma.pDF.delete({ where: { id: params.pdfId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete PDF" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { pdfId: string } },
) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title } = await req.json();

    const pdf = await prisma.pDF.update({
      where: { id: params.pdfId, ownerId: user.id },
      data: { title },
    });

    return NextResponse.json(pdf);
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "Failed to update PDF" },
      { status: 500 },
    );
  }
}
