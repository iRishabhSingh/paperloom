// app/login/components/OTPForm.tsx
"use client";

import { useState, useEffect } from "react";
import { FaLock, FaArrowLeft } from "react-icons/fa";

interface OTPFormProps {
  email: string;
  purpose: "email-verify" | "login-verify" | "reset-verify";
  onSubmit: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  onBack?: () => void;
  loading: boolean;
  error: string | null;
  success: string | null;
}

export default function OTPForm({
  email,
  error,
  onBack,
  purpose,
  success,
  loading,
  onSubmit,
  onResend,
}: Readonly<OTPFormProps>) {
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }

    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(otp);
  };

  const handleResend = async () => {
    if (!canResend) return;

    setCanResend(false);
    setCountdown(60);
    await onResend();
  };

  const getTitle = () => {
    switch (purpose) {
      case "email-verify":
        return "Verify Your Email";
      case "login-verify":
        return "Two-Factor Authentication";
      case "reset-verify":
        return "Reset Password Verification";
      default:
        return "OTP Verification";
    }
  };

  const getDescription = () => {
    switch (purpose) {
      case "email-verify":
        return "We sent a verification code to your email. Please enter it below to verify your account.";
      case "login-verify":
        return "For your security, please enter the 6-digit code sent to your email to complete your login.";
      case "reset-verify":
        return "To reset your password, please enter the 6-digit code sent to your email.";
      default:
        return "Please enter the 6-digit code sent to your email.";
    }
  };

  return (
    <div className="space-y-4">
      {onBack && (
        <button
          type="button"
          className="btn btn-ghost btn-sm mb-2"
          onClick={onBack}
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
      )}

      <div className="text-center">
        <div className="avatar placeholder">
          <div className="w-16 rounded-full bg-primary text-primary-content">
            <FaLock size={24} />
          </div>
        </div>
        <h2 className="mt-2 text-xl font-bold">{getTitle()}</h2>
        <p className="mt-2 text-gray-600">{getDescription()}</p>
        <p className="mt-1 font-medium text-primary">{email}</p>
      </div>

      {success && (
        <div className="alert alert-success p-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error p-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control">
          <label className="label" htmlFor="otp-input">
            <span className="label-text">6-digit code</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <FaLock className="text-gray-400" />
            </div>
            <input
              id="otp-input"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="input input-bordered w-full pl-10"
              placeholder="Enter 6-digit code"
              required
              maxLength={6}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend || loading}
            className={`text-sm ${canResend ? "text-primary hover:underline" : "text-gray-400"}`}
          >
            {canResend ? "Resend code" : `Resend in ${countdown}s`}
          </button>

          <button
            type="submit"
            className={`btn btn-primary ${loading ? "loading" : ""}`}
            disabled={loading || otp.length !== 6}
          >
            Verify
          </button>
        </div>
      </form>
    </div>
  );
}
