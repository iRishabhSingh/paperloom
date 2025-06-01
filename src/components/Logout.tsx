"use client";

import React from "react";
import { useRouter } from "next/navigation";

const Logout = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <button onClick={handleLogout} className="btn btn-ghost">
      Logout
    </button>
  );
};

export default Logout;
