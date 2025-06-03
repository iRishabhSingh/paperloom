import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const count = await prisma.sharedUser.count({
      where: {
        userId: user.id,
        status: "PENDING",
      },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Fetch unread count error:", error);
    return NextResponse.json(
      { error: "Failed to fetch unread count" },
      { status: 500 },
    );
  }
}
