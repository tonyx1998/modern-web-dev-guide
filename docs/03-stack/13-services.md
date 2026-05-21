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

## What's next

→ Continue to [AI Infrastructure](./ai-infrastructure) — the model providers, SDKs, and observability tools for the AI layer.
