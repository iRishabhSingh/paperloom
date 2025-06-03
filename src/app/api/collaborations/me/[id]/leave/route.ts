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

    // Remove user from collaboration
    await prisma.sharedUser.deleteMany({
      where: {
        id: params.id,
        userId: user.id, // Only the user can leave their own collaboration
        status: "ACCEPTED", // Only accepted collaborations can be left
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Leave collaboration error:", error);
    return NextResponse.json(
      { error: "Failed to leave collaboration" },
      { status: 500 },
    );
  }
}
