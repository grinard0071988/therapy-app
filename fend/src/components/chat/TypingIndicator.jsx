import Avatar from "../ui/Avatar.jsx";

/**
 * TypingIndicator
 * Three bouncing dots shown while the AI counselor is composing a reply.
 *
 * Props:
 *   counselor {object} - counselor row (for avatar + colour)
 */
export default function TypingIndicator({ counselor }) {
  return (
    <div
      aria-label="Counselor is typing"
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 8,
        marginBottom: 16,
      }}
    >
      <Avatar initials={counselor.avatar} color={counselor.color} size={32} />

      <div
        style={{
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "20px 20px 20px 6px",
          padding: "14px 18px",
          display: "flex",
          gap: 5,
          alignItems: "center",
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: counselor.color,
              animation: `bounce 1.2s ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
