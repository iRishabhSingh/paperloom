import React from "react";

import { features } from "@/components/Home/data";

const Features = () => {
  return (
    <section id="features" className="bg-base-100 py-12 md:py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-4 text-center text-2xl font-bold md:text-3xl">
          Powerful Features
        </h2>
        <p className="mx-auto mb-8 max-w-2xl px-2 text-center text-gray-600 md:mb-16">
          Everything you need for productive PDF collaboration
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="card border border-base-300 bg-base-200 shadow-md transition-all duration-300 hover:shadow-xl"
            >
              <div className="card-body items-center p-4 text-center md:p-6">
                {feature.icon()}
                <h3 className="card-title mt-2 text-lg">{feature.title}</h3>
                <p className="mt-1 text-sm text-base-content">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
