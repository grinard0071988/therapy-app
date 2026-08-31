import Avatar from "../ui/Avatar.jsx";
import Badge from "../ui/Badge.jsx";
import Spinner from "../ui/Spinner.jsx";
import { can } from "../../utils/permissions.js";

/**
 * SessionHistory
 * Shows the user's past sessions (or all sessions if admin).
 *
 * Props:
 *   sessions    {array}   - session rows from the API
 *   counselors  {array}   - counselor rows used to enrich display
 *   user        {object}  - current user (to detect admin)
 *   loading     {boolean}
 */
export default function SessionHistory({
  sessions,
  counselors,
  user,
  loading,
}) {
  const isAdmin = can(user, "view_all_sessions");

  const getCounselor = (id) => counselors.find((c) => c.id === id);

  return (
    <div>
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
        {isAdmin ? "All Sessions (Admin)" : "Your Session History"}
        {isAdmin && (
          <span
            style={{
              fontSize: 10,
              background: "#E8A94A28",
              color: "#E8A94A",
              padding: "1px 7px",
              borderRadius: 10,
              border: "1px solid #E8A94A44",
            }}
          >
            Admin view
          </span>
        )}
      </p>

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
      ) : sessions.length === 0 ? (
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
        sessions.slice(0, 7).map((s) => {
          const c = getCounselor(s.counselor_id);
          if (!c) return null;
          return (
            <div
              key={s.id}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 14,
                padding: "13px 16px",
                marginBottom: 10,
                display: "flex",
                gap: 12,
                alignItems: "center",
                animation: "fadeUp 0.3s ease both",
              }}
            >
              <Avatar initials={c.avatar} color={c.color} size={36} />

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{ fontSize: 13, fontWeight: 600, color: "#E8E0D5" }}
                >
                  {c.name}
                </div>
                {/* Admin sees whose session it is */}
                {isAdmin && s.user_name && (
                  <div style={{ fontSize: 11, color: "#7C6BC9", marginTop: 1 }}>
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

              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div
                  style={{ fontSize: 11, color: "#5A5048", marginBottom: 5 }}
                >
                  {new Date(s.started_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <Badge color={s.status === "active" ? "#E8A94A" : "#4A9E8E"}>
                  {s.status}
                </Badge>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
