"use client";

import { useEffect } from "react";

const CTAAnimation = () => {
  useEffect(() => {
    // Add any client-side animation logic here
    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
      <div className="absolute -top-1/4 left-1/4 w-[300px] h-[300px] bg-purple-400 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/3 -right-20 w-[250px] h-[250px] bg-blue-400 rounded-full mix-blend-multiply filter blur-[90px] animate-blob animation-delay-4000"></div>
      <div className="absolute -bottom-20 left-1/2 w-[280px] h-[280px] bg-cyan-400 rounded-full mix-blend-multiply filter blur-[100px] animate-blob"></div>
    </div>
  );
};

export default CTAAnimation;
