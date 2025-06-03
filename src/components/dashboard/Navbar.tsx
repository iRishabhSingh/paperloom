"use client";

import Link from "next/link";
import Logout from "@/components/Logout";
import { FiMenu, FiSearch } from "react-icons/fi";
import React, { useCallback, useEffect, useState } from "react";
import CommandPalette from "@/components/dashboard/CommandPalette";
import NotificationDropdown from "@/components/dashboard/NotificationDropdown";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const [userInitials, setUserInitials] = useState("");
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Handle '/' shortcut
  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "/" && !isCommandOpen) {
        // Check if we're not in an input field
        const activeElement = document.activeElement;
        const isInput =
          activeElement?.tagName === "INPUT" ||
          activeElement?.tagName === "TEXTAREA";

        if (!isInput) {
          e.preventDefault();
          setIsCommandOpen(true);
        }
      }
    },
    [isCommandOpen],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          const initials =
            (data.firstName?.[0] ?? "") + (data.lastName?.[0] ?? "");
          setUserInitials(initials ?? data.name?.[0] ?? "U");
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <header className="z-30 border-b border-base-300 bg-base-100 shadow-sm">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <button
            type="button"
            title="Toggle Sidebar"
            onClick={toggleSidebar}
            className="btn btn-circle btn-ghost lg:hidden"
          >
            <FiMenu size={24} />
          </button>

          {/* Enhanced search button */}
          <button
            type="button"
            onClick={() => setIsCommandOpen(true)}
            className="flex w-48 items-center gap-2 rounded-full bg-base-200 px-4 py-2 text-sm transition-all hover:bg-base-300 md:w-64"
          >
            <FiSearch className="text-base-content/70" />
            <span className="text-base-content/80">Search PDFs...</span>
            <div className="ml-auto hidden lg:flex">
              <kbd className="kbd kbd-sm">/</kbd>
            </div>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <NotificationDropdown />

          <div className="dropdown dropdown-end">
            <button
              type="button"
              title="Profile"
              tabIndex={0}
              className="btn btn-circle btn-ghost"
            >
              <div className="avatar placeholder">
                <div className="w-10 rounded-full bg-neutral text-neutral-content">
                  <span className="font-semibold">{userInitials}</span>
                </div>
              </div>
            </button>
            <ul className="menu dropdown-content mt-2 w-52 rounded-box bg-base-100 p-2 shadow">
              <li>
                <Link href="/dashboard/profile">Profile</Link>
              </li>
              <li>
                <Link href="/dashboard/settings">Settings</Link>
              </li>
              <li>
                <Logout className="text-error" />
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Command palette for searching PDFs */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </header>
  );
};

export default Navbar;
