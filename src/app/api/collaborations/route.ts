import crypto from "crypto";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";
import { getAuthUser } from "@/lib/auth";
import { NextResponse } from "next/server";
import { getCollaborationEmail } from "@/email/getCollaborationEmail";

export async function POST(req: Request) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { pdfId, recipientEmail } = await req.json();

    // Validate recipient email
    if (!recipientEmail || !/^\S+@\S+\.\S+$/.test(recipientEmail)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 },
      );
    }

    const pdf = await prisma.pDF.findUnique({
      where: { id: pdfId, ownerId: user.id },
    });

    if (!pdf) {
      return NextResponse.json({ error: "PDF not found" }, { status: 404 });
    }

    // Check if invitation already exists
    const existingInvite = await prisma.sharedUser.findFirst({
      where: {
        pdfId,
        inviteeEmail: recipientEmail,
        status: "PENDING",
      },
    });

    if (existingInvite) {
      return NextResponse.json(
        { error: "Invitation already sent to this email" },
        { status: 400 },
      );
    }

    // Generate unique token
    const token = crypto.randomBytes(20).toString("hex");

    // Create collaboration record with proper relations
    await prisma.sharedUser.create({
      data: {
        pdf: { connect: { id: pdfId } },
        inviteeEmail: recipientEmail,
        token,
        status: "PENDING",
        invitedBy: { connect: { id: user.id } },
      },
    });

    // Send invitation email
    const acceptUrl = `${process.env.NEXT_AUTH_URL}/accept-invite?token=${token}`;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
    });

    await transporter.sendMail({
      from: `"Paperloom" <${process.env.GMAIL_USER}>`,
      to: recipientEmail,
      subject: `You've been invited to collaborate on "${pdf.title}"`,
      html: getCollaborationEmail(user.name, pdf.title, acceptUrl),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Collaboration error:", error);
    return NextResponse.json(
      { error: "Failed to create collaboration" },
      { status: 500 },
    );
  }
}
