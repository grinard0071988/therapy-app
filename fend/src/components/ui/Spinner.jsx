/**
 * Spinner
 * Animated loading ring used inside buttons and loading states.
 *
 * Props:
 *   color {string} - hex colour (default: white)
 *   size  {number} - diameter in px (default: 18)
 */
export default function Spinner({ color = "#fff", size = 18 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: `2px solid ${color}44`,
        borderTopColor: color,
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
        flexShrink: 0,
      }}
    />
  );
}
