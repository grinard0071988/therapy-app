import Avatar from "../ui/Avatar.jsx";
import Badge from "../ui/Badge.jsx";

/**
 * CounselorCard
 * Clickable card in the counselor list on the HomeScreen.
 *
 * Props:
 *   counselor {object}   - counselor row from the API
 *   selected  {boolean}  - whether this card is currently selected
 *   onSelect  {function} - (counselor) => void
 */
export default function CounselorCard({ counselor: c, selected, onSelect }) {
  return (
    <div
      onClick={() => onSelect(c)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onSelect(c)}
      style={{
        background: selected
          ? `linear-gradient(135deg, ${c.color}1C, ${c.color}09)`
          : "rgba(255,255,255,0.03)",
        border: `1.5px solid ${
          selected ? c.color + "66" : "rgba(255,255,255,0.08)"
        }`,
        borderRadius: 18,
        padding: 18,
        cursor: "pointer",
        marginBottom: 12,
        transition: "all 0.25s ease",
        transform: selected ? "translateX(5px)" : "none",
        outline: "none",
      }}
    >
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        <Avatar initials={c.avatar} color={c.color} size={48} glow={selected} />

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Name + type badge */}
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 15, color: "#F0EBE3" }}>
              {c.name}
            </span>
            <Badge color={c.color}>{c.type}</Badge>
          </div>

          {/* Title */}
          <div style={{ color: "#7A6E66", fontSize: 12, marginTop: 3 }}>
            {c.title}
          </div>

          {/* Specialties */}
          <div
            style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}
          >
            {(c.specialties ?? []).map((s) => (
              <span
                key={s}
                style={{
                  fontSize: 11,
                  background: "rgba(255,255,255,0.06)",
                  color: "#C8BFB4",
                  padding: "3px 9px",
                  borderRadius: 9,
                  border: "1px solid rgba(255,255,255,0.09)",
                }}
              >
                {s}
              </span>
            ))}
          </div>

          {/* Rating + session count */}
          <div style={{ display: "flex", gap: 14, marginTop: 10 }}>
            <span style={{ fontSize: 12, color: "#F0EBE3" }}>
              ⭐ {c.rating}
            </span>
            <span style={{ fontSize: 12, color: "#5A5048" }}>
              {c.sessions_count} sessions
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
