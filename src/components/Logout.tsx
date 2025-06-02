"use client";

import React from "react";
import { FiLogOut } from "react-icons/fi";
import { useRouter } from "next/navigation";

const Logout = ({
  className,
  iconPrefix,
}: {
  className?: string;
  iconPrefix?: boolean;
}) => {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <button
      aria-label="Log out"
      onClick={handleLogout}
      className={className ?? "btn btn-ghost"}
    >
      {iconPrefix && <FiLogOut className="mr-3" size={20} aria-hidden="true" />}
      Logout
    </button>
  );
};

export default Logout;
