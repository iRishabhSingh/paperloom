"use client";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FiSend, FiChevronLeft } from "react-icons/fi";
import PdfViewer from "@/components/dashboard/PdfViewer";
import { PDFChatViewProps, GroupMessage } from "@/types/types";
import { useState, useEffect, useRef, useCallback } from "react";

export function PDFChatView({ pdf }: Readonly<PDFChatViewProps>) {
  const router = useRouter();
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/comments?pdfId=${pdf.id}`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch {
      toast.error("Failed to load messages");
    }
  }, [pdf.id]);

  useEffect(() => {
    fetchMessages();
  }, [pdf.id, fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pdfId: pdf.id,
          content: newMessage,
        }),
        credentials: "include",
      });

      if (res.ok) {
        setNewMessage("");
        fetchMessages(); // Refresh messages
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.push(`/dashboard/pdfs/${pdf.id}`)}
        className="btn btn-ghost"
      >
        <FiChevronLeft className="mr-1" /> Back to Overview
      </button>

      <div className="flex h-[calc(100vh-180px)] flex-col gap-6 lg:flex-row">
        <div className="h-full lg:w-1/2">
          <PdfViewer url={pdf.ufsUrl} />
        </div>

        <div className="flex flex-col rounded-xl border bg-base-100 lg:w-1/2">
          <div className="border-b p-4 font-semibold">Document Chat</div>

          <div className="flex-1 overflow-y-auto p-4">
            {messages.map((message: GroupMessage) => (
              <div key={message.id} className="mb-4">
                <div className="flex items-start gap-3">
                  <div className="avatar placeholder">
                    <div className="w-8 rounded-full bg-neutral text-neutral-content">
                      <span className="text-xs">
                        {
                          // message.sender?.name?.charAt(0) ?? "U"
                          "U"
                        }
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">
                      {
                        // message.sender?.name ?? message.guestName ?? "Unknown"
                        "Unknown"
                      }
                    </div>
                    <div className="mt-1 rounded-lg bg-base-200 p-3">
                      {message.content}
                    </div>
                    <div className="mt-1 text-xs text-base-content/60">
                      {new Date(message.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="border-t p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="input input-bordered flex-1"
              />
              <button title="Send" type="submit" className="btn btn-primary">
                <FiSend />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
