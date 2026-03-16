import { ComparisonResult, PremiumContent } from "./types";
import { buildPdfDocument } from "./pdfShared";

export async function generateComparisonPdfBuffer(
  result: ComparisonResult,
  city1Premium: PremiumContent,
  city2Premium: PremiumContent,
): Promise<Buffer> {
  const renderer = await import("@react-pdf/renderer");
  const React = await import("react");
  const doc = buildPdfDocument(renderer, React, result, city1Premium, city2Premium, result.tripContext);
  const stream = await renderer.pdf(doc).toBuffer();
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream as unknown as AsyncIterable<Uint8Array>) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}
