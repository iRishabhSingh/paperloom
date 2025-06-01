"use client";

import toast from "react-hot-toast";
import { TbLoader2 } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { useUploadThing } from "@/utils/uploadthing";

interface PDFUploadButtonProps {
  readonly variant?: "primary" | "outline";
  readonly size?: "normal" | "large";
  onComplete?: () => void;
}

export function PDFUploadButton({
  variant = "primary",
  size = "large",
  onComplete,
}: Readonly<PDFUploadButtonProps>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const { startUpload } = useUploadThing("pdfUploader", {
    onClientUploadComplete: async (uploadedFiles) => {
      try {
        if (!uploadedFiles || uploadedFiles.length === 0) {
          throw new Error("No files were uploaded");
        }

        const uploadedFile = uploadedFiles[0];

        // Prepare the PDF data for your database
        const pdfData = {
          title: uploadedFile.name.replace(/\.pdf$/i, ""), // Remove .pdf extension
          fileName: uploadedFile.name,
          fileSize: uploadedFile.size,
          fileType: uploadedFile.type || "application/pdf",
          fileKey: uploadedFile.key,
          ufsUrl: uploadedFile.ufsUrl,
          fileHash: uploadedFile.fileHash,
        };

        // Create the PDF record in your database
        const response = await fetch("/api/pdfs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Important for sending cookies
          body: JSON.stringify(pdfData),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message ||
              errorData.error ||
              "Failed to create PDF record",
          );
        }

        const createdPdf = await response.json();
        console.log("PDF created successfully:", createdPdf);

        toast.success("PDF uploaded and saved successfully!");
        router.refresh();
        onComplete?.();
      } catch (error) {
        console.error("Error in upload process:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "An error occurred during upload",
        );
      } finally {
        setIsUploading(false);
        if (inputRef.current) inputRef.current.value = "";
        toast.dismiss("pdf-upload");
      }
    },
    onUploadError: (error) => {
      console.error("Upload error:", error);
      setIsUploading(false);
      toast.error("Failed to upload PDF");
      if (inputRef.current) inputRef.current.value = "";
      toast.dismiss("pdf-upload");
    },
    onUploadBegin: () => {
      setIsUploading(true);
      toast.loading("Uploading PDF...", { id: "pdf-upload" });
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
