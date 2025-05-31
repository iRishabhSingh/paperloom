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
    onClientUploadComplete: () => {
      setIsUploading(false);
      toast.success("PDF uploaded successfully!");
      if (inputRef.current) inputRef.current.value = "";
      onComplete?.();
      router.refresh();
    },
    onUploadError: () => {
      setIsUploading(false);
      toast.error("PDF upload failed");
      if (inputRef.current) inputRef.current.value = "";
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

      try {
        await startUpload([selectedFile]);
        toast.dismiss("pdf-upload");
      } catch (error) {
        toast.dismiss("pdf-upload");
        toast.error("Upload failed unexpectedly");
        console.error("Upload error:", error);
        setIsUploading(false);
        if (inputRef.current) inputRef.current.value = "";
      }
    },
    [startUpload],
  );

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
        accept=".pdf"
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
