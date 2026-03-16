"use client";

import { useState } from "react";
import { CityProfile } from "@/lib/types";

interface Props {
  city1: CityProfile;
  city2: CityProfile;
}

// ── Shared sub-components ────────────────────────────────────────────────────

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 12,
        paddingBottom: 8,
        borderBottom: "1.5px solid var(--border-light)",
      }}
    >
      <span style={{ fontSize: 16 }}>{icon}</span>
      <h4
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: "var(--text-primary)",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          margin: 0,
        }}
      >
        {title}
      </h4>
    </div>
  );
}

function Section({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-light)",
        borderRadius: "var(--radius-md)",
        padding: "16px 18px",
        marginBottom: 12,
      }}
    >
      <SectionHeader icon={icon} title={title} />
      {children}
    </div>
  );
}

function BulletList({ items, accent }: { items: string[]; accent?: boolean }) {
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((item, i) => (
        <li
          key={i}
          style={{
            display: "flex",
            gap: 10,
            fontSize: 13,
            color: "var(--text-body)",
            lineHeight: 1.6,
            paddingLeft: accent ? 10 : 0,
            borderLeft: accent ? "2px solid var(--accent-secondary)" : "none",
          }}
        >
          {!accent && (
            <span style={{ color: "var(--accent-secondary)", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>•</span>
          )}
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function WarnList({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((item, i) => (
        <li
          key={i}
          style={{
            display: "flex",
            gap: 10,
            fontSize: 13,
            color: "var(--text-body)",
            lineHeight: 1.6,
            backgroundColor: "#FDF6EE",
            borderRadius: 6,
            padding: "8px 10px",
          }}
        >
          <span style={{ flexShrink: 0, marginTop: 1 }}>⚠️</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function LabelValueGrid({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {rows.map(({ label, value }, i) => (
        <div
          key={label}
          style={{
            display: "flex",
            gap: 12,
            padding: "8px 10px",
            backgroundColor: i % 2 === 0 ? "var(--color-sand-light, #FAF7F2)" : "transparent",
            borderRadius: 4,
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              minWidth: 110,
              paddingTop: 2,
              flexShrink: 0,
            }}
          >
            {label}
          </span>
          <span style={{ fontSize: 13, color: "var(--text-body)", flex: 1, lineHeight: 1.5 }}>{value}</span>
        </div>
      ))}
    </div>
  );
}

function TextBlock({ text }: { text: string }) {
  return (
    <div
      style={{
        backgroundColor: "var(--color-sand-light, #FAF7F2)",
        borderRadius: 6,
        padding: "12px 14px",
        fontSize: 13,
        color: "var(--text-body)",
        lineHeight: 1.7,
      }}
    >
      {text}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function PremiumContent({ city1, city2 }: Props) {
  const [activeTab, setActiveTab] = useState<"city1" | "city2">("city1");
  const activeCity = activeTab === "city1" ? city1 : city2;
  const p = activeCity.premium;

  return (
    <div>
      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 4,
          marginBottom: 20,
          backgroundColor: "var(--border-light)",
          borderRadius: "var(--radius-md)",
          padding: 4,
        }}
      >
        {([["city1", city1.city], ["city2", city2.city]] as const).map(([key, name]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              flex: 1,
              padding: "10px 16px",
              border: "none",
              borderRadius: "calc(var(--radius-md) - 2px)",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "'Playfair Display', serif",
              transition: "all 0.15s",
              backgroundColor: activeTab === key ? "var(--accent-primary)" : "transparent",
              color: activeTab === key ? "#FAF7F2" : "var(--text-muted)",
            }}
          >
            {name}
          </button>
        ))}
      </div>

      {/* City heading */}
      <div style={{ marginBottom: 16 }}>
        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 22,
            color: "var(--text-primary)",
            margin: "0 0 2px",
          }}
        >
          {activeCity.city} — Full Insider Guide
        </h3>
        <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
          {activeCity.country} · {activeCity.language} · {activeCity.currency}
        </p>
      </div>

      {/* Sections */}
      <Section icon="🗺️" title="Best Neighbourhoods to Stay">
        <BulletList items={p.neighborhoodRecs} />
      </Section>

      <Section icon="🛂" title="Visa Information">
        <BulletList items={p.visaInfo} />
      </Section>

      <Section icon="✈️" title="Airport Transfer">
        <LabelValueGrid rows={[
          { label: "Cheapest", value: p.airportTransfer.cheapest },
          { label: "Fastest", value: p.airportTransfer.fastest },
          { label: "Recommended", value: p.airportTransfer.recommended },
          { label: "Taxi estimate", value: p.airportTransfer.taxiEstimate },
        ]} />
      </Section>

      <Section icon="💱" title="Currency & Money Tips">
        <BulletList items={p.currencyTips} />
      </Section>

      <Section icon="📱" title="SIM Card & Connectivity">
        <TextBlock text={p.simCard} />
      </Section>

      <Section icon="💰" title="Daily Cost Breakdown">
        <LabelValueGrid rows={[
          { label: "Accommodation", value: p.dailyCostBreakdown.accommodation },
          { label: "Meals", value: p.dailyCostBreakdown.meals },
          { label: "Transport", value: p.dailyCostBreakdown.transport },
          { label: "Activities", value: p.dailyCostBreakdown.activities },
        ]} />
      </Section>

      <Section icon="🤝" title="Tipping & Etiquette">
        <BulletList items={p.tippingEtiquette} />
      </Section>

      <Section icon="💡" title="Insider Tips">
        <BulletList items={p.localTips} accent />
      </Section>

      <Section icon="⚠️" title="Areas to Avoid">
        <BulletList items={p.areasToAvoid} />
      </Section>

      <Section icon="🚨" title="Scam Warnings">
        <WarnList items={p.scamWarnings} />
      </Section>

      <Section icon="🚌" title="Day Trips">
        <BulletList items={p.dayTrips} />
      </Section>

      <Section icon="📅" title="Best Time to Visit">
        <TextBlock text={p.bestTimeToVisit} />
      </Section>

      <Section icon="🎒" title="Packing Tips">
        <BulletList items={p.packingTips} />
      </Section>

      <Section icon="📋" title="Booking Strategy">
        <TextBlock text={p.bookingStrategy} />
      </Section>

      <Section icon="🆘" title="Emergency Numbers">
        <LabelValueGrid rows={[
          { label: "Police", value: p.emergencyNumbers.police },
          { label: "Ambulance", value: p.emergencyNumbers.ambulance },
          { label: "General", value: p.emergencyNumbers.emergency },
        ]} />
      </Section>
    </div>
  );
}
