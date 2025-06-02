// components/Navbar.tsx
"use client";

import React, { useEffect, useState } from "react";
import { FiMenu, FiSearch } from "react-icons/fi";
import Logout from "../Logout";
import Link from "next/link";
import NotificationDropdown from "./NotificationDropdown";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const [userInitials, setUserInitials] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          setUserInitials(data.initials);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <header className="z-30 bg-base-100 shadow-sm">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <button
            title="Toggle Sidebar"
            onClick={toggleSidebar}
            className="btn btn-circle btn-ghost lg:hidden"
          >
            <FiMenu size={24} />
          </button>

          <div className="relative hidden md:block">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <FiSearch className="text-base-content/70" />
            </div>
            <input
              type="text"
              placeholder="Search PDFs..."
              className="input input-bordered pl-10"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <NotificationDropdown />

          <div className="dropdown dropdown-end">
            <button
              title="Profile"
              tabIndex={0}
              className="btn btn-circle h-full cursor-pointer bg-neutral"
              type="button"
            >
              <div className="flex w-10 items-center justify-center rounded-full bg-neutral text-neutral-content">
                <span className="font-semibold">{userInitials}</span>
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
    </header>
  );
};

export default Navbar;
