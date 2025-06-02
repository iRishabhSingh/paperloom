"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FiFile,
  FiDownload,
  FiShare2,
  FiMessageSquare,
  FiLoader,
} from "react-icons/fi";

interface PDF {
  id: string;
  title: string;
  fileName: string;
  fileSize: number;
  createdAt: string;
  comments: number;
  owner: string;
  ownerId: string;
  isOwner: boolean;
}

const RecentPDFs: React.FC = () => {
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentPDFs = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/pdfs/recent");

        if (!response.ok) {
          throw new Error("Failed to fetch PDFs");
        }

        const data = await response.json();
        setPdfs(data.pdfs);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPDFs();
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleDownload = async (pdfId: string, fileName: string) => {
    try {
      const response = await fetch(`/api/pdfs/${pdfId}/download`);
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  const handleShare = async (pdfId: string) => {
    try {
      const shareUrl = `${window.location.origin}/pdfs/${pdfId}`;

      if (navigator.share) {
        await navigator.share({
          title: "Check out this PDF",
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Sharing failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-base-300 bg-base-100 p-8 shadow-sm">
        <FiLoader className="animate-spin text-2xl text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
        <div className="text-center text-error">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-primary btn-sm mt-3 w-full"
        >
          Retry
        </button>
      </div>
    );
  }

  if (pdfs.length === 0) {
    return (
      <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent PDFs</h2>
          <Link href="/dashboard/pdfs" className="text-sm text-primary">
            View All
          </Link>
        </div>
        <div className="py-8 text-center text-base-content/60">
          No PDFs found. Upload your first PDF!
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-base-300 bg-base-100 p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent PDFs</h2>
        <Link href="/dashboard/pdfs" className="text-sm text-primary">
          View All
        </Link>
      </div>

      <div className="space-y-3">
        {pdfs.map((pdf) => (
          <div
            key={pdf.id}
            className="flex flex-col rounded-lg p-3 transition-colors duration-200 hover:bg-base-200 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start sm:items-center">
              <div className="mr-3 rounded-lg bg-primary/10 p-2">
                <FiFile className="text-xl text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-medium" title={pdf.title}>
                  {pdf.title}
                </h3>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 text-sm text-base-content/60">
                  <span className={`${pdf.isOwner ? "text-primary" : ""}`}>
                    {pdf.isOwner ? "You" : pdf.owner}
                  </span>
                  <span>{formatFileSize(pdf.fileSize)}</span>
                </div>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between sm:mt-0 sm:justify-end sm:gap-4">
              <div className="flex items-center text-sm text-base-content/60 sm:order-2">
                <span className="hidden sm:inline">
                  {formatDate(pdf.createdAt)}
                </span>
                <span className="inline sm:hidden">
                  {new Date(pdf.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center text-sm text-base-content/60 sm:hidden">
                  <FiMessageSquare className="mr-1" />
                  <span>{pdf.comments}</span>
                </div>

                <div className="flex gap-1">
                  <button
                    title="Download"
                    className="btn btn-square btn-ghost btn-sm"
                    onClick={() => handleDownload(pdf.id, pdf.fileName)}
                  >
                    <FiDownload size={18} />
                  </button>
                  <button
                    title="Share"
                    className="btn btn-square btn-ghost btn-sm"
                    onClick={() => handleShare(pdf.id)}
                  >
                    <FiShare2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentPDFs;
