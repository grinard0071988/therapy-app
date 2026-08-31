/**
 * AuthBackground
 * Fixed decorative radial-gradient blobs behind the auth card.
 * Rendered once at the auth layout level.
 */
export default function AuthBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-25%",
          left: "-15%",
          width: "55%",
          height: "55%",
          borderRadius: "50%",
          background: "radial-gradient(circle, #7C6BC91A 0%, transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-15%",
          right: "-10%",
          width: "50%",
          height: "50%",
          borderRadius: "50%",
          background: "radial-gradient(circle, #4A9E8E14 0%, transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "40%",
          right: "25%",
          width: "30%",
          height: "30%",
          borderRadius: "50%",
          background: "radial-gradient(circle, #C96B8A0C 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
