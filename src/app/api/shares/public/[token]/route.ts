import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { token: string } },
) {
  try {
    const share = await prisma.publicShare.findUnique({
      where: { token: params.token },
      include: {
        pdf: {
          include: {
            owner: { select: { name: true } },
            groupMessages: {
              orderBy: { createdAt: "asc" },
              include: { sender: { select: { name: true } } },
            },
          },
        },
      },
    });

    if (!share || new Date() > share.expiresAt) {
      return NextResponse.json(
        { error: "Invalid or expired link" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      pdf: share.pdf,
      comments: share.pdf.groupMessages,
    });
  } catch (error) {
    console.error("Error accessing shared PDF:", error);
    return NextResponse.json(
      { error: "Failed to access shared PDF" },
      { status: 500 },
    );
  }
}
