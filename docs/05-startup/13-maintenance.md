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

## What's next

→ Continue to [A Realistic Cost Breakdown](./cost-breakdown) where we see what a $1M ARR startup actually spends each month.
