import React from "react";
import ProfileForm from "./ProfileForm";
import SecuritySettings from "./SecuritySettings";
import NotificationsForm from "./NotificationsForm";
import AccountSettings from "./AccountSettings";

const SettingsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Account Settings</h1>

      <div className="alert mb-8 bg-base-200">
        <span>
          This settings is not available yet. Please check back later.
        </span>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Profile Section */}
        <section className="rounded-xl bg-base-100 p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold">Profile Information</h2>
          <ProfileForm />
        </section>

        {/* Security Section */}
        <section className="rounded-xl bg-base-100 p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold">Security Settings</h2>
          <SecuritySettings />
        </section>

        {/* Notifications Section */}
        <section className="rounded-xl bg-base-100 p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold">
            Notification Preferences
          </h2>
          <NotificationsForm />
        </section>

        {/* Account Management */}
        <section className="rounded-xl bg-base-100 p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold">Account Management</h2>
          <AccountSettings />
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
