---
id: databases-nosql
title: NoSQL & Specialized Databases
sidebar_position: 20
sidebar_label: 19. NoSQL & Specialized
description: Document, key-value, search, and vector databases. When and why to reach beyond Postgres.
---

# NoSQL & Specialized Databases

> **In one line:** Not every storage problem fits in tables. Document, key-value, search, and vector databases are specialized tools for specific shapes of data — but in 2026, you should only reach for them when Postgres genuinely can't.

:::tip In plain English
"NoSQL" is an umbrella term for "any database that isn't relational." It splits into a few families:

- **Document databases** (MongoDB) store flexible JSON-shaped records.
- **Key-value stores** (Redis) are giant hash maps.
- **Search engines** (Elasticsearch) are optimized for full-text matching and ranking.
- **Vector databases** (Pinecone, pgvector) store AI embeddings for semantic search.

Each was invented to solve a problem relational databases historically struggled with. In 2026, Postgres has caught up to most of them — but the dedicated alternatives are still right in specific cases.
:::

## Document (NoSQL) databases

Data lives as **documents** (JSON-like objects). No fixed schema.

```json
{
  "_id": "abc123",
  "name": "Tony",
  "addresses": [
    { "street": "123 Main", "city": "LA" }
  ],
  "preferences": { "theme": "dark" }
}
```

**Pros:**
- Flexible schema (great for evolving data).
- Nested structures (no joins needed for related data).
- Horizontal scaling is straightforward.

**Cons:**
- Weaker consistency by default.
- Joins are hard or impossible.
- Easy to model data poorly.

**Common choices:**
- **MongoDB** — the classic example. Open-source, hosted via MongoDB Atlas.
- **DynamoDB** (AWS) — fully managed, used heavily at AWS scale.
- **Firestore** (Google) — popular for mobile apps with offline sync.

:::info Highlight: 2026 status — document DBs are niche
By 2026, the industry has largely concluded that **Postgres with a JSONB column** beats most document database use cases. You get document flexibility *and* relational rigor in one database. Real document database adoption is now niche — usually big AWS shops that standardized on DynamoDB years ago.
:::

## Key-value stores

The simplest possible model: a hash table that persists.

```
SET user:42:session "eyJhbGc..."
GET user:42:session
EXPIRE user:42:session 3600    # delete after 1 hour
INCR view_count:post:42        # atomic counter
```

**Used for:**
- Caching (the #1 use case — store query results to avoid hitting the DB).
- Session storage.
- Rate limiting (count requests per IP per minute).
- Queues (push to a list, pop on a worker).
- Leaderboards (sorted sets).

**Common choices:**
- **Redis** — the dominant choice. Fast, mature, ubiquitous.
- **Valkey** — the open-source fork of Redis (after Redis's license change in 2024).
- **Upstash** — serverless Redis with HTTP API.
- **Cloudflare KV** — globally distributed key-value at the edge.

:::note Worked example: caching a slow query
Without Redis:

```javascript
// Every request hits the database. Slow page, hot DB.
const dashboardData = await db.queryComplexDashboard(userId); // 800ms
```

With Redis:

```javascript
const cacheKey = `dashboard:${userId}`;

// Fast path: serve from cache
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached); // ~2ms

// Slow path: compute and cache for 60s
const data = await db.queryComplexDashboard(userId); // 800ms
await redis.set(cacheKey, JSON.stringify(data), 'EX', 60);
return data;
```

> **In English:** Look up `dashboard:<userId>` in Redis first. If it's there (a **cache hit**), return it immediately. If not (a **cache miss**), run the slow DB query, store the result in Redis with a 60-second expiry (`'EX', 60`), and return it. This is the classic **read-through cache** pattern.

The first user pays 800ms; the next 1,000 users in the next minute each pay 2ms. This single pattern can drop your DB load by 99%.
:::

## Search engines

Optimized for full-text search, faceting, and ranking.

| Engine                  | Notes                                                          |
|-------------------------|----------------------------------------------------------------|
| **Elasticsearch**       | Powerful, complex to operate. The classic enterprise choice.   |
| **Typesense**           | Modern, easier alternative. Great DX.                          |
| **Meilisearch**         | Similar to Typesense, very fast.                                |
| **Algolia**             | Hosted, very fast, expensive at scale.                          |
| **Postgres full-text**  | Often enough; one less service to operate.                      |

Search engines do things SQL `LIKE` can't: tokenization, stemming ("running" matches "run"), synonyms, fuzzy matching, typo tolerance, relevance ranking, facets.

## Vector databases (the AI layer)

Store **embeddings** — high-dimensional vectors that represent the meaning of text/images/audio. Used for **semantic search** and **RAG (Retrieval-Augmented Generation)** in AI apps.

```
"How do I cancel my subscription?" → [0.23, -0.91, 0.45, ..., 0.12]  (1536 numbers)

To find similar questions, compute cosine similarity against stored vectors.
```

**Common choices:**
- **pgvector** — Postgres extension; the most popular 2026 choice (one DB to rule them).
- **Pinecone** — Managed, easy to start with.
- **Qdrant** — Open-source, fast.
- **Weaviate** — Open-source, feature-rich.
- **Turbopuffer** — Newer, cost-optimized.

:::info Highlight: pgvector ate the vector database market
Three years ago, you'd reach for a dedicated vector DB the moment you had AI features. In 2026, **pgvector** (the Postgres extension) handles vector search well enough that most teams skip the dedicated DB entirely. Pinecone and friends still win at *very large scale* (>10M vectors with strict latency SLOs), but most production AI apps run on Postgres + pgvector.
:::

## Time-series databases

Specialized for timestamped data (metrics, sensor readings, logs).

| Database              | Notes                                                            |
|----------------------|------------------------------------------------------------------|
| **TimescaleDB**       | A Postgres extension. The "one DB to rule them" choice.          |
| **InfluxDB**          | Purpose-built, classic in DevOps.                                 |
| **ClickHouse**        | Column-oriented; very fast aggregations over huge datasets.      |
| **Prometheus**        | The standard for application metrics (not a general-purpose DB). |

## A pragmatic summary

| Specialized DB type | When to add it                                          | What to add it to (start with this) |
|---------------------|---------------------------------------------------------|-------------------------------------|
| Key-value (Redis)   | First — caching saves the most. Almost every app.       | Postgres                            |
| Search engine       | When Postgres full-text isn't enough (faceting, large scale, typo tolerance) | Postgres        |
| Vector DB           | When you have AI features and >10M vectors              | Postgres + pgvector                 |
| Document DB         | Rare in 2026 — only if you genuinely have schemaless data | Postgres + JSONB                  |
| Time-series         | When you're recording millions of metrics/second        | Postgres + TimescaleDB              |

## What's next

→ Continue to [Choosing a Database](./databases-choosing) where we'll consolidate this into a 2026 decision tree.
