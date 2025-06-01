import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";
import { NotificationType } from "@prisma/client";
import { getShareNotificationEmail } from "@/email/getShareNotificationEmail";

export async function sendShareNotification({
  pdfId,
  userId,
  action,
}: {
  pdfId: string;
  userId: string;
  action: "added" | "removed";
}) {
  const [pdf, owner] = await Promise.all([
    prisma.pDF.findUnique({ where: { id: pdfId } }),
    prisma.user.findUnique({ where: { id: userId } }),
  ]);

  if (!pdf || !owner) return;

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
    subject: `You've been ${action} to a PDF collaboration`,
    html: getShareNotificationEmail(
      owner.name,
      pdf.title,
      action,
      `${process.env.NEXT_AUTH_URL}/pdf/${pdfId}`,
    ),
  });

  // Create in-app notification
  await prisma.notification.create({
    data: {
      //   type: action === "added" ? "ACCESS_GRANTED" : "ACCESS_REVOKED",
      type:
        action === "added"
          ? NotificationType.ACCESS_GRANTED
          : NotificationType.ACCESS_REQUEST,
      message: `You've been ${action} to "${pdf.title}"`,
      userId,
      pdfId,
    },
  });
}
