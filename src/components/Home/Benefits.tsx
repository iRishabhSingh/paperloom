import React from "react";

const Benefits = () => {
  return (
    <section id="benefits" className="bg-base-100 py-12 md:py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-4 text-center text-2xl font-bold md:text-3xl">
          Why Choose paperloom?
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-center text-gray-600 md:mb-16">
          The modern way to collaborate on documents
        </p>

        <div className="flex flex-col gap-8 md:gap-12 lg:flex-row">
          <div className="order-2 w-full lg:order-1 lg:w-1/2">
            <ul className="space-y-4 md:space-y-6">
              <li className="flex items-start">
                <div className="mr-3 flex-shrink-0 rounded-full bg-primary/10 p-2 md:p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-primary md:h-6 md:w-6"
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
                <div>
                  <h3 className="text-lg font-semibold md:text-xl">
                    No More Email Chains
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 md:text-base">
                    All feedback in one place with contextual comments
                  </p>
                </div>
              </li>

              <li className="flex items-start">
                <div className="mr-3 flex-shrink-0 rounded-full bg-primary/10 p-2 md:p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-primary md:h-6 md:w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold md:text-xl">
                    Enterprise-grade Security
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 md:text-base">
                    Bank-level encryption and access controls
                  </p>
                </div>
              </li>

              <li className="flex items-start">
                <div className="mr-3 flex-shrink-0 rounded-full bg-primary/10 p-2 md:p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-primary md:h-6 md:w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold md:text-xl">
                    Lightning Fast
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 md:text-base">
                    Optimized PDF rendering for large documents
                  </p>
                </div>
              </li>
            </ul>

            <div className="mt-8 rounded-lg border border-primary/20 bg-primary/10 p-4 md:p-6">
              <p className="mb-3 text-sm italic md:text-base">
                &quot;paperloom cut our document review time by 70%. The
                commenting system is revolutionary!&quot;
              </p>
              <p className="text-sm font-semibold md:text-base">
                — Hrishabh Singh, Creator
              </p>
            </div>
          </div>

          <div className="order-1 flex w-full justify-center lg:order-2 lg:w-1/2">
            <div className="flex aspect-video w-full max-w-md items-center justify-center rounded-xl bg-gray-100">
              <div className="text-center">
                <div className="mx-auto mb-4 h-16 w-16 rounded-xl border-2 border-dashed bg-gray-200" />
                <p className="text-sm text-gray-500">Secure document preview</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
