"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  FiFile,
  FiUser,
  FiShare2,
  FiDownload,
  FiMessageSquare,
} from "react-icons/fi";
import { FiLoader } from "react-icons/fi";

interface Activity {
  id: string;
  type: "upload" | "download" | "comment" | "share";
  user: {
    name: string;
    avatar?: string;
  };
  pdf: {
    title: string;
    id: string;
  };
  timestamp: string;
}

const ActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/activity");

        if (!response.ok) {
          throw new Error("Failed to fetch activities");
        }

        const data = await response.json();
        setActivities(data.activities);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "upload":
        return <FiFile className="text-primary" />;
      case "download":
        return <FiDownload className="text-info" />;
      case "comment":
        return <FiMessageSquare className="text-accent" />;
      case "share":
        return <FiShare2 className="text-secondary" />;
      default:
        return <FiFile />;
    }
  };

  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case "upload":
        return `uploaded ${activity.pdf.title}`;
      case "download":
        return `downloaded ${activity.pdf.title}`;
      case "comment":
        return `commented on ${activity.pdf.title}`;
      case "share":
        return `shared ${activity.pdf.title}`;
      default:
        return `performed an action on ${activity.pdf.title}`;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Recent Activity</h2>
        <div className="flex justify-center py-8">
          <FiLoader className="animate-spin text-xl text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Recent Activity</h2>
        <div className="text-center text-error">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-primary btn-sm mx-auto mt-3 block"
        >
          Retry
        </button>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Recent Activity</h2>
        <div className="py-8 text-center text-base-content/60">
          No recent activity
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-base-200">
              {activity.user.avatar ? (
                <Image
                  width={40}
                  height={40}
                  alt={activity.user.name}
                  src={activity.user.avatar}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <FiUser className="text-base-content/70" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-baseline justify-between">
                <p className="font-medium">{activity.user.name}</p>
                <span className="text-sm text-base-content/50">
                  {formatTime(activity.timestamp)}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-sm">
                {getActivityIcon(activity.type)}
                <span className="text-base-content/70">
                  {getActivityText(activity)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
