"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { FiMail, FiCheck, FiX, FiUsers, FiFile } from "react-icons/fi";

interface Collaboration {
  id: string;
  status: "PENDING" | "ACCEPTED";
  createdAt: string;
  pdf: {
    id: string;
    title: string;
    owner: {
      id: string;
      name: string;
      email: string;
    };
  };
}

export default function CollaborationsPage() {
  const [pendingInvites, setPendingInvites] = useState<Collaboration[]>([]);
  const [activeCollaborations, setActiveCollaborations] = useState<
    Collaboration[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCollaborations = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/collaborations/me", {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setPendingInvites(data.pendingInvites);
        setActiveCollaborations(data.activeCollaborations);
      } else {
        throw new Error("Failed to fetch collaborations");
      }
    } catch (error) {
      toast.error("Failed to load collaborations");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCollaborations();
  }, []);

  const handleAcceptInvite = async (inviteId: string) => {
    try {
      const res = await fetch(`/api/collaborations/me/${inviteId}/accept`, {
        method: "PATCH",
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Invitation accepted!");
        fetchCollaborations(); // Refresh the list
      } else {
        throw new Error("Failed to accept invitation");
      }
    } catch (error) {
      toast.error("Failed to accept invitation");
      console.error(error);
    }
  };

  const handleRejectInvite = async (inviteId: string) => {
    try {
      const res = await fetch(`/api/collaborations/me/${inviteId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Invitation declined");
        fetchCollaborations(); // Refresh the list
      } else {
        throw new Error("Failed to decline invitation");
      }
    } catch (error) {
      toast.error("Failed to decline invitation");
      console.error(error);
    }
  };

  const handleLeaveCollaboration = async (collabId: string) => {
    try {
      const res = await fetch(`/api/collaborations/me/${collabId}/leave`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Left collaboration successfully");
        fetchCollaborations(); // Refresh the list
      } else {
        throw new Error("Failed to leave collaboration");
      }
    } catch (error) {
      toast.error("Failed to leave collaboration");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Collaborations</h1>

      {/* Pending Invites */}
      <div className="mb-12">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <FiMail className="text-primary" /> Pending Invites
        </h2>

        {pendingInvites.length === 0 ? (
          <div className="rounded-xl bg-base-200 p-6 text-center">
            <p className="text-base-content/60">No pending invitations</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pendingInvites.map((invite) => (
              <div
                key={invite.id}
                className="rounded-xl border border-base-300 bg-base-100 p-4 shadow-sm"
              >
                <div className="mb-3 flex items-center gap-3">
                  <FiFile className="text-xl text-primary" />
                  <div>
                    <h3 className="truncate font-medium">{invite.pdf.title}</h3>
                    <p className="text-sm text-base-content/60">
                      Shared by:{" "}
                      {invite.pdf.owner.name || invite.pdf.owner.email}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    className="btn btn-success btn-sm flex-1"
                    onClick={() => handleAcceptInvite(invite.id)}
                  >
                    <FiCheck className="mr-1" /> Accept
                  </button>
                  <button
                    className="btn btn-error btn-sm flex-1"
                    onClick={() => handleRejectInvite(invite.id)}
                  >
                    <FiX className="mr-1" /> Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Collaborations */}
      <div>
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <FiUsers className="text-primary" /> Active Collaborations
        </h2>

        {activeCollaborations.length === 0 ? (
          <div className="rounded-xl bg-base-200 p-6 text-center">
            <p className="text-base-content/60">No active collaborations</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeCollaborations.map((collab) => (
              <div
                key={collab.id}
                className="rounded-xl border border-base-300 bg-base-100 p-4 shadow-sm"
              >
                <div className="mb-3 flex items-center gap-3">
                  <FiFile className="text-xl text-primary" />
                  <div>
                    <h3 className="truncate font-medium">{collab.pdf.title}</h3>
                    <p className="text-sm text-base-content/60">
                      Owner: {collab.pdf.owner.name || collab.pdf.owner.email}
                    </p>
                    <p className="text-xs text-success">
                      <FiCheck className="mr-1 inline" />
                      Accepted on{" "}
                      {new Date(collab.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/dashboard/pdfs/${collab.pdf.id}/chat`}
                    className="btn btn-primary btn-sm flex-1"
                  >
                    Go to Chat
                  </Link>
                  <button
                    className="btn btn-outline btn-error btn-sm flex-1"
                    onClick={() => handleLeaveCollaboration(collab.id)}
                  >
                    Leave
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
