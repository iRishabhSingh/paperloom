"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import AuthLayout from "@/components/AuthLayout";
import Step1 from "@/app/register/components/Step1";
import Step2 from "@/app/register/components/Step2";
import Step3 from "@/app/register/components/Step3";
import Step4 from "@/app/register/components/Step4";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form state matching schema
  const [formData, setFormData] = useState({
    profileImageUrl: "",
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    region: "IN",
  });

  const handleNext = () => {
    // Validate before proceeding
    if (step === 1 && (!formData.firstName || !formData.lastName)) {
      toast.error("Please fill in all required fields", {
        position: "top-center",
      });
      return;
    }

    if (step === 2) {
      if (
        !formData.email ||
        !formData.username ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        toast.error("Please fill in all required fields", {
          position: "top-center",
        });
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error("Please enter a valid email address", {
          position: "top-center",
        });
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match", { position: "top-center" });
        return;
      }
    }

    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      // Prepare data for API
      const { ...submitData } = formData;

      // Call registration API
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      // Handle response
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error ?? "Registration failed");
      }

      const data = await response.json();
      toast.success(
        data.message ??
          "Registration successful! Check your email for verification.",
        { position: "top-center" },
      );
      setStep(4);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error(errorMessage, {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      // Call resend OTP API
      const response = await fetch("/api/auth/resend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          action: "email-verify",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error ?? "Failed to resend OTP");
      }

      toast.success("New verification code sent!", { position: "top-center" });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to resend code";
      toast.error(errorMessage, {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (otp: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otp,
          action: "email-verify",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error ?? "Verification failed");
      }

      toast.success("Email verified successfully!", {
        position: "top-center",
      });

      // Redirect to dashboard after verification
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Verification failed";
      toast.error(errorMessage, {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full">
        {/* Step Indicator */}
        <div className="mb-8 flex justify-center">
          <ul className="steps w-full max-w-md text-xs sm:text-sm [&>*]:before:h-[1px]">
            <li className={`step ${step >= 1 ? "step-primary" : ""}`}>
              Personal
            </li>
            <li className={`step ${step >= 2 ? "step-primary" : ""}`}>
              Account
            </li>
            <li className={`step ${step >= 3 ? "step-primary" : ""}`}>
              Register
            </li>
            <li className={`step ${step >= 4 ? "step-primary" : ""}`}>
              Verify
            </li>
          </ul>
        </div>

        <div className="transition-all duration-300">
          {step === 1 && (
            <Step1
              formData={formData}
              onChange={handleChange}
              onImageChange={(file) => file?.name}
            />
          )}

          {step === 2 && <Step2 formData={formData} onChange={handleChange} />}

          {step === 3 && <Step3 formData={formData} onChange={handleChange} />}

          {step === 4 && (
            <Step4
              email={formData.email}
              onVerify={handleVerify}
              onResend={handleResendOtp}
            />
          )}
        </div>

        <div
          className={`mt-8 flex ${step === 1 ? "justify-center" : "justify-between"}`}
        >
          {step > 1 && step < 4 && (
            <button
              onClick={handleBack}
              disabled={loading}
              className="btn btn-ghost"
            >
              Back
            </button>
          )}

          {step < 4 && (
            <button
              onClick={step === 3 ? handleSubmit : handleNext}
              disabled={loading}
              className={`btn btn-primary ${step === 1 ? "w-full" : ""} ${loading ? "loading" : ""}`}
            >
              {step === 3 ? "Register" : "Next"}
            </button>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}
