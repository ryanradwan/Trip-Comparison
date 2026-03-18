import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ valid: false }, { status: 500 });
  }

  const { email } = await req.json();
  if (!email || typeof email !== "string") {
    return NextResponse.json({ valid: false }, { status: 400 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-02-25.clover" });

  try {
    // Find customers matching this email
    const customers = await stripe.customers.list({ email: email.toLowerCase().trim(), limit: 5 });

    for (const customer of customers.data) {
      const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        status: "active",
        limit: 10,
      });

      for (const sub of subscriptions.data) {
        for (const item of sub.items.data) {
          if (item.price.id === process.env.STRIPE_PRICE_ANNUAL) {
            // current_period_end exists at runtime but type varies by Stripe version — cast safely
            const periodEnd = (sub as unknown as { current_period_end: number }).current_period_end;
            const expiry = new Date(periodEnd * 1000).toISOString();
            return NextResponse.json({ valid: true, expiry });
          }
        }
      }
    }

    return NextResponse.json({ valid: false });
  } catch (err) {
    console.error("Restore access error:", err);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
