"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiFile,
  FiUsers,
  FiSettings,
  FiShare2,
  FiMessageSquare,
  FiBell,
  FiX,
} from "react-icons/fi";
import UserProfile from "./UserProfile";
import ThemedText from "../ThemedText";
import Logout from "../Logout";

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar }) => {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch("/api/notifications/unread-count");
        if (response.ok) {
          const data = await response.json();
          setUnreadCount(data.count || 0);
        }
      } catch (error) {
        console.error("Failed to fetch unread count:", error);
      }
    };

    fetchUnreadCount();
  }, []);

  const navItems = [
    { name: "Dashboard", icon: FiHome, href: "/dashboard" },
    { name: "My PDFs", icon: FiFile, href: "/dashboard/pdfs" },
    { name: "Shared Files", icon: FiShare2, href: "/dashboard/shared" },
    { name: "Comments", icon: FiMessageSquare, href: "/dashboard/comments" },
    { name: "Team", icon: FiUsers, href: "/dashboard/team" },
    {
      name: "Notifications",
      icon: FiBell,
      href: "/dashboard/notifications",
      badge: unreadCount,
    },
    { name: "Settings", icon: FiSettings, href: "/dashboard/settings" },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col bg-base-200 shadow-xl transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:h-auto lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Sidebar header */}
      <div className="flex items-center justify-between border-b border-base-300 p-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2"
          onClick={closeSidebar}
        >
          <ThemedText text="paperloom" className="text-2xl font-bold" />
        </Link>
        <button
          aria-label="Close sidebar"
          onClick={closeSidebar}
          className="btn btn-circle btn-ghost btn-sm lg:hidden"
        >
          <FiX size={20} />
        </button>
      </div>

      {/* Enhanced User profile section */}
      <Link
        href="/dashboard/profile"
        className="border-b border-base-300 p-4 transition-colors hover:bg-base-300/50"
        onClick={closeSidebar}
      >
        <UserProfile className="px-1" />
      </Link>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`group flex items-center rounded-lg px-4 py-3 transition-colors duration-200 ${
                    isActive
                      ? "bg-primary/20 font-medium text-primary"
                      : "text-base-content hover:bg-primary/10 hover:text-primary"
                  }`}
                  onClick={closeSidebar}
                >
                  <item.icon className="mr-3" size={20} aria-hidden="true" />
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <span className="badge badge-primary badge-sm">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-base-300 p-4">
        <Logout className="flex w-full items-center rounded-lg px-4 py-3 text-error transition-colors duration-200 hover:bg-error/10" />
      </div>
    </aside>
  );
};

export default Sidebar;
