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

    const invitations = await prisma.sharedUser.findMany({
      where: {
        OR: [
          { inviteeEmail: user.email, status: "PENDING" },
          { userId: user.id, status: "PENDING" },
        ],
      },
      include: {
        pdf: {
          select: {
            id: true,
            title: true,
            owner: {
              select: {
                name: true,
                profileImageUrl: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(invitations);
  } catch (error) {
    console.error("Fetch invitations error:", error);
    return NextResponse.json(
      { error: "Failed to fetch invitations" },
      { status: 500 },
    );
  }
}
