import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { generateOtp, saveOtp } from "@/lib/otp";
import { getResetPasswordEmail } from "@/email/getResetPasswordEmail";

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    // Security best practice: don't reveal if user exists
    return NextResponse.json(
      { message: "If that email is registered, OTP has been sent." },
      { status: 200 }
    );
  }

  const otp = generateOtp();

  // Save OTP with 10-minute expiry
  await saveOtp(`reset-verify:${email}`, otp, 600);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
  });

  await transporter.sendMail({
    from: `"paperloom" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Password Reset OTP",
    html: getResetPasswordEmail(user.name, otp),
  });

  return NextResponse.json(
    { message: "If that email is registered, OTP has been sent." },
    { status: 200 }
  );
}
