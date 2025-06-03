import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await getAuthUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, fileKey, fileName, fileSize, ufsUrl, fileHash } =
    await req.json();

  try {
    const pdf = await prisma.pDF.create({
      data: {
        title,
        fileName,
        fileSize,
        fileKey,
        ufsUrl,
        fileHash,
        fileType: "application/pdf",
        ownerId: user.id,
      },
    });

    return NextResponse.json(pdf);
  } catch (error) {
    console.error("Create PDF error:", error);
    return NextResponse.json(
      { error: "Failed to create PDF record" },
      { status: 500 },
    );
  }
}

export async function GET() {
  const user = await getAuthUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const pdfs = await prisma.pDF.findMany({
      where: { ownerId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(pdfs);
  } catch (error) {
    console.error("Fetch PDFs error:", error);
    return NextResponse.json(
      { error: "Failed to fetch PDFs" },
      { status: 500 },
    );
  }
}
