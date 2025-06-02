"use client";

import Link from "next/link";
import router from "next/router";
import toast from "react-hot-toast";
import { PDFCardProps } from "@/types/types";
import { FiFile, FiDownload, FiShare2, FiTrash } from "react-icons/fi";

export default function PDFCard({ pdf, onDelete }: Readonly<PDFCardProps>) {
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  // In your PDFOverview component
  const handleDownload = async (pdfId: string, fileName: string) => {
    try {
      const res = await fetch(`/api/pdfs/${pdfId}/download`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to get download URL");

      const { downloadUrl } = await res.json();

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download PDF");
    }
  };

  return (
    <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-start">
        <div className="mr-4 rounded-lg bg-primary/10 p-3">
          <FiFile className="text-xl text-primary" />
        </div>
        <div>
          <Link href={`/dashboard/pdfs/${pdf.id}`}>
            <h3 className="font-medium hover:text-primary">{pdf.title}</h3>
          </Link>
          <p className="mt-1 text-sm text-base-content/60">
            {formatFileSize(pdf.fileSize)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-base-content/60">
          {new Date(pdf.createdAt).toLocaleDateString()}
        </div>

        <div className="flex gap-2">
          <button
            title="Download"
            className="btn btn-circle btn-ghost btn-sm"
            onClick={() => handleDownload(pdf.id, pdf.fileName)}
          >
            <FiDownload size={16} />
          </button>
          <button
            title="Share"
            className="btn btn-circle btn-ghost btn-sm"
            onClick={() =>
              router.push(`/dashboard/pdfs/${pdf.id}#collaborators`)
            }
          >
            <FiShare2 size={16} />
          </button>
          <button
            title="Delete"
            className="btn btn-circle btn-ghost btn-sm text-error"
            onClick={onDelete}
          >
            <FiTrash size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
