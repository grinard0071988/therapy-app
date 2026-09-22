import { useState } from "react";
import { AuthAPI } from "../../api/api.js";
import AuthBackground from "./AuthBackground.jsx";
import Logo from "./Logo.jsx";
import InputField from "../ui/InputField.jsx";
import Button from "../ui/Button.jsx";
import Alert from "../ui/Alert.jsx";

/**
 * LoginScreen
 * Full-page login form. On success calls onLogin(token, user).
 *
 * Props:
 *   onLogin      {function} - (token, user) => void
 *   onGoRegister {function} - navigate to RegisterScreen
 */
export default function LoginScreen({ onLogin, onGoRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSubmit = async () => {
    if (!email.trim() || !password) {
      setError("Please fill in both fields.");
      triggerShake();
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { token, user } = await AuthAPI.login(email.trim(), password);
      onLogin(token, user);
    } catch (err) {
      setError(err.message);
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  // Auto-fill a demo account
  const fillDemo = (em, pw) => {
    setEmail(em);
    setPassword(pw);
    setError("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        position: "relative",
      }}
    >
      <AuthBackground />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 420,
          animation: "fadeUp 0.5s ease both",
        }}
      >
        <Logo subtitle="Your safe space to heal and grow" />

        {/* Card */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: 24,
            padding: "32px 30px",
            backdropFilter: "blur(12px)",
            animation: shake ? "shake 0.4s ease" : "none",
          }}
        >
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#E8E0D5",
              marginBottom: 5,
            }}
          >
            Welcome back
          </h2>
          <p style={{ color: "#5A5048", fontSize: 13, marginBottom: 26 }}>
            Sign in to continue your journey
          </p>

          {error && <Alert type="error">{error}</Alert>}

          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@email.com"
            icon="✉️"
            autoFocus
            onKeyDown={handleKey}
          />
          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            icon="🔒"
            onKeyDown={handleKey}
          />

          <div style={{ textAlign: "right", marginTop: -8, marginBottom: 22 }}>
            <span style={{ fontSize: 12, color: "#7C6BC9", cursor: "pointer" }}>
              Forgot password?
            </span>
          </div>

          <Button
            onClick={handleSubmit}
            loading={loading}
            disabled={!email || !password}
            fullWidth
            size="lg"
          >
            {loading ? "Signing in…" : "Sign In →"}
          </Button>

          {/* Demo credential cards */}
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: 22,
            fontSize: 14,
            color: "#5A5048",
          }}
        >
          Don&apos;t have an account?{" "}
          <span
            onClick={onGoRegister}
            style={{ color: "#7C6BC9", cursor: "pointer", fontWeight: 600 }}
          >
            Create one
          </span>
        </p>
      </div>
    </div>
  );
}
