---
id: build-vs-buy
title: The Build vs Buy Decision
sidebar_position: 5
sidebar_label: 4. Build vs Buy
description: Default to buying for non-core capabilities; build only where you're the world's expert.
---

# The Build vs Buy Decision

> **In one line:** Default to buying for non-core capabilities; build only where you're the world's expert at that specific thing.

:::tip[In plain English]
People reliably underestimate the cost of building. A "two-week project" to add auth becomes six months of edge cases, security patches, and password-reset emails over the life of the system. Unless auth *is* your product, buying it from Clerk or Auth0 is almost always cheaper.
:::

## When to build

- **It's your core differentiator.** Building the thing that makes you unique.
- **Existing options are genuinely inadequate.** Not "I don't like the API"; truly missing critical capability.
- **You have unique scale or constraints.** Off-the-shelf tools don't fit your specific volume or shape of problem.
- **Existing tools are too expensive at your scale** and you've already calculated build-and-maintain cost.
- **You have a specific competitive reason.** A tool nobody else has gives you an edge.

## When to buy

- **The capability exists as a mature commercial product.** Auth (Clerk), payments (Stripe), email (Resend), monitoring (Sentry), analytics (PostHog).
- **It's not your differentiator.** Building auth is not why customers chose you.
- **You can't afford to specialize.** Specialized vendors employ teams of experts; you can't match that focus.
- **The build cost exceeds 2 years of license cost.** You can revisit later.

## The hidden cost of building

People underestimate maintenance:

- Initial build: 2 weeks.
- Edge cases discovered in production: 4 more weeks.
- Security updates: ongoing.
- Feature requests from users: never-ending.
- Documentation: months.
- Replacement when the original author leaves: weeks.

A "2-week build" easily becomes 6 months over the project's lifetime.

## Specific build/buy cases

| Capability             | Default                            | When to build                    |
|------------------------|------------------------------------|----------------------------------|
| Auth                   | Buy (Clerk, Auth0)                 | If your product IS auth          |
| Payments               | Buy (Stripe)                       | If at PayPal scale               |
| Email                  | Buy (Resend, Postmark)             | If email IS your product         |
| Error tracking         | Buy (Sentry)                       | At very large scale              |
| Analytics              | Buy (PostHog)                      | If analytics is your product     |
| Feature flags          | Buy (LaunchDarkly, PostHog)        | Custom needs only                |
| CMS                    | Buy or open-source                 | Highly custom editorial flow     |
| Search                 | Buy (Algolia, Typesense)           | Specialized at scale             |
| Job queue              | Buy (Trigger.dev) or OSS (BullMQ)  | Massive scale                    |
| Live chat              | Buy (Intercom)                     | Almost never                     |
| ML platform            | Mixed                              | Often build at scale             |

:::note[Worked example: a $30 vs $300,000 decision]
A small SaaS adds auth.

- **Buy path:** Clerk free tier today, ~$25/month when they hit 1,000 active users. Total first-year cost: ~$300. Two days of integration work.
- **Build path:** A "simple" auth system. Estimated 2 weeks. Real cost over 2 years (including password reset edge cases, two minor security patches, one social-login provider migration, one OAuth bug, documentation, hand-off when the original engineer leaves): conservatively 3 engineer-months. At a $300k fully-loaded engineer cost, that's ~$75,000 — and they still don't have features like SSO, MFA, or audit logs that Clerk gives them for free.

Build saved $300/year. It cost $75k. Buy wins by ~100x.
:::

:::info[Highlight: the question that exposes the real cost]
Before you "just build it," ask: **"Who maintains this in three years, when the author has left and no one remembers why the password reset uses base32?"** If you can't answer that question with a real name, buy.
:::

## Page checkpoint

<Quiz id="decisions-build-vs-buy-page" title="Did build vs buy stick?" sampleSize={2}>

<Question
  prompt="In the worked example, the team estimates 2 weeks to build auth in-house vs paying ~$300/year for Clerk. Over 2 years, the chapter calculates the realistic build cost as roughly:"
  options={[
    { text: "$3,000 — basically the 2-week estimate" },
    { text: "$75,000 — about 3 engineer-months of true lifetime cost" },
    { text: "$300 — same as the buy path" },
    { text: "Impossible to know in advance" }
  ]}
  correct={1}
  explanation="The chapter's point is that 'two-week builds' realistically become ~6 months of lifetime cost when you count edge cases, security patches, OAuth bugs, docs, and handoff — ~$75k versus ~$600 for two years of Clerk."
  revisit={{ to: "/docs/decisions/build-vs-buy#the-hidden-cost-of-building", label: "Hidden cost of building" }}
/>

<Question
  prompt="Which of these is a legitimate reason to BUILD rather than buy, per the chapter?"
  options={[
    { text: "The off-the-shelf option's API is a little ugly" },
    { text: "It's your core differentiator — the thing that makes you unique" },
    { text: "An engineer on the team is excited to write it" },
    { text: "Other companies have built their own version" }
  ]}
  correct={1}
  explanation="The chapter's build criteria are: it's your differentiator, existing options are genuinely inadequate, you have unique scale/constraints, or buy economics fail at your scale. Aesthetic dislike and engineer enthusiasm don't qualify."
  revisit={{ to: "/docs/decisions/build-vs-buy#when-to-build", label: "When to build" }}
/>

<Question
  prompt="The chapter offers one diagnostic question to expose the real cost of building. What is it?"
  options={[
    { text: "'How much does the vendor charge per seat?'" },
    { text: "'Can we ship the MVP in two weeks?'" },
    { text: "'Who maintains this in three years, after the author has left?'" },
    { text: "'Does the team already know the technology?'" }
  ]}
  correct={2}
  explanation="The maintenance question forces you to confront lifetime cost: if you can't name a specific person who'll own it in three years (and explain quirky decisions like 'why does the password reset use base32'), you should buy."
  revisit={{ to: "/docs/decisions/build-vs-buy#the-hidden-cost-of-building", label: "Question that exposes real cost" }}
/>

<Question
  prompt="Your B2B SaaS needs payments. You process about $50k/month. What's the chapter's default recommendation?"
  options={[
    { text: "Build — Stripe fees compound at scale" },
    { text: "Buy Stripe — building only makes sense at PayPal-like scale" },
    { text: "Buy initially, then build once revenue passes $1M ARR" },
    { text: "Build a thin Stripe wrapper for flexibility" }
  ]}
  correct={1}
  explanation="The build/buy table is explicit: default to buying Stripe for payments, build only at PayPal scale. At $50k/month you'd save nothing and lose months of focus."
  revisit={{ to: "/docs/decisions/build-vs-buy#specific-buildbuy-cases", label: "Specific build/buy cases" }}
/>

</Quiz>

## What's next

→ Continue to [The Two-Pizza Rule](./two-pizza-rule) — keep teams small enough that two pizzas can feed them.
