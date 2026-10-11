// src/components/home/SessionHistory.jsx
import { useState } from "react";
import Avatar from "../ui/Avatar.jsx";
import Badge from "../ui/Badge.jsx";
import Spinner from "../ui/Spinner.jsx";
import { can } from "../../utils/permissions.js";

/**
 * SessionHistory
 * Lists completed and active sessions with per-row delete capability.
 *
 * Delete flow per row:
 *   Idle → [🗑 button clicked] → Confirm state (inline Yes / Cancel)
 *        → [Yes clicked]       → Deleting state (spinner)
 *        → [API resolves]      → Row disappears (parent removes it from state)
 *
 * Only "completed" sessions show the delete button.
 * Active sessions are protected — the button is hidden and the server
 * would reject the request anyway.
 *
 * Props:
 *   sessions    {array}    - session rows from the API
 *   counselors  {array}    - used to enrich each row with counselor details
 *   user        {object}   - current logged-in user
 *   loading     {boolean}  - true while the initial fetch is in flight
 *   onDelete    {function} - async (sessionId) => void  ← NEW
 */
export default function SessionHistory({
  sessions,
  counselors,
  user,
  loading,
  onDelete,
}) {
  // ── Local UI state ──────────────────────────────────────────────────────────
  // confirmingId  — the session currently showing "Are you sure?" inline buttons
  // deletingId    — the session currently being deleted (shows spinner)
  // deleteError   — error message shown below the list if the API call fails
  const [confirmingId, setConfirmingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const isAdmin = can(user, "view_all_sessions");

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const getCounselor = (id) => counselors.find((c) => c.id === id);

  const handleDeleteClick = (sessionId) => {
    setDeleteError("");
    setConfirmingId(sessionId); // enter confirm state for this row
  };

  const handleCancelDelete = () => {
    setConfirmingId(null); // back to idle
  };

  const handleConfirmDelete = async (sessionId) => {
    setConfirmingId(null);
    setDeletingId(sessionId); // enter spinner state
    setDeleteError("");
    try {
      await onDelete(sessionId); // HomeScreen removes the row from state
    } catch (err) {
      setDeleteError(
        err.message || "Could not delete session. Please try again."
      );
    } finally {
      setDeletingId(null); // always clear spinner
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* ── Section heading ── */}
      <p
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#5A5048",
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {isAdmin ? "All Sessions" : "Your Session History"}
        {isAdmin && <Badge color="#E8A94A">Admin view</Badge>}
      </p>

      {/* ── API delete error ── */}
      {deleteError && (
        <div
          style={{
            background: "#C96B8A14",
            border: "1px solid #C96B8A44",
            borderRadius: 10,
            padding: "10px 14px",
            marginBottom: 14,
            fontSize: 13,
            color: "#C96B8A",
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          <span>⚠️</span>
          <span>{deleteError}</span>
          <button
            onClick={() => setDeleteError("")}
            style={{
              marginLeft: "auto",
              background: "none",
              border: "none",
              color: "#C96B8A",
              cursor: "pointer",
              fontSize: 16,
              lineHeight: 1,
            }}
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      {/* ── Loading skeleton ── */}
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "32px 0",
          }}
        >
          <Spinner color="#7C6BC9" size={24} />
        </div>
      ) : /* ── Empty state ── */
      sessions.length === 0 ? (
        <div
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px dashed rgba(255,255,255,0.07)",
            borderRadius: 18,
            padding: "32px 24px",
            textAlign: "center",
            color: "#3E3830",
            fontSize: 14,
            lineHeight: 1.8,
          }}
        >
          No sessions yet.
          <br />
          Select a specialist to get started.
        </div>
      ) : (
        /* ── Session rows ── */
        sessions.slice(0, 7).map((s) => {
          const c = getCounselor(s.counselor_id);
          if (!c) return null;

          const isConfirming = confirmingId === s.id;
          const isDeleting = deletingId === s.id;
          const isCompleted = s.status === "completed";

          return (
            <div
              key={s.id}
              style={{
                background: isConfirming
                  ? "rgba(201,107,138,0.07)" // subtle pink tint when confirming
                  : "rgba(255,255,255,0.03)",
                border: `1px solid ${
                  isConfirming ? "#C96B8A44" : "rgba(255,255,255,0.07)"
                }`,
                borderRadius: 14,
                padding: "13px 16px",
                marginBottom: 10,
                transition: "background 0.2s, border-color 0.2s",
                animation: "fadeUp 0.3s ease both",
              }}
            >
              {/* ── Normal row content ── */}
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <Avatar initials={c.avatar} color={c.color} size={36} />

                {/* Session info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{ fontSize: 13, fontWeight: 600, color: "#E8E0D5" }}
                  >
                    {c.name}
                  </div>
                  {/* Admin sees which user the session belongs to */}
                  {isAdmin && s.user_name && (
                    <div
                      style={{ fontSize: 11, color: "#7C6BC9", marginTop: 1 }}
                    >
                      ↳ {s.user_name}
                    </div>
                  )}
                  <div
                    style={{
                      fontSize: 12,
                      color: "#7A6E66",
                      marginTop: 2,
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {s.topic || "Session"}
                  </div>
                </div>

                {/* Date + status badge */}
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div
                    style={{ fontSize: 11, color: "#5A5048", marginBottom: 5 }}
                  >
                    {new Date(s.started_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <Badge color={isCompleted ? "#4A9E8E" : "#E8A94A"}>
                    {s.status}
                  </Badge>
                </div>

                {/* ── Delete control (completed sessions only) ── */}
                {isCompleted && (
                  <div style={{ flexShrink: 0, marginLeft: 8 }}>
                    {/* Spinner while deleting */}
                    {isDeleting && <Spinner color="#C96B8A" size={16} />}

                    {/* Idle: show trash button */}
                    {!isDeleting && !isConfirming && (
                      <button
                        onClick={() => handleDeleteClick(s.id)}
                        title="Delete this session"
                        aria-label="Delete session"
                        style={{
                          background: "transparent",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 8,
                          padding: "5px 8px",
                          cursor: "pointer",
                          color: "#5A5048",
                          fontSize: 14,
                          lineHeight: 1,
                          transition:
                            "color 0.15s, border-color 0.15s, background 0.15s",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.color = "#C96B8A";
                          e.currentTarget.style.borderColor = "#C96B8A66";
                          e.currentTarget.style.background = "#C96B8A12";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.color = "#5A5048";
                          e.currentTarget.style.borderColor =
                            "rgba(255,255,255,0.1)";
                          e.currentTarget.style.background = "transparent";
                        }}
                      >
                        🗑
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* ── Inline confirmation strip (replaces row bottom) ── */}
              {isConfirming && (
                <div
                  style={{
                    marginTop: 12,
                    paddingTop: 12,
                    borderTop: "1px solid rgba(201,107,138,0.2)",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    animation: "fadeIn 0.2s ease both",
                  }}
                >
                  <span style={{ fontSize: 12, color: "#C96B8A", flex: 1 }}>
                    ⚠️ Permanently delete this session and all its messages?
                  </span>

                  {/* Confirm button */}
                  <button
                    onClick={() => handleConfirmDelete(s.id)}
                    style={{
                      background: "linear-gradient(135deg, #C96B8A, #A94A6A)",
                      border: "none",
                      borderRadius: 8,
                      padding: "6px 14px",
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                      transition: "opacity 0.15s",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.opacity = "0.8")}
                    onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
                  >
                    Yes, delete
                  </button>

                  {/* Cancel button */}
                  <button
                    onClick={handleCancelDelete}
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 8,
                      padding: "6px 14px",
                      color: "#9A8E80",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                      transition: "opacity 0.15s",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.opacity = "0.7")}
                    onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}

      {/* ── Hint text for users ── */}
      {!loading &&
        sessions.filter((s) => s.status === "completed").length > 0 && (
          <p
            style={{
              fontSize: 11,
              color: "#3E3428",
              marginTop: 10,
              textAlign: "center",
              lineHeight: 1.6,
            }}
          >
            🗑 Completed sessions can be permanently deleted.
            <br />
            This action cannot be undone.
          </p>
        )}
    </div>
  );
}
