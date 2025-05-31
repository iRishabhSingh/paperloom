// app/components/ThemeDropdown.tsx
"use client";

import { useState, useEffect, useRef } from "react";

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
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const htmlTheme = document.documentElement.getAttribute("data-theme");

    if (savedTheme) {
      setSelectedTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else if (htmlTheme) {
      setSelectedTheme(htmlTheme);
    }

    // Handle clicks outside the dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChangeTheme = (theme: string) => {
    setSelectedTheme(theme);
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full bg-base-200 px-3 py-2 shadow-sm transition-all duration-200 hover:bg-base-300"
        aria-label="Change theme"
      >
        <div className="flex">
          <div className="h-5 w-5 rounded-full border border-white bg-primary" />
          <div className="-ml-3 h-5 w-5 rounded-full border border-white bg-secondary" />
        </div>
        <span className="text-sm font-medium">Theme</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="animate-fadeIn absolute right-0 z-50 mt-2 w-56 origin-top-right overflow-hidden rounded-xl bg-base-100 shadow-xl ring-1 ring-base-300 focus:outline-none">
          <div className="border-b border-base-300 bg-base-200 p-3">
            <h3 className="text-sm font-medium">Select Theme</h3>
          </div>

          <div className="custom-scrollbar max-h-60 overflow-y-auto">
            {themes.map((theme) => (
              <div
                key={theme}
                className={`theme-item ${selectedTheme === theme ? "bg-primary/10" : "hover:bg-base-200"}`}
              >
                <button
                  onClick={() => handleChangeTheme(theme)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex bg-transparent">
                      <div
                        data-theme={theme}
                        className="h-5 w-5 rounded-full border border-white bg-primary"
                      />
                      <div
                        data-theme={theme}
                        className="-ml-3 h-5 w-5 rounded-full border border-white bg-secondary"
                      />
                    </div>
                    <span className="text-sm font-medium capitalize">
                      {theme}
                    </span>
                  </div>

                  {selectedTheme === theme && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-primary"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </div>
            ))}
          </div>

          <div className="border-t border-base-300 bg-base-200 p-3 text-xs text-base-content/70">
            Current:{" "}
            <span className="font-medium capitalize">{selectedTheme}</span>
          </div>
        </div>
      )}
    </div>
  );
}
