"use client";

import { useState } from "react";
import { ComparisonResult, TripContext } from "@/lib/types";

interface Props {
  result: ComparisonResult;
  tripContext: TripContext;
}

export default function PdfDownloadButton({ result, tripContext }: Props) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(false);

  async function handleDownload() {
    setGenerating(true);
    setError(false);
    try {
      const { generateComparisonPdf } = await import("@/lib/generatePdf");
      const blob = await generateComparisonPdf(
        result,
        result.city1.premium,
        result.city2.premium,
        tripContext
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${result.city1.city}-vs-${result.city2.city}-comparison.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("PDF generation failed", e);
      setError(true);
    } finally {
      setGenerating(false);
    }
  }

  const subject = encodeURIComponent(`Our trip comparison: ${result.city1.city} vs ${result.city2.city}`);
  const body = encodeURIComponent(`I used the Trip Comparison Engine to compare ${result.city1.city} and ${result.city2.city} for our trip.\n\nCheck it out: ${typeof window !== "undefined" ? window.location.href : ""}`);

  return (
    <div>
    {error && (
      <p style={{ fontSize: 13, color: "#B85640", margin: "0 0 10px" }}>
        PDF generation failed — please try again or contact support.
      </p>
    )}
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      <button
        onClick={handleDownload}
        disabled={generating}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "10px 18px",
          backgroundColor: "var(--accent-primary)",
          color: "white",
          border: "none",
          borderRadius: "var(--radius-sm)",
          fontSize: 13,
          fontWeight: 600,
          cursor: generating ? "not-allowed" : "pointer",
          opacity: generating ? 0.7 : 1,
        }}
      >
        📄 {generating ? "Generating PDF..." : "Download PDF"}
      </button>
      <a
        href={`mailto:?subject=${subject}&body=${body}`}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "10px 18px",
          backgroundColor: "var(--bg-card)",
          color: "var(--text-body)",
          border: "1.5px solid var(--border-medium)",
          borderRadius: "var(--radius-sm)",
          fontSize: 13,
          fontWeight: 500,
          textDecoration: "none",
          cursor: "pointer",
        }}
      >
        ✉️ Share via Email
      </a>
    </div>
    </div>
  );
}
