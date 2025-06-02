import React from "react";
import Link from "next/link";
import { FiFile, FiDownload, FiShare2, FiMessageSquare } from "react-icons/fi";

interface PDF {
  id: string;
  title: string;
  fileName: string;
  fileSize: number;
  createdAt: string;
  comments: number;
  owner: string;
}

const RecentPDFs: React.FC = () => {
  // Mock data - in real app you'd fetch from API
  const pdfs: PDF[] = [
    {
      id: "1",
      title: "Project Proposal",
      fileName: "project-proposal.pdf",
      fileSize: 2456789,
      createdAt: "2023-10-15T14:30:00Z",
      comments: 8,
      owner: "John Doe",
    },
    {
      id: "2",
      title: "Financial Report Q3",
      fileName: "financial-report-q3.pdf",
      fileSize: 1876543,
      createdAt: "2023-10-10T09:15:00Z",
      comments: 3,
      owner: "Jane Smith",
    },
    {
      id: "3",
      title: "User Research Findings",
      fileName: "user-research-2023.pdf",
      fileSize: 3210987,
      createdAt: "2023-10-05T16:45:00Z",
      comments: 12,
      owner: "You",
    },
    {
      id: "4",
      title: "Product Roadmap",
      fileName: "product-roadmap-2024.pdf",
      fileSize: 2987654,
      createdAt: "2023-10-01T11:20:00Z",
      comments: 5,
      owner: "Alex Johnson",
    },
  ];

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent PDFs</h2>
        <Link href="/dashboard/pdfs" className="text-sm text-primary">
          View All
        </Link>
      </div>

      <div className="space-y-4">
        {pdfs.map((pdf) => (
          <div
            key={pdf.id}
            className="flex items-center justify-between rounded-lg p-3 transition-colors duration-200 hover:bg-base-200"
          >
            <div className="flex items-center">
              <div className="mr-4 rounded-lg bg-primary/10 p-2">
                <FiFile className="text-xl text-primary" />
              </div>
              <div>
                <h3 className="font-medium">{pdf.title}</h3>
                <div className="mt-1 flex items-center text-sm text-base-content/60">
                  <span className="mr-3">{pdf.owner}</span>
                  <span>•</span>
                  <span className="ml-3">{formatFileSize(pdf.fileSize)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center text-sm text-base-content/60">
                <FiMessageSquare className="mr-1" />
                <span>{pdf.comments}</span>
              </div>
              <span className="text-base-content/30">|</span>
              <span className="text-sm text-base-content/60">
                {formatDate(pdf.createdAt)}
              </span>
              <div className="ml-2 flex space-x-2">
                <button
                  title="Download"
                  className="btn btn-square btn-ghost btn-sm"
                >
                  <FiDownload size={18} />
                </button>
                <button
                  title="Share"
                  className="btn btn-square btn-ghost btn-sm"
                >
                  <FiShare2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentPDFs;
