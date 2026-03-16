import { Metadata } from "next";
import { loadCity, getAllComparisonSlugs, parseSlug } from "@/lib/cities";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ComparisonClient from "./ComparisonClient";
import ItineraryRecommendations from "@/components/ItineraryRecommendations";
import { getItinerariesForCities } from "@/lib/itineraries";

export async function generateStaticParams() {
  // Limit to avoid memory issues — first 200 pairs, rest are ISR
  const slugs = getAllComparisonSlugs().slice(0, 200);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) return { title: "Not Found" };
  const [id1, id2] = parsed;
  const [c1, c2] = await Promise.all([loadCity(id1), loadCity(id2)]);
  if (!c1 || !c2) return { title: "Not Found" };
  const title = `${c1.city} vs ${c2.city} — Which Is Better For Your Trip? | The Next Stamp`;
  const desc = `Compare ${c1.city} (${c1.country}) and ${c2.city} (${c2.country}) side by side on food, beaches, safety, budget, nightlife, weather, and more. Personalized to your travel style.`;
  return {
    title,
    description: desc,
    openGraph: { title, description: desc, type: "website" },
    alternates: { canonical: `/compare/${slug}` },
  };
}

export default async function ComparisonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) notFound();
  const [id1, id2] = parsed;
  const [c1, c2] = await Promise.all([loadCity(id1), loadCity(id2)]);
  if (!c1 || !c2) notFound();

  const sameCountry = c1.country === c2.country;
  const itineraries = getItinerariesForCities(id1, id2);

  return (
    <main style={{ maxWidth: 1024, margin: "0 auto", padding: "0 16px 64px" }}>
      <Suspense fallback={<div style={{ padding: 32, textAlign: "center", color: "var(--text-muted)" }}>Loading comparison...</div>}>
        <ComparisonClient city1={c1} city2={c2} slug={slug} />
      </Suspense>

      {/* Itinerary recommendations — shown if we have products for either city */}
      {itineraries.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <ItineraryRecommendations itineraries={itineraries} />
        </div>
      )}

      {/* SEO text — always visible */}
      <section
        style={{
          marginTop: 64,
          padding: "32px",
          backgroundColor: "var(--bg-card)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border-light)",
        }}
      >
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 22,
            color: "var(--text-primary)",
            margin: "0 0 12px",
          }}
        >
          {c1.city} vs {c2.city}: Which Should You Visit?
        </h2>
        <p style={{ fontSize: 14, color: "var(--text-body)", lineHeight: 1.8, margin: 0 }}>
          {sameCountry
            ? `Can't decide between ${c1.city} and ${c2.city}? Both are in ${c1.country}, so there are no visa or currency differences to worry about — it purely comes down to which destination fits your travel style.`
            : `Choosing between ${c1.city} (${c1.country}) and ${c2.city} (${c2.country}) is one of the most common travel dilemmas. `}
          {" "}{c1.description} {c2.description} Use the comparison tool above to get a personalized recommendation based on your priorities, month of travel, and budget.
        </p>
      </section>
    </main>
  );
}
