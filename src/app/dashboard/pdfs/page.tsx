"use client";

import { PDF } from "@/types";
import toast from "react-hot-toast";
import { FiFile } from "react-icons/fi";
import { useEffect, useState } from "react";
import PDFCard from "@/components/dashboard/PDFCard";
import { PDFUploadButton } from "@/components/PDFUploadButton";
import { UploadModal } from "@/components/dashboard/UploadModal";

export default function PDFsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedPdfId, setUploadedPdfId] = useState<string | null>(null);
  const [pdfs, setPdfs] = useState<PDF[]>([]); // Replace with your actual PDF type

  // Fetch user's PDFs on mount
  const fetchPDFs = async () => {
    const res = await fetch("/api/pdfs", { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      setPdfs(data);
    }
  };
  useEffect(() => {
    fetchPDFs();
  }, []);

  // Add this function inside the PDFsPage component
  const handleDeletePDF = async (pdfId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this PDF? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/pdfs/${pdfId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setPdfs(pdfs.filter((pdf) => pdf.id !== pdfId));
        toast.success("PDF deleted successfully");
      } else {
        throw new Error("Failed to delete PDF");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete PDF");
    }
  };

  const handleUploadComplete = (pdfId: string) => {
    setUploadedPdfId(pdfId);
    setIsModalOpen(true);
    fetchPDFs();
    toast.success("PDF uploaded successfully!");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My PDFs</h1>
        <PDFUploadButton
          onUploadComplete={handleUploadComplete}
          size="normal"
          variant="primary"
        />
      </div>

      {pdfs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-base-300 bg-base-100 p-12 text-center">
          <FiFile className="mb-4 text-6xl text-base-content/30" />
          <h2 className="mb-2 text-xl font-semibold">No PDFs yet</h2>
          <p className="mb-6 text-base-content/60">
            Upload your first PDF to get started
          </p>
          <PDFUploadButton
            onUploadComplete={handleUploadComplete}
            size="large"
            variant="primary"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pdfs.map((pdf) => (
            <PDFCard
              key={pdf.id}
              pdf={pdf}
              onDelete={() => handleDeletePDF(pdf.id)}
            />
          ))}
        </div>
      )}

      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pdfId={uploadedPdfId}
      />
    </div>
  );
}
