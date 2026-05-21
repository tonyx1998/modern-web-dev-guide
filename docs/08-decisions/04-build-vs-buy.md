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

## What's next

→ Continue to [The Two-Pizza Rule](./two-pizza-rule) — keep teams small enough that two pizzas can feed them.
