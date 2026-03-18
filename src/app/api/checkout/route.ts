import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function createStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-02-25.clover" });
}

export async function GET(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const { searchParams } = req.nextUrl;
  const slug = searchParams.get("slug") ?? "";
  const priceType = searchParams.get("priceType") as "single" | "annual";

  if (!slug) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }
  if (priceType !== "single" && priceType !== "annual") {
    return NextResponse.json({ error: "Invalid priceType" }, { status: 400 });
  }

  try {
    const stripe = createStripe();
    const priceId = priceType === "annual"
      ? process.env.STRIPE_PRICE_ANNUAL!
      : process.env.STRIPE_PRICE_SINGLE!;

    const origin = req.nextUrl.origin;
    const session = await stripe.checkout.sessions.create({
      mode: priceType === "annual" ? "subscription" : "payment",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/compare/${slug}?premium=${priceType}`,
      cancel_url: `${origin}/compare/${slug}`,
      metadata: { slug, priceType, tripContext: "", weights: "" },
    });

    return NextResponse.redirect(session.url!, 302);
  } catch (err) {
    console.error("Stripe error:", err);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const stripe = createStripe();

  try {
    const body = await req.json();
    const { priceType, slug, tripContext, weights } = body ?? {};

    if (typeof slug !== "string" || !slug) {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    }
    if (priceType !== "single" && priceType !== "annual") {
      return NextResponse.json({ error: "Invalid priceType" }, { status: 400 });
    }

    const priceId =
      priceType === "annual"
        ? process.env.STRIPE_PRICE_ANNUAL!
        : process.env.STRIPE_PRICE_SINGLE!;

    const origin = req.nextUrl.origin;
    const session = await stripe.checkout.sessions.create({
      mode: priceType === "annual" ? "subscription" : "payment",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/compare/${slug}?premium=${priceType}`,
      cancel_url: `${origin}/compare/${slug}`,
      metadata: {
        slug,
        priceType,
        tripContext: tripContext ? JSON.stringify(tripContext) : "",
        weights: weights ? JSON.stringify(weights) : "",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
