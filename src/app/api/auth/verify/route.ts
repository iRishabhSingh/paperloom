import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { signJwt } from "@/lib/jwt";
import { verifyOtp } from "@/lib/otp";

export async function POST(req: Request) {
  const { email, otp, action } = await req.json();

  // Check if the OTP is valid
  const otpKey = `${action}:${email}`;
  const isValidOtp = await verifyOtp(otpKey, otp);
  if (!isValidOtp) {
    return NextResponse.json(
      { message: "Invalid or expired OTP" },
      { status: 400 }
    );
  }

  try {
    // Handle different actions based on the `action` parameter
    if (action === "email-verify") {
      await prisma.user.update({
        where: { email },
        data: { emailVerified: true },
      });

      return NextResponse.json(
        { message: "Email verified successfully" },
        { status: 200 }
      );
    } else if (action === "login-verify") {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }

      if (user.twoFAEnabled && user.twoFASecret) {
        const jwtToken = signJwt({ userId: user.id, role: user.role });

        return NextResponse.json(
          {
            message: "Login successful with 2FA",
            token: jwtToken,
          },
          { status: 200 }
        );
      }

      const jwtToken = signJwt({ userId: user.id, role: user.role });

      return NextResponse.json(
        {
          message: "Login successful",
          token: jwtToken,
        },
        { status: 200 }
      );
    } else if (action === "reset-verify") {
      // Password reset OTP verified successfully
      return NextResponse.json(
        { message: "Password reset OTP verified successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
