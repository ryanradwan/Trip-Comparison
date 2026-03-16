import type { Metadata } from "next";
import FaqAccordion from "./FaqAccordion";
import { FAQ_SECTIONS } from "./faqData";

export const metadata: Metadata = {
  title: "FAQ | Trip Comparison Engine — The Next Stamp Travel Co.",
  description: "Answers to common questions about how city scoring works, what's included in the premium guide, pricing, and how to plan your trip.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_SECTIONS.flatMap((section) =>
    section.questions.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    }))
  ),
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "48px 16px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 10px" }}>
            Help Centre
          </p>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(28px, 5vw, 40px)",
              color: "var(--text-primary)",
              margin: "0 0 14px",
              lineHeight: 1.2,
            }}
          >
            Frequently Asked Questions
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-muted)", margin: 0, lineHeight: 1.6 }}>
            Everything you need to know about comparing cities and unlocking insider travel guides.
          </p>
        </div>

        <FaqAccordion />

        <div
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-light)",
            borderRadius: "var(--radius-lg)",
            padding: "28px 32px",
            textAlign: "center",
            marginTop: 48,
          }}
        >
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "var(--text-primary)", margin: "0 0 8px" }}>
            Still have questions?
          </p>
          <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 16px" }}>
            Reach out to the team at The Next Stamp Travel Co.
          </p>
          <a
            href="https://thenextstamptravelco.com/contact"
            style={{
              display: "inline-block",
              padding: "10px 22px",
              backgroundColor: "var(--accent-primary)",
              color: "white",
              borderRadius: "var(--radius-sm)",
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Contact Us →
          </a>
        </div>
      </main>
    </>
  );
}
