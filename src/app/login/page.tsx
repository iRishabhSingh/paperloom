"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/AuthLayout";
import OTPForm from "@/app/login/components/OTPForm";
import LoginForm from "@/app/login/components/LoginForm";
import { resendOtp, requestPasswordReset } from "@/app/login/actions";
import ForgotPasswordModal from "@/app/login/components/ForgotPasswordModal";

type Step = "login" | "otp";
type OTPPurpose = "email-verify" | "login-verify" | "reset-verify";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>("login");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [otpPurpose, setOtpPurpose] = useState<OTPPurpose>("email-verify");

  const handleLogin = async ({
    emailOrUsername,
    password,
  }: {
    emailOrUsername: string;
    password: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrUsername, password }),
      });

      const response = await res.json();

      if (res.ok && response.success) {
        toast.success("Login successful!");
        router.push("/dashboard");
      } else if (response.requiresOtp) {
        setEmail(response.email ?? emailOrUsername);
        setOtpPurpose(response.purpose);
        setStep("otp");
        toast.success(response.message ?? "OTP sent to your email");
      } else {
        setError(response.message ?? "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (otp: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, action: otpPurpose }),
      });

      const response = await res.json();

      if (res.ok) {
        if (otpPurpose === "reset-verify") {
          router.push(`/password-reset?email=${encodeURIComponent(email)}`);
        } else {
          toast.success("Login successful!");
          router.push("/dashboard");
        }
      } else {
        setError(response.message ?? "Verification failed");
      }
    } catch (err) {
      console.error(err);
      setError("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpResend = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await resendOtp({ email, action: otpPurpose });

      if (response.success) {
        toast.success("OTP resent successfully!");
        setSuccess("New OTP sent to your email");
      } else {
        setError(response.message ?? "Failed to resend OTP");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message ?? "Failed to resend OTP");
      } else {
        setError("Failed to resend OTP");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await requestPasswordReset(email);

      if (response.success) {
        setEmail(email);
        setOtpPurpose("reset-verify");
        setStep("otp");
        setShowForgotPassword(false);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message ?? "Failed to send reset instructions");
      } else {
        setError("Failed to send reset instructions");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {step === "login" && (
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Sign in to your account</h1>
            <p className="mt-2 text-gray-600">
              Enter your credentials to access your workspace
            </p>
          </div>

          <LoginForm
            onSubmit={handleLogin}
            onForgotPassword={() => setShowForgotPassword(true)}
            loading={loading}
            error={error}
          />

          <div className="divider">OR</div>

          <div className="text-center">
            <p className="text-gray-600">Don&apos;t have an account?</p>
            <button
              className="btn btn-outline mt-2"
              onClick={() => router.push("/register")}
            >
              Create Account
            </button>
          </div>
        </div>
      )}

      {step === "otp" && (
        <OTPForm
          email={email}
          purpose={otpPurpose}
          onSubmit={handleOtpVerify}
          onResend={handleOtpResend}
          onBack={() => setStep("login")}
          loading={loading}
          error={error}
          success={success}
        />
      )}

      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        onSubmit={handleForgotPasswordSubmit}
        loading={loading}
        error={error}
        success={success}
      />
    </AuthLayout>
  );
}
