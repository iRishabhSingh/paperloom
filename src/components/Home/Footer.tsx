import React from "react";
import Link from "next/link";

import ThemedText from "@/components/ThemedText";
import SmoothScrollLink from "@/components/Home/animations/SmoothScrollLink";

const Footer = () => {
  return (
    <footer className="bg-base-300 py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 md:gap-8">
          <div className="md:col-span-1">
            <ThemedText
              text="paperloom"
              className="mb-3 text-2xl text-primary"
            />
            <p className="text-sm text-gray-600">
              Modern PDF collaboration for distributed teams
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-semibold">Product</h3>
            <ul className="space-y-2">
              <li>
                <SmoothScrollLink
                  href="#features"
                  className="text-sm text-gray-600 hover:text-primary"
                >
                  Features
                </SmoothScrollLink>
              </li>
              <li>
                <SmoothScrollLink
                  href="#how-it-works"
                  className="text-sm text-gray-600 hover:text-primary"
                >
                  How It Works
                </SmoothScrollLink>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-sm text-gray-600 hover:text-primary"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-semibold">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-gray-600 hover:text-primary"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/docs"
                  className="text-sm text-gray-600 hover:text-primary"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="text-sm text-gray-600 hover:text-primary"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-semibold">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-600 hover:text-primary"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-600 hover:text-primary"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-gray-600 hover:text-primary"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-base-200 pt-6 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} paperloom. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
