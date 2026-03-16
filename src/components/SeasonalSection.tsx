"use client";

import { CityProfile, TripContext, SeasonalScore } from "@/lib/types";
import { MONTHS } from "@/lib/constants";

interface Props {
  city1: CityProfile;
  city2: CityProfile;
  tripContext: TripContext;
  seasonalScores: SeasonalScore[];
}

function CrowdLabel(level: number): string {
  if (level <= 2) return "Very quiet";
  if (level <= 4) return "Light crowds";
  if (level <= 6) return "Moderate";
  if (level <= 8) return "Busy";
  return "Peak crowds";
}

function FlightLabel(idx: number): string {
  if (idx <= 3) return "Low season";
  if (idx <= 6) return "Mid season";
  return "High season";
}

export default function SeasonalSection({ city1, city2, tripContext, seasonalScores }: Props) {
  const month = tripContext.month;
  const m1 = city1.monthlyData[month];
  const m2 = city2.monthlyData[month];
  const monthName = MONTHS[month];

  const rows = [
    {
      label: "Weather",
      icon: "☀️",
      val1: `${m1.weatherScore}/10`,
      val2: `${m2.weatherScore}/10`,
      winner: m1.weatherScore > m2.weatherScore ? "city1" : m2.weatherScore > m1.weatherScore ? "city2" : "tie" as const,
    },
    {
      label: "Avg Temp",
      icon: "🌡️",
      val1: `${m1.avgTempCelsius}°C`,
      val2: `${m2.avgTempCelsius}°C`,
      winner: "tie" as const,
    },
    {
      label: "Rainy Days",
      icon: "🌧️",
      val1: `${m1.rainyDays} days`,
      val2: `${m2.rainyDays} days`,
      winner: m1.rainyDays < m2.rainyDays ? "city1" : m2.rainyDays < m1.rainyDays ? "city2" : "tie" as const,
    },
    {
      label: "Crowds",
      icon: "👥",
      val1: CrowdLabel(m1.crowdLevel),
      val2: CrowdLabel(m2.crowdLevel),
      winner: m1.crowdLevel < m2.crowdLevel ? "city1" : m2.crowdLevel < m1.crowdLevel ? "city2" : "tie" as const,
    },
    {
      label: "Flights",
      icon: "✈️",
      val1: FlightLabel(m1.flightPriceIndex),
      val2: FlightLabel(m2.flightPriceIndex),
      winner: m1.flightPriceIndex < m2.flightPriceIndex ? "city1" : m2.flightPriceIndex < m1.flightPriceIndex ? "city2" : "tie" as const,
    },
  ];

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
          alignItems: "center",
        }}
      >
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, color: "white", fontWeight: 600 }}>
          {monthName} Snapshot
        </span>
        <span style={{ textAlign: "center", color: "var(--color-sand-light)", fontSize: 14, fontWeight: 600 }}>{city1.city}</span>
        <span style={{ textAlign: "right", color: "var(--color-sand-light)", fontSize: 14, fontWeight: 600 }}>{city2.city}</span>
      </div>

      {/* Rows */}
      {rows.map((row, i) => (
        <div
          key={row.label}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            alignItems: "center",
            padding: "12px 24px",
            backgroundColor: i % 2 === 0 ? "var(--bg-card)" : "var(--bg-table-alt)",
            borderBottom: "1px solid var(--border-light)",
          }}
        >
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{row.icon} {row.label}</span>
          <span
            style={{
              textAlign: "center",
              fontSize: 13,
              fontWeight: row.winner === "city1" ? 600 : 400,
              color: row.winner === "city1" ? "var(--accent-winner)" : "var(--text-body)",
            }}
          >
            {row.val1}
            {row.winner === "city1" && <span style={{ marginLeft: 4, color: "var(--accent-winner)" }}>●</span>}
          </span>
          <span
            style={{
              textAlign: "right",
              fontSize: 13,
              fontWeight: row.winner === "city2" ? 600 : 400,
              color: row.winner === "city2" ? "var(--accent-winner)" : "var(--text-body)",
            }}
          >
            {row.winner === "city2" && <span style={{ marginRight: 4, color: "var(--accent-winner)" }}>●</span>}
            {row.val2}
          </span>
        </div>
      ))}
    </div>
  );
}
