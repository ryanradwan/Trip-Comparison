"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CityInput from "@/components/CityInput";
import PopularComparisons from "@/components/PopularComparisons";
import { CityIndexEntry } from "@/lib/types";
import { generateSlug } from "@/lib/utils";
import citiesIndex from "@/data/cities/_index.json";

const cities = citiesIndex as CityIndexEntry[];

export default function HomePage() {
  const [city1, setCity1] = useState<CityIndexEntry | null>(null);
  const [city2, setCity2] = useState<CityIndexEntry | null>(null);
  const router = useRouter();

  function handleCompare() {
    if (!city1 || !city2) return;
    const slug = generateSlug(city1.id, city2.id);
    router.push(`/compare/${slug}`);
  }

  const canCompare = city1 !== null && city2 !== null;

  return (
    <main style={{ maxWidth: 1024, margin: "0 auto", padding: "0 16px" }}>
      {/* Hero */}
      <section
        style={{
          textAlign: "center",
          padding: "72px 16px 56px",
        }}
      >
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(28px, 5vw, 48px)",
            color: "var(--text-primary)",
            margin: "0 0 16px",
            lineHeight: 1.2,
          }}
        >
          Can&apos;t decide between two destinations?
        </h1>
        <p
          style={{
            fontSize: 18,
            color: "var(--text-muted)",
            margin: "0 auto 48px",
            maxWidth: 520,
            lineHeight: 1.6,
          }}
        >
          Compare them side by side — personalized to your travel style, budget, and priorities.
        </p>

        {/* City pickers */}
        <div
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-light)",
            borderRadius: "var(--radius-lg)",
            padding: "28px 32px",
            boxShadow: "0 4px 24px rgba(123, 94, 67, 0.06)",
            maxWidth: 640,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 16,
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            <CityInput
              label="First destination"
              value={city1}
              onChange={setCity1}
              excludeId={city2?.id}
              cities={cities}
            />

            <div
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "var(--text-muted)",
                paddingTop: 28,
                flexShrink: 0,
              }}
            >
              VS
            </div>

            <CityInput
              label="Second destination"
              value={city2}
              onChange={setCity2}
              excludeId={city1?.id}
              cities={cities}
            />
          </div>

          <button
            onClick={handleCompare}
            disabled={!canCompare}
            style={{
              marginTop: 20,
              width: "100%",
              padding: "14px",
              backgroundColor: canCompare ? "var(--accent-primary)" : "var(--color-tan)",
              color: "white",
              border: "none",
              borderRadius: "var(--radius-md)",
              fontSize: 15,
              fontWeight: 600,
              cursor: canCompare ? "pointer" : "not-allowed",
              transition: "background-color 0.15s",
            }}
            onMouseEnter={(e) => {
              if (canCompare) (e.currentTarget as HTMLElement).style.backgroundColor = "var(--accent-hover)";
            }}
            onMouseLeave={(e) => {
              if (canCompare) (e.currentTarget as HTMLElement).style.backgroundColor = "var(--accent-primary)";
            }}
          >
            Compare These Cities →
          </button>
        </div>
      </section>

      {/* Social proof */}
      <section style={{ marginBottom: 56 }}>
        {/* Stats bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "32px",
            flexWrap: "wrap",
            padding: "24px 16px",
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-light)",
            borderRadius: "var(--radius-lg)",
            marginBottom: 40,
          }}
        >
          {[
            { value: "50,000+", label: "Comparisons made" },
            { value: "50", label: "Destinations covered" },
            { value: "Monthly", label: "Data updates" },
          ].map(({ value, label }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: "var(--accent-primary)", lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Feature icons */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 40 }}>
          {[
            { icon: "🎯", title: "Personalised Scoring", desc: "Adjust what matters most — beach, food, nightlife, budget — and get a result tailored to you." },
            { icon: "📊", title: "Expert City Data", desc: "50 destinations with scores across 18 categories, updated monthly with real travel insights." },
            { icon: "📄", title: "Instant PDF Report", desc: "Unlock a branded PDF with insider tips, visa info, scam warnings, and cost breakdowns for both cities." },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-light)",
                borderRadius: "var(--radius-md)",
                padding: "20px 22px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>{title}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          {[
            { initials: "SM", color: "#A1785A", quote: "The cost breakdown showed Porto was 22% cheaper than Lisbon — exactly what I needed to make the call. Booked within the hour.", name: "Sarah M.", comparison: "Lisbon vs Porto", trip: "Solo trip · Sept 2025" },
            { initials: "JP", color: "#7B5E43", quote: "The typhoon season data for our Tokyo vs Bali comparison saved us from a disaster honeymoon. We hadn't even considered travel month.", name: "James & Priya", comparison: "Tokyo vs Bali", trip: "Couple trip · Nov 2025" },
            { initials: "TR", color: "#BFA38A", quote: "Family-friendliness scores and the daily cost breakdown made choosing between Barcelona and Rome straightforward. Kids loved the trip.", name: "Tom R.", comparison: "Barcelona vs Rome", trip: "Family trip · Aug 2025" },
          ].map(({ initials, color, quote, name, comparison, trip }) => (
            <div
              key={name}
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-light)",
                borderRadius: "var(--radius-md)",
                padding: "20px 22px",
              }}
            >
              <div style={{ color: "var(--color-bronze)", fontSize: 13, marginBottom: 10, letterSpacing: 1 }}>★★★★★</div>
              <p style={{ fontSize: 13, color: "var(--text-body)", lineHeight: 1.7, margin: "0 0 14px", fontStyle: "italic" }}>&ldquo;{quote}&rdquo;</p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className="testimonial-avatar" style={{ backgroundColor: color }}>{initials}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{name}</div>
                  <div style={{ fontSize: 11, color: "var(--accent-primary)", marginTop: 1 }}>{comparison}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>{trip}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular comparisons */}
      <PopularComparisons />

      {/* Browse link */}
      <div style={{ textAlign: "center", marginTop: 48, marginBottom: 24 }}>
        <a
          href="/destinations"
          style={{ color: "var(--accent-primary)", fontSize: 14, textDecoration: "underline" }}
        >
          Browse all {cities.length} destinations →
        </a>
      </div>

      {/* FAQ teaser */}
      <section
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-light)",
          borderRadius: "var(--radius-lg)",
          padding: "36px 32px",
          marginBottom: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 22,
              color: "var(--text-primary)",
              margin: "0 0 8px",
            }}
          >
            Have questions?
          </h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", margin: 0, lineHeight: 1.6 }}>
            Learn how scoring works, what&apos;s in the premium guide, and how to get the most out of your comparison.
          </p>
        </div>
        <a
          href="/faq"
          style={{
            display: "inline-block",
            padding: "12px 24px",
            backgroundColor: "var(--accent-primary)",
            color: "white",
            borderRadius: "var(--radius-md)",
            fontSize: 14,
            fontWeight: 600,
            textDecoration: "none",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          View FAQ →
        </a>
      </section>
    </main>
  );
}
