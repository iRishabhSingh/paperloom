import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await getAuthUser(req);
    const { pdfId } = await req.json();

    await prisma.sharedUser.deleteMany({
      where: { pdfId, userId: user?.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Leave share error:", error);
    return NextResponse.json(
      { error: "Failed to leave share" },
      { status: 500 },
    );
  }
}
