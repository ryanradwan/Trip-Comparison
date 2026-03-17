"use client";

import { useState } from "react";
import { TripContext, TravelerWeights } from "@/lib/types";

interface Props {
  slug: string;
  onUnlocked: () => void;
  tripContext?: TripContext;
  weights?: TravelerWeights;
}

export default function PremiumUpsell({ slug, onUnlocked, tripContext, weights }: Props) {
  const [loading, setLoading] = useState<"single" | "annual" | null>(null);

  async function handleCheckout(priceType: "single" | "annual") {
    setLoading(priceType);
    const stripeWindow = window.open('', '_blank');
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceType, slug, tripContext, weights }),
      });
      const { url } = await res.json();
      if (url && stripeWindow) {
        stripeWindow.location.href = url;
      } else {
        stripeWindow?.close();
      }
      setLoading(null);
    } catch (e) {
      console.error(e);
      stripeWindow?.close();
      setLoading(null);
    }
  }

  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-medium)",
        borderRadius: "var(--radius-lg)",
        padding: "32px",
        boxShadow: "0 4px 20px rgba(123, 94, 67, 0.06)",
        textAlign: "center",
      }}
    >
      <p style={{ fontSize: 12, fontWeight: 600, color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 8px" }}>
        Premium Breakdown
      </p>
      <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 4px" }}>
        ⭐⭐⭐⭐⭐ &nbsp;Trusted by 1,000+ travellers
      </p>
      <h3
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 22,
          color: "var(--text-primary)",
          margin: "0 0 12px",
        }}
      >
        Unlock the Full Insider Guide + PDF
      </h3>
      <p style={{ fontSize: 14, color: "var(--text-muted)", margin: "0 0 20px", lineHeight: 1.6, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
        Everything the free comparison doesn&apos;t show — the real insider intel for both cities.
      </p>

      {/* Feature list */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "8px 24px", maxWidth: 560, margin: "0 auto 28px", textAlign: "left" }}>
        {[
          "🗺️ Best neighbourhoods to stay",
          "✈️ Airport transfer options & costs",
          "🛂 Visa requirements & e-visa links",
          "💱 Currency tips & best ATMs",
          "📱 SIM card & data advice",
          "💰 Daily cost breakdown by category",
          "🤝 Tipping & local etiquette guide",
          "💡 Insider tips from local knowledge",
          "⚠️ Areas to avoid + safety notes",
          "🚨 Common scams & how to avoid them",
          "🚌 Best day trips from each city",
          "📅 Best time to visit & booking strategy",
          "🎒 Packing tips for the destination",
          "🆘 Emergency numbers for both cities",
          "📄 Branded PDF to download & share",
        ].map((item) => (
          <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "var(--text-body)", lineHeight: 1.5 }}>
            <span style={{ flexShrink: 0 }}>{item.split(" ")[0]}</span>
            <span>{item.split(" ").slice(1).join(" ")}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
        {/* Single */}
        <div
          style={{
            border: "1.5px solid var(--border-medium)",
            borderRadius: "var(--radius-md)",
            padding: "20px 24px",
            width: 200,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>This comparison</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>$5.99</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16 }}>one-time</div>
          <button
            onClick={() => handleCheckout("single")}
            disabled={loading !== null}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "var(--color-espresso)",
              color: "var(--color-cream)",
              border: "none",
              borderRadius: "var(--radius-sm)",
              fontSize: 13,
              fontWeight: 600,
              cursor: loading !== null ? "not-allowed" : "pointer",
              opacity: loading !== null ? 0.7 : 1,
            }}
          >
            {loading === "single" ? "Loading..." : "Unlock This Comparison"}
          </button>
          <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "8px 0 0", lineHeight: 1.4 }}>
            ✓ Instant access &nbsp;·&nbsp; ✓ 7-day money-back guarantee
          </p>
        </div>

        {/* Annual */}
        <div
          style={{
            border: "2px solid var(--accent-primary)",
            borderRadius: "var(--radius-md)",
            padding: "20px 24px",
            width: 200,
            textAlign: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -12,
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "var(--accent-primary)",
              color: "white",
              fontSize: 11,
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: 99,
              whiteSpace: "nowrap",
            }}
          >
            Best Value
          </div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>Unlimited, 1 year</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>$40</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16 }}>per year</div>
          <button
            onClick={() => handleCheckout("annual")}
            disabled={loading !== null}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "var(--accent-primary)",
              color: "white",
              border: "none",
              borderRadius: "var(--radius-sm)",
              fontSize: 13,
              fontWeight: 600,
              cursor: loading !== null ? "not-allowed" : "pointer",
              opacity: loading !== null ? 0.7 : 1,
            }}
          >
            {loading === "annual" ? "Loading..." : "Unlock All Comparisons"}
          </button>
          <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "8px 0 0", lineHeight: 1.4 }}>
            ✓ All 49 cities &nbsp;·&nbsp; ✓ 7-day money-back guarantee
          </p>
        </div>
      </div>
    </div>
  );
}
