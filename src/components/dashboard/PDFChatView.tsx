"use client";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FiSend, FiChevronLeft, FiEdit2, FiTrash2 } from "react-icons/fi";
import PdfViewer from "@/components/dashboard/PdfViewer";
import { PDFChatViewProps, GroupMessage, User } from "@/types/types";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

export function PDFChatView({ pdf }: Readonly<PDFChatViewProps>) {
  const router = useRouter();
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
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

  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session", { credentials: "include" });
      if (res.ok) {
        const session = await res.json();
        setCurrentUser(session.user ?? null);
      }
    } catch {
      toast.error("Failed to load user session");
    }
  }, []);

  useEffect(() => {
    fetchMessages();
    fetchCurrentUser();
  }, [pdf.id, fetchMessages, fetchCurrentUser]);

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
        fetchMessages();
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message");
    }
  };

  const handleEdit = (message: GroupMessage) => {
    setEditingId(message.id);
    setEditContent(message.content);
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editContent.trim()) return;

    try {
      const res = await fetch(`/api/comments/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editContent }),
        credentials: "include",
      });

      if (res.ok) {
        setEditingId(null);
        fetchMessages();
        toast.success("Message updated");
      } else {
        throw new Error("Failed to update message");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update message");
    }
  };

  const handleDelete = async (messageId: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      const res = await fetch(`/api/comments/${messageId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        fetchMessages();
        toast.success("Message deleted");
      } else {
        throw new Error("Failed to delete message");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete message");
    }
  };

  const canEditMessage = (message: GroupMessage) => {
    if (!currentUser) return false;
    return message.senderId === currentUser.id;
  };

  const canDeleteMessage = (message: GroupMessage) => {
    if (!currentUser) return false;
    return (
      message.senderId === currentUser.id || pdf.ownerId === currentUser.id
    );
  };

  const getSenderName = (message: GroupMessage) => {
    if (message.sender?.name) return message.sender.name;
    if (message.guestName) return message.guestName;
    return "Unknown User";
  };

  const getAvatarContent = (message: GroupMessage) => {
    if (message.sender?.profileImageUrl) {
      return (
        <Image
          width={40}
          height={40}
          src={message.sender.profileImageUrl}
          alt={getSenderName(message)}
          className="h-8 w-8 rounded-full object-cover"
        />
      );
    }

    const initials = getSenderName(message).charAt(0).toUpperCase() || "U";
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-content">
        <span className="text-xs font-medium">{initials}</span>
      </div>
    );
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

        <div className="flex flex-col rounded-xl border bg-base-100 shadow-lg lg:w-1/2">
          <div className="border-b bg-primary/10 p-4 font-semibold text-primary">
            Document Chat
          </div>

          <div className="flex-1 overflow-y-auto bg-base-100 p-4">
            {messages.map((message: GroupMessage) => (
              <div
                key={message.id}
                className="group mb-4 rounded-lg p-2 transition-colors hover:bg-base-200/50"
              >
                {editingId === message.id ? (
                  <div className="flex gap-3">
                    <div className="mt-1 flex-shrink-0">
                      {getAvatarContent(message)}
                    </div>
                    <div className="flex-1">
                      <textarea
                        title="Edit message"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="textarea textarea-bordered w-full"
                        rows={3}
                        autoFocus
                      />
                      <div className="mt-2 flex justify-end gap-2">
                        <button
                          onClick={() => setEditingId(null)}
                          className="btn btn-ghost btn-sm"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveEdit}
                          className="btn btn-primary btn-sm"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {getAvatarContent(message)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between">
                        <div className="truncate font-medium">
                          {getSenderName(message)}
                          {message.senderId === currentUser?.id && (
                            <span className="badge badge-primary badge-xs ml-2">
                              You
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                          {canEditMessage(message) && (
                            <button
                              onClick={() => handleEdit(message)}
                              className="btn btn-circle btn-ghost btn-xs"
                              title="Edit"
                            >
                              <FiEdit2 />
                            </button>
                          )}
                          {canDeleteMessage(message) && (
                            <button
                              onClick={() => handleDelete(message.id)}
                              className="btn btn-circle btn-ghost btn-xs text-error"
                              title="Delete"
                            >
                              <FiTrash2 />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="mt-1 whitespace-pre-wrap break-words rounded-lg bg-base-200 p-3">
                        {message.content}
                      </div>
                      <div className="mt-1 text-xs text-base-content/60">
                        {new Date(message.createdAt).toLocaleString()}
                        {message.createdAt !== message.updatedAt && " (edited)"}
                      </div>
                    </div>
                  </div>
                )}
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
