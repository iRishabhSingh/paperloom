"use server";

export async function register(formData: FormData) {
  try {
    // Get base URL dynamically
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : (process.env.NEXT_AUTH_URL ?? "http://localhost:3000");

    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      body: formData,
    });

    // Handle non-JSON responses
    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      const text = await response.text();
      throw new Error(text || "Invalid response from server");
    }

    const data = await response.json();

    if (response.ok) {
      return { success: true, message: data.message };
    } else {
      return { success: false, message: data.message ?? "Registration failed" };
    }
  } catch (error: unknown) {
    console.error("Registration error:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Network error. Please try again.",
    };
  }
}
