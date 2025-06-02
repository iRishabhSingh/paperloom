"use client";

import { useState } from "react";
import { FiMail, FiCheck } from "react-icons/fi";
import { ShareViaEmailFormProps } from "@/types/types";

export function ShareViaEmailForm({
  pdfId,
  onCollaboratorAdded,
}: Readonly<ShareViaEmailFormProps>) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/shares", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdfId, recipientEmail: email }),
      });

      if (res.ok) {
        const data = await res.json();
        setStatus("Invitation sent!");
        setEmail("");
        if (onCollaboratorAdded) {
          onCollaboratorAdded({
            id: data.id,
            pdfId: data.pdfId ?? pdfId,
            userId: data.userId ?? "",
            canReshare: data.canReshare ?? false,
            createdAt: data.createdAt ?? new Date().toISOString(),
            user: data,
            status: "PENDING",
          });
        }
      } else {
        setStatus("Failed to send invite");
      }
    } catch (error) {
      console.error(error);
      setStatus("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-control">
        <label className="label" htmlFor="collaborator-email">
          <span className="label-text">Collaborator Email</span>
        </label>
        <input
          id="collaborator-email"
          type="email"
          placeholder="Enter email address"
          className="input input-bordered"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <button className="btn btn-primary" type="submit" disabled={isLoading}>
        {isLoading ? (
          <span className="loading loading-spinner"></span>
        ) : (
          <>
            <FiMail className="mr-2" />
            Send Invite
          </>
        )}
      </button>

      {status && (
        <div className="flex items-center gap-2 text-success">
          <FiCheck />
          <span>{status}</span>
        </div>
      )}
    </form>
  );
}
