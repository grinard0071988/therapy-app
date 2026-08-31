import Avatar from "../ui/Avatar.jsx";

/**
 * MessageBubble
 * A single chat message — user on the right, counselor on the left.
 *
 * Props:
 *   message   {object} - { role: "user"|"assistant", content, created_at|ts }
 *   counselor {object} - counselor row (for avatar + colour)
 *   user      {object} - current user (for avatar)
 */
export default function MessageBubble({ message: msg, counselor, user }) {
  const isUser = msg.role === "user";
  const time = msg.created_at ?? msg.ts;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: 16,
        alignItems: "flex-end",
        gap: 8,
        animation: "fadeUp 0.25s ease both",
      }}
    >
      {/* Counselor avatar on the left */}
      {!isUser && (
        <Avatar initials={counselor.avatar} color={counselor.color} size={32} />
      )}

      {/* Bubble + timestamp */}
      <div
        style={{
          maxWidth: "72%",
          display: "flex",
          flexDirection: "column",
          alignItems: isUser ? "flex-end" : "flex-start",
        }}
      >
        <div
          style={{
            background: isUser
              ? "linear-gradient(135deg, #6B5EAB, #9080D0)"
              : "rgba(255,255,255,0.07)",
            border: isUser ? "none" : "1px solid rgba(255,255,255,0.1)",
            borderRadius: isUser ? "20px 20px 6px 20px" : "20px 20px 20px 6px",
            padding: "12px 17px",
            color: isUser ? "#fff" : "#E8E0D5",
            fontSize: 14,
            lineHeight: 1.7,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {msg.content}
        </div>

        {/* Timestamp */}
        {time && (
          <div
            style={{
              fontSize: 10,
              color: "#3E3830",
              marginTop: 5,
              paddingInline: 4,
            }}
          >
            {new Date(time).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        )}
      </div>

      {/* User avatar on the right */}
      {isUser && <Avatar initials={user.avatar} color="#6B5EAB" size={32} />}
    </div>
  );
}
