"use client";

import {
  FiX,
  FiHome,
  FiBell,
  FiFile,
  FiShare2,
  FiSettings,
  FiMessageSquare,
} from "react-icons/fi";
import Link from "next/link";
import Logout from "@/components/Logout";
import { usePathname } from "next/navigation";
import ThemedText from "@/components/ThemedText";
import React, { useEffect, useState } from "react";
import UserProfile from "@/components/dashboard/UserProfile";

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar }) => {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingPath, setLoadingPath] = useState("");
  const [counts, setCounts] = useState({
    pdfCount: 0,
    publicShareCount: 0,
    collaborationCount: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch("/api/dashboard?type=counts");
        if (response.ok) {
          const data = await response.json();
          setCounts(data);
        }
      } catch (error) {
        console.error("Failed to fetch counts:", error);
      }
    };

    const fetchUnreadCount = async () => {
      try {
        const response = await fetch("/api/notifications/unread-count");
        if (response.ok) {
          const data = await response.json();
          setUnreadCount(data.count ?? 0);
        }
      } catch (error) {
        console.error("Failed to fetch unread count:", error);
      }
    };

    fetchCounts();
    fetchUnreadCount();
  }, []);

  const navItems = [
    { name: "Dashboard", icon: FiHome, href: "/dashboard" },
    {
      name: "My PDFs",
      icon: FiFile,
      href: "/dashboard/pdfs",
      badge: counts.pdfCount,
    },
    {
      name: "Shared Files",
      icon: FiShare2,
      href: "/dashboard/shared",
      badge: counts.publicShareCount,
    },
    {
      name: "Collaborations",
      icon: FiMessageSquare,
      href: "/dashboard/collaborations",
      badge: counts.collaborationCount,
    },
    {
      name: "Notifications",
      icon: FiBell,
      href: "/dashboard/notifications",
      badge: unreadCount,
    },
    { name: "Settings", icon: FiSettings, href: "/dashboard/settings" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          tabIndex={0}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeSidebar}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              closeSidebar();
            }
          }}
          style={{ cursor: "pointer" }}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col bg-base-200 shadow-xl transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:h-auto lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar header with fixed height */}
        <div className="ml-5 flex h-16 items-center justify-start border-b border-base-300">
          <Link
            href="/dashboard"
            className="flex items-center gap-2"
            onClick={() => {
              closeSidebar();
              setLoadingPath("/dashboard");
            }}
          >
            <ThemedText text="paperloom/" className="text-2xl font-bold" />
          </Link>
        </div>

        {/* Enhanced User profile section */}
        <Link
          href="/dashboard/profile"
          className="border-b border-base-300 p-4 transition-colors hover:bg-base-300/50"
          onClick={() => {
            closeSidebar();
            setLoadingPath("/dashboard/profile");
          }}
        >
          <UserProfile className="px-1" />
        </Link>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => {
              const isDashboard = item.name === "Dashboard";
              const isActive = isDashboard
                ? pathname === item.href
                : pathname.startsWith(item.href);

              const isLoading = loadingPath === item.href;

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    // onClick={() => handleNavigation(item.href)}
                    className={`group flex w-full items-center rounded-lg px-4 py-3 transition-colors duration-200 ${
                      isActive
                        ? "bg-primary/20 font-medium text-primary"
                        : "text-base-content hover:bg-primary/10 hover:text-primary"
                    } ${isLoading ? "cursor-not-allowed opacity-70" : ""}`}
                  >
                    {isLoading ? (
                      <span className="loading loading-spinner mr-3 text-primary"></span>
                    ) : (
                      <item.icon
                        className="mr-3"
                        size={20}
                        aria-hidden="true"
                      />
                    )}
                    <span className="flex-1 text-left">{item.name}</span>
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
          <Logout
            iconPrefix
            className="flex w-full items-center rounded-lg px-4 py-3 text-error transition-colors duration-200 hover:bg-error/10"
          />
        </div>
      </aside>

      {/* Close button outside sidebar */}
      {isOpen && (
        <button
          aria-label="Close sidebar"
          onClick={closeSidebar}
          className="fixed left-64 top-4 z-50 rounded-full bg-base-200 p-2 shadow-lg transition-transform lg:hidden"
        >
          <FiX size={24} className="text-base-content" />
        </button>
      )}
    </>
  );
};

export default Sidebar;
