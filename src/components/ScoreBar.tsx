"use client";

interface Props {
  score: number; // 0-10
  isWinner?: boolean;
  dimmed?: boolean;
}

function getBarColor(score: number): string {
  if (score >= 8) return "rgba(161, 120, 90, 1)";
  if (score >= 6) return "rgba(161, 120, 90, 0.7)";
  if (score >= 4) return "#D8C2A7";
  return "rgba(191, 163, 138, 0.6)";
}

export default function ScoreBar({ score, isWinner, dimmed }: Props) {
  const pct = Math.min(100, Math.max(0, score * 10));
  const color = getBarColor(score);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        style={{
          flex: 1,
          height: 6,
          backgroundColor: "var(--color-sand-light)",
          borderRadius: 9999,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            backgroundColor: color,
            borderRadius: 9999,
            opacity: dimmed ? 0.4 : 1,
            transition: "width 0.5s ease",
          }}
        />
      </div>
      <span
        style={{
          fontSize: 13,
          fontVariantNumeric: "tabular-nums",
          color: isWinner ? "var(--accent-winner)" : dimmed ? "var(--text-muted)" : "var(--text-body)",
          fontWeight: isWinner ? 600 : 400,
          minWidth: 28,
          textAlign: "right",
        }}
      >
        {score}
        {isWinner && (
          <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", backgroundColor: "var(--accent-winner)", marginLeft: 4, verticalAlign: "middle" }} />
        )}
      </span>
    </div>
  );
}
