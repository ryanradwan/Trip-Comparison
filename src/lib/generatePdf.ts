"use client";

import { ComparisonResult, PremiumContent, TripContext } from "./types";
import { buildPdfDocument } from "./pdfShared";

export async function generateComparisonPdf(
  result: ComparisonResult,
  city1Premium: PremiumContent,
  city2Premium: PremiumContent,
  tripContext: TripContext
): Promise<Blob> {
  const renderer = await import("@react-pdf/renderer");
  const React = await import("react");
  const doc = buildPdfDocument(renderer, React, result, city1Premium, city2Premium, tripContext);
  return await renderer.pdf(doc).toBlob();
}
