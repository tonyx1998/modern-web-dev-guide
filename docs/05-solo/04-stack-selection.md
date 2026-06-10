---
id: stack-selection
title: 'Phase 3: Stack Selection'
sidebar_position: 5
sidebar_label: 4. Stack Selection
description: For a 2026 personal SaaS, the stack is basically pre-decided. Pick it, ship, and only revisit if you outgrow it.
---

# Phase 3: Stack Selection

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

## Common mistakes

:::caution[Where people commonly trip up]
- **Comparison-shopping the stack for a week.** Solo devs spend Saturday reading "Bun vs Deno vs Node in 2026" threads and Sunday reading "Drizzle vs Prisma" benchmarks. The fix is to take the defaults on this page as if they were chosen for you, and ship. Even a *slightly worse* stack you actually used beats the perfect one you never started.
- **Picking the AI-native framework du jour.** Every six months a hot new framework promises to obsolete Next.js. The fix is to wait two release cycles before adopting — your project lasts longer than the hype curve, and migrating mid-build costs weeks.
- **Splitting hosts to "save money."** Putting the frontend on Cloudflare Pages, the API on Fly.io, the DB on Railway, and auth on Supabase to shave $10/month creates four dashboards, four CLIs, and four ways for prod to break. The fix is one platform until the bills actually hurt — usually never.
- **Locking yourself into something exotic for "the learning."** A custom Rust backend or self-hosted Postgres is great for a learning project, terrible for a SaaS you want users on. The fix is to separate the goals: pick the boring stack for the SaaS, pick the exotic thing for a separate learning repo.
:::

## Page checkpoint

<Quiz id="solo-stack-selection-page" title="Did stack selection stick?" sampleSize={3}>

<Question
  prompt="Up to roughly how many active users does the default 2026 stack handle without architectural changes?"
  options={[
    { text: "About 100" },
    { text: "About 1,000" },
    { text: "About 10,000" },
    { text: "About 1,000,000" }
  ]}
  correct={2}
  explanation="The stack carries you from zero to roughly 10,000 active users with zero architectural changes. By the time you outgrow it, you'll have either revenue or real workload data to make the next call wisely."
  revisit={{ to: "/docs/solo/stack-selection#the-2026-personal-saas-stack", label: "The 2026 stack" }}
/>

<Question
  prompt="When is it actually legitimate to deviate from the default stack?"
  options={[
    { text: "When you find a tweet praising a new framework" },
    { text: "When your primary goal is learning a specific technology" },
    { text: "When the default tools have any open GitHub issues" },
    { text: "Never — the defaults always win" }
  ]}
  correct={1}
  explanation="If learning a specific tech is your primary goal, swap it in — just be honest that you're optimizing for learning, not shipping. The page warns against pretending a detour is 'for the project' when it's really for you."
  revisit={{ to: "/docs/solo/stack-selection#why-not-other-stack", label: "When to deviate" }}
/>

<Question
  prompt="Which ORM does the default stack pair with Postgres?"
  options={[
    { text: "Prisma" },
    { text: "Drizzle" },
    { text: "TypeORM" },
    { text: "Sequelize" }
  ]}
  correct={1}
  explanation="The 2026 default stack uses Drizzle as the ORM with Postgres on Neon (or Supabase). It's a TypeScript-first query builder that fits the rest of the toolchain."
  revisit={{ to: "/docs/solo/stack-selection#the-2026-personal-saas-stack", label: "Default stack list" }}
/>

<Question
  prompt="Why does the page discourage Svelte or Vue for solo SaaS projects?"
  options={[
    { text: "They're slower at runtime" },
    { text: "They lack TypeScript support" },
    { text: "Smaller ecosystem means fewer copy-paste answers" },
    { text: "They can't deploy to Vercel" }
  ]}
  correct={2}
  explanation="The objection isn't technical merit — it's ecosystem size. Fewer Stack Overflow answers and fewer ready-made libraries means more time spent solving problems Next.js users have already solved."
  revisit={{ to: "/docs/solo/stack-selection#why-not-other-stack", label: "Why not other stacks" }}
/>

</Quiz>

## What's next

→ Continue to [Phase 4: Environment Setup](./env-setup) where we'll go from empty folder to deployed empty project in about an hour.
