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
    });

    if (!pdf) {
      return NextResponse.json({ error: "PDF not found" }, { status: 404 });
    }

    const isOwner = pdf.ownerId === user.id;
    const isSharedUser = await prisma.sharedUser.findFirst({
      where: {
        pdfId: pdf.id,
        userId: user.id,
        status: "ACCEPTED",
      },
    });

    if (!isOwner && !isSharedUser) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      downloadUrl: pdf.ufsUrl,
      fileName: pdf.fileName,
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Failed to get download URL" },
      { status: 500 },
    );
  }
}
