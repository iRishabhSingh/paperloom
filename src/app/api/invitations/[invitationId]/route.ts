import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { invitationId: string } },
) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const invitation = await prisma.sharedUser.findUnique({
      where: { id: params.invitationId },
    });

    if (!invitation || invitation.inviteeEmail !== user.email) {
      return NextResponse.json(
        { error: "Invalid invitation" },
        { status: 400 },
      );
    }

    await prisma.sharedUser.delete({
      where: { id: params.invitationId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete invitation error:", error);
    return NextResponse.json(
      { error: "Failed to delete invitation" },
      { status: 500 },
    );
  }
}
