"use client";

import { FaEnvelope, FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";

interface Step2Props {
  formData: {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Step2({ formData, onChange }: Readonly<Step2Props>) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="space-y-4">
      <div className="form-control">
        <label className="label" htmlFor="email">
          <span className="label-text">Email*</span>
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <FaEnvelope className="text-gray-400" />
          </div>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            className="input input-bordered w-full pl-10"
            placeholder="you@example.com"
            required
          />
        </div>
      </div>

      <div className="form-control">
        <label className="label" htmlFor="username">
          <span className="label-text">Username*</span>
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <FaUser className="text-gray-400" />
          </div>
          <input
            id="username"
            type="text"
            name="username"
            value={formData.username}
            onChange={onChange}
            className="input input-bordered w-full pl-10"
            placeholder="john_doe"
            required
          />
        </div>
      </div>

      <div className="form-control">
        <label className="label" htmlFor="password">
          <span className="label-text">Password*</span>
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <FaLock className="text-gray-400" />
          </div>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={onChange}
            className="input input-bordered w-full pl-10"
            placeholder="••••••••"
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

      <div className="form-control">
        <label className="label" htmlFor="confirmPassword">
          <span className="label-text">Confirm Password*</span>
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <FaLock className="text-gray-400" />
          </div>
          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={onChange}
            className="input input-bordered w-full pl-10"
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <FaEyeSlash className="text-gray-400" />
            ) : (
              <FaEye className="text-gray-400" />
            )}
          </button>
        </div>
        {formData.password &&
          formData.confirmPassword &&
          formData.password !== formData.confirmPassword && (
            <span className="label-text-alt block text-error">
              Passwords do not match
            </span>
          )}
      </div>
    </div>
  );
}
