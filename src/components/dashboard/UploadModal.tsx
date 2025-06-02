"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadModalProps } from "@/types/types";
import { FiX, FiCheck, FiMail, FiMessageSquare } from "react-icons/fi";
import { ShareViaEmailForm } from "@/components/dashboard/ShareViaEmailForm";

export function UploadModal({
  onClose,
  isOpen,
  pdfId,
}: Readonly<UploadModalProps>) {
  const router = useRouter();
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-xl bg-base-100 p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {step === 1 ? "Upload Complete" : "Share PDF"}
          </h2>
          <button
            onClick={onClose}
            className="btn btn-circle btn-ghost btn-sm"
            aria-label="Close"
          >
            <FiX size={20} />
          </button>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center justify-center text-success">
              <div className="rounded-full bg-success/10 p-3">
                <FiCheck size={32} />
              </div>
            </div>
            <p className="text-center">
              Your PDF has been uploaded successfully!
            </p>
            <div className="flex gap-3">
              <button
                className="btn btn-outline flex-1"
                onClick={() => setStep(2)}
              >
                <FiMail className="mr-2" />
                Add Collaborators
              </button>
              <button
                className="btn btn-primary flex-1"
                onClick={() => {
                  router.push(`/dashboard/pdfs/${pdfId}/chat`);
                  onClose();
                }}
              >
                <FiMessageSquare className="mr-2" />
                Go to Chat
              </button>
            </div>
          </div>
        )}

        {step === 2 && pdfId && (
          <div className="space-y-4">
            <ShareViaEmailForm pdfId={pdfId} />
            <div className="flex justify-end gap-3">
              <button className="btn btn-outline" onClick={onClose}>
                Skip
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  router.push(`/dashboard/pdfs/${pdfId}/chat`);
                  onClose();
                }}
              >
                Go to Chat
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
