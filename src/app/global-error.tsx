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
    <div
      className="h-screen w-full bg-base-100 flex items-center justify-center p-8"
      data-theme="dark"
    >
      <div className="text-center space-y-10">
        <div className="animate-digit-reveal">
          <ThemedText text={errorCode} className="text-9xl text-base-content" />
        </div>

        <p className="text-xl text-base-content animate-text-reveal delay-100">
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
