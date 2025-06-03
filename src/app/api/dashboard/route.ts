export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const searchQuery = searchParams.get("q") ?? "";

    const pdfs = await prisma.pDF.findMany({
      where: {
        OR: [
          { ownerId: user.id },
          {
            sharedUsers: {
              some: {
                userId: user.id,
                status: "ACCEPTED", // Ensure only accepted collaborations
              },
            },
          },
        ],
        fileName: { contains: searchQuery, mode: "insensitive" },
      },
      include: {
        owner: { select: { name: true, email: true } },
        // Add sharedUsers to verify collaboration status
        sharedUsers: {
          where: { userId: user.id, status: "ACCEPTED" },
          select: { status: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(pdfs);
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch PDFs" },
      { status: 500 },
    );
  }
}
