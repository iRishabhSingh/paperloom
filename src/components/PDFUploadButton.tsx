"use client";

import toast from "react-hot-toast";
import { TbLoader2 } from "react-icons/tb";
import { useUploadThing } from "@/utils/uploadthing";
import { PDFUploadButtonProps } from "@/types/types";
import { useCallback, useRef, useState } from "react";

export function PDFUploadButton({
  variant = "primary",
  onUploadComplete,
  size = "large",
}: Readonly<PDFUploadButtonProps>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { startUpload } = useUploadThing("pdfUploader", {
    onClientUploadComplete: async (files) => {
      toast.dismiss("upload");
      setIsUploading(false);

      const uploaded = files?.[0];
      if (!uploaded) {
        toast.error("No file uploaded.");
        return;
      }

      // Send metadata to your own API
      const response = await fetch("/api/pdfs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: uploaded.name.replace(/\\.pdf$/i, ""),
          fileName: uploaded.name,
          fileSize: uploaded.size,
          fileType: uploaded.type,
          fileKey: uploaded.key,
          ufsUrl: uploaded.ufsUrl,
          fileHash: uploaded.fileHash,
        }),
      });

      if (!response.ok) {
        toast.error("Failed to save PDF to database.");
        return;
      }

      const pdf = await response.json();
      toast.success("PDF uploaded successfully!");
      if (onUploadComplete) {
        onUploadComplete(pdf.id); // 🔁 Send back the PDF ID
      }
    },

    onUploadBegin: () => {
      setIsUploading(true);
      toast.loading("Uploading PDF...", { id: "upload" });
    },

    onUploadError: () => {
      toast.dismiss("upload");
      setIsUploading(false);
      toast.error("Upload failed");
    },
  });

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (!selectedFile) return;

      // Validate file type
      const isPdf =
        selectedFile.type === "application/pdf" ||
        selectedFile.name.toLowerCase().endsWith(".pdf");

      if (!isPdf) {
        toast.error("Please upload a PDF file");
        if (inputRef.current) inputRef.current.value = "";
        return;
      }

      try {
        await startUpload([selectedFile]);
      } catch (error) {
        console.error("Upload initialization error:", error);
        setIsUploading(false);
        if (inputRef.current) inputRef.current.value = "";
        toast.dismiss("pdf-upload");
        toast.error("Failed to start upload");
      }
    },
    [startUpload],
  );

  // Button styling classes
  const baseClasses =
    "btn rounded-full transition-all w-24 sm:w-28 md:w-32 lg:w-36 xl:w-40";
  const variantClasses =
    variant === "primary"
      ? "btn-primary text-white shadow-md hover:shadow-xl hover:bg-primary/90"
      : "btn-outline border-2";
  const sizeClasses =
    size === "large" ? "md:btn-lg px-8 py-3 text-lg" : "px-6 py-2";
  const stateClasses = isUploading
    ? "opacity-80 cursor-not-allowed"
    : "cursor-pointer";

  return (
    <div className="inline-block">
      <input
        title="Upload PDF"
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept=".pdf,application/pdf"
        className="hidden"
        disabled={isUploading}
      />

      <button
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
        className={`${baseClasses} ${variantClasses} ${sizeClasses} ${stateClasses}`}
      >
        {isUploading ? (
          <span className="flex items-center gap-2">
            <TbLoader2 className="h-5 w-5 animate-spin" />
          </span>
        ) : (
          "Upload PDF"
        )}
      </button>
    </div>
  );
}
