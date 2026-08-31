import { useState, useEffect, useRef } from "react";
import { ChatAPI, SessionsAPI } from "../../api/api.js";
import { can } from "../../utils/permissions.js";
import Avatar from "../ui/Avatar.jsx";
import Badge from "../ui/Badge.jsx";
import Button from "../ui/Button.jsx";
import Alert from "../ui/Alert.jsx";
import MessageBubble from "./MessageBubble.jsx";
import TypingIndicator from "./TypingIndicator.jsx";

/**
 * ChatScreen
 * Full-height real-time chat between the user and an AI counselor.
 * Sends messages to chat.php which calls Claude server-side.
 *
 * Props:
 *   user      {object}   - current user
 *   token     {string}   - auth token
 *   counselor {object}   - the selected counselor
 *   session   {object}   - active session row from the API
 *   onEnd     {function} - called when the user ends the session
 */
export default function ChatScreen({ user, token, counselor, session, onEnd }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [sendError, setSendError] = useState("");
  const [ending, setEnding] = useState(false);

  const endRef = useRef(null);
  const taRef = useRef(null);

  // Authorization guard
  if (!can(user, "send_message")) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <Alert type="error">🚫 You are not authorised to send messages.</Alert>
      </div>
    );
  }

  // Counselor greeting on mount
  useEffect(() => {
    const greeting = {
      role: "assistant",
      content: `Hello ${user.name.split(" ")[0]}, I'm ${
        counselor.name
      }. This is a safe, confidential space — you can share whatever is on your mind.\n\nWhat would you like to talk about today?`,
      created_at: new Date().toISOString(),
    };
    setMessages([greeting]);
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // Auto-resize textarea
  const resizeTextarea = () => {
    if (!taRef.current) return;
    taRef.current.style.height = "auto";
    taRef.current.style.height =
      Math.min(taRef.current.scrollHeight, 130) + "px";
  };

  // Send a message
  const send = async () => {
    const text = input.trim();
    if (!text || typing) return;

    setSendError("");
    const userMsg = {
      role: "user",
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    if (taRef.current) taRef.current.style.height = "auto";
    setTyping(true);

    try {
      const { reply } = await ChatAPI.send(token, session.id, text);
      const botMsg = {
        role: "assistant",
        content: reply,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setSendError(err.message);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I had trouble responding. Please try again.",
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  //End session
  const handleEnd = async () => {
    setEnding(true);
    // Extract a short topic from the first user message
    const firstUser = messages.find((m) => m.role === "user");
    const topic = firstUser ? firstUser.content.slice(0, 60) : "";
    try {
      await SessionsAPI.end(token, session.id, topic);
    } catch {
      /* best-effort */
    }
    setEnding(false);
    onEnd();
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Ambient background */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-30%",
            right: "-20%",
            width: "70%",
            height: "70%",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${counselor.color}12 0%, transparent 60%)`,
          }}
        />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          maxWidth: 800,
          margin: "0 auto",
          width: "100%",
          padding: "0 22px",
        }}
      >
        {/*  Chat header */}
        <div
          style={{
            padding: "16px 0 14px",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            display: "flex",
            alignItems: "center",
            gap: 14,
            flexShrink: 0,
          }}
        >
          <Button
            onClick={handleEnd}
            loading={ending}
            variant="ghost"
            size="sm"
          >
            ← End
          </Button>

          <Avatar
            initials={counselor.avatar}
            color={counselor.color}
            size={42}
            glow
          />

          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#F0EBE3" }}>
              {counselor.name}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginTop: 3,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#4A9E8E",
                  boxShadow: "0 0 8px #4A9E8E",
                  animation: "pulse 2s infinite",
                }}
              />
              <span style={{ fontSize: 12, color: "#4A9E8E" }}>
                Session active
              </span>
            </div>
          </div>

          {/* Current user info */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Avatar initials={user.avatar} color="#7C6BC9" size={28} />
            <div>
              <div style={{ fontSize: 12, color: "#9A8E80" }}>
                {user.name.split(" ")[0]}
              </div>
              {user.role === "admin" && <Badge color="#E8A94A">Admin</Badge>}
            </div>
          </div>
        </div>

        {/*  Messages area  */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px 0",
          }}
        >
          {messages.map((msg, i) => (
            <MessageBubble
              key={i}
              message={msg}
              counselor={counselor}
              user={user}
            />
          ))}

          {typing && <TypingIndicator counselor={counselor} />}

          {sendError && (
            <div style={{ marginBottom: 16 }}>
              <Alert type="warning">{sendError}</Alert>
            </div>
          )}

          <div ref={endRef} />
        </div>

        {/* Input area */}
        <div style={{ flexShrink: 0, padding: "12px 0 20px" }}>
          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1.5px solid rgba(255,255,255,0.1)",
              borderRadius: 18,
              padding: "12px 14px",
              display: "flex",
              gap: 12,
              alignItems: "flex-end",
              backdropFilter: "blur(10px)",
            }}
          >
            <textarea
              ref={taRef}
              rows={1}
              placeholder="Share what's on your mind…"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                resizeTextarea();
              }}
              onKeyDown={handleKey}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#E8E0D5",
                fontSize: 14,
                lineHeight: 1.65,
                maxHeight: 130,
              }}
            />
            <button
              onClick={send}
              disabled={!input.trim() || typing}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                border: "none",
                flexShrink: 0,
                background:
                  input.trim() && !typing
                    ? `linear-gradient(135deg, ${counselor.color}, ${counselor.color}99)`
                    : "rgba(255,255,255,0.07)",
                color: "#fff",
                fontSize: 18,
                cursor: input.trim() && !typing ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s",
              }}
              aria-label="Send message"
            >
              ↑
            </button>
          </div>

          <p
            style={{
              textAlign: "center",
              fontSize: 11,
              color: "#2A2424",
              marginTop: 8,
            }}
          >
            Enter to send &nbsp;·&nbsp; Shift+Enter for new line &nbsp;·&nbsp;
            Not a substitute for emergency care
          </p>
        </div>
      </div>
    </div>
  );
}
