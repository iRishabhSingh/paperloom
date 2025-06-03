import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { token: string } },
) {
  const user = await getAuthUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await prisma.publicShare.update({
      where: { token: params.token },
      data: { accepted: true }, // Add this field to PublicShare model
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Accept public share error:", error);
    return NextResponse.json(
      { error: "Failed to accept public share" },
      { status: 500 },
    );
  }
}
