"use client";

import { CategoryScore, CityProfile } from "@/lib/types";
import ScoreBar from "./ScoreBar";

interface Props {
  city1: CityProfile;
  city2: CityProfile;
  categoryScores: CategoryScore[];
}

export default function ComparisonTable({ city1, city2, categoryScores }: Props) {
  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(123, 94, 67, 0.06)",
        border: "1px solid var(--border-light)",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "var(--bg-table-header)",
          padding: "16px 24px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 16,
          alignItems: "end",
        }}
      >
        <span style={{ color: "white", fontSize: 13, fontWeight: 600, opacity: 0.7 }}>Category</span>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", color: "white", fontSize: 16, fontWeight: 600 }}>{city1.city}</div>
          <div style={{ color: "var(--color-sand-light)", fontSize: 12, marginTop: 2 }}>{city1.country}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", color: "white", fontSize: 16, fontWeight: 600 }}>{city2.city}</div>
          <div style={{ color: "var(--color-sand-light)", fontSize: 12, marginTop: 2 }}>{city2.country}</div>
        </div>
      </div>

      {/* Rows */}
      {categoryScores.map((cat, i) => (
        <div
          key={cat.category}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 16,
            alignItems: "center",
            padding: "14px 24px",
            backgroundColor: i % 2 === 0 ? "var(--bg-card)" : "var(--bg-table-alt)",
            borderBottom: i < categoryScores.length - 1 ? "1px solid var(--border-light)" : "none",
          }}
        >
          <span style={{ fontSize: 13, color: "var(--text-body)" }}>{cat.icon} {cat.label}</span>
          <div style={{ padding: "0 8px" }}>
            <ScoreBar score={cat.score1} isWinner={cat.winner === "city1"} dimmed={cat.winner === "city2"} />
          </div>
          <div style={{ padding: "0 8px" }}>
            <ScoreBar score={cat.score2} isWinner={cat.winner === "city2"} dimmed={cat.winner === "city1"} />
          </div>
        </div>
      ))}
    </div>
  );
}
