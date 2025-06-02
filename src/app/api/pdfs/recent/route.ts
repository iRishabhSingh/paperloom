import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  const user = await getAuthUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // Fetch the 5 most recent PDFs for the current user, ordered by createdAt in descending order
    const pdfs = await prisma.pDF.findMany({
      where: {
        ownerId: user.id,
        deletedAt: null, // Exclude soft-deleted PDFs if needed
      },
      orderBy: { createdAt: "desc" },
      take: 5, // Limit to 5 most recent
      select: {
        id: true,
        title: true,
        fileName: true,
        fileSize: true,
        createdAt: true,
        ownerId: true,
        owner: {
          select: {
            name: true,
          },
        },
      },
    });

    // Format the response to match your component's expected interface
    const formattedPdfs = pdfs.map((pdf) => ({
      id: pdf.id,
      title: pdf.title,
      fileName: pdf.fileName,
      fileSize: pdf.fileSize,
      createdAt: pdf.createdAt.toISOString(),
      comments: 0, // You can add comment count if needed
      owner: pdf.owner?.name || "Unknown",
      ownerId: pdf.ownerId,
      isOwner: pdf.ownerId === user.id,
    }));

    return NextResponse.json({ pdfs: formattedPdfs });
  } catch (error) {
    console.error("Fetch recent PDFs error:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent PDFs" },
      { status: 500 },
    );
  }
}
