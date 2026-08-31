import { useState } from "react";

/**
 * InputField
 * Labelled text/email/password input with focus ring and error display.
 *
 * Props:
 *   label       {string}
 *   type        {string}   - default "text"
 *   value       {string}
 *   onChange    {function} - receives the new string value
 *   placeholder {string}
 *   icon        {string}   - emoji prefix
 *   error       {string}   - validation error message
 *   autoFocus   {boolean}
 *   onKeyDown   {function}
 */
export default function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  error,
  autoFocus = false,
  onKeyDown,
}) {
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? "#C96B8A88"
    : focused
    ? "rgba(124,107,201,0.7)"
    : "rgba(255,255,255,0.1)";

  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label
          style={{
            display: "block",
            fontSize: 11,
            fontWeight: 700,
            color: "#7A6E66",
            marginBottom: 7,
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          {label}
        </label>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "rgba(255,255,255,0.04)",
          border: `1.5px solid ${borderColor}`,
          borderRadius: 12,
          padding: "12px 14px",
          transition: "border-color 0.2s",
        }}
      >
        {icon && (
          <span style={{ fontSize: 15, flexShrink: 0, opacity: 0.55 }}>
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          autoFocus={autoFocus}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#E8E0D5",
            fontSize: 14,
            minWidth: 0,
          }}
        />
      </div>

      {error && (
        <p style={{ fontSize: 12, color: "#C96B8A", marginTop: 5 }}>{error}</p>
      )}
    </div>
  );
}
