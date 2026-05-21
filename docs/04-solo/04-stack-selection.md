---
id: stack-selection
title: 'Phase 2: Stack Selection'
sidebar_position: 5
sidebar_label: 4. Stack Selection
description: For a 2026 personal SaaS, the stack is basically pre-decided. Pick it, ship, and only revisit if you outgrow it.
---

# Phase 2: Stack Selection

> **In one line:** For a 2026 personal SaaS, the stack is essentially pre-decided. Use the defaults; ship the product.

:::tip[In plain English]
There's a "boring stack" that's quietly settled across the indie web — Next.js for the app, Postgres for data, Vercel for hosting, Clerk for auth, Stripe for payments. It's boring the way a Honda Civic is boring: not exciting, but it will start every morning for 200,000 miles. Don't agonize over which framework "feels" best. Pick the defaults and start.
:::

## The 2026 personal SaaS stack

For a 2026 personal SaaS, the stack is basically pre-decided:

```
Frontend + Backend:  Next.js 15 (App Router)
Language:            TypeScript
Styling:             Tailwind + shadcn/ui
Database:            Postgres on Neon (or Supabase)
ORM:                 Drizzle
Auth:                Clerk (fastest) or Better Auth (free, open-source)
Email:               Resend
Payments (if any):   Stripe
File storage (if any): Cloudflare R2
Hosting:             Vercel (or Cloudflare Pages)
Monitoring:          Sentry free tier
Analytics:           Vercel Analytics + PostHog free tier
```

This stack handles everything from 0 to ~10,000 active users without changes. By the time you outgrow it, you'll have learned enough to make the next decision wisely.

## Why Not [Other Stack]?

You'll be tempted to evaluate alternatives. Resist for personal projects:

- **Why not Astro?** Fine for content-only. Add interactivity → switch to Next.js eventually anyway.
- **Why not Svelte/Vue?** Smaller ecosystem; fewer copy-paste solutions on Stack Overflow.
- **Why not [your own custom stack]?** You'll spend more time setting it up than building.
- **Why not the latest hype?** New tools have unknown failure modes. Personal projects need shipping more than experimentation.

The exception: **if your goal is learning a specific technology**, use it. Just be aware you're optimizing for learning, not shipping.

:::note[Worked example: when to deviate]
You're building a small SaaS, but you genuinely want to learn Svelte. Is that a good reason to swap out Next.js?

- If learning Svelte is the *primary* goal and the app is the vehicle: yes, use Svelte. You're optimizing for learning.
- If launching the app is the *primary* goal: no, stick with Next.js. The Svelte detour adds 2–4 weeks of friction and gives you fewer copy-paste answers on Stack Overflow.

Be honest with yourself about which goal is primary. Both are legitimate — just don't pretend the Svelte detour is "for the project" when it's really for you.
:::

:::info[Highlight: scale anchor — "0 to 10K users without changes"]
The whole point of picking the default stack is that it carries you across the entire personal-project lifecycle. From day-one empty deploy to ~10K active users, you make zero architectural changes. By the time you'd outgrow it, you'll either (a) have real revenue to fund a rewrite, or (b) have learned enough about the actual workload to make a smart next call. Either way, you've earned that decision instead of pre-paying for it.
:::

## What's next

→ Continue to [Phase 3: Environment Setup](./env-setup) where we'll go from empty folder to deployed empty project in about an hour.
