"use client";

import React, { useState } from "react";
import { FiBell, FiMail } from "react-icons/fi";

interface NotificationSettings {
  email: {
    comments: boolean;
    shares: boolean;
    updates: boolean;
  };
  inApp: {
    comments: boolean;
    mentions: boolean;
  };
}

const NotificationsForm = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      comments: true,
      shares: true,
      updates: false,
    },
    inApp: {
      comments: true,
      mentions: true,
    },
  });

  const handleToggle = (type: keyof NotificationSettings, field: string) => {
    setSettings((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: !prev[type][field as keyof (typeof prev)[typeof type]],
      },
    }));
  };

  const saveSettings = async () => {
    try {
      const response = await fetch("/api/users/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        // Show success message
      }
    } catch (error) {
      console.error("Failed to save notification settings:", error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Email Notifications */}
      <div>
        <div className="mb-4 flex items-center">
          <FiMail className="mr-3 text-xl" />
          <h3 className="font-medium">Email Notifications</h3>
        </div>

        <div className="space-y-3">
          {Object.entries(settings.email).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between rounded-lg bg-base-200 p-3"
            >
              <span className="capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </span>
              <input
                type="checkbox"
                checked={value}
                title="Toggle Notification"
                onChange={() => handleToggle("email", key)}
                className="toggle toggle-primary"
              />
            </div>
          ))}
        </div>
      </div>

      {/* In-App Notifications */}
      <div>
        <div className="mb-4 flex items-center">
          <FiBell className="mr-3 text-xl" />
          <h3 className="font-medium">In-App Notifications</h3>
        </div>

        <div className="space-y-3">
          {Object.entries(settings.inApp).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between rounded-lg bg-base-200 p-3"
            >
              <span className="capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </span>
              <input
                type="checkbox"
                checked={value}
                title="Toggle Notification"
                onChange={() => handleToggle("inApp", key)}
                className="toggle toggle-primary"
              />
            </div>
          ))}
        </div>
      </div>

      <button onClick={saveSettings} className="btn btn-primary mt-4">
        Save Notification Preferences
      </button>
    </div>
  );
};

export default NotificationsForm;
