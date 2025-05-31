"use client";

import Link from "next/link";
import { useEffect } from "react";

import ThemedText from "@/components/ThemedText";

export default function ErrorPage({
  error,
  reset,
}: Readonly<{
  error: Error;
  reset: () => void;
}>) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const errorCode = error?.name || "500";
  const errorMessage =
    error?.message || "An unexpected error occurred. Please try again later.";

  return (
    <div className="flex h-screen w-full items-center justify-center bg-base-100 p-8">
      <div className="space-y-10 text-center">
        <div className="animate-digit-reveal">
          <ThemedText text={errorCode} className="text-9xl text-base-content" />
        </div>

        <p className="animate-text-reveal text-xl text-base-content delay-100">
          {errorMessage}
        </p>

        <div className="animate-button-reveal flex justify-center gap-4 delay-200">
          <button onClick={reset} className="btn btn-outline btn-primary">
            Try Again
          </button>
          <Link href="/" className="btn btn-outline btn-primary">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
