import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to accept invitations" },
        { status: 401 },
      );
    }

    const { token } = await req.json();

    // Find pending invitation
    const collaboration = await prisma.sharedUser.findFirst({
      where: {
        token,
        status: "PENDING",
        inviteeEmail: user.email, // Ensure email matches
      },
      include: { pdf: true },
    });

    if (!collaboration) {
      return NextResponse.json(
        { error: "Invalid or expired invitation" },
        { status: 400 },
      );
    }

    // Update collaboration status
    await prisma.sharedUser.update({
      where: { id: collaboration.id },
      data: {
        status: "ACCEPTED",
        user: { connect: { id: user.id } },
        acceptedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      pdfId: collaboration.pdfId,
    });
  } catch (error) {
    console.error("Accept invitation error:", error);
    return NextResponse.json(
      { error: "Failed to accept invitation" },
      { status: 500 },
    );
  }
}
