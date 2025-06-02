"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PdfViewer from "@/components/dashboard/PdfViewer";
import { FiChevronLeft, FiUsers, FiMessageSquare } from "react-icons/fi";
import { ShareViaEmailForm } from "@/components/dashboard/ShareViaEmailForm";
import { PDFOverviewProps, SharedUser, User } from "@/types/types";

export default function PDFOverview({
  pdf,
  userId,
  basePath,
}: Readonly<PDFOverviewProps>) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("preview");
  const [collaborators, setCollaborators] = useState(pdf.sharedUsers || []);

  const handleCollaboratorAdded = (
    newCollaborator: SharedUser & { user: User },
  ) => {
    setCollaborators([...collaborators, newCollaborator]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/dashboard/pdfs")}
          className="btn btn-ghost"
        >
          <FiChevronLeft className="mr-1" /> Back to PDFs
        </button>
        <div className="flex gap-2">
          <button
            className="btn btn-primary"
            onClick={() => router.push(`${basePath}/chat`)}
          >
            <FiMessageSquare className="mr-2" />
            Go to Chat
          </button>
        </div>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{pdf.title}</h1>
          <p className="text-base-content/60">
            {new Date(pdf.createdAt).toLocaleDateString()}
            {pdf.ownerId === userId ? " • You own this document" : ""}
          </p>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab-bordered tab ${activeTab === "preview" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("preview")}
        >
          Preview
        </button>
        <button
          className={`tab-bordered tab ${activeTab === "collaborators" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("collaborators")}
        >
          <FiUsers className="mr-1" />
          Collaborators
        </button>
      </div>

      {activeTab === "preview" && (
        <div className="rounded-xl border border-base-300 bg-base-100 p-4">
          <PdfViewer url={pdf.ufsUrl} />
        </div>
      )}

      {activeTab === "collaborators" && (
        <div className="space-y-6">
          {pdf.ownerId === userId && (
            <div className="rounded-xl border border-base-300 bg-base-100 p-6">
              <h3 className="mb-4 text-lg font-semibold">Add Collaborator</h3>
              <ShareViaEmailForm
                pdfId={pdf.id}
                onCollaboratorAdded={handleCollaboratorAdded}
              />
            </div>
          )}

          <div className="rounded-xl border border-base-300 bg-base-100 p-6">
            <h3 className="mb-4 text-lg font-semibold">
              Current Collaborators
            </h3>
            {collaborators.length === 0 ? (
              <p className="text-base-content/60">No collaborators yet</p>
            ) : (
              <ul className="space-y-3">
                {collaborators.map((collab: SharedUser & { user: User }) => (
                  <li
                    key={collab.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{collab.user.email}</p>
                      <p className="text-sm text-base-content/60">
                        {collab.status === "ACCEPTED" ? "Accepted" : "Pending"}
                      </p>
                    </div>
                    {pdf.ownerId === userId && collab.status !== "ACCEPTED" && (
                      <button className="btn btn-ghost btn-sm text-error">
                        Remove
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
