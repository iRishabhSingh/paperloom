import daisyui from "daisyui";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [daisyui],

  // daisyUI configuration
  daisyui: {
    themes: [
      "light",
      "dark",
      "business",
      "cupcake",
      "bumblebee",
      "retro",
      "forest",
      "fancy",
      "wireframe",
      "black",
      "dracula",
    ],
  },
};
export default config;
