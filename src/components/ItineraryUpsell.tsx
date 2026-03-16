"use client";

import { CityProfile } from "@/lib/types";

interface Props {
  winnerCity: CityProfile;
  loserCity: CityProfile;
}

const CUSTOM_ITINERARY_URL =
  process.env.NEXT_PUBLIC_CUSTOM_ITINERARY_URL ||
  "https://thenextstamptravelco.com/custom-travel-itineraries-personalized-trip-planning-services/";

const btnStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "11px 20px",
  backgroundColor: "var(--accent-primary)",
  color: "white",
  border: "none",
  borderRadius: "var(--radius-sm)",
  fontSize: 13,
  fontWeight: 600,
  textDecoration: "none",
  cursor: "pointer",
};

const linkStyle: React.CSSProperties = {
  color: "var(--accent-primary)",
  textDecoration: "underline",
  fontSize: 13,
};

export default function ItineraryUpsell({ winnerCity, loserCity }: Props) {
  const winnerHasProduct = !!winnerCity.shopUrl;
  const loserHasProduct = !!loserCity.shopUrl;
  const sameCountry = winnerCity.country === loserCity.country;

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
      <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px" }}>
        Plan Your Trip
      </p>

      {winnerHasProduct ? (
        <>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "var(--text-primary)", margin: "0 0 10px" }}>
            Ready to plan your {winnerCity.city} trip?
          </h3>
          <p style={{ fontSize: 14, color: "var(--text-muted)", margin: "0 0 20px", lineHeight: 1.6 }}>
            We&apos;ve built a detailed day-by-day itinerary for {winnerCity.city} — insider tips, restaurant picks, and smart logistics so you can travel like you planned it for months.
          </p>
          <a href={winnerCity.shopUrl!} target="_blank" rel="noopener noreferrer" style={btnStyle}>
            Get the {winnerCity.city} Itinerary →
          </a>

          {loserHasProduct && (
            <p style={{ marginTop: 16, color: "var(--text-muted)", fontSize: 13 }}>
              Still considering {loserCity.city}?{" "}
              <a href={loserCity.shopUrl!} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                View the {loserCity.city} itinerary
              </a>
            </p>
          )}

          {sameCountry && loserHasProduct && (
            <p style={{ marginTop: 8, color: "var(--text-muted)", fontSize: 13 }}>
              Why not both? Grab the {winnerCity.city} and {loserCity.city} itineraries and combine them into one trip.
            </p>
          )}
        </>
      ) : (
        <>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "var(--text-primary)", margin: "0 0 10px" }}>
            Want a custom {winnerCity.city} itinerary?
          </h3>
          <p style={{ fontSize: 14, color: "var(--text-muted)", margin: "0 0 20px", lineHeight: 1.6 }}>
            We don&apos;t have a pre-built guide for {winnerCity.city} yet, but our team can create a personalized day-by-day itinerary tailored to your travel style, budget, and interests.
          </p>
          <a href={CUSTOM_ITINERARY_URL} target="_blank" rel="noopener noreferrer" style={btnStyle}>
            Request a Custom Itinerary →
          </a>

          {loserHasProduct && (
            <p style={{ marginTop: 16, color: "var(--text-muted)", fontSize: 13 }}>
              We do have a ready-made itinerary for {loserCity.city}:{" "}
              <a href={loserCity.shopUrl!} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                View the {loserCity.city} itinerary
              </a>
            </p>
          )}
        </>
      )}
    </div>
  );
}
