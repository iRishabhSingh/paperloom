"use client";

import { useState } from "react";
import { FaEnvelope, FaTimes } from "react-icons/fa";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: string | null;
}

export default function ForgotPasswordModal({
  error,
  isOpen,
  loading,
  success,
  onClose,
  onSubmit,
}: Readonly<ForgotPasswordModalProps>) {
  const [email, setEmail] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-xl bg-base-100 shadow-xl">
        <div className="flex items-center justify-between border-b border-base-300 p-4">
          <h3 className="text-lg font-bold">Reset Password</h3>
          <button
            onClick={onClose}
            className="btn btn-circle btn-ghost"
            aria-label="Close modal"
            title="Close"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="py-4 text-center">
              <div className="avatar placeholder mx-auto">
                <div className="w-16 rounded-full bg-success text-success-content">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="mt-4 text-lg font-bold">Email Sent!</h3>
              <p className="mt-2">
                We&apos;ve sent instructions to reset your password to{" "}
                <span className="font-semibold">{email}</span>. Please check
                your email.
              </p>
              <button className="btn btn-primary mt-6" onClick={onClose}>
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p>
                Enter your email address below, and we&apos;ll send you
                instructions to reset your password.
              </p>

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

              <div className="form-control">
                <label className="label" htmlFor="forgot-password-email">
                  <span className="label-text">Email Address</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    id="forgot-password-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input input-bordered w-full pl-10"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="form-control mt-6">
                <button
                  type="submit"
                  className={`btn btn-primary ${loading ? "loading" : ""}`}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Reset Instructions"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
