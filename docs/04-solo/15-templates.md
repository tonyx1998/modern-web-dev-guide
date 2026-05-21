---
id: templates
title: Pre-Built Templates Worth Knowing
sidebar_position: 16
sidebar_label: 15. Templates
description: shadcn/ui, Vercel templates, SaaS starter kits, Create T3 App. When starting from a template saves days; when it costs them.
---

# Pre-Built Templates Worth Knowing

> **In one line:** A good template skips days of setup. A bad one locks you into code you don't understand. Pick deliberately.

:::tip[In plain English]
A template is like a furnished apartment — you can move in tonight, but the previous tenant chose the curtains. Sometimes that's a huge win (you didn't want to pick curtains anyway). Sometimes you'll be ripping out wallpaper for a month. Templates work best when their opinions roughly match yours.
:::

## Templates worth knowing in 2026

Don't always start from scratch:

- **shadcn/ui** — Component library.
- **Vercel templates** (vercel.com/templates) — Many starter Next.js apps.
- **shipfa.st, mkdirs.com, indiestarter.dev** — Paid SaaS starter kits (auth + payments + landing page pre-built).
- **Create T3 App** — Type-safe full-stack starter (Next.js + tRPC + Drizzle + Tailwind).

Templates save days of setup. Just make sure you understand what they do — don't deploy something you can't maintain.

:::note[Worked example: which template for which goal]
- "I want to build a SaaS with auth, payments, and a landing page already wired up." → A paid kit like shipfa.st. Money saves you weeks.
- "I want a Next.js + Postgres + tRPC project structure I'd build anyway." → Create T3 App. Zero cost; opinionated in mainstream ways.
- "I want pre-built buttons, inputs, dropdowns, dialogs that look good." → shadcn/ui (not really a template — a component library you copy in).
- "I want to clone someone's specific finished app." → Browse Vercel templates for one that matches.

Don't reach for a template just because templates exist. Match it to the specific time you'd otherwise spend.
:::

:::info[Highlight: understand-or-don't-use]
The single template danger: deploying code you can't read. When a Stripe webhook misfires in production, you need to know exactly how the kit handles subscriptions. If the answer is "I have no idea, the template does it," you have a debugging time bomb.

Before you `npm install` a paid SaaS kit, spend an evening reading its source. If you can't make sense of the auth flow or the payment handler, walk away.
:::

## What's next

→ Continue to [A Sample Two-Weekend Project](./sample-project) for a concrete weekend-by-weekend schedule.
