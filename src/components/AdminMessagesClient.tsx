"use client";

import { markMessageRead, deleteMessage } from "@/lib/actions";
import { useState } from "react";

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  isRead: number | null;
  createdAt: string | null;
}

export default function AdminMessagesClient({ messages }: { messages: Message[] }) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  async function handleToggleRead(id: number, currentStatus: number | null) {
    const fd = new FormData();
    fd.set("id", String(id));
    fd.set("isRead", String(currentStatus ? 0 : 1));
    await markMessageRead(fd);
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this message?")) return;
    const fd = new FormData();
    fd.set("id", String(id));
    await deleteMessage(fd);
  }

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div>
      {unreadCount > 0 && (
        <div className="alert alert-info">
          📬 You have <strong>{unreadCount}</strong> unread message{unreadCount > 1 ? "s" : ""}.
        </div>
      )}

      <div className="panel">
        <div className="panel-header">
          <span>✉ All Messages ({messages.length})</span>
          <span style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>
            {unreadCount} unread
          </span>
        </div>
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">✉</div>
            <p className="empty-state-text">No messages yet.</p>
          </div>
        ) : (
          <table className="cf-table">
            <thead>
              <tr>
                <th className="col-id">#</th>
                <th>Status</th>
                <th>From</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg, idx) => (
                <>
                  <tr
                    key={msg.id}
                    style={{
                      fontWeight: msg.isRead ? 400 : 700,
                      cursor: "pointer",
                    }}
                    onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}
                  >
                    <td className="col-id">{idx + 1}</td>
                    <td className="text-center">
                      {msg.isRead ? (
                        <span style={{ color: "var(--text-muted)", fontSize: "var(--font-size-xs)" }}>Read</span>
                      ) : (
                        <span className="unread-badge">New</span>
                      )}
                    </td>
                    <td>{msg.name}</td>
                    <td>
                      <a href={`mailto:${msg.email}`} onClick={(e) => e.stopPropagation()}>
                        {msg.email}
                      </a>
                    </td>
                    <td>{msg.subject || "(No subject)"}</td>
                    <td className="text-mono" style={{ fontSize: "var(--font-size-xs)", whiteSpace: "nowrap" }}>
                      {msg.createdAt || "—"}
                    </td>
                    <td>
                      <div className="btn-group" onClick={(e) => e.stopPropagation()}>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleToggleRead(msg.id, msg.isRead)}
                        >
                          {msg.isRead ? "Unread" : "Read"}
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(msg.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedId === msg.id && (
                    <tr key={`${msg.id}-expand`}>
                      <td colSpan={7} style={{ background: "var(--bg-secondary)", padding: "var(--space-lg)" }}>
                        <div style={{ maxWidth: "600px" }}>
                          <div style={{ marginBottom: "var(--space-sm)", fontSize: "var(--font-size-sm)", color: "var(--text-muted)" }}>
                            From: <strong>{msg.name}</strong> ({msg.email})
                          </div>
                          <div style={{ fontSize: "var(--font-size-md)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                            {msg.message}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
        <div className="panel-footer">
          Total: {messages.length} message(s) • {unreadCount} unread
        </div>
      </div>
    </div>
  );
}
