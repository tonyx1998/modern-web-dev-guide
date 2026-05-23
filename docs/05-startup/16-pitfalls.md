---
id: pitfalls
title: Common Pitfalls at This Scale
sidebar_position: 17
sidebar_label: 16. Pitfalls
description: Microservices too early, premature scaling, skipping observability, no code review, building auth from scratch, ignoring security, process theater, tech debt avoidance.
---

# Common Pitfalls at This Scale

> **In one line:** Microservices too early, premature scaling, no observability, no code review, building what you should buy, ignoring security, process theater, and avoiding tech debt — the eight ways startups consistently shoot themselves in the foot.

:::tip[In plain English]
Each of these pitfalls is a reasonable-sounding decision that turns out to be expensive. They're not exotic failures — most growing startups hit several of them. The goal isn't to never make any of these mistakes; it's to recognize them quickly and reverse course.
:::

## Microservices Too Early

The single biggest mistake of growing startups. Microservices add:
- Network latency between services.
- Distributed debugging complexity.
- Deployment coordination.
- Operational overhead.
- Communication boundaries between teams (which is what they're for — but you don't have enough teams yet).

A modular monolith handles ~50 engineers comfortably. Most "we need microservices" pain is actually "we need cleaner module boundaries."

## Premature Scaling

Designing for 10M users when you have 100. Building elaborate caching layers, sharded databases, multi-region failover — for traffic levels a single Postgres handles trivially.

Build for 10x current scale. Re-architect when actual load demands it.

## Skipping Observability Until Something Breaks

By the time you wish you had Sentry, you've already had ten production bugs you didn't know about. Set up Sentry on day one.

## No Code Review

"We're moving fast" is not an excuse. Code review:
- Catches bugs.
- Spreads knowledge.
- Builds team culture.
- Forces clarity.

Even a 2-person team should review each other's work.

## Building Auth/Payments/Email From Scratch

Time spent building these is time not spent on your differentiator. Use Clerk, Stripe, Resend. The cost is trivial compared to engineering time.

## Ignoring Security Until Compelled

A breach can kill a startup — lost trust, lost customers, possible legal liability. Basic hygiene from day one (HTTPS, validated inputs, secrets management) is cheap.

## Hiring Specialists Too Early

A 10-person team needs generalists. Hiring a specialized DevOps engineer when nobody on the team can touch infrastructure creates a bottleneck.

## Process Theater

Daily standups that have become status reports nobody listens to. Weekly retros that produce action items nobody acts on. JIRA fields nobody fills in. Periodically prune.

## Tech Debt Avoidance

"We'll refactor next quarter" — three years in a row. Tech debt compounds. Allocate explicit time (10–20% per sprint) to maintenance and refactoring.

:::note[Worked example: a microservices "decision" reversed]
A 12-engineer team decides they need to split their app into "the API service," "the worker service," and "the auth service." Three months in: deploy coordination is a nightmare, network calls between services are flaky, debugging requires reading three log streams at once.

In a retro, the team admits the split was premature. They merge the services back into one monolith (~3 weeks of work). Velocity recovers; on-call calms down.

The lesson isn't "microservices are bad." It's "microservices solve organizational problems you don't have yet at 12 engineers." Reversing the call early was the right move; staying stubborn would have cost six months of velocity.
:::

:::info[Highlight: process theater is everyone's responsibility]
Process theater (standups, retros, JIRA fields) doesn't get added by a villain — it accumulates by inertia. Nobody decides "let's keep doing the useless standup." It just becomes habit.

The fix is institutional: every retro should include "what process should we kill?" The list of accepted process should be *shorter than you'd expect*, with each item earning its place.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Over-engineering the anti-microservices stance.** "No microservices" is a heuristic, not a religion. When the auth team genuinely needs to deploy on a different cadence at 60 engineers, refusing to extract a service "because monoliths win" is the *same* dogma in the opposite direction. Re-evaluate at real triggers.
- **Treating this whole pitfalls list as a checklist to audit on day one.** A 6-engineer team that spends a quarter on observability, SOC 2 prep, RFC processes, and tech-debt budgets has built process to avoid theoretical pain instead of shipping. Solve pitfalls as they actually appear — not in advance.
- **Doom-scrolling postmortems from other companies and adopting their fixes.** A war story about Kubernetes failures at a 500-engineer org is interesting; it's not a blueprint for your 12-person team. Filter learnings by "does this match our actual scale?" before importing the cure.
- **Paralysis from picking the "right" thing.** Endless evaluation of Drizzle vs Prisma, tRPC vs Server Actions, Trigger.dev vs Inngest. Each pair is *fine* at this scale. The cost of choosing wrong (a future migration) is less than the cost of three weeks of evaluation. Pick, ship, revisit if it bites.
- **Over-correcting from one pitfall straight into another.** A team burned by "premature scaling" rejects all caching for two years and ships a 4-second dashboard. A team burned by "no review" institutes 3-reviewer gates and stalls velocity. The middle is always less satisfying than swinging — find it anyway.
:::

## Page checkpoint

<Quiz id="startup-pitfalls-page" title="Did the pitfalls stick?" sampleSize={2}>

<Question
  prompt="What does the page call the single biggest mistake of growing startups?"
  options={[
    { text: "Microservices too early" },
    { text: "Hiring too many generalists" },
    { text: "Picking the wrong programming language" },
    { text: "Using shadcn/ui instead of a custom design system" }
  ]}
  correct={0}
  explanation="Microservices too early is named the single biggest mistake. They solve organizational problems you don't yet have, and add network latency, distributed debugging, deploy coordination, and operational overhead instead."
  revisit={{ to: "/docs/startup/pitfalls#microservices-too-early", label: "Microservices too early" }}
/>

<Question
  prompt="How does the page frame premature scaling?"
  options={[
    { text: "Design for 10M users from day one to avoid future rewrites" },
    { text: "Build for ~10x current scale; re-architect when actual load demands it, not before" },
    { text: "Always shard the database before launch" },
    { text: "Premature scaling isn't a real concern" }
  ]}
  correct={1}
  explanation="Designing for 10M users when you have 100 is premature. The rule of thumb is build for 10x current scale and re-architect only when real load demands it."
  revisit={{ to: "/docs/startup/pitfalls#premature-scaling", label: "Premature scaling" }}
/>

<Question
  prompt="Why does the page tell startups not to build auth, payments, or email from scratch?"
  options={[
    { text: "It's illegal in most jurisdictions" },
    { text: "Time spent building these is time not spent on your differentiator; managed services are cheap compared to engineering time" },
    { text: "Open-source options don't exist" },
    { text: "Engineers find these topics boring" }
  ]}
  correct={1}
  explanation="Clerk, Stripe, and Resend cost trivially compared to engineering time. Every hour rebuilding auth, payments, or email is an hour not building your product's actual differentiator."
  revisit={{ to: "/docs/startup/pitfalls#building-authpaymentsemail-from-scratch", label: "Buy vs build" }}
/>

<Question
  prompt="What does the page mean by process theater?"
  options={[
    { text: "Plays performed at company offsites" },
    { text: "Standups, retros, and JIRA fields that have become habit but no longer produce useful outcomes" },
    { text: "A monthly demo for investors" },
    { text: "The on-call rotation handoff ritual" }
  ]}
  correct={1}
  explanation="Process theater is process that accumulated by inertia — standups nobody listens to, retros with no follow-through, JIRA fields nobody fills in. Every retro should ask what process to kill."
  revisit={{ to: "/docs/startup/pitfalls#process-theater", label: "Process theater" }}
/>

</Quiz>

## What's next

→ Continue to [When You're Outgrowing This Scale](./outgrowing) where we'll cover the signs you're approaching the enterprise stage.
