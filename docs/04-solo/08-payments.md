---
id: payments
title: 'Phase 6: Payments (If Building SaaS)'
sidebar_position: 9
sidebar_label: 8. Payments
description: Stripe Checkout plus a webhook handler is the minimal payments flow. You never touch a credit card number.
---

# Phase 6: Payments (If Building SaaS)

> **In one line:** Stripe Checkout takes the user to Stripe's site for payment, then a webhook tells your server they paid. You never see a credit card number.

:::tip In plain English
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

:::note Worked example: end-to-end test in Stripe test mode
1. Switch your `STRIPE_SECRET_KEY` to the test key (`sk_test_...`).
2. Run `stripe listen --forward-to localhost:3000/api/stripe/webhook` in a second terminal.
3. Click "Subscribe" in your app.
4. On the Stripe-hosted Checkout page, use card number `4242 4242 4242 4242` with any future expiry and any CVC.
5. Get redirected back to `/dashboard?success=1`.
6. Watch the Stripe CLI window — you'll see the `checkout.session.completed` event being forwarded to your local webhook.
7. Check your local DB — the `subscriptions` row should be there.

Now do it once more with card `4000 0000 0000 0002` — Stripe rejects that one, so you'll see the user *not* land on success. Both code paths covered.
:::

:::info Highlight: the metadata trick
`metadata: { userId }` in the Checkout session is how you connect a Stripe customer back to your own user. Without it, the webhook arrives with a Stripe customer ID and no easy way to know *which* of your users it belongs to.

Always pass enough metadata in the session creation to identify the user in the webhook. It's tempting to look up by email — don't. Emails can change; Stripe customer IDs are stable; your `userId` is the bridge.
:::

## What's next

→ Continue to [Phase 7: Deployment](./deployment) where pushing to GitHub is now the entire deployment process.
