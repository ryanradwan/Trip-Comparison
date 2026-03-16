"use client";

import { CityProfile } from "@/lib/types";
import { getAffiliateLinks } from "@/lib/affiliates";

interface Props {
  winnerCity: CityProfile;
}

export default function AffiliateBookingCTA({ winnerCity }: Props) {
  const links = getAffiliateLinks(winnerCity);

  const btnStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "10px 18px",
    backgroundColor: "var(--accent-primary)",
    color: "white",
    border: "none",
    borderRadius: "var(--radius-sm)",
    fontSize: 13,
    fontWeight: 600,
    textDecoration: "none",
    cursor: "pointer",
    transition: "background-color 0.15s",
  };

  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-light)",
        borderRadius: "var(--radius-lg)",
        padding: "24px",
        boxShadow: "0 4px 20px rgba(123, 94, 67, 0.06)",
      }}
    >
      <h3
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 18,
          color: "var(--text-primary)",
          margin: "0 0 6px",
        }}
      >
        Ready to book {winnerCity.city}?
      </h3>
      <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 20px" }}>
        Find the best flights, hotels, tours, and activities for your trip.
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <a
          href={links.flights}
          target="_blank"
          rel="noopener noreferrer"
          style={btnStyle}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--accent-hover)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--accent-primary)"; }}
        >
          ✈️ Search Flights
        </a>
        <a
          href={links.hotels}
          target="_blank"
          rel="noopener noreferrer"
          style={btnStyle}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--accent-hover)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--accent-primary)"; }}
        >
          🏨 Find Hotels
        </a>
        <a
          href={links.tours}
          target="_blank"
          rel="noopener noreferrer"
          style={btnStyle}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--accent-hover)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--accent-primary)"; }}
        >
          🎒 Book Tours
        </a>
        <a
          href={links.viator}
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...btnStyle, backgroundColor: "var(--color-bronze)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--accent-hover)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--color-bronze)"; }}
        >
          🎡 Explore Activities
        </a>
      </div>
      <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "14px 0 0", fontStyle: "italic" }}>
        Affiliate links — we may earn a small commission at no extra cost to you.
      </p>
    </div>
  );
}
