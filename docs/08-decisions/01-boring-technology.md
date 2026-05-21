---
id: boring-technology
title: The Boring Technology Rule
sidebar_position: 2
sidebar_label: 1. Boring Technology
description: Choose boring technology. Save innovation tokens for the thing that actually differentiates your product.
---

# The Boring Technology Rule

> **In one line:** Choose boring technology. Save innovation tokens for the thing that actually differentiates your product.

:::tip In plain English
Every team has a small budget of "innovation tokens" — chances to bet on new, unfamiliar technology. Spend them on the one or two things that actually make your product different. Use boring, well-understood tools for everything else. Postgres, Redis, and Next.js aren't sexy, but they don't surprise you in production at 2 a.m.
:::

The phrase "innovation tokens" comes from Dan McKinley's 2015 essay. The idea: every team has a limited budget for adopting novel technology. Spend it on the one or two things that matter most. Use boring, well-understood tools for everything else.

## Why boring wins

- **Known failure modes.** Old technology has documented bugs, known limits, well-trodden recovery paths. New technology surprises you in production.
- **Mature ecosystems.** Libraries, tutorials, Stack Overflow answers, hiring pools.
- **Stable APIs.** New tools evolve rapidly; breaking changes are common. Boring tools change slowly.
- **Operational maturity.** Logging, monitoring, debugging tools, runbooks.
- **Risk reduction.** Less surface area for "new tech + new feature failing simultaneously."

## Concrete examples in 2026

**Boring choices (the ones to default to):**

- PostgreSQL for relational data.
- Redis for cache and queues.
- Next.js or your framework's stable LTS.
- React (boring at this point) for UI.
- TypeScript.
- Vercel or Cloudflare or AWS for hosting.
- Stripe for payments.
- Sentry for errors.

**Innovation tokens you might spend (one or two, deliberately):**

- A novel ML/AI workflow that's your differentiator.
- A specialized database for an unusual access pattern.
- A new framework that genuinely fits your problem.
- An edge-first architecture if performance is your moat.

**Innovation that's usually a mistake:**

- New programming language because it's hyped.
- Microservices because Netflix uses them.
- Custom build system because npm "isn't sophisticated enough."
- Web framework that's a year old when alternatives are mature.
- Document database when you want SQL.

## How to apply it

Before adopting a new tool, ask:

- **Is this the thing my company is uniquely good at?** If yes, maybe spend the token. If no, use the boring choice.
- **What's the cost of being wrong?** If high, lean boring.
- **What's the cost of staying with the alternative?** If high, the new tool might be worth it.

If you can't articulate why the new tool is necessary, it probably isn't.

:::note Worked example: spending a token deliberately
You're building an AI-first note-taking app. Your differentiator is the AI summarization and semantic search. Reasonable token allocation:

- **Spend a token on:** a vector database setup and a custom RAG pipeline — this is your moat.
- **Do NOT spend tokens on:** the framework (use Next.js), the database (use Postgres with pgvector), auth (use Clerk), hosting (use Vercel), payments (use Stripe).

You now have *one* novel thing to debug in production instead of five. Your team can focus their attention where it matters.
:::

:::info Highlight: the test for "is this boring enough?"
A tool is "boring" if:

1. It's been used in production at meaningful scale for at least 5 years.
2. You can hire 10 people who know it well without searching beyond your city.
3. When something breaks, the first Google result is helpful.

If a tool fails any of those tests, it's probably an innovation token. Decide consciously.
:::

## What's next

→ Continue to [The Reversibility Test](./reversibility) — how to allocate deliberation time based on whether a decision is a one-way or two-way door.
