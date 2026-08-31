import Avatar from "../ui/Avatar.jsx";
import Badge from "../ui/Badge.jsx";
import Button from "../ui/Button.jsx";
import Alert from "../ui/Alert.jsx";
import { can } from "../../utils/permissions.js";

/**
 * CounselorDetail
 * Right-panel expanded view of the selected counselor with a "Begin Session" CTA.
 *
 * Props:
 *   counselor     {object}   - selected counselor
 *   user          {object}   - current logged-in user
 *   onStart       {function} - (counselor) => void
 *   sessionLoading {boolean} - shows spinner on the button while creating session
 */
export default function CounselorDetail({
  counselor: c,
  user,
  onStart,
  sessionLoading,
}) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1.5px solid ${c.color}44`,
        borderRadius: 22,
        padding: 26,
        animation: "fadeIn 0.3s ease both",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          gap: 14,
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Avatar initials={c.avatar} color={c.color} size={56} glow />
        <div>
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: 18,
              color: "#F0EBE3",
            }}
          >
            {c.name}
          </div>
          <div style={{ color: "#7A6E66", fontSize: 13, marginTop: 2 }}>
            {c.title}
          </div>
          <div style={{ color: c.color, fontSize: 12, marginTop: 4 }}>
            ⭐ {c.rating} · {c.sessions_count} sessions
          </div>
        </div>
      </div>

      {/* Bio */}
      <p
        style={{
          fontSize: 14,
          color: "#B0A898",
          lineHeight: 1.75,
          marginBottom: 20,
        }}
      >
        {c.bio}
      </p>

      {/* Specialties */}
      <div style={{ marginBottom: 24 }}>
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#5A5048",
            textTransform: "uppercase",
            letterSpacing: "1px",
            marginBottom: 10,
          }}
        >
          Specializes in
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {(c.specialties ?? []).map((s) => (
            <span
              key={s}
              style={{
                fontSize: 12,
                background: `${c.color}1E`,
                color: c.color,
                padding: "5px 13px",
                borderRadius: 20,
                border: `1px solid ${c.color}44`,
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* CTA — guarded by permission */}
      {can(user, "start_session") ? (
        <Button
          onClick={() => onStart(c)}
          loading={sessionLoading}
          fullWidth
          size="lg"
          color={c.color}
        >
          Begin Session →
        </Button>
      ) : (
        <Alert type="error">
          🚫 You don&apos;t have permission to start sessions.
        </Alert>
      )}
    </div>
  );
}
