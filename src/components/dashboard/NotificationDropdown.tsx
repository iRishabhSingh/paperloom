"use client";

import React, { useEffect, useState } from "react";
import { FiBell, FiCheck, FiTrash2 } from "react-icons/fi";

interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const length = notifications.length;

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/notifications");
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: "POST" });
      fetchNotifications(); // Refresh notifications
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: "DELETE" });
      fetchNotifications(); // Refresh notifications
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications/mark-all-read", { method: "POST" });
      fetchNotifications(); // Refresh notifications
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  return (
    <div className="dropdown dropdown-end">
      <button
        title="Notifications"
        className="btn btn-circle btn-ghost"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="indicator">
          <FiBell size={20} />
          {unreadCount > 0 && (
            <span className="badge indicator-item badge-primary badge-xs">
              {unreadCount}
            </span>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="dropdown-content mt-2 w-80 rounded-box bg-base-100 shadow-lg">
          <div className="menu p-2">
            <div className="flex items-center justify-between px-4 py-2">
              <h3 className="font-bold">Notifications</h3>
              <button
                onClick={markAllAsRead}
                className="btn btn-ghost btn-xs"
                disabled={unreadCount === 0}
              >
                Mark all as read
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center p-4">
                <span className="loading loading-spinner"></span>
              </div>
            ) : length === 0 ? (
              <div className="p-4 text-center text-sm text-base-content/70">
                No notifications yet
              </div>
            ) : (
              <ul className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <li key={notification.id}>
                    <div
                      className={`flex flex-col gap-1 ${notification.read ? "" : "bg-primary/10"}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{notification.title}</h4>
                          <p className="text-sm">{notification.message}</p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="btn btn-ghost btn-xs"
                            title="Mark as read"
                          >
                            <FiCheck size={14} />
                          </button>
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="btn btn-ghost btn-xs text-error"
                            title="Delete"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <span className="text-xs text-base-content/50">
                        {new Date(notification.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
