import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { signJwt } from "@/lib/jwt";
import { generateOtp, saveOtp } from "@/lib/otp";

export async function POST(req: Request) {
  const { emailOrUsername, password } = await req.json();

  if (!emailOrUsername || !password) {
    return NextResponse.json(
      { message: "Email or Username and Password are required" },
      { status: 400 }
    );
  }

  try {
    // Find user by email or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 }
      );
    }

    // Check if email is verified
    if (!user.emailVerified) {
      // Generate OTP for email verification
      const otp = generateOtp();
      const otpExpirySeconds = 10 * 60; // 10 minutes in seconds

      // Save OTP with expiry in Redis under email verify key
      await saveOtp(`email-verify:${user.email}`, otp, otpExpirySeconds);

      // Send OTP via email for verification
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Your App" <${process.env.GMAIL_USER}>`,
        to: user.email,
        subject: "Verify your email",
        text: `Hi ${user.firstName},\n\nYour verification code is: ${otp}\n\nThis code will expire in 10 minutes.`,
      });

      return NextResponse.json(
        {
          message: "Email not verified. Verification OTP sent to your email.",
        },
        { status: 403 }
      );
    }

    // Email is verified, check if 2FA is enabled
    if (user.twoFAEnabled) {
      // Generate OTP for login verification (2FA)
      const otp = generateOtp();

      // Save OTP with expiry in Redis under login verify key
      await saveOtp(`login-verify:${user.email}`, otp, 600);

      // Send OTP via email for 2FA login
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Your App" <${process.env.GMAIL_USER}>`,
        to: user.email,
        subject: "Login 2FA Verification",
        text: `Hi ${user.firstName},\n\nYour login 2FA code is: ${otp}\n\nThis code will expire in 10 minutes.`,
      });

      // ✅ Add return here to prevent immediate login
      return NextResponse.json(
        {
          message:
            "2FA OTP sent. Please check your email for the verification code.",
        },
        { status: 403 }
      );
    }

    // Email verified and 2FA not enabled, generate JWT and login
    const jwtToken = signJwt({ userId: user.id, role: user.role });

    return NextResponse.json(
      {
        message: "Login successful",
        twoFA: user.twoFAEnabled,
        token: jwtToken,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
