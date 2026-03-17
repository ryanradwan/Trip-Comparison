"use client";

export default function BackButton() {
  return (
    <button
      onClick={() => { window.parent.location.href = 'https://thenextstamptravelco.com'; }}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "var(--text-muted)",
        fontSize: 13,
        padding: 0,
      }}
    >
      ← Back
    </button>
  );
}
