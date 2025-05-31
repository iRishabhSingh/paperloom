import React from "react";
import Link from "next/link";

import CTAAnimation from "@/components/Home/animations/CTAAnimation";

const CTASection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/90 to-secondary/80 py-16 text-primary-content md:py-24">
      <CTAAnimation />

      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/30 backdrop-blur-sm"></div>

      <div className="container relative z-10 mx-auto px-4 text-center">
        <h2 className="mb-5 text-3xl font-bold md:mb-7 md:text-4xl">
          Ready to revolutionize your PDF workflow?
        </h2>

        <div className="mx-auto mb-7 max-w-2xl md:mb-10">
          <p className="mb-3 text-lg md:text-xl">
            Join thousands of teams using paperloom for seamless collaboration
          </p>
          <div className="mx-auto h-0.5 w-24 rounded-full bg-primary/20"></div>
        </div>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/register"
            className="btn btn-lg flex transform items-center gap-2 border-0 bg-base-100 text-primary shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-base-200 hover:shadow-xl"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                clipRule="evenodd"
              />
            </svg>
            Get Started Free
          </Link>

          <button className="btn btn-outline btn-lg border-base-100 text-base-100 hover:border-base-100 hover:bg-base-100/10">
            Schedule a Demo
          </button>
        </div>

        <p className="mt-5 flex items-center justify-center gap-2 text-sm text-primary-content/90">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          No credit card required • Free forever plan
        </p>
      </div>
    </section>
  );
};

export default CTASection;
