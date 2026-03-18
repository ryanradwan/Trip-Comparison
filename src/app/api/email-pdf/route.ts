import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { loadCity, parseSlug } from "@/lib/cities";
import { compareCities } from "@/lib/scoring";
import { generateComparisonPdfBuffer } from "@/lib/generatePdfServer";
import { DEFAULT_TRIP_CONTEXT, SLIDER_CATEGORIES } from "@/lib/constants";
import { TravelerWeights } from "@/lib/types";

export const maxDuration = 60;

function defaultWeights(): TravelerWeights {
  const w: TravelerWeights = {};
  for (const cat of SLIDER_CATEGORIES) w[cat.key] = cat.defaultWeight;
  return w;
}

export async function POST(req: NextRequest) {
  const { email, slug } = await req.json();

  if (!email || typeof email !== "string" || !slug || typeof slug !== "string") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = parseSlug(slug);
  if (!parsed) return NextResponse.json({ error: "Invalid slug" }, { status: 400 });

  const [id1, id2] = parsed;
  const [city1, city2] = await Promise.all([loadCity(id1), loadCity(id2)]);
  if (!city1 || !city2) return NextResponse.json({ error: "Cities not found" }, { status: 404 });

  try {
    const result = compareCities(city1, city2, DEFAULT_TRIP_CONTEXT, defaultWeights());
    const pdfBuffer = await generateComparisonPdfBuffer(result, city1.premium, city2.premium);

    const fileName = `${city1.city}-vs-${city2.city}-Trip-Report.pdf`
      .replace(/\s+/g, "-")
      .toLowerCase();

    const resend = new Resend(process.env.RESEND_API_KEY!);
    await resend.emails.send({
      from: process.env.RESEND_FROM ?? "noreply@thenextstamptravelco.com",
      to: email,
      subject: `Your Trip Report: ${city1.city} vs ${city2.city}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #5C4A38;">
          <div style="background: #7B5E43; padding: 28px 32px; border-radius: 8px 8px 0 0;">
            <h1 style="color: #FAF7F2; font-size: 22px; margin: 0 0 6px;">Your Trip Report is Ready</h1>
            <p style="color: #D8C2A7; font-size: 14px; margin: 0;">${city1.city} vs ${city2.city} · The Next Stamp Travel Co.</p>
          </div>
          <div style="background: #FAF7F2; padding: 28px 32px; border: 1px solid #D8C2A7; border-top: none; border-radius: 0 0 8px 8px;">
            <p style="font-size: 15px; line-height: 1.7; margin: 0 0 16px;">
              Your full insider breakdown for <strong>${city1.city} vs ${city2.city}</strong> is attached as a PDF.
            </p>
          </div>
          <p style="font-size: 11px; color: #BFA38A; text-align: center; margin-top: 16px;">
            © The Next Stamp Travel Co. · <a href="${process.env.NEXT_PUBLIC_MAIN_SITE_URL}" style="color: #BFA38A;">thenextstamptravelco.com</a>
          </p>
        </div>
      `,
      attachments: [{ filename: fileName, content: pdfBuffer }],
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Email PDF error:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
