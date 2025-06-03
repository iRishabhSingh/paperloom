import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete a pending invitation
    await prisma.sharedUser.deleteMany({
      where: {
        id: params.id,
        OR: [
          { inviteeEmail: user.email }, // User was invited
          { invitedById: user.id }, // User sent the invitation
        ],
        status: "PENDING", // Only pending can be deleted
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete collaboration error:", error);
    return NextResponse.json(
      { error: "Failed to delete collaboration" },
      { status: 500 },
    );
  }
}
