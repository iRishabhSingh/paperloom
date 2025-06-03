import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all collaborations related to this user
    const collaborations = await prisma.sharedUser.findMany({
      where: {
        OR: [
          // Pending invitations to this email
          { inviteeEmail: user.email, status: "PENDING" },
          // Accepted collaborations (either by email or user ID)
          {
            OR: [{ userId: user.id }, { inviteeEmail: user.email }],
            status: "ACCEPTED",
          },
        ],
      },
      include: {
        pdf: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Separate into pending and active
    const pendingInvites = collaborations.filter((c) => c.status === "PENDING");
    const activeCollaborations = collaborations.filter(
      (c) => c.status === "ACCEPTED",
    );

    return NextResponse.json({
      pendingInvites,
      activeCollaborations,
    });
  } catch (error) {
    console.error("Fetch collaborations error:", error);
    return NextResponse.json(
      { error: "Failed to fetch collaborations" },
      { status: 500 },
    );
  }
}
