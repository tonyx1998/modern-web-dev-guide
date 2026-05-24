---
id: payments
title: 'Phase 7: Payments (If Building SaaS)'
sidebar_position: 9
sidebar_label: 8. Payments
description: Stripe Checkout plus a webhook handler is the minimal payments flow. You never touch a credit card number.
---

# Phase 7: Payments (If Building SaaS)

> **In one line:** Stripe Checkout takes the user to Stripe's site for payment, then a webhook tells your server they paid. You never see a credit card number.

:::tip[In plain English]
Payments are the second area (after auth) where rolling your own would be catastrophic. PCI compliance, tax calculations, dispute handling, fraud detection — all hard problems. With Stripe Checkout, your server's job is two functions: "make a checkout session" and "react to the webhook when payment succeeds." Stripe does everything in between.
:::

## The minimal flow

Stripe + a webhook handler. The minimal flow:

1. User clicks "Subscribe."
2. Your server creates a Stripe Checkout session.
3. User completes checkout on Stripe-hosted page.
4. Stripe redirects them back to your app.
5. Stripe sends a webhook to your server.
6. Your server marks the user as a subscriber in your DB.

## Step 1: create a checkout session

A **webhook** (Stripe's term for "we'll POST a JSON event to this URL when something happens — like a successful payment") is the second half of this flow. First, the checkout session:

```typescript
// src/app/api/checkout/route.ts
import Stripe from 'stripe';
import { auth } from '@clerk/nextjs/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  const { userId } = await auth();
  if (!userId) return new Response('Unauthorized', { status: 401 });

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: 'price_xxxxxxxxxxxxx', quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing`,
    metadata: { userId },
  });

  return Response.json({ url: session.url });
}
```

> **In English:** This is the route the "Subscribe" button hits. It looks up the signed-in user, asks Stripe to create a Checkout session in subscription mode against your pre-configured price (`price_xxxx...` — set up once in the Stripe dashboard), passes URLs Stripe will redirect to on success/cancel, and crucially stashes your `userId` in `metadata` so the webhook (next code block) can find this user again. Returns the hosted Checkout URL; your frontend redirects the user there.

## Step 2: handle the webhook

```typescript
// src/app/api/stripe/webhook/route.ts
import Stripe from 'stripe';
import { db } from '@/db';
import { subscriptions } from '@/db/schema';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')!;
  const body = await req.text();

  const event = stripe.webhooks.constructEvent(
    body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    await db.insert(subscriptions).values({
      userId: session.metadata!.userId,
      stripeCustomerId: session.customer as string,
      status: 'active',
    });
  }

  return new Response('ok');
}
```

> **In English:** Stripe POSTs events here. `constructEvent` does the security work: it verifies the `stripe-signature` header against your webhook secret, so attackers can't fake events by guessing the URL. If verification fails, it throws. On a successful checkout, you write the row to your `subscriptions` table — pulling `userId` out of the metadata you set in step 1 and saving Stripe's customer ID for future API calls. Always return 200 (`'ok'`) so Stripe doesn't keep retrying.

## Step 3: test it locally

Test webhooks locally with the Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

:::note[Worked example: end-to-end test in Stripe test mode]
1. Switch your `STRIPE_SECRET_KEY` to the test key (`sk_test_...`).
2. Run `stripe listen --forward-to localhost:3000/api/stripe/webhook` in a second terminal.
3. Click "Subscribe" in your app.
4. On the Stripe-hosted Checkout page, use card number `4242 4242 4242 4242` with any future expiry and any CVC.
5. Get redirected back to `/dashboard?success=1`.
6. Watch the Stripe CLI window — you'll see the `checkout.session.completed` event being forwarded to your local webhook.
7. Check your local DB — the `subscriptions` row should be there.

Now do it once more with card `4000 0000 0000 0002` — Stripe rejects that one, so you'll see the user *not* land on success. Both code paths covered.
:::

:::info[Highlight: the metadata trick]
`metadata: { userId }` in the Checkout session is how you connect a Stripe customer back to your own user. Without it, the webhook arrives with a Stripe customer ID and no easy way to know *which* of your users it belongs to.

Always pass enough metadata in the session creation to identify the user in the webhook. It's tempting to look up by email — don't. Emails can change; Stripe customer IDs are stable; your `userId` is the bridge.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Granting access on the success_url redirect.** The user lands on `/dashboard?success=1`, you flip them to "subscribed" in the DB, and they bookmark the URL to fake a paid account forever. The fix is to grant access *only* in the webhook handler — the redirect is a UX signal, not proof of payment.
- **Treating the webhook as a one-time event.** Stripe will redeliver the same `checkout.session.completed` if your handler 500s or times out — and you'll double-insert subscriptions. The fix is to make handlers idempotent: upsert on `stripe_session_id`, or check if the row exists before inserting.
- **Ignoring `customer.subscription.updated` and `.deleted`.** Your code listens for the initial payment and then never updates state — so canceled subscribers still get paid features for months. The fix is to handle the full lifecycle from day one: subscription updates, payment failures, cancellations all flip the DB.
- **Testing only with `4242 4242 4242 4242`.** That card always succeeds, so your code never sees a decline, a 3DS prompt, or a webhook arriving after the redirect. The fix is to also run `4000 0025 0000 3155` (3DS) and `4000 0000 0000 0341` (auth succeeds, charge fails later) before you go live — Stripe documents the full set.
- **Putting Stripe live keys in your `.env.local`.** A typo with a live key is real money. The fix is test keys everywhere except Vercel's Production environment — and never paste a live `sk_live_` key into your local terminal.
:::

## Page checkpoint

<Quiz id="solo-payments-page" title="Did the payments flow stick?" sampleSize={2}>

<Question
  prompt="Why does the Checkout session include metadata: { userId }?"
  options={[
    { text: "To prefill the customer's name on the Checkout page" },
    { text: "So the webhook can connect the Stripe customer back to your user" },
    { text: "To enable test mode automatically" },
    { text: "Because Stripe rejects sessions without metadata" }
  ]}
  correct={1}
  explanation="Without the metadata, the webhook arrives with a Stripe customer ID and no clean way to map it to your user. The page warns against looking up by email — emails change, but your userId is stable."
  revisit={{ to: "/docs/solo/payments#step-1-create-a-checkout-session", label: "The metadata trick" }}
/>

<Question
  prompt="What does stripe.webhooks.constructEvent verify in the webhook handler?"
  options={[
    { text: "That the payment amount matches the price ID" },
    { text: "That the stripe-signature header matches your webhook secret" },
    { text: "That the user is authenticated via Clerk" },
    { text: "That the request originates from a US IP address" }
  ]}
  correct={1}
  explanation="It validates the stripe-signature header against your webhook secret. Without that check, anyone who guesses the URL could POST fake 'payment successful' events to your server."
  revisit={{ to: "/docs/solo/payments#step-2-handle-the-webhook", label: "Webhook signature" }}
/>

<Question
  prompt="What does the Stripe Checkout flow protect you from having to handle directly?"
  options={[
    { text: "Webhook event names" },
    { text: "Credit card numbers (PCI compliance)" },
    { text: "Database migrations" },
    { text: "Server-side environment variables" }
  ]}
  correct={1}
  explanation="Users complete payment on Stripe's hosted page, so card numbers never touch your server. That's how you avoid PCI compliance scope — plus tax calculations, fraud detection, and dispute handling that Stripe also absorbs."
  revisit={{ to: "/docs/solo/payments#phase-6-payments-if-building-saas", label: "Plain English intro" }}
/>

<Question
  prompt="Why should your webhook handler always return 200 ('ok')?"
  options={[
    { text: "Stripe charges a fee for non-200 responses" },
    { text: "So Stripe doesn't keep retrying the same event" },
    { text: "It's required for GDPR compliance" },
    { text: "Vercel ignores non-200 responses" }
  ]}
  correct={1}
  explanation="Stripe retries failed webhook deliveries. If you return non-200, the same event keeps arriving — fine for transient errors but noisy if everything actually succeeded. Always return 200 once you've handled the event."
  revisit={{ to: "/docs/solo/payments#step-2-handle-the-webhook", label: "Webhook response" }}
/>

</Quiz>

## What's next

→ Continue to [Phase 8: Deployment](./deployment) where pushing to GitHub is now the entire deployment process.
