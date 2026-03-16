import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { loadCity, parseSlug } from "@/lib/cities";
import { compareCities } from "@/lib/scoring";
import { generateComparisonPdfBuffer } from "@/lib/generatePdfServer";
import { TripContext, TravelerWeights } from "@/lib/types";
import { DEFAULT_TRIP_CONTEXT, SLIDER_CATEGORIES } from "@/lib/constants";

function defaultWeights(): TravelerWeights {
  const w: TravelerWeights = {};
  for (const cat of SLIDER_CATEGORIES) {
    w[cat.key] = cat.defaultWeight;
  }
  return w;
}

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-02-25.clover" });
  const resend = new Resend(process.env.RESEND_API_KEY!);

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const customerEmail = session.customer_details?.email;
  const slug = session.metadata?.slug;

  if (!customerEmail || !slug) {
    console.error("Missing email or slug in webhook session");
    return NextResponse.json({ received: true });
  }

  try {
    const parsed = parseSlug(slug);
    if (!parsed) {
      console.error("Could not parse slug:", slug);
      return NextResponse.json({ received: true });
    }
    const [id1, id2] = parsed;

    const [city1, city2] = await Promise.all([loadCity(id1), loadCity(id2)]);

    if (!city1 || !city2) {
      console.error("City not found for slug:", slug);
      return NextResponse.json({ received: true });
    }

    // Restore tripContext and weights from metadata (or use defaults)
    let tripContext: TripContext = DEFAULT_TRIP_CONTEXT;
    let weights: TravelerWeights = defaultWeights();

    try {
      if (session.metadata?.tripContext) {
        tripContext = JSON.parse(session.metadata.tripContext);
      }
      if (session.metadata?.weights) {
        weights = JSON.parse(session.metadata.weights);
      }
    } catch {
      // Use defaults if parsing fails
    }

    // Run comparison and generate PDF
    const result = compareCities(city1, city2, tripContext, weights);
    const pdfBuffer = await generateComparisonPdfBuffer(result, city1.premium, city2.premium);

    const fileName = `${city1.city}-vs-${city2.city}-Trip-Report.pdf`
      .replace(/\s+/g, "-")
      .toLowerCase();

    // Send email with PDF attached
    await resend.emails.send({
      from: process.env.RESEND_FROM ?? "noreply@thenextstamptravelco.com",
      to: customerEmail,
      subject: `Your Trip Report: ${city1.city} vs ${city2.city}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #5C4A38;">
          <div style="background: #7B5E43; padding: 28px 32px; border-radius: 8px 8px 0 0;">
            <h1 style="color: #FAF7F2; font-size: 22px; margin: 0 0 6px;">Your Trip Report is Ready</h1>
            <p style="color: #D8C2A7; font-size: 14px; margin: 0;">${city1.city} vs ${city2.city} · The Next Stamp Travel Co.</p>
          </div>
          <div style="background: #FAF7F2; padding: 28px 32px; border: 1px solid #D8C2A7; border-top: none; border-radius: 0 0 8px 8px;">
            <p style="font-size: 15px; line-height: 1.7; margin: 0 0 16px;">
              Hi there! Your full insider breakdown for <strong>${city1.city} vs ${city2.city}</strong> is attached to this email as a PDF.
            </p>
            <p style="font-size: 14px; line-height: 1.7; margin: 0 0 20px; color: #7B5E43;">
              Your report includes:
            </p>
            <ul style="font-size: 13px; line-height: 2; color: #5C4A38; padding-left: 20px; margin: 0 0 24px;">
              <li>Personalised scores &amp; winner verdict</li>
              <li>Best neighbourhoods to stay in both cities</li>
              <li>Airport transfer options &amp; costs</li>
              <li>Visa requirements &amp; currency tips</li>
              <li>Scam warnings &amp; areas to avoid</li>
              <li>Daily cost breakdown by category</li>
              <li>Insider tips, day trips &amp; emergency numbers</li>
            </ul>
            <p style="font-size: 13px; color: #BFA38A; margin: 0; border-top: 1px solid #D8C2A7; padding-top: 16px;">
              You can also access your comparison anytime at
              <a href="${process.env.NEXT_PUBLIC_URL}/compare/${slug}" style="color: #A1785A;">compare.thenextstamptravelco.com/compare/${slug}</a>
            </p>
          </div>
          <p style="font-size: 11px; color: #BFA38A; text-align: center; margin-top: 16px;">
            © The Next Stamp Travel Co. · <a href="${process.env.NEXT_PUBLIC_MAIN_SITE_URL}" style="color: #BFA38A;">thenextstamptravelco.com</a>
          </p>
        </div>
      `,
      attachments: [
        {
          filename: fileName,
          content: pdfBuffer,
        },
      ],
    });

    console.log(`Email sent to ${customerEmail} for ${slug}`);
  } catch (err) {
    console.error("Error generating/sending report:", err);
    // Still return 200 so Stripe doesn't retry — the user still has in-app access
  }

  return NextResponse.json({ received: true });
}
