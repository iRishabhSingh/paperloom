import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const DashboardPageLayout = ({ children }: { children: React.ReactNode }) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default DashboardPageLayout;
