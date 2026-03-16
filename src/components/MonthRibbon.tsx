"use client";

import { useState } from "react";
import { CityProfile } from "@/lib/types";
import { MONTHS } from "@/lib/constants";

interface Props {
  city1: CityProfile;
  city2: CityProfile;
  selectedMonth: number;
  onMonthChange: (month: number) => void;
}

const SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function monthScore(city: CityProfile, m: number): number {
  const d = city.monthlyData[m];
  return d.weatherScore * 0.5 + (10 - d.crowdLevel) * 0.3 + (10 - d.flightPriceIndex) * 0.2;
}

// Classify months relative to each city's own score range — guarantees every city
// always shows its genuinely best months in green, not an absolute cut-off
function classifyMonths(city: CityProfile): { best: number[]; avoid: number[] } {
  const scores = Array.from({ length: 12 }, (_, m) => ({ m, s: monthScore(city, m) }));
  const sorted = [...scores].sort((a, b) => b.s - a.s);
  const best = sorted.slice(0, 4).map((x) => x.m);
  const avoid = sorted.slice(9).map((x) => x.m);
  return { best, avoid };
}

// Convert a sorted list of month indices into editorial ranges like "Nov – Feb · Apr"
function formatMonthRanges(months: number[]): string {
  if (months.length === 0) return "—";

  // Sort and find contiguous runs (wrapping Jan after Dec)
  const sorted = [...months].sort((a, b) => a - b);
  const runs: number[][] = [];
  let current = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === sorted[i - 1] + 1) {
      current.push(sorted[i]);
    } else {
      runs.push(current);
      current = [sorted[i]];
    }
  }
  runs.push(current);

  // Check if last run and first run are adjacent (wrap-around Dec → Jan)
  if (runs.length > 1 && runs[runs.length - 1][runs[runs.length - 1].length - 1] === 11 && runs[0][0] === 0) {
    const merged = [...runs[runs.length - 1], ...runs[0]];
    runs.splice(0, 1);
    runs.splice(runs.length - 1, 1);
    runs.push(merged);
  }

  return runs.map((run) => {
    if (run.length === 1) return SHORT[run[0]];
    return `${SHORT[run[0]]} – ${SHORT[run[run.length - 1]]}`;
  }).join("  ·  ");
}

function CityEditorial({
  city,
  selectedMonth,
  onMonthChange,
  hoveredMonth,
  onHover,
}: {
  city: CityProfile;
  selectedMonth: number;
  onMonthChange: (m: number) => void;
  hoveredMonth: number | null;
  onHover: (m: number | null) => void;
}) {
  const { best: bestMonths, avoid: avoidMonths } = classifyMonths(city);

  const displayMonth = hoveredMonth ?? selectedMonth;
  const d = city.monthlyData[displayMonth];

  return (
    <div style={{ marginBottom: 28 }}>
      {/* City name */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
        <h3 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 20,
          color: "var(--text-primary)",
          margin: 0,
          fontWeight: 700,
        }}>
          {city.city}
        </h3>
        <span style={{ fontSize: 12, color: "var(--text-muted)", fontStyle: "italic" }}>
          {MONTHS[displayMonth]}: {d.avgTempCelsius}°C · {d.rainyDays} rainy days
        </span>
      </div>

      {/* Thin editorial band */}
      <div style={{ display: "flex", gap: 2, marginBottom: 10 }}>
        {Array.from({ length: 12 }, (_, m) => {
          const isSelected = m === selectedMonth;
          const isHovered = m === hoveredMonth;
          const isBest = bestMonths.includes(m);
          const isAvoid = avoidMonths.includes(m);
          const bgColor = isBest ? "#4E8C5F" : isAvoid ? "#B85640" : "#C4943A";

          return (
            <button
              key={m}
              onClick={() => onMonthChange(m)}
              onMouseEnter={() => onHover(m)}
              onMouseLeave={() => onHover(null)}
              title={`${MONTHS[m]} — ${d.avgTempCelsius}°C`}
              style={{
                flex: 1,
                height: isSelected ? 14 : isHovered ? 12 : 10,
                borderRadius: 99,
                backgroundColor: bgColor,
                border: "none",
                cursor: "pointer",
                opacity: isSelected ? 1 : isHovered ? 0.9 : isBest ? 0.85 : 0.6,
                transition: "all 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
                padding: 0,
              }}
            />
          );
        })}
      </div>

      {/* Month labels */}
      <div style={{ display: "flex", gap: 2, marginBottom: 12 }}>
        {SHORT.map((label, m) => (
          <div
            key={label}
            style={{
              flex: 1,
              textAlign: "center",
              fontSize: 8.5,
              fontWeight: m === selectedMonth ? 700 : 400,
              color: m === selectedMonth ? "var(--text-primary)" : "var(--text-muted)",
              letterSpacing: "0.02em",
              cursor: "pointer",
            }}
            onClick={() => onMonthChange(m)}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Editorial verdict */}
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        <div>
          <span style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--color-espresso)",
            marginRight: 6,
          }}>
            Best
          </span>
          <span style={{ fontSize: 13, color: "var(--text-body)", fontWeight: 500 }}>
            {formatMonthRanges(bestMonths)}
          </span>
        </div>
        {avoidMonths.length > 0 && (
          <div>
            <span style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--color-tan)",
              marginRight: 6,
            }}>
              Avoid
            </span>
            <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 400 }}>
              {formatMonthRanges(avoidMonths)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MonthRibbon({ city1, city2, selectedMonth, onMonthChange }: Props) {
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  // Find months that are in the "best" category for both cities (relative ranking)
  const best1 = classifyMonths(city1).best;
  const best2 = classifyMonths(city2).best;
  const sharedGreat = Array.from({ length: 12 }, (_, m) => m).filter(
    (m) => best1.includes(m) && best2.includes(m)
  );

  const sharedInsight = sharedGreat.length > 0
    ? `${formatMonthRanges(sharedGreat)} ${sharedGreat.length === 1 ? "is" : "are"} great for both cities`
    : null;

  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-light)",
        borderRadius: "var(--radius-lg)",
        padding: "28px 32px",
        boxShadow: "0 4px 20px rgba(123, 94, 67, 0.06)",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <p style={{
          fontSize: 11,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "var(--text-muted)",
          margin: "0 0 4px",
        }}>
          When to Go
        </p>
        <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>
          Click any month to update the seasonal comparison below.
        </p>
      </div>

      {/* City editorials */}
      <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: 24 }}>
        <CityEditorial
          city={city1}
          selectedMonth={selectedMonth}
          onMonthChange={onMonthChange}
          hoveredMonth={hoveredMonth}
          onHover={setHoveredMonth}
        />
        <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: 24 }}>
          <CityEditorial
            city={city2}
            selectedMonth={selectedMonth}
            onMonthChange={onMonthChange}
            hoveredMonth={hoveredMonth}
            onHover={setHoveredMonth}
          />
        </div>
      </div>

      {/* Shared insight */}
      {sharedInsight && (
        <div style={{
          borderTop: "1px solid var(--border-light)",
          paddingTop: 16,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>✦</span>
          <p style={{
            fontSize: 13,
            color: "var(--text-body)",
            margin: 0,
            fontStyle: "italic",
            lineHeight: 1.6,
          }}>
            <strong style={{ fontStyle: "normal", color: "var(--text-primary)" }}>{sharedInsight}</strong> — the ideal window if you want the best of both destinations.
          </p>
        </div>
      )}

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginTop: 16, justifyContent: "flex-end" }}>
        {[
          ["#4E8C5F", "Best"],
          ["#C4943A", "OK"],
          ["#B85640", "Avoid"],
        ].map(([color, label]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 18, height: 6, borderRadius: 99, backgroundColor: color }} />
            <span style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.03em" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
