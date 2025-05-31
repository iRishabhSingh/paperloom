"use server";

import { headers } from "next/headers";

function getBaseUrl() {
  const headersList = headers();
  const protocol = headersList.get("x-forwarded-proto") ?? "http";
  const host = headersList.get("host");
  return `${protocol}://${host}`;
}

export async function login({
  emailOrUsername,
  password,
}: {
  emailOrUsername: string;
  password: string;
}) {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ emailOrUsername, password }),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        token: data.token,
        requiresOtp: false,
      };
    } else if (response.status === 403) {
      return {
        success: false,
        requiresOtp: true,
        purpose: data.purpose ?? "email-verify",
        email: data.email,
        message: data.message,
      };
    } else {
      return {
        success: false,
        message: data.message ?? "Login failed",
      };
    }
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "Network error. Please try again.",
    };
  }
}

export async function verifyOtp({
  email,
  otp,
  action,
}: {
  email: string;
  otp: string;
  action: string;
}) {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp, action }),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        token: data.token,
        message: data.message,
      };
    } else {
      return {
        success: false,
        message: data.message ?? "Verification failed",
      };
    }
  } catch (error) {
    console.error("OTP verification error:", error);
    return {
      success: false,
      message: "Network error. Please try again.",
    };
  }
}

export async function resendOtp({
  email,
  action,
}: {
  email: string;
  action: string;
}) {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/auth/resend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, action }),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: data.message,
      };
    } else {
      return {
        success: false,
        message: data.message ?? "Failed to resend OTP",
      };
    }
  } catch (error) {
    console.error("Resend OTP error:", error);
    return {
      success: false,
      message: "Network error. Please try again.",
    };
  }
}

export async function requestPasswordReset(email: string) {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/auth/password-reset/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: data.message,
      };
    } else {
      return {
        success: false,
        message: data.message ?? "Failed to request password reset",
      };
    }
  } catch (error) {
    console.error("Password reset request error:", error);
    return {
      success: false,
      message: "Network error. Please try again.",
    };
  }
}

export async function resetPassword({
  email,
  newPassword,
}: {
  email: string;
  newPassword: string;
}) {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/auth/password-reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, newPassword }),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: data.message,
      };
    } else {
      return {
        success: false,
        message: data.message ?? "Password reset failed",
      };
    }
  } catch (error) {
    console.error("Password reset error:", error);
    return {
      success: false,
      message: "Network error. Please try again.",
    };
  }
}
