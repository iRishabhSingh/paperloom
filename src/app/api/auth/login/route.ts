import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { signJwt } from "@/lib/jwt";
import { generateOtp, saveOtp } from "@/lib/otp";
import { get2FAEmail } from "@/email/get2FAEmail";
import { getVerificationEmail } from "@/email/getVerificationEmail";

export async function POST(req: Request) {
  const { emailOrUsername, password } = await req.json();
  const lowerCasedEmailOrUsername = emailOrUsername.toLowerCase();

  if (!emailOrUsername || !password) {
    return NextResponse.json(
      { message: "Email or Username and Password are required" },
      { status: 400 },
    );
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: lowerCasedEmailOrUsername },
          { username: lowerCasedEmailOrUsername },
        ],
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 },
      );
    }

    // EMAIL NOT VERIFIED
    if (!user.emailVerified) {
      const otp = generateOtp();
      await saveOtp(`email-verify:${user.email}`, otp, 600);

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"paperloom" <${process.env.GMAIL_USER}>`,
        to: user.email,
        subject: "Verify your email",
        html: getVerificationEmail(otp, user.firstName),
      });

      return NextResponse.json(
        {
          message: "Email not verified. Verification OTP sent.",
          requiresOtp: true,
          email: user.email,
          purpose: "email-verify",
        },
        { status: 403 },
      );
    }

    // 2FA ENABLED
    if (user.twoFAEnabled) {
      const otp = generateOtp();
      await saveOtp(`login-verify:${user.email}`, otp, 600);

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"paperloom" <${process.env.GMAIL_USER}>`,
        to: user.email,
        subject: "2FA Login Verification",
        html: get2FAEmail(otp, user.firstName),
      });

      return NextResponse.json(
        {
          message: "2FA OTP sent. Check your email.",
          requiresOtp: true,
          email: user.email,
          purpose: "login-verify",
        },
        { status: 403 },
      );
    }

    // SUCCESSFUL LOGIN - Set HTTP-only cookie
    const jwtToken = signJwt({ userId: user.id, role: user.role });
    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
      },
      { status: 200 },
    );

    response.cookies.set("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
