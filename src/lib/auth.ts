import prisma from "@/lib/prisma";
import { verify } from "jsonwebtoken";
import { NextRequest } from "next/server";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  profileImageUrl?: string;
}

export async function getAuthUser(
  req?: NextRequest | Request,
): Promise<AuthUser | null> {
  try {
    // Get the token either from the request cookies or from next/headers
    let token: string | undefined;

    if (req) {
      // For API routes (using NextRequest or standard Request)
      const cookieHeader = req.headers.get("cookie");
      if (cookieHeader) {
        const cookies = cookieHeader.split(";").reduce(
          (acc, cookie) => {
            const [name, value] = cookie.trim().split("=");
            acc[name] = value;
            return acc;
          },
          {} as Record<string, string>,
        );
        token = cookies["token"];
      }
    } else {
      // For server components/pages (using next/headers)
      const { cookies } = await import("next/headers");
      token = cookies().get("token")?.value;
    }

    if (!token) return null;

    const decoded = verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        profileImageUrl: true,
      },
    });

    if (!user) return null;

    return {
      ...user,
      profileImageUrl: user.profileImageUrl ?? undefined,
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}
