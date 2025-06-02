"use client";

import React, { useState } from "react";
import { FiLock, FiShield, FiLogOut } from "react-icons/fi";

const SecuritySettings = () => {
  const [activeSessions, setActiveSessions] = useState([
    {
      id: "1",
      device: "Chrome on Windows",
      location: "New York, NY",
      lastActive: "2 hours ago",
      current: true,
    },
    {
      id: "2",
      device: "Safari on iPhone",
      location: "San Francisco, CA",
      lastActive: "3 days ago",
      current: false,
    },
  ]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implement password change logic
  };

  const terminateSession = (sessionId: string) => {
    setActiveSessions(
      activeSessions.filter((session) => session.id !== sessionId),
    );
    // Call API to terminate session
  };

  return (
    <div className="space-y-8">
      {/* Change Password */}
      <div>
        <h3 className="mb-4 font-medium">Change Password</h3>
        <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
          <div className="form-control">
            <label htmlFor="currentPassword" className="label">
              <span className="label-text">Current Password</span>
            </label>
            <input
              id="currentPassword"
              type="password"
              className="input input-bordered w-full"
              placeholder="Current password"
              required
            />
          </div>

          <div className="form-control">
            <label htmlFor="newPassword" className="label">
              <span className="label-text">New Password</span>
            </label>
            <input
              id="newPassword"
              type="password"
              className="input input-bordered w-full"
              placeholder="New password"
              required
            />
          </div>

          <div className="form-control">
            <label htmlFor="confirmPassword" className="label">
              <span className="label-text">Confirm New Password</span>
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="input input-bordered w-full"
              placeholder="Confirm new password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary mt-2">
            <FiLock className="mr-2" />
            Change Password
          </button>
        </form>
      </div>

      {/* Two-Factor Authentication */}
      <div>
        <h3 className="mb-4 font-medium">Two-Factor Authentication</h3>
        <div className="alert bg-base-200">
          <FiShield className="text-xl" />
          <span>
            Two-factor authentication adds an extra layer of security to your
            account
          </span>
          <button className="btn btn-sm ml-auto">Enable 2FA</button>
        </div>
      </div>

      {/* Active Sessions */}
      <div>
        <h3 className="mb-4 font-medium">Active Sessions</h3>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Device</th>
                <th>Location</th>
                <th>Last Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeSessions.map((session) => (
                <tr
                  key={session.id}
                  className={session.current ? "bg-base-200" : ""}
                >
                  <td>
                    <div className="flex items-center">
                      {session.device}
                      {session.current && (
                        <span className="badge badge-primary badge-sm ml-2">
                          Current
                        </span>
                      )}
                    </div>
                  </td>
                  <td>{session.location}</td>
                  <td>{session.lastActive}</td>
                  <td>
                    {!session.current && (
                      <button
                        onClick={() => terminateSession(session.id)}
                        className="btn btn-ghost btn-xs text-error"
                      >
                        <FiLogOut className="mr-1" />
                        Terminate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
