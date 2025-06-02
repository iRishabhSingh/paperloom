"use client";
import Image from "next/image";
import React, { useState } from "react";
import { FiUser, FiMail, FiSave } from "react-icons/fi";

interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
}

const ProfileForm = () => {
  const [profile, setProfile] = useState<UserProfile>({
    name: "John Doe",
    email: "john.doe@example.com",
    avatarUrl: "/default-avatar.png",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        // Show success message
        import("react-hot-toast").then(({ toast }) => {
          toast.success("Profile updated successfully!");
        });
      } else {
        // Handle error
        import("react-hot-toast").then(({ toast }) => {
          toast.error("Failed to update profile.");
        });
      }
    } catch (error) {
      console.error("Profile update failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center gap-6 md:flex-row">
        <div className="avatar">
          <div className="w-24 rounded-full border-2 border-primary bg-base-200">
            <Image
              src={profile.avatarUrl ?? "/default-avatar.png"}
              alt="Profile"
              className="object-cover"
              width={96}
              height={96}
              priority
            />
          </div>
        </div>

        <div className="flex-1">
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => document.getElementById("avatar-upload")?.click()}
          >
            Change Avatar
          </button>
          <input
            type="file"
            title="Upload Avatar"
            id="avatar-upload"
            className="hidden"
            accept="image/*"
            onChange={() => console.log("Avatar upload")} // Implement upload
          />
          <p className="mt-2 text-sm text-base-content/70">
            JPG, PNG or GIF. Max size 2MB.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="form-control">
          <label htmlFor="name" className="label">
            <span className="label-text">Full Name</span>
          </label>
          <label className="input-group">
            <span className="bg-base-200">
              <FiUser />
            </span>
            <input
              id="name"
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Your name"
              required
            />
          </label>
        </div>

        <div className="form-control">
          <label htmlFor="email" className="label">
            <span className="label-text">Email Address</span>
          </label>
          <label className="input-group">
            <span className="bg-base-200">
              <FiMail />
            </span>
            <input
              id="email"
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="your@email.com"
              required
            />
          </label>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <>
              <FiSave className="mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
