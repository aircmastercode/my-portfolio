"use client";

// Soft, drifting mesh-gradient "aurora" behind all content. Multi-hue atmosphere
// derived from the active theme's accent trio, giving depth without flatness.
export default function Aurora() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div
        className="aurora-blob"
        style={{
          top: "-10%",
          left: "-5%",
          width: "55vw",
          height: "55vw",
          background: "radial-gradient(circle at center, var(--accent), transparent 65%)",
          animation: "aurora-drift-1 18s ease-in-out infinite",
        }}
      />
      <div
        className="aurora-blob"
        style={{
          top: "5%",
          right: "-10%",
          width: "50vw",
          height: "50vw",
          background: "radial-gradient(circle at center, var(--accent-warm), transparent 65%)",
          animation: "aurora-drift-2 22s ease-in-out infinite",
        }}
      />
      <div
        className="aurora-blob"
        style={{
          bottom: "-15%",
          left: "20%",
          width: "48vw",
          height: "48vw",
          background: "radial-gradient(circle at center, var(--accent-2), transparent 65%)",
          animation: "aurora-drift-3 26s ease-in-out infinite",
        }}
      />
      {/* darken toward edges so content stays readable */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(120% 90% at 50% 30%, transparent 30%, var(--bg) 85%)" }}
      />
    </div>
  );
}
