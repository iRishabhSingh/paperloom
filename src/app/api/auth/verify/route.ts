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
      // Update user's emailVerified status in the database
      await prisma.user.update({
        where: { email },
        data: { emailVerified: true },
      });

      return NextResponse.json({ message: "Email verified successfully" });
    } else if (action === "login-verify") {
      // Login action - Here you can verify 2FA and sign JWT
      const user = await prisma.user.findUnique({ where: { email } });

      // If 2FA is enabled, you can verify it and then sign the JWT token for login
      if (user?.twoFAEnabled && user.twoFASecret) {
        // Assuming you want a separate function to handle 2FA token verification
        const jwtToken = signJwt({ userId: user.id, role: user.role });

        return NextResponse.json({
          message: "Login successful with 2FA",
          token: jwtToken,
        });
      }

      // If 2FA is not enabled, proceed with login directly
      const jwtToken = signJwt({ userId: user?.id, role: user?.role });

      return NextResponse.json({
        message: "Login successful",
        token: jwtToken,
      });
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
