export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { NextResponse } from "next/server";
import { Notification } from "@/types/index";

export async function GET(req: Request) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") ?? "10");
    const cursor = searchParams.get("cursor");

    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: "desc" },
      include: { pdf: { select: { id: true, title: true } } },
    });

    let nextCursor = null;
    if (notifications.length > limit) {
      nextCursor = notifications.pop()?.id;
    }

    return NextResponse.json({
      data: notifications as Notification[],
      nextCursor,
    });
  } catch (error) {
    console.error("Fetch notifications error:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 },
    );
  }
}
