"use client";

import React, { useEffect, useState } from "react";
import { FiEdit, FiUser } from "react-icons/fi";

interface UserData {
  name: string;
  email: string;
  initials: string;
}

interface UserProfileProps {
  className?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ className = "" }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className={`flex w-full items-center gap-3 ${className}`}>
        <div className="h-12 w-12 animate-pulse rounded-full bg-base-300"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 animate-pulse rounded bg-base-300"></div>
          <div className="h-3 w-1/2 animate-pulse rounded bg-base-300"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`group flex w-full items-center gap-3 ${className}`}>
      <div className="relative flex-shrink-0">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-content">
          <FiUser size={20} aria-label="User avatar" />
        </div>
        <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-base-100 shadow-sm">
          <FiEdit
            className="text-primary transition-transform group-hover:scale-110"
            size={10}
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate font-medium leading-tight">
          {user?.name || "Anonymous"}
        </h3>
        <p className="truncate text-xs text-base-content/70">
          {user?.email || "No email"}
        </p>
        <div className="mt-0.5">
          <span className="relative inline-block text-xs font-medium text-primary">
            Edit Profile{" "}
            <span className="absolute bottom-0 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
