import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecret = process.env.STRIPE_SECRET_KEY ?? "";

const stripe = new Stripe(stripeSecret, {
  apiVersion: "2024-06-20" as Stripe.LatestApiVersion,
});

const PLATFORM_FEE_RATE = 0.1;
const STRIPE_PERCENT_FEE = 0.029;
const STRIPE_FIXED_FEE = 30; // $0.30 expressed in cents

interface CheckoutPayload {
  agentId: string;
  agentName?: string;
  baseAmount: number;
  currency?: string;
  successUrl?: string;
  cancelUrl?: string;
}

function calculateBreakdown(baseAmount: number) {
  const platformFee = Math.round(baseAmount * PLATFORM_FEE_RATE);
  const stripeProcessing = Math.round(baseAmount * STRIPE_PERCENT_FEE + STRIPE_FIXED_FEE);
  const total = baseAmount + platformFee + stripeProcessing;

  return {
    baseAmount,
    platformFee,
    stripeProcessing,
    total,
  };
}

function formatCurrency(amount: number, currency: string) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  });

  return formatter.format(amount / 100);
}

export async function POST(request: NextRequest) {
  if (!stripeSecret) {
    return NextResponse.json(
      { error: "Stripe is not configured." },
      { status: 500 },
    );
  }

  let payload: CheckoutPayload;

  try {
    payload = (await request.json()) as CheckoutPayload;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid JSON";
    return NextResponse.json(
      { error: `Invalid request body: ${message}` },
      { status: 400 },
    );
  }

  const {
    agentId,
    agentName = "PantherIQ Agent",
    baseAmount,
    currency = "usd",
    successUrl,
    cancelUrl,
  } = payload;

  if (!agentId || typeof agentId !== "string") {
    return NextResponse.json(
      { error: "Missing agentId." },
      { status: 400 },
    );
  }

  if (!Number.isFinite(baseAmount) || baseAmount <= 0) {
    return NextResponse.json(
      { error: "baseAmount must be a positive integer (cents)." },
      { status: 400 },
    );
  }

  const cleanAmount = Math.round(baseAmount);
  const breakdown = calculateBreakdown(cleanAmount);

  const fallbackOrigin = request.headers.get("origin") ?? new URL(request.url).origin;
  const resolvedSuccessUrl = successUrl ?? `${fallbackOrigin}/checkout/${agentId}/success?session_id={CHECKOUT_SESSION_ID}`;
  const resolvedCancelUrl = cancelUrl ?? `${fallbackOrigin}/checkout/${agentId}/cancel`;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: resolvedSuccessUrl,
      cancel_url: resolvedCancelUrl,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency,
            unit_amount: breakdown.baseAmount,
            product_data: {
              name: `${agentName} access`,
              metadata: {
                agentId,
                priceType: "agent-price",
              },
            },
          },
        },
        {
          quantity: 1,
          price_data: {
            currency,
            unit_amount: breakdown.platformFee,
            product_data: {
              name: "PantherIQ platform fee (10%)",
              metadata: {
                agentId,
                priceType: "platform-fee",
              },
            },
          },
        },
        {
          quantity: 1,
          price_data: {
            currency,
            unit_amount: breakdown.stripeProcessing,
            product_data: {
              name: "Stripe processing",
              metadata: {
                agentId,
                priceType: "stripe-processing",
              },
            },
          },
        },
      ],
      metadata: {
        agentId,
        agentName,
        baseAmount: breakdown.baseAmount.toString(),
        platformFee: breakdown.platformFee.toString(),
        stripeProcessing: breakdown.stripeProcessing.toString(),
        total: breakdown.total.toString(),
      },
      custom_text: {
        submit: {
          message: "Creators receive 90% of the sale. PantherIQ collects a 10% platform fee.",
        },
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      breakdown: {
        agentPrice: formatCurrency(breakdown.baseAmount, currency),
        platformFee: formatCurrency(breakdown.platformFee, currency),
        stripeProcessing: formatCurrency(breakdown.stripeProcessing, currency),
        total: formatCurrency(breakdown.total, currency),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Stripe error";
    console.error("[checkout] Stripe session creation failed", message);
    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}
