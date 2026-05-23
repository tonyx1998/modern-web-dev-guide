---
id: services
title: Payments, Email, Files & Other Services
sidebar_position: 14
sidebar_label: Services
description: The boring-but-essential third-party services every app needs — payments (Stripe), email (Resend), files (R2), video (Mux), maps, push notifications, analytics.
---

# Payments, Email, Files & Other Services

> **In one line:** Buy, don't build. Every modern app stitches together best-in-class services for payments, email, files, video, and more.

:::tip[In plain English]
You're not going to build your own payment processor. Or your own globally-distributed file storage. Or your own email-deliverability system. These are *enormously* hard problems already solved by specialized companies. Pay them and move on. This page is the catalog of which services to pay.
:::

## Payments

| Service          | Notes                                                              |
|------------------|--------------------------------------------------------------------|
| **Stripe**        | Default for almost everyone. Excellent API and docs.              |
| **Paddle / Lemon Squeezy** | Merchant of Record (they handle global tax compliance). Great for indie SaaS. |
| **Adyen**         | Large enterprises.                                                 |

## Email (transactional)

| Service          | Notes                                                              |
|------------------|--------------------------------------------------------------------|
| **Resend**        | Modern, developer-friendly, React Email integration.              |
| **Postmark**      | High deliverability, focused on transactional.                    |
| **AWS SES**       | Cheap at scale, more setup.                                       |
| **SendGrid**      | Legacy choice, still widely used.                                  |

## Email (marketing)

- **Loops** — Modern, developer-friendly.
- **Customer.io** — Event-driven sequences.
- **Mailchimp** — Classic, broad features.

## File storage

| Service          | Notes                                                              |
|------------------|--------------------------------------------------------------------|
| **Cloudflare R2** | S3-compatible, **no egress fees** (major cost win). Increasingly the default. |
| **AWS S3**        | The original. Mature, integrated with everything AWS.             |
| **Backblaze B2**  | Cheap, S3-compatible.                                              |

## Image optimization & CDN

- **Cloudflare Images** — Bundled with Cloudflare.
- **Imgix / Cloudinary** — Image transformation as a service.
- **Framework built-ins** — Next.js `<Image>`, Astro `<Image>` handle most needs.

## Video

- **Mux** — Best DX for video. Upload → get adaptive streaming.
- **Cloudflare Stream** — Bundled with Cloudflare.

## SMS

- **Twilio** — Default.
- **MessageBird / Plivo** — Alternatives.

## Maps

- **Google Maps** — Most familiar, expensive at scale.
- **Mapbox** — Customizable, designer-friendly.
- **MapTiler / MapLibre** — Open-source alternatives.

## Push notifications

- **OneSignal** — Most popular.
- **Knock** — Multi-channel notifications.

## Analytics

| Service          | Notes                                                              |
|------------------|--------------------------------------------------------------------|
| **PostHog**       | Open-source, all-in-one (analytics, replay, flags, experiments).  |
| **Mixpanel / Amplitude** | Mature product analytics.                                  |
| **Plausible / Fathom** | Privacy-friendly, simple website analytics.                  |
| **Vercel Analytics** | Built-in for Vercel sites.                                     |

:::info[Highlight: the "buy" decision tree]
Before building any of the categories on this page, ask:

1. **Is this our core product?** No → buy.
2. **Are there 3+ mature competitors offering this as a service?** Yes → buy.
3. **Would I be embarrassed if a real company saw my version next to theirs?** Yes → buy.

The math almost always favors buying these services. Stripe charges 2.9% + 30¢ per transaction; *building* a global compliant payments system would cost ~$10M and 18 months. A weekend cost-benefit analysis isn't even close.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Building your own payment flow because Stripe "is just an API."** Stripe handles SCA, 3DS, dispute mediation, tax-ID validation, fraud signals, and a hundred jurisdictions. Six weeks into your homegrown version, you'll wish you'd used Stripe Checkout from the start.
- **Sending transactional email from your own SMTP server or from Gmail.** Deliverability is the entire game in email, and you don't get to opt out of SPF/DKIM/DMARC, IP warming, and reputation scoring. Use Resend, Postmark, or SES — they spend full-time engineering hours on the inbox-vs-spam fight you can't win solo.
- **Storing files in your application server's filesystem.** Works on one box, breaks the instant you scale to two, and dies on any serverless platform (ephemeral disk). Put files in R2 / S3 from day one — the API is barely more code, and you'll never have to migrate.
- **Paying S3 egress without realizing.** S3 egress is the silent killer of cloud bills. R2 (no egress fees), Backblaze B2, or putting Cloudflare in front of S3 can drop your bill by an order of magnitude if you're shipping a lot of bytes to users.
- **Skipping webhook signature verification on Stripe / GitHub / Slack endpoints.** Webhooks are public URLs; without signature checks, anyone can forge events. Every provider ships a verify helper — use it before you do anything with the payload.
- **Letting one provider's outage take down your whole product.** When Stripe (or Resend, or Twilio) has a bad afternoon, your "Send invite email" button shouldn't kill the signup flow. Push side-effects through a queue with retries so a third-party hiccup is invisible to users.
:::

## Page checkpoint

<Quiz id="stack-services-page" title="Did third-party services stick?" sampleSize={2}>

<Question
  prompt="What's the 'buy decision tree' the page recommends for any service category like payments or email?"
  options={[
    { text: "Always build — saves money long-term" },
    { text: "Buy only if your CTO approves it in writing" },
    { text: "Buy if it's not core, if 3+ mature competitors offer it as a service, or if you'd be embarrassed by your in-house version next to theirs" },
    { text: "Build the first version, then buy if it's slow" }
  ]}
  correct={2}
  explanation="The math almost always favors buying for these categories: payments, email deliverability, video, and storage are enormous specialized problems already solved well by mature services."
  revisit={{ to: "/docs/stack/services#payments", label: "Buy decision tree" }}
/>

<Question
  prompt="What advantage does Cloudflare R2 have over AWS S3 that's making it increasingly the default for file storage?"
  options={[
    { text: "R2 is faster on Linux machines" },
    { text: "R2 is S3-compatible but has no egress fees — a major cost win for download-heavy workloads" },
    { text: "R2 supports more file formats" },
    { text: "R2 includes a built-in CDN with no configuration" }
  ]}
  correct={1}
  explanation="R2 speaks the S3 API but charges nothing for egress, which is the line item that bites people on S3 once traffic grows. Same protocol, dramatically different bill."
  revisit={{ to: "/docs/stack/services#file-storage", label: "File storage" }}
/>

<Question
  prompt="Why might an indie SaaS pick Paddle or Lemon Squeezy over Stripe?"
  options={[
    { text: "They have lower per-transaction fees in every country" },
    { text: "They act as Merchant of Record, handling global tax compliance for you" },
    { text: "They're the only processors that support credit cards" },
    { text: "They include free email marketing" }
  ]}
  correct={1}
  explanation="Paddle and Lemon Squeezy are Merchants of Record — they collect the payment in their own name and handle VAT/GST/sales-tax filings globally. Stripe leaves that compliance to you."
  revisit={{ to: "/docs/stack/services#payments", label: "Payments section" }}
/>

<Question
  prompt="Which transactional email service does the page highlight for its developer-friendly DX and React Email integration?"
  options={[
    { text: "SendGrid" },
    { text: "AWS SES" },
    { text: "Resend" },
    { text: "Mailchimp" }
  ]}
  correct={2}
  explanation="Resend is the modern, developer-friendly transactional email service with first-class React Email integration. Postmark, SES, and SendGrid remain solid alternatives at different price/setup points."
  revisit={{ to: "/docs/stack/services#email-transactional", label: "Email (transactional)" }}
/>

</Quiz>

## What's next

→ Continue to [AI Infrastructure](./ai-infrastructure) — the model providers, SDKs, and observability tools for the AI layer.
