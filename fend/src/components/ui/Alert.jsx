/**
 * Alert
 * Inline notification banner for errors, warnings, and info.
 *
 * Props:
 *   children  {ReactNode}
 *   type      {"error"|"warning"|"info"|"success"} - default "error"
 */
export default function Alert({ children, type = "error" }) {
  const palette = {
    error: { color: "#C96B8A", icon: "⚠️" },
    warning: { color: "#E8A94A", icon: "🔔" },
    info: { color: "#7C6BC9", icon: "ℹ️" },
    success: { color: "#4A9E8E", icon: "✅" },
  };
  const { color, icon } = palette[type] ?? palette.error;

  return (
    <div
      role="alert"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        background: `${color}18`,
        border: `1px solid ${color}44`,
        borderRadius: 12,
        padding: "11px 15px",
        marginBottom: 20,
      }}
    >
      <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{icon}</span>
      <span style={{ fontSize: 13, color, lineHeight: 1.55 }}>{children}</span>
    </div>
  );
}
