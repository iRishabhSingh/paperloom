import React from "react";
import Link from "next/link";

import ThemedText from "@/components/ThemedText";
import HeroAnimation from "@/components/Home/animations/HeroAnimation";
import SmoothScrollLink from "@/components/Home/animations/SmoothScrollLink";

const Hero = () => {
  return (
    <section className="relative overflow-hidden py-12 md:py-20">
      <HeroAnimation />
      <div className="absolute inset-0 bg-gradient-to-br from-base-100 via-primary/5 to-base-100"></div>

      <div className="container relative z-10 mx-auto px-4 text-center">
        <ThemedText
          text="paperloom"
          className="mb-4 px-2 text-4xl text-primary sm:text-5xl md:text-6xl"
        />

        <p className="mx-auto mb-6 mt-2 max-w-2xl text-lg md:text-xl">
          Seamless PDF collaboration for modern teams
        </p>
        <p className="mx-auto mb-8 max-w-2xl px-2 text-base text-gray-600">
          Upload, share, and collaborate on PDFs with real-time comments and
          secure access controls.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
          <Link href="/register" className="btn btn-primary md:btn-lg">
            Get Started Free
          </Link>
          <SmoothScrollLink href="#demo" className="btn btn-outline md:btn-lg">
            Watch Demo
          </SmoothScrollLink>
        </div>
      </div>
    </section>
  );
};

export default Hero;
