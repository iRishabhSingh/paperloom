"use client";

import { useState } from "react";

export default function PdfViewer({ url }: { readonly url: string }) {
  const [numPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  return (
    <div className="flex h-full min-h-48 flex-col overflow-hidden rounded-lg border bg-base-100">
      <div className="flex items-center justify-between border-b bg-base-200 p-2">
        <div className="flex items-center gap-2">
          <button
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
            className="btn btn-ghost btn-xs"
          >
            ←
          </button>
          <span className="text-sm">
            Page {pageNumber} {numPages && `of ${numPages}`}
          </span>
          <button
            disabled={!!numPages && pageNumber >= numPages}
            onClick={() => setPageNumber((prev) => prev + 1)}
            className="btn btn-ghost btn-xs"
          >
            →
          </button>
        </div>
        <a href={url} download className="btn btn-primary btn-xs">
          Download
        </a>
      </div>

      <div className="flex-1 overflow-auto">
        <iframe
          src={`${url}#page=${pageNumber}`}
          className="h-full w-full"
          title="PDF Viewer"
        />
      </div>
    </div>
  );
}
