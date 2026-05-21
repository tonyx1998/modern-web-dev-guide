---
id: observability
title: 'Phase 9: Observability'
sidebar_position: 12
sidebar_label: 11. Observability
description: Sentry for errors, Better Stack or Axiom for logs, uptime monitoring, PostHog for product analytics, Vercel Analytics for performance, and a simple on-call rotation.
---

# Phase 9: Observability

> **In one line:** Errors in Sentry. Logs in Better Stack or Axiom. Uptime via Better Stack. Behavior in PostHog. Performance in Vercel Analytics. On-call rotates weekly.

:::tip[In plain English]
Solo, you can get away with just Sentry. At startup scale, the observability surface widens because the things that can go wrong widen — payments fail silently, background jobs back up, a slow query starts cascading. Each tool covers one specific dimension; together they form the picture you need to keep a paying-customer product up.
:::

## A typical small-company observability stack

## Errors: Sentry

- Captures exceptions in frontend, backend, and serverless functions.
- Source maps for readable stack traces.
- Releases tied to git commits.
- Alerts for new error types or regression in volume.

## Logs: Better Stack or Axiom

- Centralized logs from Vercel functions + Supabase + Resend + Stripe webhooks.
- Search across all sources.
- Saved queries for common investigations.

## Uptime: Better Stack Heartbeats

- Pings critical endpoints every 1–3 minutes.
- Alerts on 3+ consecutive failures.
- Status page for customers.

## Product analytics: PostHog

- Page views, user behavior, funnel analysis.
- Session replay for debugging hard-to-reproduce issues.
- Feature flags + A/B testing.
- Cohort analysis.

## Performance: Vercel Analytics + Sentry Performance

- Core Web Vitals from real users.
- API endpoint latencies.
- Slow query identification.

## On-call

- Simple rotation: one engineer at a time, rotates weekly.
- Tools: Better Stack On-call, Incident.io, or PagerDuty.
- Runbooks for common issues in Notion.
- Blameless post-mortems for significant incidents.

:::note[Worked example: an incident pieced together from three tools]
**Symptom:** Users complain checkout is slow.

1. **Vercel Analytics:** confirms checkout p95 latency has jumped from 800ms to 4s in the last hour.
2. **Sentry Performance:** points to the Server Action `createCheckoutSession` as the slow call.
3. **Better Stack logs:** filtered to that endpoint, show a slow query against the `customers` table.
4. **Supabase slow-query log:** confirms a missing index after a recent migration.

Total time from "users complain" to "root cause identified": about 10 minutes. Without these tools, this would have been an hour of guesswork. The investment in observability pays back the *first time* there's a real incident.
:::

:::info[Highlight: blameless post-mortems matter more than blame]
After a significant incident, the team writes a short post-mortem in Notion: what happened, when, why, what fixed it, what would have caught it earlier. *Crucially, the document doesn't name individuals as the cause.*

The reason is practical, not soft: the moment people fear post-mortems, they hide near-misses. Hidden near-misses become future incidents. Blameless writing trades the small dopamine hit of assigning fault for the much larger benefit of an honest learning culture.
:::

## What's next

→ Continue to [Phase 10: Security and Compliance](./security) where daily hygiene, SOC 2, and pen testing become real concerns.
