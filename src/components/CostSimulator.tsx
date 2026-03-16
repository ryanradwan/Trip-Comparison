"use client";

import { CityProfile, TripContext } from "@/lib/types";

interface Props {
  city1: CityProfile;
  city2: CityProfile;
  tripContext: TripContext;
}

function estimateTripCost(city: CityProfile, days: number, dailyBudget: number): number {
  // Use the city's budget tier closest to the user's daily budget
  const { budget, mid, premium } = city.budgetTiers;
  let cityDailyCost: number;
  if (dailyBudget <= budget * 1.3) {
    cityDailyCost = budget;
  } else if (dailyBudget <= mid * 1.3) {
    cityDailyCost = mid;
  } else {
    cityDailyCost = premium;
  }
  return Math.round(cityDailyCost * days);
}

export default function CostSimulator({ city1, city2, tripContext }: Props) {
  const { tripLengthDays, dailyBudget } = tripContext;

  const cost1 = estimateTripCost(city1, tripLengthDays, dailyBudget);
  const cost2 = estimateTripCost(city2, tripLengthDays, dailyBudget);
  const cheaper = cost1 <= cost2 ? city1 : city2;
  const costDiff = Math.abs(cost1 - cost2);
  const cheaperCost = Math.min(cost1, cost2);
  const expensiveCost = Math.max(cost1, cost2);
  const pctDiff = expensiveCost > 0 ? Math.round((costDiff / expensiveCost) * 100) : 0;

  const barMax = Math.max(cost1, cost2);

  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-light)",
        borderRadius: "var(--radius-lg)",
        padding: "24px 28px",
        boxShadow: "0 4px 20px rgba(123, 94, 67, 0.06)",
      }}
    >
      <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", margin: "0 0 6px" }}>
        💰 Trip Cost Estimate
      </p>
      <h3
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 18,
          color: "var(--text-primary)",
          margin: "0 0 18px",
        }}
      >
        {tripLengthDays}-day trip for your travel style
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 18 }}>
        {[
          { city: city1, cost: cost1 },
          { city: city2, cost: cost2 },
        ].map(({ city, cost }) => {
          const isCheaper = cost <= Math.min(cost1, cost2) + 0.01;
          return (
            <div key={city.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: isCheaper ? 600 : 400, color: isCheaper ? "var(--text-primary)" : "var(--text-muted)" }}>
                  {city.city}
                </span>
                <span style={{ fontSize: 20, fontWeight: 700, color: isCheaper ? "var(--accent-primary)" : "var(--text-muted)", fontVariantNumeric: "tabular-nums" }}>
                  ${cost.toLocaleString()}
                </span>
              </div>
              <div style={{ backgroundColor: "var(--border-light)", borderRadius: 99, height: 8, overflow: "hidden" }}>
                <div
                  className="score-bar-fill"
                  style={{
                    height: "100%",
                    borderRadius: 99,
                    backgroundColor: isCheaper ? "var(--accent-primary)" : "var(--color-tan)",
                    width: `${Math.round((cost / barMax) * 100)}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {costDiff > 0 && (
        <div
          style={{
            backgroundColor: "var(--bg-section-alt)",
            borderRadius: "var(--radius-md)",
            padding: "12px 16px",
            fontSize: 13,
            color: "var(--text-body)",
            lineHeight: 1.6,
          }}
        >
          <strong style={{ color: "var(--accent-primary)" }}>{cheaper.city}</strong> is estimated{" "}
          <strong>${costDiff.toLocaleString()}</strong> cheaper ({pctDiff}% less) for a {tripLengthDays}-day trip.
          {" "}Based on {city1.city}&apos;s ${city1.budgetTiers.mid}/day and {city2.city}&apos;s ${city2.budgetTiers.mid}/day mid-range costs.
        </div>
      )}

      <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "12px 0 0", fontStyle: "italic" }}>
        Estimates based on mid-range daily costs excluding international flights.
      </p>
    </div>
  );
}
