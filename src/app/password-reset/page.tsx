"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";

import AuthLayout from "@/components/AuthLayout";
import { resetPassword } from "@/app/login/actions";
import ResetPasswordForm from "@/app/login/components/ResetPasswordForm";

export default function PasswordResetPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") ?? "";
  const [email] = useState(emailParam);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleResetPassword = async (newPassword: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await resetPassword({ email, newPassword });

      if (response.success) {
        setSuccess("Password reset successfully!");
        toast.success("Password reset successfully!");

        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(response.message ?? "Password reset failed");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message ?? "Password reset failed");
      } else {
        setError("Password reset failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-4">
        <ResetPasswordForm
          email={email}
          onSubmit={handleResetPassword}
          onBack={() => router.push("/login")}
          loading={loading}
          error={error}
          success={success}
        />
      </div>
    </AuthLayout>
  );
}
