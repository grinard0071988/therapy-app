import { useState, useEffect } from "react";
import { CounselorsAPI, SessionsAPI } from "../../api/api.js";
import { can } from "../../utils/permissions.js";
import Avatar from "../ui/Avatar.jsx";
import Badge from "../ui/Badge.jsx";
import Button from "../ui/Button.jsx";
import Alert from "../ui/Alert.jsx";
import Spinner from "../ui/Spinner.jsx";
import CounselorCard from "./CounselorCard.jsx";
import CounselorDetail from "./CounselorDetail.jsx";
import SessionHistory from "./SessionHistory.jsx";

/**
 * HomeScreen
 * Authenticated landing page. Shows counselors on the left, detail / history on the right.
 *
 * Props:
 *   user          {object}   - current user
 *   token         {string}   - auth token for API calls
 *   onStartSession {function} - (counselor, session) => void
 *   onLogout      {function}
 */
export default function HomeScreen({ user, token, onStartSession, onLogout }) {
  const [counselors, setCounselors] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [fetchError, setFetchError] = useState("");
  const [counselorLoading, setCounselorLoading] = useState(true);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [sessionStarting, setSessionStarting] = useState(false);

  // Fetch counselors and sessions on mount
  useEffect(() => {
    if (!can(user, "view_counselors")) return;

    CounselorsAPI.list(token)
      .then(({ counselors }) => setCounselors(counselors))
      .catch((e) => setFetchError(e.message))
      .finally(() => setCounselorLoading(false));

    SessionsAPI.list(token)
      .then(({ sessions }) => setSessions(sessions))
      .catch(() => {
        /* non-critical */
      })
      .finally(() => setSessionsLoading(false));
  }, [token, user]);

  //Start a session via the API
  const handleStart = async (counselor) => {
    setSessionStarting(true);
    try {
      const { session } = await SessionsAPI.create(token, counselor.id);
      onStartSession(counselor, session);
    } catch (e) {
      setFetchError(e.message);
    } finally {
      setSessionStarting(false);
    }
  };

  // Authorization wall
  if (!can(user, "view_counselors")) {
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
        <Alert type="error">
          🚫 You are not authorised to access this area.
        </Alert>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      {/* Ambient background blobs */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-20%",
            left: "-10%",
            width: "60%",
            height: "60%",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, #7C6BC91A 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            right: "-5%",
            width: "50%",
            height: "50%",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, #4A9E8E14 0%, transparent 70%)",
          }}
        />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 980,
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* Header */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "24px 0 20px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            marginBottom: 44,
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg, #7C6BC9, #4A9E8E)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}
            >
              🌿
            </div>
            <span
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#F0EBE3",
                letterSpacing: "-0.3px",
              }}
            >
              Solace
            </span>
          </div>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {user.role === "admin" && <Badge color="#E8A94A">Admin</Badge>}
            <Avatar initials={user.avatar} color="#7C6BC9" size={34} />
            <span style={{ fontSize: 13, color: "#9A8E80" }}>
              {user.name.split(" ")[0]}
            </span>
            <Button onClick={onLogout} variant="ghost" size="sm">
              Sign out
            </Button>
          </div>
        </header>

        {/*  API error  */}
        {fetchError && <Alert type="error">{fetchError}</Alert>}

        {/*  Hero  */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 48,
            animation: "fadeUp 0.6s ease both",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(124,107,201,0.1)",
              border: "1px solid rgba(124,107,201,0.25)",
              borderRadius: 20,
              padding: "5px 14px",
              marginBottom: 18,
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#4A9E8E",
                animation: "pulse 2s infinite",
              }}
            />
            <span
              style={{
                fontSize: 12,
                color: "#7C6BC9",
                fontWeight: 600,
                letterSpacing: "0.5px",
              }}
            >
              AUTHENTICATED · SECURE SESSION
            </span>
          </div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 700,
              lineHeight: 1.15,
              color: "#F0EBE3",
              marginBottom: 12,
            }}
          >
            Hello, {user.name.split(" ")[0]}.
            <br />
            <em style={{ color: "#7C6BC9", fontStyle: "italic" }}>
              Who would you like to speak with?
            </em>
          </h1>
          <p
            style={{
              fontSize: 15,
              color: "#7A6E66",
              maxWidth: 380,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Select a specialist to begin a private, confidential session.
          </p>
        </div>

        {/*  Main two-column grid  */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 28,
            alignItems: "start",
          }}
        >
          {/*  Left: counselor list */}
          <div style={{ animation: "fadeUp 0.6s 0.1s ease both" }}>
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#5A5048",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Our Specialists
            </p>

            {counselorLoading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "40px 0",
                }}
              >
                <Spinner color="#7C6BC9" size={28} />
              </div>
            ) : (
              counselors.map((c) => (
                <CounselorCard
                  key={c.id}
                  counselor={c}
                  selected={selected?.id === c.id}
                  onSelect={setSelected}
                />
              ))
            )}
          </div>

          {/*  Right: detail or history  */}
          <div style={{ animation: "fadeUp 0.6s 0.2s ease both" }}>
            {selected ? (
              <CounselorDetail
                counselor={selected}
                user={user}
                onStart={handleStart}
                sessionLoading={sessionStarting}
              />
            ) : (
              <SessionHistory
                sessions={sessions}
                counselors={counselors}
                user={user}
                loading={sessionsLoading}
              />
            )}
          </div>
        </div>

        {/*  Footer  */}
        <div
          style={{
            textAlign: "center",
            padding: "40px 0 28px",
            color: "#2E2828",
            fontSize: 12,
            lineHeight: 1.9,
          }}
        >
          🔒 End-to-end encrypted · All conversations are confidential · Not a
          substitute for emergency care
        </div>
      </div>
    </div>
  );
}
