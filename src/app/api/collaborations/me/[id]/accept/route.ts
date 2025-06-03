import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Update the collaboration status
    const updatedCollaboration = await prisma.sharedUser.update({
      where: {
        id: params.id,
        inviteeEmail: user.email, // Ensure only the invited user can accept
        status: "PENDING", // Only pending invites can be accepted
      },
      data: {
        status: "ACCEPTED",
        userId: user.id,
        acceptedAt: new Date(),
      },
    });

    if (!updatedCollaboration) {
      return NextResponse.json(
        { error: "Invitation not found or already accepted" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Accept collaboration error:", error);
    return NextResponse.json(
      { error: "Failed to accept collaboration" },
      { status: 500 },
    );
  }
}
