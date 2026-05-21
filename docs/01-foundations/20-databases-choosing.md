---
id: databases-choosing
title: Choosing a Database (2026 Decision Guide)
sidebar_position: 21
sidebar_label: 20. Choosing a DB
description: A pragmatic 2026 decision tree for picking your data stores. Spoiler — Postgres almost every time, with Redis added soon after.
---

# Choosing a Database

> **In one line:** Start with Postgres. Add Redis as soon as you need caching. Add anything else only when Postgres genuinely can't do the job. That's it.

:::tip In plain English
You're going to read a lot of opinions on Twitter, Reddit, and Hacker News about "the best" database. Most of them are wrong because they generalize from someone else's specific problem. The reality is: 95% of web apps in 2026 are well-served by Postgres, often with Redis added for caching. Save the complex specialized databases for when you actually have the problem they solve.
:::

## The 2026 default stack

```
Start here:
   1. Postgres (or hosted: Supabase, Neon, Railway)
                ↓
Add when you feel the pain:
   2. Redis  (caching, sessions, rate limiting, queues)
                ↓
Add only with a specific reason:
   3. Search engine (Postgres FTS not enough)
   4. Dedicated vector DB (>10M vectors)
   5. Document DB (genuinely schemaless data)
```

## A pragmatic decision tree

```
Are you starting a new project?
├── Yes → Use Postgres.
│         ├── Need a free tier? → Supabase, Neon, Railway.
│         └── Already on AWS/GCP? → RDS Postgres / Cloud SQL Postgres.
│
└── Joining an existing project?
    └── Use what the team uses. Pick your fights.
```

```
Do you have a SLOW QUERY problem in production?
├── Yes → Add Redis. Cache the slow query for 60s. Problem solved 90% of the time.
└── No  → Don't add Redis yet.
```

```
Do you need search beyond "WHERE title LIKE '%foo%'"?
├── Try Postgres full-text search (tsvector / tsquery) first.
│   It's usually enough.
├── If not enough (very large dataset, complex faceting, typo tolerance):
│   → Add Typesense (easy) or Meilisearch (also easy).
└── At very large scale + complex queries: Elasticsearch.
```

```
Do you have AI features with embeddings?
├── < 10M vectors → pgvector (Postgres extension). Done.
└── > 10M vectors and need strict latency → Pinecone or Turbopuffer.
```

## The cost of each addition

Every extra database costs you:

- **Operational complexity** — more backups, more monitoring, more failure modes.
- **Mental complexity** — your team has to know one more system.
- **Data consistency challenges** — if Redis says one thing and Postgres another, who's right?
- **Latency** — every cross-database call costs network round trips.

This is why the 2026 advice is *boring*: minimize the number of databases until forced to add more.

:::info Highlight: the "Choose Boring Technology" principle
Dan McKinley's famous essay says every team starts with a budget of ~3 "innovation tokens" for non-boring choices. Spend them carefully. **Choosing Postgres is spending zero tokens** — it's the boring choice. That's good. It means you have all 3 tokens left for the parts of your product that are genuinely novel.

If your innovation tokens are going into "I picked a cool new vector DB," ask yourself: is this the part of my product that's supposed to be novel?
:::

## Worked example: data stack for three real apps

**Solo developer's todo app:**

```
1 database: SQLite (single file, no server) or Postgres on Neon free tier.
That's it. Done.
```

**Mid-size startup SaaS, ~20 employees, 10K paying customers:**

```
- Postgres on RDS (main DB)
- Redis on Upstash (cache + sessions)
- pgvector extension (AI search, if any)
- ClickHouse or BigQuery (analytics, optional)
```

**Enterprise, hundreds of engineers, billions of records:**

```
- Postgres (per-service, dozens of clusters)
- DynamoDB (high-throughput key-value)
- Redis Enterprise (cache, sessions, rate limit)
- Elasticsearch (search & log aggregation)
- Pinecone or self-hosted vector DB (large embedding stores)
- Snowflake or BigQuery (analytics warehouse)
- Kafka (event bus)
```

The pattern: complexity grows with scale, not with ambition. Start small. Earn each addition.

## What's next

→ Continue to [Authentication: Proving Identity](./authentication) where we start the third pillar of every web app (after rendering and data): **who is talking to us, and what are they allowed to do?**
