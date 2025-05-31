import React from "react";
import Link from "next/link";

import ThemedText from "@/components/ThemedText";
import ThemeDropdown from "@/components/ThemeDropdown";
import SmoothScrollLink from "@/components/Home/animations/SmoothScrollLink";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-base-100 shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="max-w-[50vw] truncate text-2xl text-primary sm:text-3xl"
        >
          <ThemedText text="paperloom" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden space-x-6 md:flex">
          <SmoothScrollLink
            href="#features"
            className="transition hover:text-primary"
          >
            Features
          </SmoothScrollLink>
          <SmoothScrollLink
            href="#how-it-works"
            className="transition hover:text-primary"
          >
            How It Works
          </SmoothScrollLink>
          <SmoothScrollLink
            href="#benefits"
            className="transition hover:text-primary"
          >
            Benefits
          </SmoothScrollLink>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            className="btn btn-square btn-ghost"
            aria-label="Open menu"
            title="Open menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden items-center space-x-4 md:flex">
          <ThemeDropdown />
          <Link href="/login" className="btn btn-ghost">
            Log in
          </Link>
          <Link href="/register" className="btn btn-primary">
            Sign Up Free
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
