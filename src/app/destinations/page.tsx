"use client";

import { useState } from "react";
import Link from "next/link";
import { getCityIndex } from "@/lib/cities";
import { generateSlug } from "@/lib/utils";

const ALL_CITIES = getCityIndex().filter((c) => c.enabled);
const REGIONS = ["All", ...Array.from(new Set(ALL_CITIES.map((c) => c.region))).sort()];

const BUDGET_FILTERS = [
  { label: "All", value: "all" },
  { label: "Budget (under $60)", value: "budget" },
  { label: "Mid ($60–150)", value: "mid" },
  { label: "Premium ($150+)", value: "premium" },
];

export default function DestinationsPage() {
  const [regionFilter, setRegionFilter] = useState("All");
  const [budgetFilter, setBudgetFilter] = useState("all");

  const filtered = ALL_CITIES.filter((city) => {
    const regionMatch = regionFilter === "All" || city.region === regionFilter;
    const budgetMatch = budgetFilter === "all" || city.budgetCategory === budgetFilter;
    return regionMatch && budgetMatch;
  });

  const pillStyle = (active: boolean): React.CSSProperties => ({
    padding: "6px 14px",
    borderRadius: 99,
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    border: active ? "1.5px solid var(--accent-primary)" : "1.5px solid var(--border-light)",
    backgroundColor: active ? "var(--accent-primary)" : "var(--bg-card)",
    color: active ? "white" : "var(--text-muted)",
    transition: "all 0.15s",
  });

  // Group filtered cities by region for display
  const grouped: Record<string, typeof filtered> = {};
  for (const city of filtered) {
    if (!grouped[city.region]) grouped[city.region] = [];
    grouped[city.region].push(city);
  }
  const regions = Object.keys(grouped).sort();

  return (
    <main style={{ maxWidth: 1024, margin: "0 auto", padding: "40px 16px 64px" }}>
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 36,
            color: "var(--text-primary)",
            margin: "0 0 12px",
          }}
        >
          Browse Destinations
        </h1>
        <p style={{ fontSize: 15, color: "var(--text-muted)", margin: 0 }}>
          {ALL_CITIES.length} cities across {REGIONS.length - 1} regions. Click any two to compare.
        </p>
      </div>

      {/* Filters */}
      <div
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-light)",
          borderRadius: "var(--radius-lg)",
          padding: "18px 20px",
          marginBottom: 36,
        }}
      >
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 10px" }}>Region</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {REGIONS.map((r) => (
              <button key={r} onClick={() => setRegionFilter(r)} style={pillStyle(regionFilter === r)}>
                {r}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 10px" }}>Daily Budget</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {BUDGET_FILTERS.map((b) => (
              <button key={b.label} onClick={() => setBudgetFilter(b.value)} style={pillStyle(budgetFilter === b.value)}>
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 20px" }}>
        Showing {filtered.length} {filtered.length === 1 ? "city" : "cities"}
        {regionFilter !== "All" ? ` in ${regionFilter}` : ""}
      </p>

      {regions.map((region) => (
        <section key={region} style={{ marginBottom: 48 }}>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 22,
              color: "var(--text-primary)",
              margin: "0 0 16px",
              paddingBottom: 8,
              borderBottom: "2px solid var(--border-light)",
            }}
          >
            {region}
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: 10,
            }}
          >
            {grouped[region].map((city) => (
              <div
                key={city.id}
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border-light)",
                  borderRadius: "var(--radius-md)",
                  padding: "14px 16px",
                  boxShadow: "0 2px 8px rgba(123, 94, 67, 0.04)",
                }}
              >
                <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: 14, marginBottom: 2 }}>
                  {city.city}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10 }}>
                  {city.country}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {ALL_CITIES
                    .filter((c) => c.id !== city.id && c.region === city.region)
                    .slice(0, 3)
                    .map((other) => (
                      <Link
                        key={other.id}
                        href={`/compare/${generateSlug(city.id, other.id)}`}
                        style={{
                          fontSize: 11,
                          color: "var(--accent-primary)",
                          textDecoration: "none",
                          padding: "2px 6px",
                          border: "1px solid var(--color-tan)",
                          borderRadius: 4,
                        }}
                      >
                        vs {other.city}
                      </Link>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
          <p style={{ fontSize: 16 }}>No cities match your filters.</p>
          <button
            onClick={() => { setRegionFilter("All"); setBudgetFilter("all"); }}
            style={{ marginTop: 12, color: "var(--accent-primary)", background: "none", border: "none", cursor: "pointer", fontSize: 13, textDecoration: "underline" }}
          >
            Clear filters
          </button>
        </div>
      )}
    </main>
  );
}
