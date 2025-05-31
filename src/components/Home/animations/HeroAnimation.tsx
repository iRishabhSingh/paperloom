"use client";

import { useEffect } from "react";

const HeroAnimation = () => {
  useEffect(() => {
    // Add any client-side animation logic here
    // This is a placeholder for a future animation
    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
      <div className="absolute -top-1/2 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/3 -right-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      <div className="absolute -bottom-20 left-1/2 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
    </div>
  );
};

export default HeroAnimation;
