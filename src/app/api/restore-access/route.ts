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

  const normalizedEmail = email.toLowerCase().trim();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-02-25.clover" });

  try {
    // Step 1: search customers by email (flexible search)
    const searchResult = await stripe.customers.search({
      query: `email:"${normalizedEmail}"`,
      limit: 10,
    });
    console.log(`Restore access: found ${searchResult.data.length} customers for ${normalizedEmail}`);

    for (const customer of searchResult.data) {
      const found = await checkCustomerSubscription(stripe, customer.id);
      if (found) return NextResponse.json({ valid: true });
    }

    // Step 2: fallback — scan all active annual subscriptions and match email
    const priceId = process.env.STRIPE_PRICE_ANNUAL!;
    const subs = await stripe.subscriptions.search({
      query: `status:'active' AND price:'${priceId}'`,
      limit: 100,
    });
    console.log(`Restore access fallback: found ${subs.data.length} active annual subscriptions`);

    for (const sub of subs.data) {
      const customer = await stripe.customers.retrieve(sub.customer as string);
      if (!customer.deleted) {
        console.log(`  Sub customer email: ${customer.email}`);
        if (customer.email?.toLowerCase() === normalizedEmail) {
          return NextResponse.json({ valid: true });
        }
      }
    }

    console.log(`Restore access: no match found for ${normalizedEmail}`);
    return NextResponse.json({ valid: false });
  } catch (err) {
    console.error("Restore access error:", err);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}

async function checkCustomerSubscription(stripe: Stripe, customerId: string): Promise<boolean> {
  const priceId = process.env.STRIPE_PRICE_ANNUAL!;
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: "active",
    limit: 10,
  });
  console.log(`  Customer ${customerId}: ${subscriptions.data.length} active subscriptions`);
  for (const sub of subscriptions.data) {
    for (const item of sub.items.data) {
      console.log(`    Price ID: ${item.price.id} (looking for ${priceId})`);
      if (item.price.id === priceId) return true;
    }
  }
  return false;
}
