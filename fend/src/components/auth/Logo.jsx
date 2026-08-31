/**
 * Logo
 * Centred app logo + tagline used on the auth screens.
 *
 * Props:
 *   subtitle {string} - optional one-liner below the name
 */
export default function Logo({ subtitle }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 38 }}>
      <div
        style={{
          width: 54,
          height: 54,
          borderRadius: 16,
          background: "linear-gradient(135deg, #7C6BC9, #4A9E8E)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 26,
          margin: "0 auto 14px",
          boxShadow: "0 8px 32px #7C6BC944",
        }}
      >
        🌿
      </div>
      <h1
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 34,
          fontWeight: 700,
          color: "#F0EBE3",
          letterSpacing: "-0.5px",
        }}
      >
        Solace
      </h1>
      {subtitle && (
        <p style={{ color: "#5A5048", fontSize: 14, marginTop: 6 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
