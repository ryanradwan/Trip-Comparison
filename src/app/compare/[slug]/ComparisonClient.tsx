"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { CityProfile, TripContext, TravelerWeights, ComparisonResult } from "@/lib/types";
import { SLIDER_CATEGORIES, getDefaultTripContext } from "@/lib/constants";
import { compareCities } from "@/lib/scoring";
import { isPremiumUnlocked, unlockPremium } from "@/lib/premium";
import TripDetailsForm from "@/components/TripDetailsForm";
import PrioritySliders from "@/components/PrioritySliders";
import SeasonalSection from "@/components/SeasonalSection";
import ComparisonTable from "@/components/ComparisonTable";
import VerdictCard from "@/components/VerdictCard";
import AffiliateBookingCTA from "@/components/AffiliateBookingCTA";
import PremiumUpsell from "@/components/PremiumUpsell";
import PremiumContent from "@/components/PremiumContent";
import PdfDownloadButton from "@/components/PdfDownloadButton";
import ItineraryUpsell from "@/components/ItineraryUpsell";
import ScrollReveal from "@/components/ScrollReveal";
import TravelerProfilePicker from "@/components/TravelerProfilePicker";
import HiddenGemCard from "@/components/HiddenGemCard";
import CostSimulator from "@/components/CostSimulator";
import MonthRibbon from "@/components/MonthRibbon";

interface Props {
  city1: CityProfile;
  city2: CityProfile;
  slug: string;
}

function initWeights(): TravelerWeights {
  const w: TravelerWeights = {};
  for (const cat of SLIDER_CATEGORIES) {
    w[cat.key] = cat.defaultWeight;
  }
  return w;
}

export default function ComparisonClient({ city1, city2, slug }: Props) {
  const searchParams = useSearchParams();
  const resultsRef = useRef<HTMLDivElement>(null);

  const [tripContext, setTripContext] = useState<TripContext>(getDefaultTripContext);
  const [weights, setWeights] = useState<TravelerWeights>(initWeights);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [premium, setPremium] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Handle premium unlock from Stripe redirect
  useEffect(() => {
    const premiumParam = searchParams.get("premium");
    if (premiumParam === "single" || premiumParam === "annual") {
      unlockPremium(premiumParam as "single" | "annual", slug);
      setPremium(true);
      // Clean URL
      const url = new URL(window.location.href);
      url.searchParams.delete("premium");
      window.history.replaceState({}, "", url.toString());
    } else {
      setPremium(isPremiumUnlocked(slug));
    }
  }, [searchParams, slug]);

  function handleCompare() {
    setIsComparing(true);
    setCurrentStep(3);
    setTimeout(() => {
      const r = compareCities(city1, city2, tripContext, weights);
      setResult(r);
      setIsComparing(false);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }, 600);
  }

  function handleWeightsChange(w: TravelerWeights) {
    setWeights(w);
    if (currentStep === 1) setCurrentStep(2);
  }

  const winnerCity = result
    ? result.winner === "city1"
      ? city1
      : result.winner === "city2"
      ? city2
      : city1
    : city1;

  const loserCity = result
    ? result.winner === "city1"
      ? city2
      : result.winner === "city2"
      ? city1
      : city2
    : city2;

  return (
    <div>
      {/* City header — always visible */}
      <div
        style={{
          padding: "40px 0 32px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(24px, 4vw, 36px)",
                color: "var(--text-primary)",
                margin: 0,
              }}
            >
              {city1.city}
            </h1>
            <p style={{ fontSize: 14, color: "var(--text-muted)", margin: "4px 0 0" }}>{city1.country}</p>
          </div>

          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "var(--text-muted)",
              flexShrink: 0,
            }}
          >
            VS
          </div>

          <div>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(24px, 4vw, 36px)",
                color: "var(--text-primary)",
                margin: 0,
              }}
            >
              {city2.city}
            </h1>
            <p style={{ fontSize: 14, color: "var(--text-muted)", margin: "4px 0 0" }}>{city2.country}</p>
          </div>
        </div>
      </div>

      {/* Step indicator */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28 }}>
        {(["Trip Details", "Priorities", "Results"] as const).map((label, i) => {
          const step = (i + 1) as 1 | 2 | 3;
          const isDone = step < currentStep;
          const isActive = step === currentStep;
          return (
            <div key={label} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700,
                  backgroundColor: isDone ? "var(--accent-primary)" : isActive ? "var(--accent-primary)" : "var(--border-light)",
                  color: isDone || isActive ? "white" : "var(--text-muted)",
                  transition: "all 0.3s",
                }}>
                  {isDone ? "✓" : step}
                </div>
                <span style={{ fontSize: 11, color: isActive ? "var(--accent-primary)" : "var(--text-muted)", fontWeight: isActive ? 600 : 400 }}>{label}</span>
              </div>
              {i < 2 && (
                <div style={{ width: 48, height: 2, backgroundColor: step < currentStep ? "var(--accent-primary)" : "var(--border-light)", margin: "0 4px 16px", transition: "background-color 0.3s" }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Trip details + sliders */}
      <div
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-light)",
          borderRadius: "var(--radius-lg)",
          padding: "28px 32px",
          boxShadow: "0 4px 20px rgba(123, 94, 67, 0.06)",
          marginBottom: 16,
        }}
      >
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 18,
            color: "var(--text-primary)",
            margin: "0 0 20px",
          }}
        >
          Tell us about your trip
        </h2>
        <TripDetailsForm value={tripContext} onChange={setTripContext} />
      </div>

      <div
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-light)",
          borderRadius: "var(--radius-lg)",
          padding: "28px 32px",
          boxShadow: "0 4px 20px rgba(123, 94, 67, 0.06)",
          marginBottom: 24,
        }}
      >
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 18,
            color: "var(--text-primary)",
            margin: "0 0 16px",
          }}
        >
          What matters most to you?
        </h2>
        <TravelerProfilePicker onSelect={handleWeightsChange} />
        <PrioritySliders weights={weights} onChange={handleWeightsChange} />
      </div>

      {/* Compare button */}
      <button
        onClick={handleCompare}
        disabled={isComparing}
        style={{
          width: "100%",
          padding: "16px",
          backgroundColor: "var(--accent-primary)",
          color: "white",
          border: "none",
          borderRadius: "var(--radius-md)",
          fontSize: 16,
          fontWeight: 700,
          cursor: isComparing ? "not-allowed" : "pointer",
          marginBottom: 40,
          transition: "background-color 0.15s, transform 0.1s, box-shadow 0.15s",
          boxShadow: "0 4px 14px rgba(123, 94, 67, 0.25)",
          opacity: isComparing ? 0.85 : 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
        onMouseEnter={(e) => {
          if (isComparing) return;
          const el = e.currentTarget as HTMLElement;
          el.style.backgroundColor = "var(--accent-hover)";
          el.style.boxShadow = "0 6px 20px rgba(123, 94, 67, 0.35)";
          el.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.backgroundColor = "var(--accent-primary)";
          el.style.boxShadow = "0 4px 14px rgba(123, 94, 67, 0.25)";
          el.style.transform = "translateY(0)";
        }}
        onMouseDown={(e) => { if (!isComparing) (e.currentTarget as HTMLElement).style.transform = "translateY(1px)"; }}
        onMouseUp={(e) => { if (!isComparing) (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
      >
        {isComparing ? (
          <>
            <span className="btn-spinner" />
            Comparing destinations...
          </>
        ) : (
          "Compare Now →"
        )}
      </button>

      {/* Results — hidden until compare is clicked */}
      {!result && (
        <p style={{ animation: "fadeIn 0.4s ease both", textAlign: "center", color: "var(--text-muted)", fontSize: 14, marginBottom: 40 }}>
          Fill in your trip details above, then hit Compare to see your personalized results.
        </p>
      )}

      {result && (
        <div ref={resultsRef} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <ScrollReveal>
            <MonthRibbon
              city1={city1}
              city2={city2}
              selectedMonth={tripContext.month}
              onMonthChange={(m) => setTripContext((prev) => ({ ...prev, month: m }))}
            />
          </ScrollReveal>

          <ScrollReveal delay={40}>
            <SeasonalSection
              city1={city1}
              city2={city2}
              tripContext={tripContext}
              seasonalScores={result.seasonalScores}
            />
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <CostSimulator city1={city1} city2={city2} tripContext={tripContext} />
          </ScrollReveal>

          <ScrollReveal delay={120}>
            <ComparisonTable
              city1={city1}
              city2={city2}
              categoryScores={result.categoryScores}
            />
          </ScrollReveal>

          <ScrollReveal delay={160}>
            <VerdictCard result={result} isPremium={premium} />
          </ScrollReveal>

          <ScrollReveal delay={240}>
            <AffiliateBookingCTA winnerCity={winnerCity} />
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <HiddenGemCard winnerCity={winnerCity} city1Id={city1.id} city2Id={city2.id} />
          </ScrollReveal>

          <ScrollReveal delay={320}>
            {!premium ? (
              <PremiumUpsell slug={slug} onUnlocked={() => setPremium(true)} tripContext={tripContext} weights={weights} />
            ) : (
              <div
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border-light)",
                  borderRadius: "var(--radius-lg)",
                  padding: "28px 32px",
                  boxShadow: "0 4px 20px rgba(123, 94, 67, 0.06)",
                }}
              >
                <div style={{ marginBottom: 24 }}>
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 20,
                      color: "var(--text-primary)",
                      margin: "0 0 12px",
                    }}
                  >
                    Your Full Insider Breakdown
                  </h3>
                  <PdfDownloadButton result={result} tripContext={tripContext} slug={slug} />
                </div>

                <PremiumContent city1={city1} city2={city2} />
              </div>
            )}
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <ItineraryUpsell winnerCity={winnerCity} loserCity={loserCity} />
          </ScrollReveal>
        </div>
      )}
    </div>
  );
}
