"use client";

import { CityProfile, CityIndexEntry } from "@/lib/types";
import { generateSlug } from "@/lib/utils";
import citiesIndex from "@/data/cities/_index.json";

const BUDGET_RANK: Record<string, number> = { budget: 0, mid: 1, premium: 2 };

interface Props {
  winnerCity: CityProfile;
  city1Id: string;
  city2Id: string;
}

export default function HiddenGemCard({ winnerCity, city1Id, city2Id }: Props) {
  const index = citiesIndex as CityIndexEntry[];

  // Determine winner's budget tier from the index
  const winnerEntry = index.find((c) => c.id === winnerCity.id);
  const winnerBudgetRank = BUDGET_RANK[winnerEntry?.budgetCategory ?? "mid"];

  // Find a hidden gem: same region, cheaper or equal budget, not either compared city
  const candidates = index.filter(
    (c) =>
      c.enabled &&
      c.id !== city1Id &&
      c.id !== city2Id &&
      c.region === winnerCity.region &&
      BUDGET_RANK[c.budgetCategory] < winnerBudgetRank
  );

  // Fallback: same region, same budget, different city
  const fallback = index.filter(
    (c) =>
      c.enabled &&
      c.id !== city1Id &&
      c.id !== city2Id &&
      c.region === winnerCity.region &&
      BUDGET_RANK[c.budgetCategory] <= winnerBudgetRank
  );

  const gem = candidates[0] ?? fallback[0];

  if (!gem) return null;

  const slug = generateSlug(winnerCity.id, gem.id);
  const budgetLabels: Record<string, string> = { budget: "budget-friendly", mid: "mid-range", premium: "premium" };

  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-light)",
        borderRadius: "var(--radius-lg)",
        padding: "22px 28px",
        boxShadow: "0 4px 20px rgba(123, 94, 67, 0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 20,
        flexWrap: "wrap",
      }}
    >
      <div style={{ flex: 1, minWidth: 200 }}>
        <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", margin: "0 0 6px" }}>
          💎 Hidden Gem Alternative
        </p>
        <p style={{ fontSize: 15, color: "var(--text-body)", margin: "0 0 4px", lineHeight: 1.5 }}>
          Love {winnerCity.city} but want something more {budgetLabels[gem.budgetCategory]}? Consider{" "}
          <strong style={{ color: "var(--text-primary)" }}>{gem.city}</strong>.
        </p>
        <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>
          {gem.city}, {gem.country} · {gem.region}
        </p>
      </div>
      <a
        href={`/compare/${slug}`}
        style={{
          display: "inline-block",
          padding: "10px 20px",
          backgroundColor: "var(--accent-primary)",
          color: "white",
          borderRadius: "var(--radius-md)",
          fontSize: 13,
          fontWeight: 600,
          textDecoration: "none",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        Compare {winnerCity.city} vs {gem.city} →
      </a>
    </div>
  );
}
