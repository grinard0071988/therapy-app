/**
 * Badge
 * Small pill-shaped label, coloured to match a counselor or status.
 *
 * Props:
 *   children {ReactNode}
 *   color    {string}  - hex colour
 */
export default function Badge({ children, color }) {
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.6px",
        textTransform: "uppercase",
        padding: "2px 8px",
        borderRadius: 20,
        background: `${color}28`,
        color: color,
        border: `1px solid ${color}44`,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}
