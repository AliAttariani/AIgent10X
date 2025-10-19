import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  // Cast to string literal to satisfy Stripe type definitions while using desired API version.
  apiVersion: '2024-06-20' as Stripe.LatestApiVersion,
});

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const signature = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    console.error('[stripe] Missing webhook secret or signature header');
    return NextResponse.json(
      { message: 'Missing Stripe webhook configuration' },
      { status: 500 },
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[stripe] Signature verification failed:', message);
    return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      console.info('[stripe] checkout.session.completed', session.id);
      break;
    }
    case 'customer.subscription.created': {
      const subscription = event.data.object as Stripe.Subscription;
      console.info('[stripe] customer.subscription.created', subscription.id);
      break;
    }
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      console.info('[stripe] customer.subscription.updated', subscription.id);
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      console.info('[stripe] customer.subscription.deleted', subscription.id);
      break;
    }
    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge;
      console.info('[stripe] charge.refunded', charge.id);
      break;
    }
    default: {
      console.info('[stripe] Unhandled event type', event.type);
    }
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
