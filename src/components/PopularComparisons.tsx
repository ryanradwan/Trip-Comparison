import Link from "next/link";
import { generateSlug } from "@/lib/utils";

const POPULAR_PAIRS = [
  { city1: "lisbon", name1: "Lisbon", city2: "athens", name2: "Athens", badge: "🔥 Trending" },
  { city1: "tokyo", name1: "Tokyo", city2: "kyoto", name2: "Kyoto", badge: "⭐ Popular" },
  { city1: "barcelona", name1: "Barcelona", city2: "rome", name2: "Rome", badge: "🔥 Trending" },
  { city1: "bangkok", name1: "Bangkok", city2: "chiang-mai", name2: "Chiang Mai", badge: "⭐ Popular" },
  { city1: "ubud", name1: "Ubud", city2: "seminyak", name2: "Seminyak", badge: null },
  { city1: "dubrovnik", name1: "Dubrovnik", city2: "split", name2: "Split", badge: "✏️ Staff Pick" },
  { city1: "paris", name1: "Paris", city2: "london", name2: "London", badge: "🔥 Trending" },
  { city1: "medellin", name1: "Medellín", city2: "cartagena", name2: "Cartagena", badge: "✏️ Staff Pick" },
  { city1: "marrakech", name1: "Marrakech", city2: "istanbul", name2: "Istanbul", badge: "⭐ Popular" },
];

export default function PopularComparisons() {
  return (
    <section style={{ marginTop: 56 }}>
      <h2
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 22,
          color: "var(--text-primary)",
          textAlign: "center",
          marginBottom: 24,
        }}
      >
        Popular Comparisons
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 12,
        }}
      >
        {POPULAR_PAIRS.map((pair) => {
          const slug = generateSlug(pair.city1, pair.city2);
          return (
            <Link
              key={slug}
              href={`/compare/${slug}`}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: "14px 16px",
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-light)",
                borderRadius: "var(--radius-md)",
                textDecoration: "none",
                color: "var(--text-body)",
                fontSize: 14,
                fontWeight: 500,
                transition: "border-color 0.15s, box-shadow 0.15s",
                boxShadow: "0 2px 8px rgba(123, 94, 67, 0.04)",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "var(--accent-primary)";
                el.style.boxShadow = "0 4px 16px rgba(123, 94, 67, 0.10)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "var(--border-light)";
                el.style.boxShadow = "0 2px 8px rgba(123, 94, 67, 0.04)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{pair.name1}</span>
                <span style={{ color: "var(--text-muted)", fontSize: 12 }}>vs</span>
                <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{pair.name2}</span>
              </div>
              {pair.badge && (
                <span className="comparison-badge">{pair.badge}</span>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
