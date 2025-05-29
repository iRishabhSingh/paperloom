import Link from "next/link";
import "@/styles/animations/not-found.css";
import ThemedText from "@/components/ThemedText";

const NotFoundPage = () => {
  return (
    <div
      className="h-screen w-full bg-base-100 flex items-center justify-center p-8"
      data-theme="dark"
    >
      <div className="text-center space-y-10">
        <div className="animate-digit-reveal">
          <ThemedText text="404" className="text-9xl text-base-content" />
        </div>

        <p className="text-xl text-base-content animate-text-reveal delay-100">
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
