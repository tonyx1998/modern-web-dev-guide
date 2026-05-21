---
id: outgrowing
title: When You're Outgrowing This Scale
sidebar_position: 18
sidebar_label: 17. Outgrowing
description: Signs you're approaching the next stage — 50+ engineers, multi-team blocking, risky monolith deploys, real microservices reasons, mounting compliance, exhausted on-call.
---

# When You're Outgrowing This Scale

> **In one line:** When your engineering org passes 50 people, teams routinely block each other, monolith deploys feel risky, and on-call exhausts a single brain — you've outgrown the small-company workflow.

:::tip[In plain English]
The small-company workflow has natural limits. The patterns that worked at 20 engineers start to creak at 60. Recognizing the signals early lets you transition deliberately instead of in crisis. The next chapter — [Large Company Workflow](/docs/enterprise) — covers what changes.
:::

## Signs you've outgrown the small-company workflow

Signs you're approaching the next stage:

- **Engineering org > 50 people.** Communication overhead is constant. Decisions take days, not hours.
- **Multiple teams routinely block each other.** "We're waiting on the platform team" becomes a regular phrase.
- **The monolith deploys are getting risky.** Every deploy touches code from 20 engineers.
- **You're considering microservices for real reasons.** Different teams need different deployment cadences; different services have wildly different scaling needs.
- **Compliance work is consuming significant time.** SOC 2, HIPAA, PCI all stack up.
- **You have on-call but it's exhausting.** A single engineer can't reasonably understand the whole system.

That's when [Chapter 6: Large Company Workflow](/docs/enterprise) becomes relevant.

## Wrapping Up Part 5

Small-company web development in 2026 is a sweet spot. The tooling is mature, the patterns are well-understood, and a small team can ship genuinely impressive software:

- Pick the dominant stack (Next.js + Postgres + Vercel + Supabase + managed services).
- Build a [modular monolith](./architecture).
- Add process when missing it causes pain.
- Lean on managed services for everything not central to your differentiator.
- Maintain code quality through [review](./cicd) and [testing](./testing).
- Monitor production from day one.
- Plan for the next year, not the next decade.

The hardest discipline: resisting both extremes. Don't be sloppy like a personal project; don't be heavyweight like an enterprise. Stay in the middle, where execution speed is highest.

:::note[Worked example: a clean graduation]
A startup hits 55 engineers. The CTO notices three signals over one quarter:

1. Two teams blocked each other on a shared module three times in a month.
2. A bad deploy took down the app for 12 minutes because the monolith merge bundled fifteen people's changes.
3. SOC 2 work is now consuming one full engineer's time, but they have no security org to own it.

Instead of waiting for things to get worse, the CTO starts a deliberate transition: spin up a small platform team, extract two services from the monolith (the two that scale very differently), and hire a security lead. None of these moves are "we became an enterprise overnight" — they're surgical responses to specific signals.

Three months later, the team is operating under more of the patterns in [Chapter 6](/docs/enterprise). The transition was uncomfortable but not catastrophic.
:::

:::info[Highlight: graduating gracefully beats graduating in crisis]
Most companies don't notice they've outgrown their workflow until something breaks badly — a major incident, a key hire quitting, a missed deadline. The hard skill at this stage is *noticing the signals early and acting on them before the crisis.*

The signals listed above are the leading indicators. Watch them quarterly. When two or three are flashing red, start the transition — don't wait for the fourth.
:::

## What's next

→ Continue to [Chapter 6: Large Company Workflow](/docs/enterprise) — what changes when you scale to enterprise: hundreds of engineers, regulatory compliance, massive infrastructure.
