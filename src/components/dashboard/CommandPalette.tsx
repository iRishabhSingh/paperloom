"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FiSearch, FiX, FiFile, FiUser } from "react-icons/fi";

interface PdfOwner {
  name: string;
}

interface PdfResult {
  id: string;
  title?: string;
  fileName: string;
  owner?: PdfOwner;
  ownerId?: string;
  fileSize?: number;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
}) => {
  const [results, setResults] = useState<PdfResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isOpen) return;

    const searchPdfs = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/dashboard?q=${encodeURIComponent(searchQuery)}`,
        );
        if (response.ok) {
          const data = await response.json();
          setResults(data);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      if (searchQuery.trim()) {
        searchPdfs();
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, isOpen]);

  const handleResultClick = (pdfId: string) => {
    onClose();
    router.push(`/dashboard/pdf/${pdfId}`);
  };

  const renderResults = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center p-8">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      );
    }

    if (results.length > 0) {
      return (
        <ul>
          {results.map((pdf) => (
            <li key={pdf.id}>
              <button
                type="button"
                onClick={() => handleResultClick(pdf.id)}
                className="flex w-full items-center gap-4 rounded-md p-4 text-left hover:bg-base-200"
              >
                <FiFile className="flex-shrink-0 text-primary" size={24} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">
                    {pdf.title ?? pdf.fileName}
                  </p>
                  <p className="flex items-center gap-1 truncate text-sm text-base-content/70">
                    <FiUser size={14} />
                    {pdf.owner?.name ?? "You"}
                    {/* Show collaboration badge */}
                    {!pdf.owner ? (
                      <span className="ml-2 rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-800">
                        Collaborator
                      </span>
                    ) : null}
                  </p>
                </div>
                {pdf.fileSize && (
                  <span className="text-sm text-base-content/50">
                    {(pdf.fileSize / 1024 / 1024).toFixed(1)}MB
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      );
    }

    if (searchQuery) {
      return (
        <div className="py-12 text-center text-base-content/50">
          No matching PDFs found
        </div>
      );
    }

    return (
      <div className="py-12 text-center text-base-content/50">
        <FiSearch size={48} className="mx-auto mb-4 opacity-30" />
        <p>Search for PDFs by name</p>
        <p className="mt-2 text-sm">Owned by you or shared with you</p>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      aria-label="Close command palette"
      className="fixed inset-0 z-50 flex justify-center bg-black/50 pt-24"
    >
      <div
        className="max-h-[70vh] w-full max-w-2xl overflow-hidden rounded-lg border border-base-300 bg-base-100 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            onClose();
          }
        }}
      >
        <div className="relative border-b border-base-300">
          <FiSearch className="absolute left-4 top-4 text-base-content/70" />
          <input
            type="text"
            placeholder="Search PDFs you own or collaborate on..."
            className="w-full bg-base-100 p-4 pl-12 pr-16 text-lg focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-sm absolute right-4 top-4"
            aria-label="Close search"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {renderResults()}
        </div>

        <div className="flex justify-between border-t border-base-300 p-3 text-sm text-base-content/50">
          <span>↑↓ Navigate</span>
          <span>↵ Open</span>
          <span>Esc Close</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
