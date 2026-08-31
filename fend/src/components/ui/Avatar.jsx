/**
 * Avatar
 * Circular avatar showing the user's or counselor's initials.
 *
 * Props:
 *   initials {string}  - 1–2 character label, e.g. "SW"
 *   color    {string}  - hex accent colour, e.g. "#7C6BC9"
 *   size     {number}  - diameter in px (default 40)
 *   glow     {boolean} - adds a soft coloured glow (used for the active counselor)
 */
export default function Avatar({ initials, color, size = 40, glow = false }) {
  return (
    <div
      style={{
        width:          size,
        height:         size,
        borderRadius:   "50%",
        flexShrink:     0,
        background:     `linear-gradient(135deg, ${color}EE, ${color}66)`,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        color:          "#fff",
        fontWeight:     700,
        fontSize:       size * 0.34,
        letterSpacing:  "0.5px",
        boxShadow:      glow
          ? `0 0 24px ${color}66, 0 2px 8px ${color}44`
          : `0 2px 8px ${color}33`,
        border:         `2px solid ${color}44`,
        userSelect:     "none",
        transition:     "box-shadow 0.3s ease",
      }}
    >
      {initials}
    </div>
  );
}
