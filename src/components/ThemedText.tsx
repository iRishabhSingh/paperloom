import React from "react";
import { Vast_Shadow } from "next/font/google";

import ThemedTextProps from "@/types/ThemedTextProps";

const vastShadow = Vast_Shadow({
  weight: "400",
  display: "swap",
  subsets: ["latin"],
  variable: "--font-vast-shadow",
});

const ThemedText: React.FC<ThemedTextProps> = ({ text, className = "" }) => {
  return <span className={`${vastShadow.className} ${className}`}>{text}</span>;
};

export default ThemedText;
