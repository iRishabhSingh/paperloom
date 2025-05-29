"use client";

import { useState, useEffect } from "react";

const themes = [
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
];

export default function ThemeDropdown() {
  const [selectedTheme, setSelectedTheme] = useState<string>("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const htmlTheme = document.documentElement.getAttribute("data-theme");

    if (savedTheme) {
      setSelectedTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else if (htmlTheme) {
      setSelectedTheme(htmlTheme);
    }
  }, []);

  // Handle theme change
  const handleChangeTheme = (theme: string) => {
    setSelectedTheme(theme);
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  };

  return (
    <div className="dropdown">
      <button className="btn btn-primary dropdown-toggle" tabIndex={0}>
        Select Theme
      </button>
      <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
        {themes.map((theme) => (
          <li key={theme}>
            <button
              type="button"
              className={`w-full text-left ${
                selectedTheme === theme ? "text-primary font-semibold" : ""
              }`}
              onClick={() => handleChangeTheme(theme)}
            >
              {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
