"use client";

import React, { useState, useEffect } from "react";
import { FiEdit, FiSave, FiX, FiUser, FiMail, FiGlobe } from "react-icons/fi";
import Image from "next/image";

const ProfilePage = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    firstName: "",
    lastName: "",
    region: "",
    createdAt: "",
    twoFAEnabled: false,
    profileImageUrl: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [tempData, setTempData] = useState({ ...userData });

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          setUserData({
            name: data.name ?? `${data.firstName} ${data.lastName}`,
            email: data.email,
            firstName: data.firstName ?? "",
            lastName: data.lastName ?? "",
            region: data.region ?? "",
            createdAt: data.createdAt,
            twoFAEnabled: data.twoFAEnabled,
            profileImageUrl: data.profileImageUrl ?? "",
          });
          setTempData({
            name: data.name ?? `${data.firstName} ${data.lastName}`,
            email: data.email,
            firstName: data.firstName ?? "",
            lastName: data.lastName ?? "",
            region: data.region ?? "",
            createdAt: data.createdAt,
            twoFAEnabled: data.twoFAEnabled,
            profileImageUrl: data.profileImageUrl ?? "",
          });
        } else {
          setError("Failed to fetch user data");
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempData({ ...userData });
    setError("");
    setSuccess("");
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      const response = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: tempData.firstName,
          lastName: tempData.lastName,
          region: tempData.region,
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUserData({
          ...userData,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          name:
            updatedUser.name ??
            `${updatedUser.firstName} ${updatedUser.lastName}`,
          region: updatedUser.region,
        });
        setIsEditing(false);
        setSuccess("Profile updated successfully!");
      } else {
        const errorData = await response.json();
        setError(errorData.message ?? "Failed to update profile");
      }
    } catch (err) {
      console.error("Update error:", err);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleTwoFA = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/two-factor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enable: !userData.twoFAEnabled,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setUserData((prev) => ({
          ...prev,
          twoFAEnabled: result.enabled,
        }));
        setTempData((prev) => ({
          ...prev,
          twoFAEnabled: result.enabled,
        }));
        setSuccess(result.message ?? "Two-Factor Authentication updated");
      } else {
        const errorData = await response.json();
        setError(errorData.message ?? "Failed to update 2FA settings");
      }
    } catch (err) {
      console.error("2FA toggle error:", err);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h3 className="text-3xl font-bold">Profile</h3>
        {isEditing ? (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="btn btn-ghost"
              disabled={isLoading}
            >
              <FiX className="mr-2" /> Cancel
            </button>
            <button
              onClick={handleSave}
              className="btn btn-primary"
              disabled={isLoading}
            >
              <FiSave className="mr-2" />
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        ) : (
          <button onClick={handleEdit} className="btn btn-outline">
            <FiEdit className="mr-2" /> Edit Profile
          </button>
        )}
      </div>

      {error && (
        <div className="alert alert-error mb-6">
          <div>
            <span>{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="alert alert-success mb-6">
          <div>
            <span>{success}</span>
          </div>
        </div>
      )}

      <div className="alert mb-8 bg-base-200">
        <span>
          This Profile page is not functional yet. Please check back later.
        </span>
      </div>

      <div className="mb-8 rounded-xl bg-base-100 p-6 shadow-lg">
        <div className="flex flex-col items-center gap-8 md:flex-row">
          <div className="flex-shrink-0">
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-5xl text-primary-content">
              {userData.profileImageUrl ? (
                <Image
                  width={128}
                  height={128}
                  src={userData.profileImageUrl}
                  alt="Profile"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <FiUser />
              )}
            </div>
          </div>

          <div className="flex-grow">
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="label">
                      <span className="label-text">First Name</span>
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      name="firstName"
                      value={tempData.firstName}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="label">
                      <span className="label-text">Last Name</span>
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      name="lastName"
                      value={tempData.lastName}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="region" className="label">
                    <span className="label-text">Region</span>
                  </label>
                  <input
                    id="region"
                    type="text"
                    name="region"
                    value={tempData.region}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    placeholder="e.g., United States"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">{userData.name}</h2>
                <div className="flex items-center gap-2 text-base-content/70">
                  <FiMail className="text-base-content/70" />
                  <span>{userData.email}</span>
                </div>
                <div className="flex items-center gap-2 text-base-content/70">
                  <FiGlobe className="text-base-content/70" />
                  <span>{userData.region ?? "Not specified"}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl bg-base-100 p-6 shadow-lg">
          <h3 className="mb-4 text-xl font-bold">Account Information</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-base-content/70">Account Created</p>
              <p>{formatDate(userData.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-base-content/70">Email Verification</p>
              <p className="text-success">Verified</p>
            </div>
            <div>
              <p className="text-sm text-base-content/70">
                Two-Factor Authentication
              </p>
              <div className="flex items-center gap-2">
                <span
                  className={
                    userData.twoFAEnabled ? "text-success" : "text-warning"
                  }
                >
                  {userData.twoFAEnabled ? "Enabled" : "Disabled"}
                </span>
                <button
                  onClick={toggleTwoFA}
                  className="btn btn-outline btn-xs"
                  disabled={isLoading}
                >
                  {userData.twoFAEnabled ? "Disable" : "Enable"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-base-100 p-6 shadow-lg">
          <h3 className="mb-4 text-xl font-bold">Security</h3>
          <div className="space-y-4">
            <button className="btn btn-outline btn-block">
              Change Password
            </button>
            <button className="btn btn-outline btn-block">
              Manage Connected Devices
            </button>
            <button className="btn btn-outline btn-block">
              View Login History
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-xl bg-base-100 p-6 shadow-lg">
        <h3 className="mb-4 text-xl font-bold">Danger Zone</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Delete Account</p>
              <p className="text-sm text-base-content/70">
                Permanently delete your account and all associated data
              </p>
            </div>
            <button className="btn btn-outline btn-error">
              Delete Account
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Export Data</p>
              <p className="text-sm text-base-content/70">
                Download all your data in a ZIP file
              </p>
            </div>
            <button className="btn btn-outline">Export Data</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
