"use client";

import { useState } from "react";
import { TripContext, TravelerWeights } from "@/lib/types";
import { unlockPremium } from "@/lib/premium";

interface Props {
  slug: string;
  onUnlocked: () => void;
  tripContext?: TripContext;
  weights?: TravelerWeights;
}

export default function PremiumUpsell({ slug, onUnlocked }: Props) {
  const [showRestore, setShowRestore] = useState(false);
  const [restoreEmail, setRestoreEmail] = useState("");
  const [restoreStatus, setRestoreStatus] = useState<"idle" | "loading" | "success" | "fail">("idle");

  async function handleRestore() {
    if (!restoreEmail) return;
    setRestoreStatus("loading");
    try {
      const res = await fetch("/api/restore-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: restoreEmail }),
      });
      const data = await res.json();
      if (data.valid) {
        unlockPremium("annual");
        setRestoreStatus("success");
        setTimeout(() => onUnlocked(), 800);
      } else {
        setRestoreStatus("fail");
      }
    } catch {
      setRestoreStatus("fail");
    }
  }
  const buttonStyle = {
    display: "block",
    width: "100%",
    padding: "10px",
    borderRadius: "var(--radius-sm)",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    textDecoration: "none",
    textAlign: "center" as const,
  };

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
          <a
            href={`/api/checkout?slug=${slug}&priceType=single`}
            target="_top"
            style={{
              ...buttonStyle,
              backgroundColor: "var(--color-espresso)",
              color: "var(--color-cream)",
            }}
          >
            Unlock This Comparison
          </a>
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
          <a
            href={`/api/checkout?slug=${slug}&priceType=annual`}
            target="_top"
            style={{
              ...buttonStyle,
              backgroundColor: "var(--accent-primary)",
              color: "white",
            }}
          >
            Unlock All Comparisons
          </a>
          <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "8px 0 0", lineHeight: 1.4 }}>
            ✓ All 50 cities &nbsp;·&nbsp; ✓ 7-day money-back guarantee
          </p>
        </div>
      </div>

      {/* Restore annual access */}
      <div style={{ marginTop: 24, borderTop: "1px solid var(--border-light)", paddingTop: 16 }}>
        {!showRestore ? (
          <button
            onClick={() => setShowRestore(true)}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "var(--text-muted)", textDecoration: "underline" }}
          >
            Already have an annual subscription? Restore access
          </button>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>Enter the email you used to purchase:</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
              <input
                type="email"
                value={restoreEmail}
                onChange={(e) => setRestoreEmail(e.target.value)}
                placeholder="your@email.com"
                style={{ padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-medium)", fontSize: 13, width: 220 }}
              />
              <button
                onClick={handleRestore}
                disabled={restoreStatus === "loading"}
                style={{ padding: "8px 16px", backgroundColor: "var(--accent-primary)", color: "white", border: "none", borderRadius: "var(--radius-sm)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
              >
                {restoreStatus === "loading" ? "Checking..." : "Restore Access"}
              </button>
            </div>
            {restoreStatus === "success" && <p style={{ fontSize: 12, color: "#2E7D32", margin: 0 }}>✓ Access restored! Loading your content...</p>}
            {restoreStatus === "fail" && <p style={{ fontSize: 12, color: "#B85640", margin: 0 }}>No active annual subscription found for that email.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
