"use client";

import { useState } from "react";
import { ComparisonResult, TripContext } from "@/lib/types";

interface Props {
  result: ComparisonResult;
  tripContext: TripContext;
  slug: string;
}

export default function PdfDownloadButton({ result, slug }: Props) {
  const [generating, setGenerating] = useState(false);
  const [downloadError, setDownloadError] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleDownload() {
    setGenerating(true);
    setDownloadError(false);
    try {
      const { generateComparisonPdf } = await import("@/lib/generatePdf");
      const blob = await generateComparisonPdf(
        result,
        result.city1.premium,
        result.city2.premium,
        result.tripContext
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${result.city1.city}-vs-${result.city2.city}-comparison.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("PDF generation failed", e);
      setDownloadError(true);
    } finally {
      setGenerating(false);
    }
  }

  async function handleEmailSend() {
    if (!emailInput) return;
    setEmailStatus("sending");
    try {
      const res = await fetch("/api/email-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput, slug }),
      });
      if (res.ok) {
        setEmailStatus("sent");
      } else {
        setEmailStatus("error");
      }
    } catch {
      setEmailStatus("error");
    }
  }

  return (
    <div>
      {downloadError && (
        <p style={{ fontSize: 13, color: "#B85640", margin: "0 0 10px" }}>
          PDF generation failed — please try again or contact support.
        </p>
      )}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-start" }}>
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

        {!showEmailForm ? (
          <button
            onClick={() => setShowEmailForm(true)}
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
              cursor: "pointer",
            }}
          >
            ✉️ Email me the PDF
          </button>
        ) : emailStatus === "sent" ? (
          <p style={{ fontSize: 13, color: "#2E7D32", margin: "10px 0 0", alignSelf: "center" }}>
            ✓ PDF sent — check your inbox!
          </p>
        ) : (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="your@email.com"
              style={{
                padding: "9px 12px",
                borderRadius: "var(--radius-sm)",
                border: "1.5px solid var(--border-medium)",
                fontSize: 13,
                width: 200,
              }}
            />
            <button
              onClick={handleEmailSend}
              disabled={emailStatus === "sending"}
              style={{
                padding: "9px 16px",
                backgroundColor: "var(--color-espresso)",
                color: "var(--color-cream)",
                border: "none",
                borderRadius: "var(--radius-sm)",
                fontSize: 13,
                fontWeight: 600,
                cursor: emailStatus === "sending" ? "not-allowed" : "pointer",
                opacity: emailStatus === "sending" ? 0.7 : 1,
              }}
            >
              {emailStatus === "sending" ? "Sending..." : "Send"}
            </button>
            {emailStatus === "error" && (
              <p style={{ fontSize: 12, color: "#B85640", margin: 0 }}>Failed — please try again.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
