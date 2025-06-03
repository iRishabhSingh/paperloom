import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(
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

    await prisma.sharedUser.update({
      where: { id: params.invitationId },
      data: {
        status: "ACCEPTED",
        userId: user.id,
        acceptedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Accept invitation error:", error);
    return NextResponse.json(
      { error: "Failed to accept invitation" },
      { status: 500 },
    );
  }
}
