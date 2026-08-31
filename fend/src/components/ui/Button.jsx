import Spinner from "./Spinner.jsx";

/**
 * Button
 * The single button component used throughout the app.
 *
 * Props:
 *   children   {ReactNode}
 *   onClick    {function}
 *   variant    {"primary"|"ghost"}        - default "primary"
 *   color      {string}                   - hex accent (default purple)
 *   size       {"sm"|"md"|"lg"}           - default "md"
 *   fullWidth  {boolean}
 *   disabled   {boolean}
 *   loading    {boolean}
 *   type       {"button"|"submit"}        - default "button"
 */
export default function Button({
  children,
  onClick,
  variant = "primary",
  color = "#7C6BC9",
  size = "md",
  fullWidth = false,
  disabled = false,
  loading = false,
  type = "button",
}) {
  const pad = { sm: "8px 15px", md: "11px 20px", lg: "14px 28px" }[size];
  const fontSize = size === "sm" ? 13 : 14;
  const isDisabled = disabled || loading;

  const bg =
    variant === "primary"
      ? isDisabled
        ? "rgba(124,107,201,0.28)"
        : `linear-gradient(135deg, ${color}, ${color}BB)`
      : "rgba(255,255,255,0.06)";

  const handleMouseOver = (e) => {
    if (!isDisabled) e.currentTarget.style.opacity = "0.82";
  };
  const handleMouseOut = (e) => {
    e.currentTarget.style.opacity = "1";
  };
  const handleMouseDown = (e) => {
    if (!isDisabled) e.currentTarget.style.transform = "scale(0.97)";
  };
  const handleMouseUp = (e) => {
    e.currentTarget.style.transform = "scale(1)";
  };

  return (
    <button
      type={type}
      onClick={!isDisabled ? onClick : undefined}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{
        width: fullWidth ? "100%" : "auto",
        padding: pad,
        borderRadius: 12,
        border:
          variant === "ghost" ? "1px solid rgba(255,255,255,0.12)" : "none",
        background: bg,
        color: isDisabled ? "rgba(255,255,255,0.3)" : "#fff",
        fontWeight: 600,
        fontSize: fontSize,
        cursor: isDisabled ? "not-allowed" : "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        transition: "opacity 0.18s, transform 0.1s",
        outline: "none",
      }}
    >
      {loading && <Spinner color="#fff" />}
      {children}
    </button>
  );
}
