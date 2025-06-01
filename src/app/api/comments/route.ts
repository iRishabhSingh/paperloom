import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { getNewCommentEmail } from "@/email/getNewCommentEmail";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pdfId = searchParams.get("pdfId");
    const token = searchParams.get("token");

    if (!pdfId) {
      return NextResponse.json(
        { error: "PDF ID is required" },
        { status: 400 },
      );
    }

    if (token) {
      const validShare = await prisma.publicShare.findFirst({
        where: { token, pdfId, expiresAt: { gt: new Date() } },
      });
      if (!validShare) {
        return NextResponse.json(
          { error: "Invalid share token" },
          { status: 401 },
        );
      }
    } else {
      const user = await getAuthUser(req);
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const hasAccess = await prisma.pDF.findFirst({
        where: {
          id: pdfId,
          OR: [
            { ownerId: user.id },
            { sharedUsers: { some: { userId: user.id } } },
          ],
        },
      });
      if (!hasAccess) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const comments = await prisma.groupMessage.findMany({
      where: { pdfId },
      orderBy: { createdAt: "asc" },
      include: {
        sender: { select: { name: true, profileImageUrl: true } },
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Fetch comments error:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const { pdfId, content, token, guestName, guestEmail } = await req.json();
    const authUser = await getAuthUser(req);
    const commenterName = authUser?.name ?? guestName ?? "Anonymous";

    let pdfOwnerId = "";
    let pdfTitle = "";
    let pdfUrl = "";

    if (token) {
      const share = await prisma.publicShare.findFirst({
        where: { token, expiresAt: { gt: new Date() } },
        include: { pdf: true },
      });

      if (!share) {
        return NextResponse.json(
          { error: "Invalid share token" },
          { status: 401 },
        );
      }

      pdfOwnerId = share.pdf.ownerId;
      pdfTitle = share.pdf.title;
      pdfUrl = `${process.env.NEXT_AUTH_URL}/pdf/${share.pdf.id}?token=${token}`;
    } else if (authUser) {
      const pdf = await prisma.pDF.findUnique({
        where: { id: pdfId },
        select: { ownerId: true, title: true },
      });

      if (!pdf) {
        return NextResponse.json({ error: "PDF not found" }, { status: 404 });
      }

      pdfOwnerId = pdf.ownerId;
      pdfTitle = pdf.title;
      pdfUrl = `${process.env.NEXT_AUTH_URL}/pdf/${pdfId}`;
    } else {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const comment = await prisma.groupMessage.create({
      data: {
        content,
        pdfId,
        senderId: authUser?.id,
        guestName: authUser ? null : guestName,
        guestEmail: authUser ? null : guestEmail,
      },
    });

    if (pdfOwnerId !== authUser?.id) {
      const owner = await prisma.user.findUnique({
        where: { id: pdfOwnerId },
        select: { email: true, name: true },
      });

      if (owner) {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
          },
        });

        await transporter.sendMail({
          from: `"Paperloom" <${process.env.GMAIL_USER}>`,
          to: owner.email,
          subject: `New comment on ${pdfTitle}`,
          html: getNewCommentEmail(pdfTitle, commenterName, content, pdfUrl),
        });
      }
    }

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Comment error:", error);
    return NextResponse.json(
      { error: "Failed to add comment" },
      { status: 500 },
    );
  }
}
