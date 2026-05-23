---
id: maintenance
title: 'Phase 11: Maintenance and Scaling'
sidebar_position: 14
sidebar_label: 13. Maintenance
description: Weekly cadence (bug triage, sprint planning, perf review, cost review), scaling Postgres with indexes, replicas, pooling, and caching.
---

# Phase 11: Maintenance and Scaling

> **In one line:** A weekly cadence of triage, sprint, performance, and cost reviews. When growth bites, scale Postgres first (indexes, replicas, pooling), then add caching, *then* re-architect.

:::tip[In plain English]
Once the company is past MVP and into "running a real product," maintenance and scaling become rhythms instead of projects. Bug triage every week. Slow-query review every week. Cost review every week. Nothing dramatic — but the lack of dramatic moments is the point.
:::

## Weekly cadence

- Bug triage (Linear, Jira) — categorize new issues.
- Sprint review/planning — what shipped, what's next.
- Performance review — slowest endpoints, costliest queries.
- Cost review — Vercel/Supabase/Sentry/PostHog bills.

## Scaling Postgres

:::info[Jargon]
- **Index** — a separate data structure Postgres can use to find rows for a query without scanning the whole table.
- **Read replica** — a copy of the database that handles `SELECT` traffic; writes still go to the primary.
- **Connection pool** — a process (PgBouncer, Supavisor) sitting between your app and Postgres that multiplexes many client connections onto a small number of real DB connections. Critical with serverless functions, where each function instance otherwise opens its own connection.
- **`EXPLAIN ANALYZE`** — a Postgres command that runs a query and reports the actual execution plan, including which indexes were used and how long each step took.
:::

- **Indexes** for columns frequently filtered or sorted.
- **Read replicas** when read load becomes significant (Supabase, Neon support this).
- **Connection pooling** (PgBouncer, Supavisor) — essential in serverless environments.
- **Caching** (Upstash Redis) — reduce repeated queries.
- **Query optimization** — `EXPLAIN ANALYZE` slow queries; rewrite or add indexes.

## Scaling the app

- Vercel auto-scales serverless functions.
- Railway auto-scales containers.
- Add background job workers if queues are backing up.
- Add caching layers (Redis, CDN) before scaling compute.

## Cost optimization

- Move large data to R2 (no egress fees).
- Cache API responses aggressively.
- Use ISR or static generation where possible.
- Right-size your database tier.
- Audit unused services periodically.

:::note[Worked example: a slow query review that paid off]
At the weekly perf review, the team notices the dashboard endpoint has crept from 200ms to 900ms p95 over the last month. They open the Supabase slow-query log.

The culprit: a query that joins `users` to `subscriptions` and filters by `status = 'active'`. As the user count grew, the lack of an index on `subscriptions.status` started biting.

```sql
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
```

One migration. p95 latency back to 200ms. Found and fixed in ~30 minutes — *because the weekly cadence surfaced it before users complained.*
:::

:::info[Highlight: scale Postgres before re-architecting]
The instinct when traffic grows is to imagine you need microservices, Kubernetes, a separate read-API service. Usually, you need none of those. You need:

1. An index on the column that's now being scanned.
2. A connection pool because serverless functions exhaust DB connections.
3. A Redis cache in front of a few hot endpoints.

In that order. Most "we need to re-architect" pain at this scale dissolves once Postgres is properly tuned. Re-architecting is a *last* resort, not a *first* one.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Indexing every column "just in case."** Each index slows writes and costs storage. Add indexes when `EXPLAIN ANALYZE` proves a real query is doing a sequential scan — not preemptively because someone might filter by `created_at` someday.
- **Caching too aggressively, then debugging stale data for a month.** A 5-minute Redis TTL on user profile data feels fine until a customer changes their email and gets confused for an hour. Cache only what's safe to be slightly stale, and invalidate on write where it matters.
- **Letting the cost review become "review the chart, nothing to do."** Each weekly review needs a *decision*: cap a runaway service, archive cold data, downgrade a tier. Reviews that end in "interesting, see you next week" stop adding value within a month.
- **Putting off the major Postgres or framework upgrade because "it's stable."** A Postgres 14 cluster you can't easily upgrade in 2026 is a future weekend of pain. Schedule version upgrades quarterly while the gap is small — it's cheaper than catching up by three majors when forced.
- **Killing the maintenance budget the quarter before a big launch.** Tech debt compounds whether you pay the interest or not. The "we'll skip maintenance this sprint" decision typically extends to four sprints and produces the incident that delays the launch anyway.
:::

## Page checkpoint

<Quiz id="startup-maintenance-page" title="Did maintenance and scaling stick?" sampleSize={2}>

<Question
  prompt="What weekly cadence does the page describe at this scale?"
  options={[
    { text: "Bug triage, sprint review/planning, performance review, and cost review" },
    { text: "Daily standups only, with no recurring weekly meetings" },
    { text: "A single all-hands meeting with no operational reviews" },
    { text: "Monthly retros and quarterly bug triage" }
  ]}
  correct={0}
  explanation="The weekly cadence is four recurring rituals: triaging new issues, sprint review/planning, reviewing slowest endpoints and queries, and reviewing infrastructure bills."
  revisit={{ to: "/docs/startup/maintenance#weekly-cadence", label: "Weekly cadence" }}
/>

<Question
  prompt="What scaling order does the page recommend when Postgres starts to struggle?"
  options={[
    { text: "Split into microservices first, then add a database" },
    { text: "Indexes, then connection pooling, then a Redis cache in front of hot endpoints — before any re-architecting" },
    { text: "Immediately migrate to a NoSQL database" },
    { text: "Add Kubernetes and scale the app tier first" }
  ]}
  correct={1}
  explanation="The highlight pushes the order: index the scanned columns, add a pooler for serverless connection exhaustion, cache hot endpoints with Redis. Most scaling pain dissolves once Postgres is properly tuned. Re-architecting is a last resort."
  revisit={{ to: "/docs/startup/maintenance#scaling-postgres", label: "Scaling order" }}
/>

<Question
  prompt="Why does the page describe connection pooling (PgBouncer, Supavisor) as critical in serverless environments?"
  options={[
    { text: "It encrypts the database connection" },
    { text: "Each function instance otherwise opens its own DB connection, exhausting the pool" },
    { text: "It's required by SOC 2" },
    { text: "It compresses query results to save bandwidth" }
  ]}
  correct={1}
  explanation="Without a pooler, every serverless function instance opens its own Postgres connection. A connection pool multiplexes many client connections onto a small number of real DB connections, preventing exhaustion."
  revisit={{ to: "/docs/startup/maintenance#scaling-postgres", label: "Connection pooling" }}
/>

<Question
  prompt="In the slow-query worked example, how did the team find the regression before users complained?"
  options={[
    { text: "Customer support escalated a ticket" },
    { text: "The weekly performance review surfaced p95 dashboard latency creeping from 200ms to 900ms" },
    { text: "Sentry sent a critical alert at 3am" },
    { text: "An external monitoring vendor flagged it" }
  ]}
  correct={1}
  explanation="The weekly perf-review cadence caught the regression. The team then used the slow-query log to identify a missing index on subscriptions.status — a 30-minute fix that restored p95 latency."
  revisit={{ to: "/docs/startup/maintenance#scaling-the-app", label: "Slow query review" }}
/>

</Quiz>

## What's next

→ Continue to [A Realistic Cost Breakdown](./cost-breakdown) where we see what a $1M ARR startup actually spends each month.
