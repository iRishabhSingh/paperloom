"use client";

import { FaUser, FaTimes } from "react-icons/fa";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

interface Step1Props {
  formData: {
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageChange: (file: File | null) => void;
}

export default function Step1({
  formData,
  onChange,
  onImageChange,
}: Readonly<Step1Props>) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    formData.profileImageUrl ?? null,
  );

  // Handle image selection
  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate image type
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onImageChange(file);
    },
    [onImageChange],
  );

  // Handle image removal
  const handleRemoveImage = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setPreviewUrl(null);
      onImageChange(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [onImageChange],
  );

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div className="space-y-4">
      <div className="mb-4 flex justify-center">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
          id="profileImage"
        />

        <label htmlFor="profileImage" className="group relative cursor-pointer">
          <span className="sr-only">Upload profile image</span>
          <div className="avatar">
            <div className="relative w-24 rounded-full bg-base-200">
              {previewUrl ? (
                <Image
                  width={96}
                  height={96}
                  src={previewUrl}
                  alt="Profile preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <FaUser className="text-4xl text-gray-400" />
                </div>
              )}

              {/* Remove button */}
              {previewUrl && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Remove image"
                >
                  <FaTimes size={14} />
                </button>
              )}

              {/* Edit overlay */}
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-30 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="text-xs font-medium text-white">Edit</span>
              </div>
            </div>
          </div>
        </label>
      </div>

      {/* ... rest of the form (first name/last name inputs) ... */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="form-control">
          <label className="label" htmlFor="firstName">
            <span className="label-text">First Name*</span>
          </label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={onChange}
            className="input input-bordered"
            placeholder="John"
            required
          />
        </div>

        <div className="form-control">
          <label className="label" htmlFor="lastName">
            <span className="label-text">Last Name*</span>
          </label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={onChange}
            className="input input-bordered"
            placeholder="Doe"
            required
          />
        </div>
      </div>
    </div>
  );
}
