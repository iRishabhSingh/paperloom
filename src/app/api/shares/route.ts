import crypto from "crypto";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";
import { getAuthUser } from "@/lib/auth";
import { NextResponse } from "next/server";
import { getShareEmail } from "@/email/getShareEmail";

export async function POST(req: Request) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { pdfId, recipientEmail } = await req.json();

    const pdf = await prisma.pDF.findUnique({
      where: { id: pdfId, ownerId: user.id },
    });

    if (!pdf) {
      return NextResponse.json({ error: "PDF not found" }, { status: 404 });
    }

    const token = crypto.randomBytes(20).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await prisma.publicShare.create({
      data: {
        token,
        pdfId,
        expiresAt,
      },
    });

    const shareUrl = `${process.env.NEXT_AUTH_URL}/share/${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Paperloom" <${process.env.GMAIL_USER}>`,
      to: recipientEmail,
      subject: `${user.name} shared a PDF with you`,
      html: getShareEmail(user.name, pdf.fileName, shareUrl),
    });

    return NextResponse.json({
      success: true,
      shareUrl,
      message: "PDF shared successfully. Notification email sent.",
    });
  } catch (error) {
    console.error("Sharing error:", error);
    return NextResponse.json({ error: "Failed to share PDF" }, { status: 500 });
  }
}
