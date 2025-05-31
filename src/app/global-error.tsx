"use client";

import ThemedText from "@/components/ThemedText";
import GlobalErrorProps from "@/types/GlobalErrorProps";

export default function GlobalError({
  error,
  reset,
}: Readonly<GlobalErrorProps>) {
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
          {errorMessage || "Critical system error"}
        </p>

        <div className="animate-button-reveal delay-200">
          <button
            onClick={reset}
            className="btn btn-outline btn-primary btn-lg"
          >
            Attempt Recovery
          </button>
        </div>
      </div>
    </div>
  );
}
