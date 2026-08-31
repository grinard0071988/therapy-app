import { useState } from "react";
import { useAuth } from "./hooks/useAuth.js";
import { can } from "./utils/permissions.js";
import Spinner from "./components/ui/Spinner.jsx";
import LoginScreen from "./components/auth/LoginScreen.jsx";
import RegisterScreen from "./components/auth/RegisterScreen.jsx";
import HomeScreen from "./components/home/HomeScreen.jsx";
import ChatScreen from "./components/chat/ChatScreen.jsx";

/**
 * App
 * Root component. Controls which screen is shown based on:
 *   - Auth state  (unauthenticated → auth screens)
 *   - Navigation  (home or active chat)
 *
 * Screen flow:
 *   Not logged in → LoginScreen ↔ RegisterScreen
 *   Logged in     → HomeScreen → ChatScreen → HomeScreen
 */
export default function App() {
  // Auth state (managed by the useAuth hook)
  const { user, token, loading, login, logout } = useAuth();

  // In-app navigation
  const [authScreen, setAuthScreen] = useState("login"); // "login" | "register"
  const [activeCounselor, setActiveCounselor] = useState(null);
  const [activeSession, setActiveSession] = useState(null);

  // Handlers

  /** Called by HomeScreen once the API returns a new session row. */
  const handleStartSession = (counselor, session) => {
    if (!can(user, "start_session")) return;
    setActiveCounselor(counselor);
    setActiveSession(session);
  };

  /** Called by ChatScreen when the user clicks "End". */
  const handleEndSession = () => {
    setActiveCounselor(null);
    setActiveSession(null);
  };

  // Loading state (restoring session from sessionStorage)
  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div style={{ fontSize: 28 }}>🌿</div>
        <Spinner color="#7C6BC9" size={24} />
        <p style={{ fontSize: 13, color: "#5A5048" }}>
          Restoring your session…
        </p>
      </div>
    );
  }

  //  Not authenticated
  if (!user) {
    if (authScreen === "register") {
      return (
        <RegisterScreen
          onLogin={login}
          onGoLogin={() => setAuthScreen("login")}
        />
      );
    }
    return (
      <LoginScreen
        onLogin={login}
        onGoRegister={() => setAuthScreen("register")}
      />
    );
  }

  // Authenticated: active chat session
  if (activeCounselor && activeSession) {
    return (
      <ChatScreen
        user={user}
        token={token}
        counselor={activeCounselor}
        session={activeSession}
        onEnd={handleEndSession}
      />
    );
  }

  // Authenticated: home
  return (
    <HomeScreen
      user={user}
      token={token}
      onStartSession={handleStartSession}
      onLogout={logout}
    />
  );
}
