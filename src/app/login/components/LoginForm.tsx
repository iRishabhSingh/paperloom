"use client";

import { useState } from "react";
import { FaEye, FaEyeSlash, FaLock, FaEnvelope } from "react-icons/fa";

interface LoginFormProps {
  readonly loading: boolean;
  readonly error: string | null;
  readonly onForgotPassword: () => void;

  readonly onSubmit: (data: {
    password: string;
    emailOrUsername: string;
  }) => Promise<void>;
}

export default function LoginForm({
  error,
  loading,
  onSubmit,
  onForgotPassword,
}: LoginFormProps) {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ emailOrUsername, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
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
        <label className="label py-1" htmlFor="emailOrUsername">
          <span className="label-text">Email or Username</span>
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <FaEnvelope className="text-gray-400" />
          </div>
          <input
            id="emailOrUsername"
            type="text"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            className="input input-bordered w-full pl-10"
            placeholder="Enter your email or username"
            required
          />
        </div>

        <div className="mt-2 flex justify-between">
          <label className="label py-1" htmlFor="password">
            <span className="label-text">Password</span>
          </label>
          <div className="label py-1">
            <button
              type="button"
              onClick={onForgotPassword}
              className="link-hover link label-text-alt underline"
            >
              Forgot password?
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <FaLock className="text-gray-400" />
          </div>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered w-full pl-10"
            placeholder="Enter your password"
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <FaEyeSlash className="text-gray-400" />
            ) : (
              <FaEye className="text-gray-400" />
            )}
          </button>
        </div>
      </div>

      <div className="form-control mt-4">
        <button
          type="submit"
          className={`btn btn-primary ${loading ? "loading" : ""}`}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </div>
    </form>
  );
}
