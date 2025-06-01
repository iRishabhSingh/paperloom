import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { signJwt } from "@/lib/jwt";
import { verifyOtp } from "@/lib/otp";

export async function POST(req: Request) {
  const { email, otp, action } = await req.json();
  const otpKey = `${action}:${email}`;
  const isValidOtp = await verifyOtp(otpKey, otp);

  if (!isValidOtp) {
    return NextResponse.json(
      { message: "Invalid or expired OTP" },
      { status: 400 },
    );
  }

  try {
    if (action === "email-verify") {
      await prisma.user.update({
        where: { email },
        data: { emailVerified: true },
      });

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 },
        );
      }

      const jwtToken = signJwt({ userId: user.id, role: user.role });
      const response = NextResponse.json(
        { message: "Email verified successfully" },
        { status: 200 },
      );

      response.cookies.set("token", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });

      return response;
    } else if (action === "login-verify") {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 },
        );
      }

      const jwtToken = signJwt({ userId: user.id, role: user.role });
      const response = NextResponse.json(
        { message: "Login successful" },
        { status: 200 },
      );

      response.cookies.set("token", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });

      return response;
    } else if (action === "reset-verify") {
      return NextResponse.json(
        { message: "Password reset OTP verified successfully" },
        { status: 200 },
      );
    } else {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
