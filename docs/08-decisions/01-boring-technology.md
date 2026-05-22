---
id: boring-technology
title: The Boring Technology Rule
sidebar_position: 2
sidebar_label: 1. Boring Technology
description: Choose boring technology. Save innovation tokens for the thing that actually differentiates your product.
---

# The Boring Technology Rule

> **In one line:** Choose boring technology. Save innovation tokens for the thing that actually differentiates your product.

:::tip[In plain English]
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

:::note[Worked example: spending a token deliberately]
You're building an AI-first note-taking app. Your differentiator is the AI summarization and semantic search. Reasonable token allocation:

- **Spend a token on:** a vector database setup and a custom RAG pipeline — this is your moat.
- **Do NOT spend tokens on:** the framework (use Next.js), the database (use Postgres with pgvector), auth (use Clerk), hosting (use Vercel), payments (use Stripe).

You now have *one* novel thing to debug in production instead of five. Your team can focus their attention where it matters.
:::

:::info[Highlight: the test for "is this boring enough?"]
A tool is "boring" if:

1. It's been used in production at meaningful scale for at least 5 years.
2. You can hire 10 people who know it well without searching beyond your city.
3. When something breaks, the first Google result is helpful.

If a tool fails any of those tests, it's probably an innovation token. Decide consciously.
:::

## Page checkpoint

<Quiz id="decisions-boring-technology-page" title="Did the boring technology rule stick?" sampleSize={2}>

<Question
  prompt="Your AI-first note-taking app needs to ship. Which of these is the right place to spend an innovation token?"
  options={[
    { text: "The web framework — pick the newest one for marketing buzz" },
    { text: "The custom RAG pipeline and vector store that powers your differentiating semantic search" },
    { text: "Auth — roll your own so you control every detail" },
    { text: "The hosting platform — use a brand-new edge provider that launched last month" }
  ]}
  correct={1}
  explanation="Innovation tokens go on the thing that makes you unique. Your AI/RAG pipeline is your moat; framework, auth, and hosting should be the boring defaults so you have only one novel thing to debug in production."
  revisit={{ to: "/docs/decisions/boring-technology#how-to-apply-it", label: "How to apply it" }}
/>

<Question
  prompt="A teammate proposes adopting a 14-month-old web framework that has 800 GitHub stars. By the chapter's 'is this boring enough?' test, which signal most disqualifies it as a boring choice?"
  options={[
    { text: "It hasn't been used in production at meaningful scale for at least 5 years" },
    { text: "It has fewer GitHub stars than the alternatives" },
    { text: "Its logo is ugly" },
    { text: "It's written in TypeScript instead of Rust" }
  ]}
  correct={0}
  explanation="The boring test requires production use at meaningful scale for ~5+ years, a hireable local talent pool, and helpful first-page Google results when things break. A 14-month-old framework fails the first criterion outright."
  revisit={{ to: "/docs/decisions/boring-technology#how-to-apply-it", label: "Is this boring enough?" }}
/>

<Question
  prompt="Why does the chapter argue old, boring technology beats new technology for most jobs?"
  options={[
    { text: "Old technology is always faster than new technology" },
    { text: "Boring tech has known failure modes, mature ecosystems, stable APIs, and operational maturity — the surprises live elsewhere" },
    { text: "New technology is more expensive to license" },
    { text: "Senior engineers refuse to work with new tools" }
  ]}
  correct={1}
  explanation="The case for boring is structural: documented bugs, well-trodden recovery paths, abundant hiring, slow-moving APIs, and existing runbooks. New tech surprises you in production at 2 a.m."
  revisit={{ to: "/docs/decisions/boring-technology#why-boring-wins", label: "Why boring wins" }}
/>

<Question
  prompt="Which of these is described as 'innovation that's usually a mistake' — i.e., a bad place to spend a token?"
  options={[
    { text: "A specialized database for a genuinely unusual access pattern you've measured" },
    { text: "A novel ML workflow that's your product's differentiator" },
    { text: "Microservices because Netflix uses them" },
    { text: "An edge-first architecture when performance is genuinely your moat" }
  ]}
  correct={2}
  explanation="Adopting microservices because a 10,000-engineer company does is the canonical cargo-cult mistake. The other options describe deliberate tokens tied to a real, specific problem."
  revisit={{ to: "/docs/decisions/boring-technology#concrete-examples-in-2026", label: "Innovation that's usually a mistake" }}
/>

</Quiz>

## What's next

→ Continue to [The Reversibility Test](./reversibility) — how to allocate deliberation time based on whether a decision is a one-way or two-way door.
