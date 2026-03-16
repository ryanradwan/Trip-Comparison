import { ComparisonResult } from "@/lib/types";

interface Props {
  result: ComparisonResult;
  isPremium: boolean;
}

function getConfidence(marginOfVictory: number): { pct: number; label: string; color: string } {
  const pct = Math.min(98, Math.round(50 + marginOfVictory * 2.5));
  if (pct >= 80) return { pct, label: "High confidence", color: "#2D7A4F" };
  if (pct >= 60) return { pct, label: "Moderate confidence", color: "#A1785A" };
  return { pct, label: "Very close call", color: "#BFA38A" };
}

export default function VerdictCard({ result, isPremium }: Props) {
  const { city1, city2, winner, verdictText, totalScore1, totalScore2, marginOfVictory } = result;
  const winnerCity = winner === "city1" ? city1 : winner === "city2" ? city2 : null;
  const confidence = getConfidence(marginOfVictory);
  return (
    <div
      style={{
        backgroundColor: "var(--accent-winner-bg)",
        border: "1.5px solid var(--border-medium)",
        borderRadius: "var(--radius-lg)",
        padding: "28px 32px",
        boxShadow: "0 4px 20px rgba(123, 94, 67, 0.08)",
      }}
    >
      {/* Winner */}
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 6px" }}>
          Our Verdict
        </p>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 28,
            color: "var(--accent-winner)",
            margin: 0,
          }}
        >
          {winner === "tie" ? "It's a Tie" : `${winnerCity?.city} Wins`}
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6, flexWrap: "wrap" }}>
          {winner !== "tie" && (
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
              by {marginOfVictory.toFixed(1)} points
            </span>
          )}
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            fontSize: 11, fontWeight: 600, padding: "3px 10px",
            borderRadius: 99, color: confidence.color,
            backgroundColor: confidence.color + "18",
            border: `1px solid ${confidence.color}40`,
          }}>
            <span style={{ fontVariantNumeric: "tabular-nums" }}>{confidence.pct}%</span>
            {confidence.label}
          </span>
        </div>
      </div>

      {/* Score bars */}
      <div style={{ marginBottom: 20, padding: "16px 0", borderTop: "1px solid var(--border-medium)", borderBottom: "1px solid var(--border-medium)" }}>
        {[
          { city: city1, score: totalScore1, isWinner: winner === "city1" },
          { city: city2, score: totalScore2, isWinner: winner === "city2" },
        ].map(({ city, score, isWinner }) => (
          <div key={city.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, color: isWinner ? "var(--text-primary)" : "var(--text-muted)", fontWeight: isWinner ? 600 : 400, width: 90, flexShrink: 0 }}>
              {city.city}
            </div>
            <div style={{ flex: 1, backgroundColor: "var(--border-light)", borderRadius: 99, height: 10, overflow: "hidden" }}>
              <div className="score-bar-fill" style={{ height: "100%", borderRadius: 99, backgroundColor: isWinner ? "var(--accent-winner)" : "var(--color-tan)", width: `${score}%` }} />
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: isWinner ? "var(--accent-winner)" : "var(--text-muted)", fontVariantNumeric: "tabular-nums", width: 38, textAlign: "right", flexShrink: 0 }}>
              {score.toFixed(1)}
            </div>
          </div>
        ))}
      </div>

      {/* Verdict text */}
      <p style={{ fontSize: 15, color: "var(--text-body)", lineHeight: 1.7, margin: "0 0 20px" }}>
        {verdictText}
      </p>

    </div>
  );
}
