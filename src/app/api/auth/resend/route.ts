import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { generateOtp, saveOtp } from "@/lib/otp";

export async function POST(req: Request) {
  const { email, action } = await req.json();

  // Validate input
  if (!email || !action) {
    return NextResponse.json(
      { message: "Email and action are required" },
      { status: 400 }
    );
  }

  // Action validation (email verification or login verification)
  if (!["email-verify", "login-verify"].includes(action)) {
    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  }

  try {
    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Generate OTP
    const otp = generateOtp();

    // Save OTP in Redis with a key based on the action
    await saveOtp(`${action}:${email}`, otp, 600);

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    let subject = "";
    let text = "";

    if (action === "email-verify") {
      subject = "Verify your email";
      text = `Hi, \n\nYour email verification code is: ${otp}\nThis code will expire in 10 minutes.`;
    } else if (action === "login-verify") {
      subject = "Login 2FA";
      text = `Hi, \n\nYour 2FA login code is: ${otp}\nThis code will expire in 10 minutes.`;
    }

    await transporter.sendMail({
      from: `"Your App" <${process.env.GMAIL_USER}>`,
      to: email,
      subject,
      text,
    });

    return NextResponse.json(
      {
        message: `${
          action === "email-verify" ? "Email verification" : "Login 2FA"
        } OTP sent successfully.`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Resend OTP error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
