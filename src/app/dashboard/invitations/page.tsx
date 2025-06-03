"use client";

import { useState, useEffect } from "react";
import { FiMail, FiCheck, FiX } from "react-icons/fi";

interface Invitation {
  id: string;
  pdf: {
    id: string;
    title: string;
    owner: {
      name: string;
      profileImageUrl: string | null;
    };
  };
  status: string;
}

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvitations = async () => {
      const res = await fetch("/api/invitations");
      if (res.ok) {
        const data = await res.json();
        setInvitations(data);
      }
      setLoading(false);
    };
    fetchInvitations();
  }, []);

  const handleAccept = async (invitationId: string) => {
    const res = await fetch(`/api/invitations/${invitationId}/accept`, {
      method: "POST",
    });

    if (res.ok) {
      setInvitations(invitations.filter((inv) => inv.id !== invitationId));
    }
  };

  const handleReject = async (invitationId: string) => {
    const res = await fetch(`/api/invitations/${invitationId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setInvitations(invitations.filter((inv) => inv.id !== invitationId));
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="loading loading-spinner text-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">My Invitations</h1>

      {invitations.length === 0 ? (
        <div className="py-12 text-center">
          <FiMail className="mx-auto mb-4 text-5xl text-gray-400" />
          <p className="text-xl">No pending invitations</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {invitations.map((invitation) => (
            <div key={invitation.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">{invitation.pdf.title}</h2>
                <p>
                  Shared by:{" "}
                  <span className="font-semibold">
                    {invitation.pdf.owner.name}
                  </span>
                </p>

                <div className="card-actions mt-4 justify-end">
                  <button
                    className="btn btn-error"
                    onClick={() => handleReject(invitation.id)}
                  >
                    <FiX className="mr-2" /> Reject
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={() => handleAccept(invitation.id)}
                  >
                    <FiCheck className="mr-2" /> Accept
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
