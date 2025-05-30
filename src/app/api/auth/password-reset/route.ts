import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { email, newPassword } = await req.json();

  if (!email || !newPassword) {
    return NextResponse.json(
      { message: "Email and new password are required" },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Optional: Hide user existence for security reasons
      return NextResponse.json(
        { message: "If that email is registered, password has been reset." },
        { status: 200 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: { passwordHash: hashedPassword },
    });

    return NextResponse.json(
      { message: "Password reset successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
