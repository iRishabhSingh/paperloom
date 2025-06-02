"use client";

import React, { useState } from "react";
import { FiDownload, FiTrash2 } from "react-icons/fi";

const AccountSettings = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const exportData = async () => {
    try {
      const response = await fetch("/api/users/export-data");
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "paperloom-data-export.zip";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Data export failed:", error);
    }
  };

  const deleteAccount = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch("/api/users/me", {
        method: "DELETE",
      });

      if (response.ok) {
        // Redirect to login or homepage
      }
    } catch (error) {
      console.error("Account deletion failed:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Data Export */}
      <div>
        <h3 className="mb-2 font-medium">Export Your Data</h3>
        <p className="mb-4 text-base-content/70">
          Download a copy of all your PDFs and comments in a ZIP archive.
        </p>
        <button onClick={exportData} className="btn btn-outline">
          <FiDownload className="mr-2" />
          Export Data
        </button>
      </div>

      {/* Account Deletion */}
      <div>
        <h3 className="mb-2 font-medium">Delete Account</h3>
        <p className="mb-4 text-base-content/70">
          Permanently delete your account and all associated data. This action
          cannot be undone.
        </p>
        <button
          onClick={() => setShowDeleteConfirmation(true)}
          className="btn btn-error"
        >
          <FiTrash2 className="mr-2" />
          Delete Account
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Confirm Account Deletion</h3>
            <p className="py-4">
              Are you sure you want to permanently delete your account? All your
              PDFs, comments, and account data will be removed immediately and
              cannot be recovered.
            </p>
            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => setShowDeleteConfirmation(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-error"
                onClick={deleteAccount}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Delete Account"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;
