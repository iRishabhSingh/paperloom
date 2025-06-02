import React from "react";
import { FiFile, FiUsers, FiMessageSquare, FiDownload } from "react-icons/fi";

const StatsCards: React.FC = () => {
  const stats = [
    {
      title: "Total PDFs",
      value: 24,
      change: "+3",
      icon: FiFile,
      color: "text-primary",
    },
    {
      title: "Shared Files",
      value: 12,
      change: "+2",
      icon: FiUsers,
      color: "text-secondary",
    },
    {
      title: "Comments",
      value: 42,
      change: "+8",
      icon: FiMessageSquare,
      color: "text-accent",
    },
    {
      title: "Downloads",
      value: 128,
      change: "+24",
      icon: FiDownload,
      color: "text-info",
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="mb-1 text-sm text-base-content/70">{stat.title}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
            <div
              className={`rounded-lg bg-opacity-10 p-3 ${stat.color.replace("text-", "bg-")}`}
            >
              <stat.icon size={24} className={stat.color} />
            </div>
          </div>
          <p className="mt-2 text-sm">
            <span className="text-success">↗︎ {stat.change}</span> since last
            week
          </p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
