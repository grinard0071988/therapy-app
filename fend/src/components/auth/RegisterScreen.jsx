import { useState } from "react";
import { AuthAPI } from "../../api/api.js";
import AuthBackground from "./AuthBackground.jsx";
import Logo from "./Logo.jsx";
import InputField from "../ui/InputField.jsx";
import Button from "../ui/Button.jsx";
import Alert from "../ui/Alert.jsx";

/**
 * RegisterScreen
 * Full-page sign-up form with live password-strength meter.
 *
 * Props:
 *   onLogin   {function} - (token, user) => void   (called after successful register + auto-login)
 *   onGoLogin {function} - navigate back to LoginScreen
 */
export default function RegisterScreen({ onLogin, onGoLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  // Password strength
  const strength =
    password.length === 0
      ? null
      : password.length < 6
      ? { label: "Too short", color: "#C96B8A", pct: "20%" }
      : password.length < 10
      ? { label: "Moderate", color: "#E8A94A", pct: "60%" }
      : { label: "Strong", color: "#4A9E8E", pct: "100%" };

  // Client-side validation
  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Name is required.";
    if (!email.trim()) e.email = "Email is required.";
    if (password.length < 6) e.password = "Min. 6 characters.";
    if (password !== confirm) e.confirm = "Passwords don't match.";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      triggerShake();
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      // 1. register
      await AuthAPI.register(name.trim(), email.trim(), password);
      // 2. auto-login
      const { token, user } = await AuthAPI.login(email.trim(), password);
      onLogin(token, user);
    } catch (err) {
      setErrors({ general: err.message });
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const allFilled = name && email && password && confirm;

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
        <Logo subtitle="Begin your journey to feeling better" />

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
              marginBottom: 24,
            }}
          >
            Create your account
          </h2>

          {errors.general && <Alert type="error">{errors.general}</Alert>}

          <InputField
            label="Full Name"
            value={name}
            onChange={setName}
            placeholder="Your full name"
            icon="👤"
            autoFocus
            error={errors.name}
          />
          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@email.com"
            icon="✉️"
            error={errors.email}
          />
          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="Min. 6 characters"
            icon="🔒"
            error={errors.password}
          />

          {/* Password strength meter */}
          {strength && (
            <div style={{ marginTop: -10, marginBottom: 16 }}>
              <div
                style={{
                  height: 3,
                  borderRadius: 2,
                  background: "rgba(255,255,255,0.06)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: strength.pct,
                    background: strength.color,
                    transition: "width 0.35s, background 0.35s",
                  }}
                />
              </div>
              <p
                style={{
                  fontSize: 11,
                  color: strength.color,
                  marginTop: 4,
                  fontWeight: 500,
                }}
              >
                {strength.label}
              </p>
            </div>
          )}

          <InputField
            label="Confirm Password"
            type="password"
            value={confirm}
            onChange={setConfirm}
            placeholder="Repeat password"
            icon="🔐"
            error={errors.confirm}
          />

          <Button
            onClick={handleSubmit}
            loading={loading}
            disabled={!allFilled}
            fullWidth
            size="lg"
          >
            {loading ? "Creating account…" : "Create Account →"}
          </Button>

          <p
            style={{
              fontSize: 11,
              color: "#3A3030",
              textAlign: "center",
              marginTop: 16,
              lineHeight: 1.7,
            }}
          >
            By signing up you agree to our Terms of Service &amp; Privacy
            Policy.
            <br />
            Your data is encrypted and confidential.
          </p>
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: 22,
            fontSize: 14,
            color: "#5A5048",
          }}
        >
          Already have an account?{" "}
          <span
            onClick={onGoLogin}
            style={{ color: "#7C6BC9", cursor: "pointer", fontWeight: 600 }}
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}
