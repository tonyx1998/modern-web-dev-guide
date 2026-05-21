---
id: pitfalls
title: Common Pitfalls at This Scale
sidebar_position: 17
sidebar_label: 16. Pitfalls
description: Microservices too early, premature scaling, skipping observability, no code review, building auth from scratch, ignoring security, process theater, tech debt avoidance.
---

# Common Pitfalls at This Scale

> **In one line:** Microservices too early, premature scaling, no observability, no code review, building what you should buy, ignoring security, process theater, and avoiding tech debt — the eight ways startups consistently shoot themselves in the foot.

:::tip In plain English
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

:::note Worked example: a microservices "decision" reversed
A 12-engineer team decides they need to split their app into "the API service," "the worker service," and "the auth service." Three months in: deploy coordination is a nightmare, network calls between services are flaky, debugging requires reading three log streams at once.

In a retro, the team admits the split was premature. They merge the services back into one monolith (~3 weeks of work). Velocity recovers; on-call calms down.

The lesson isn't "microservices are bad." It's "microservices solve organizational problems you don't have yet at 12 engineers." Reversing the call early was the right move; staying stubborn would have cost six months of velocity.
:::

:::info Highlight: process theater is everyone's responsibility
Process theater (standups, retros, JIRA fields) doesn't get added by a villain — it accumulates by inertia. Nobody decides "let's keep doing the useless standup." It just becomes habit.

The fix is institutional: every retro should include "what process should we kill?" The list of accepted process should be *shorter than you'd expect*, with each item earning its place.
:::

## What's next

→ Continue to [When You're Outgrowing This Scale](./outgrowing) where we'll cover the signs you're approaching the enterprise stage.
