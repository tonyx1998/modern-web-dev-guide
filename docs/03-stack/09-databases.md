---
id: databases
title: Databases (Tools)
sidebar_position: 10
sidebar_label: 9. Databases
description: The store of truth for your application. Postgres dominates; SQLite is increasingly production-viable; Redis is for caching and queues; specialized DBs only when justified.
---

# Databases (Tools)

> **In one line:** Postgres for the data. Redis for the cache. SQLite at the edge. Specialized databases (search, vector, graph) only when Postgres can't.

:::tip In plain English
The database is where your app's data actually lives. The 2026 default is **PostgreSQL** — open-source, mature, has extensions for almost every specialized need (vectors, time-series, geospatial, full-text search). Add **Redis** when you need fast caching. Reach for anything else only when you have a *specific* problem Postgres can't solve.
:::

## PostgreSQL — the default

In 2026, PostgreSQL is the default relational database for almost every new project.

**Why:**

- Open-source, no licensing concerns.
- Feature-rich (JSON, full-text search, GIS, time-series, vectors).
- Excellent extension ecosystem.
- Mature managed offerings.
- Strong ACID guarantees.

**Notable extensions:**

- **pgvector** — Vector similarity search (for AI/RAG).
- **PostGIS** — Geographic data.
- **TimescaleDB** — Time-series optimization.
- **pg_search** — Full-text search.
- **pg-boss** — Background jobs.

## Managed Postgres providers

| Provider           | Notes                                                       |
|--------------------|-------------------------------------------------------------|
| **Supabase**        | Postgres + Auth + Storage + Realtime + Edge Functions. All-in-one backend. |
| **Neon**            | Serverless Postgres with branching (each PR can have its own DB branch). |
| **Railway**         | Simple managed DB alongside app hosting.                   |
| **PlanetScale (Postgres)** | Branching, schema changes without locks.            |
| **AWS RDS**         | Mature, full control, more operational burden.             |
| **Google Cloud SQL / Azure Database** | Same idea for other clouds.                |

## SQLite

A single-file database. Used to be considered "embedded only," but in 2026 it's production-viable via:

- **Cloudflare D1** — SQLite at the edge.
- **Turso** — Distributed SQLite with replication.
- **Litestream** — Streaming backup for SQLite to S3.

**When SQLite makes sense:** Edge-first apps, single-region apps with moderate write volume, apps that benefit from running queries with zero network latency.

## MySQL

Still common in legacy systems. PlanetScale popularized serverless MySQL (now deprecated in favor of Postgres).

For new projects, Postgres is almost always preferred.

## MongoDB

Document database. Popular in 2015–2020.

**Where it still fits:** Apps with genuinely schemaless data, content management systems, certain analytics workloads.

**Where Postgres beats it:** Almost everything else. Postgres's JSON columns + relational data are usually better.

## DynamoDB (AWS)

Serverless NoSQL store. Scales infinitely, predictable performance.

**When to use:** AWS-native apps with simple access patterns; massive scale where Postgres limits are real.
**Trade-off:** Hard to query in flexible ways; "you must know your access patterns up front."

## Redis / Valkey

In-memory key-value store. Used for:

- Caching
- Session storage
- Rate limiting
- Job queues (with BullMQ)
- Leaderboards (sorted sets)
- Pub/sub messaging

**Managed:** Upstash (serverless), Redis Cloud, AWS ElastiCache.

**Valkey** is the open-source fork after Redis's license change. Many cloud providers are migrating to it.

## Search engines

| Engine          | Notes                                                          |
|-----------------|----------------------------------------------------------------|
| **Typesense**    | Modern, fast, easy to operate. Popular for new projects.       |
| **Meilisearch**  | Similar to Typesense; great DX.                                |
| **Algolia**      | Hosted, very fast, expensive at scale.                          |
| **Elasticsearch**| Powerful, complex, dominant historically.                       |

**Often, Postgres full-text search is enough** — one less service to operate.

## Vector databases

For storing embeddings (high-dimensional vectors that represent meaning).

- **pgvector** — Postgres extension; the popular 2026 choice.
- **Pinecone** — Managed, easy to start.
- **Qdrant** — Open-source, fast.
- **Weaviate** — Open-source, feature-rich.
- **Turbopuffer** — Newer, cost-optimized.

**Recommendation:** Use pgvector unless you have specific needs that justify a separate service.

## Analytics databases

For OLAP (analytical queries on large datasets):

- **ClickHouse** — Columnar, blazing fast.
- **DuckDB** — In-process analytics; great for local data work.
- **Snowflake / BigQuery** — Cloud data warehouses.

## Graph databases

For data with complex relationships (social networks, recommendations):

- **Neo4j** — Most popular, Cypher query language.
- **Amazon Neptune** — AWS managed.

Often Postgres + recursive CTEs is enough for "I just need some graph queries" use cases.

:::info Highlight: the 2026 default data stack
For 95% of new projects, this is the right starting point:

```mermaid
flowchart LR
    PG[("Postgres<br/>Supabase or Neon")]
    R[("Redis<br/>when you need caching")]
    V["pgvector extension<br/>if you have AI features"]
    PG --- R
    PG --- V
    style PG fill:#2a5
```

That's it. One DB to back up. One mental model. One ops burden. Add specialized databases only when Postgres genuinely can't handle the job — which, in 2026, is rare.
:::

## What's next

→ Continue to [ORMs & Database Tools](./orms) — the layer that translates between your code and SQL.
