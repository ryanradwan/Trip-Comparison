"use client";

import { ItineraryProduct } from "@/lib/itineraries";

interface Props {
  itineraries: ItineraryProduct[];
}

export default function ItineraryRecommendations({ itineraries }: Props) {
  if (itineraries.length === 0) return null;

  return (
    <section style={{ marginTop: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--accent-secondary)",
            margin: "0 0 4px",
          }}
        >
          From The Next Stamp Shop
        </p>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 22,
            color: "var(--text-primary)",
            margin: 0,
          }}
        >
          {itineraries.length === 1
            ? "Recommended Itinerary"
            : "Recommended Itineraries for These Cities"}
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: itineraries.length === 1 ? "1fr" : "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {itineraries.map((item) => (
          <ItineraryCard key={item.url} item={item} />
        ))}
      </div>
    </section>
  );
}

function ItineraryCard({ item }: { item: ItineraryProduct }) {
  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1.5px solid var(--accent-secondary)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header bar */}
      <div
        style={{
          backgroundColor: "var(--accent-primary)",
          padding: "8px 16px",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span style={{ fontSize: 10 }}>⭐</span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#FAF7F2",
          }}
        >
          Featured Guide · {item.cityLabel}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: "20px 20px 0" }}>
        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 18,
            color: "var(--text-primary)",
            margin: "0 0 8px",
            lineHeight: 1.3,
          }}
        >
          {item.name}
        </h3>
        <p
          style={{
            fontSize: 13,
            color: "var(--text-body)",
            lineHeight: 1.6,
            margin: "0 0 16px",
          }}
        >
          {item.description}
        </p>

        {/* Highlights */}
        <ul style={{ margin: "0 0 20px", padding: 0, listStyle: "none" }}>
          {item.highlights.map((h) => (
            <li
              key={h}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 12,
                color: "var(--text-body)",
                marginBottom: 6,
              }}
            >
              <span style={{ color: "var(--accent-secondary)", fontWeight: 700, flexShrink: 0 }}>✓</span>
              {h}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div style={{ padding: "0 20px 20px", marginTop: "auto" }}>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            width: "100%",
            padding: "12px 0",
            backgroundColor: "var(--accent-primary)",
            color: "#FAF7F2",
            fontWeight: 700,
            fontSize: 14,
            textAlign: "center",
            borderRadius: "var(--radius-md)",
            textDecoration: "none",
            transition: "background-color 0.15s",
            boxSizing: "border-box",
          }}
        >
          View Itinerary →
        </a>
      </div>
    </div>
  );
}
