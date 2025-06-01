"use client";

import { FaLock, FaEnvelope } from "react-icons/fa";
import { useEffect, useState } from "react";

interface Step4Props {
  email: string;
  onVerify: (otp: string) => void;
  onResend: () => void;
}

export default function Step4({
  email,
  onVerify,
  onResend,
}: Readonly<Step4Props>) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      onVerify(otp);
    }
  };

  const handleResend = () => {
    if (canResend) {
      setCanResend(false);
      setCountdown(60);
      onResend();
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="avatar placeholder">
          <div className="w-16 rounded-full bg-primary text-primary-content">
            <FaEnvelope size={24} />
          </div>
        </div>
        <h2 className="mt-2 text-xl font-bold">Verify Your Email</h2>
        <p className="mt-2 text-gray-600">
          We&apos;ve sent a 6-digit verification code to your email address
        </p>
        <p className="mt-1 font-medium text-primary">{email}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control">
          <div className="flex justify-between">
            <label className="label" htmlFor="otp-input">
              <span className="label-text">Verification Code</span>
            </label>
            <button
              type="button"
              onClick={handleResend}
              disabled={!canResend}
              className={`text-sm ${canResend ? "text-primary hover:underline" : "text-gray-400"}`}
            >
              {canResend ? "Resend code" : `Resend in ${countdown}s`}
            </button>
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <FaLock className="text-gray-400" />
            </div>
            <input
              id="otp-input"
              type="text"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setOtp(value.slice(0, 6));
              }}
              className="input input-bordered w-full pl-10"
              placeholder="Enter 6-digit code"
              required
              maxLength={6}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={otp.length !== 6}
          >
            Verify
          </button>
        </div>
      </form>
    </div>
  );
}
