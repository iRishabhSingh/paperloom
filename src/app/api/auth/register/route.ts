import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

import prisma from "@/lib/prisma";
import { generateOtp, saveOtp } from "@/lib/otp";
import { getVerificationEmail } from "@/email/getVerificationEmail";

export async function POST(req: Request) {
  const { email, username, password, firstName, lastName } = await req.json();

  // Validate email format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(email)) {
    return new Response("Invalid email format", { status: 400 });
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return new Response("Email already in use", { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash: hashedPassword,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        region: "IN", // or dynamically set based on the request
      },
    });

    // Generate OTP and save it with expiry (for example, 10 minutes)
    const otp = generateOtp();
    await saveOtp(`email-verify:${email}`, otp, 600);

    // Send OTP via email
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

    // Success response
    return new Response(
      JSON.stringify({
        message: "User registered successfully. Check your email for OTP.",
      }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Registration error:", error);
    return new Response("Something went wrong", { status: 500 });
  }
}
