import React from "react";

import { steps } from "@/components/Home/data";

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="bg-base-200 py-12 md:py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-4 text-center text-2xl font-bold md:text-3xl">
          How It Works
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-center text-gray-600 md:mb-16">
          Get started with paperloom in 4 simple steps
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.title}
              className="flex flex-col items-center rounded-xl border border-base-300 bg-base-100 p-4 text-center shadow-sm transition-shadow duration-300 hover:shadow-md"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-white md:h-14 md:w-14">
                {step.number}
              </div>
              <h3 className="mb-1 text-lg font-semibold">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>

        <div
          id="demo"
          className="mx-auto mt-12 max-w-4xl rounded-xl border border-base-300 bg-base-100 p-4 shadow-sm md:mt-20 md:rounded-2xl md:p-6 md:shadow-lg"
        >
          <div className="flex aspect-video items-center justify-center rounded-lg bg-gray-100">
            <div className="p-4 text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-xl border-2 border-dashed bg-gray-200" />
              <p className="text-sm text-gray-500">App interface preview</p>
              <button className="btn btn-primary btn-sm mt-3">View Demo</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
