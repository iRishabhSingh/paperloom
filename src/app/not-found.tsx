import Link from "next/link";
import "@/styles/animations/not-found.css";
import ThemedText from "@/components/ThemedText";

const NotFoundPage = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-base-100 p-8">
      <div className="space-y-10 text-center">
        <div className="animate-digit-reveal">
          <ThemedText text="404" className="text-9xl text-base-content" />
        </div>

        <p className="animate-text-reveal text-xl text-base-content delay-100">
          Resource not found in archive
        </p>

        <div className="animate-button-reveal delay-200">
          <Link href="/" className="btn btn-outline btn-primary btn-lg">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
