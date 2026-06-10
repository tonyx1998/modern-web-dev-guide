---
id: cloud-managed-data
title: Managed Data Services
sidebar_position: 7
sidebar_label: Managed data
description: Managed relational databases (RDS/Aurora), managed NoSQL (DynamoDB), caches (ElastiCache), and managed queues/streams (SQS/Kinesis) — what the cloud runs for you and what you still own.
---

# Managed Data Services

> **In one line:** A managed data service is the same database/cache/queue you could install on a VM, except the cloud handles provisioning, patching, backups, replication, and failover — so you trade some control and a price premium for not being paged at 3am because Postgres ran out of disk.

:::tip[In plain English]
You *could* launch a VM, `apt install postgresql`, and run your own database. People did this for years, and it means *you* now own backups, security patches, replication, failover when the disk fills, and the upgrade that goes wrong at midnight. A **managed database** (AWS RDS, Google Cloud SQL, Azure Database) is that same Postgres/MySQL, but the provider does all of that operational work behind an API. You still own your schema, your queries, your indexes, and your access rules — but not the pager. For almost every team, the premium is worth it. This page covers the four managed-data shapes you'll meet: relational, NoSQL, cache, and queue/stream.
:::

## Why managed (the build-vs-buy of databases)

Running a production database well is a specialized job: tuning, monitoring, backup *and tested restore*, point-in-time recovery, replication, zero-downtime failover, security patching, version upgrades. A managed service turns all of that into checkboxes and an API. The honest tradeoff:

- **You gain:** automated backups + point-in-time restore, push-button multi-AZ failover, automated patching, read replicas, monitoring — and your weekends.
- **You give up:** some configuration depth (you can't touch the OS or every config flag), and you pay a premium over raw compute.

The decision maps directly onto [build vs buy](/docs/decisions/build-vs-buy): self-managing a database is justified only when you have a specific need the managed offering can't meet *and* the expertise to run it. For 95% of teams, managed is correct. This is also why platforms like Neon, PlanetScale, and Supabase exist — they're managed databases with even nicer DX, themselves running on the hyperscalers.

## 1. Managed relational (RDS / Aurora / Cloud SQL)

The default home for your primary transactional data — the Postgres/MySQL from [the SQL foundations chapter](/docs/foundations/databases-sql), operated for you.

- **RDS** runs standard Postgres/MySQL/MariaDB/SQL Server/Oracle. You pick an instance size and storage; AWS handles the rest.
- **Aurora** is AWS's cloud-native re-implementation of the Postgres/MySQL *wire protocol* with a distributed storage layer — better performance, faster failover, storage that auto-grows, and an Aurora *Serverless* mode that scales capacity with load. Compatible with your existing Postgres/MySQL drivers.

The two reliability features you must understand:

- **Multi-AZ deployment** = a synchronous standby replica in another AZ. If the primary's AZ fails, the service promotes the standby and repoints the DNS endpoint automatically — usually under a minute, no data loss. This is *availability*, not read scaling.
- **Read replicas** = asynchronous copies you can send read queries to, offloading the primary. They lag slightly (eventually consistent) — fine for analytics and read-heavy pages, *not* for "read your own write" right after a write.

```
            writes + consistent reads
   App ───────────────► PRIMARY (us-east-1a)
    │                      │ sync replication
    │                      ▼
    │                   STANDBY (us-east-1b)  ← promoted automatically on failover
    │
    └── heavy reads ──► READ REPLICA (async, may lag a few ms–s)
```

:::note[Worked example: "the data looks stale" after adding a read replica]
A team adds a read replica and routes all reads to it to take load off the primary. Suddenly users report: they update their profile, the page reloads, and it shows the *old* value. Cause: read replicas are *asynchronous* — the write hit the primary but hadn't propagated to the replica when the reload's read arrived. The fix is the standard pattern: route **reads that must reflect a just-made write** (read-after-write, same user session) to the *primary*, and send only load-tolerant reads (lists, search, analytics) to replicas. Replication lag is a feature's constraint, not a bug.
:::

## 2. Managed NoSQL (DynamoDB / Firestore / Cosmos DB)

DynamoDB is a fully-managed key-value/document store with a fundamentally different bargain than a relational DB: **single-digit-millisecond latency at any scale, but you must design around the access pattern up front.**

- **No joins, no ad-hoc queries.** You query by key. Need a different access pattern? You model a different *index* or duplicate the data. You design the table *for the queries*, not the other way around.
- **Partition key is destiny.** Data is sharded by a partition key's hash. A bad key (everyone writes to the same partition — a "hot partition") throttles you no matter how much capacity you buy.
- **Billing:** on-demand (per request, scales to zero-ish) or provisioned (cheaper at steady high volume). It's genuinely pay-per-use and scales to massive throughput without you thinking about servers.

When to reach for it: huge scale with *known, simple* access patterns (session stores, shopping carts, IoT/event ingestion, leaderboards), or when you want a serverless data store with no connection-pool problem. When **not** to: anything needing flexible queries, joins, or reporting — that's still relational's job. (See [SQL vs NoSQL](/docs/foundations/databases-choosing).)

```javascript
// DynamoDB is queried by key — note there's no "WHERE status = 'active'" without
// having designed an index for it first.
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const { Item } = await ddb.send(new GetCommand({
  TableName: "Sessions",
  Key: { sessionId: "abc-123" },   // ← the partition key; queries pivot on this
}));
```

## 3. Managed cache (ElastiCache / Memorystore)

A managed **Redis/Valkey or Memcached** — an in-memory store for things you need *fast* and can afford to lose: cached query results, session data, rate-limiter counters, leaderboards, pub/sub. This is the cloud version of [the caching foundations](/docs/foundations/caching). The managed part handles clustering, failover, and patching. Key discipline: a cache is *not* your source of truth — design so a cold/flushed cache degrades to slower-but-correct, never to wrong-or-down.

## 4. Managed queues & streams (SQS / Kinesis / Pub/Sub)

The cloud-native versions of [message queues](/docs/foundations/message-queues) — decouple producers from consumers so a traffic spike or a slow worker doesn't take down the request path.

| | **Queue (SQS / Pub/Sub)** | **Stream (Kinesis / Kafka / Pub/Sub)** |
|---|---|---|
| Model | Each message consumed once, then deleted | Append-only log; many consumers, replayable |
| Ordering | FIFO option; standard is best-effort | Ordered within a partition |
| Use for | Task queues, background jobs, buffering work | Event sourcing, analytics pipelines, fan-out, replay |
| Mental model | A to-do list workers drain | A tape every reader can rewind |

The rule of thumb: **queue** when each message is a *task* to be done once (resize this image, send this email); **stream** when the data is an *event log* multiple systems consume independently and you might need to replay history. Streams are covered far more deeply in [Chapter 7](/docs/distributed-systems/event-streaming).

:::info[Highlight: managed services move the line of the shared-responsibility model]
On a self-hosted DB on a VM, you own everything above the hypervisor — OS, patching, backups, failover. On RDS, the provider takes the OS, engine patching, backup *mechanism*, and failover *mechanism* — but you still own the schema, the queries, the indexes, *configuring* backups/retention, and access control. "Managed" is not "I don't have to think about the database." It's "I don't have to think about the *operating-system-and-process* parts of the database." You still very much own using it well.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Sending read-after-write traffic to an async read replica.** Users see stale data right after they save. Route consistency-sensitive reads to the primary; replicas are for load-tolerant reads.
- **Self-managing a database on a VM without the expertise.** You've signed up for backups, failover, and patching as a second job. Use a managed service unless you have a concrete reason and the skills.
- **Choosing DynamoDB for a relational workload.** No joins, no ad-hoc queries; if you find yourself fighting it to do reporting, you wanted Postgres. Model NoSQL around known access patterns only.
- **Hot partition keys in DynamoDB.** A key that funnels writes to one partition throttles regardless of provisioned capacity. Choose high-cardinality, evenly-distributed partition keys.
- **Treating the cache as a source of truth.** When (not if) it's flushed or fails, the system must degrade to slower-but-correct, not wrong-or-down.
- **Assuming 'managed' means 'set and forget.'** You still own schema design, indexing, query performance, backup retention, and verifying that restores actually work. Test a restore before you need one.
:::

## Page checkpoint

<Quiz id="cloud-managed-data-page" title="Did managed data stick?" sampleSize={3}>

<Question
  prompt="A team routes all reads to a new async read replica and users start seeing stale data right after saving changes. What's the correct fix?"
  options={[
    { text: "Switch the replica to synchronous replication for all reads" },
    { text: "Route reads that must reflect a just-made write to the primary; send only load-tolerant reads (lists, search, analytics) to replicas" },
    { text: "Add more read replicas" },
    { text: "Disable caching on the app" }
  ]}
  correct={1}
  explanation="Read replicas are asynchronous and lag the primary, so a read right after a write may miss it. The standard pattern is to send read-after-write / consistency-sensitive reads to the primary and offload only lag-tolerant reads to replicas."
  revisit={{ to: "/docs/cloud/cloud-managed-data#1-managed-relational-rds--aurora--cloud-sql", label: "Replica lag" }}
/>

<Question
  prompt="When is DynamoDB (managed NoSQL) the right choice over a managed relational database?"
  options={[
    { text: "Whenever you want to avoid writing SQL" },
    { text: "For huge scale with known, simple key-based access patterns (sessions, carts, event ingestion) — not for flexible queries, joins, or reporting" },
    { text: "For any workload that needs ACID transactions" },
    { text: "Only for read-heavy analytics dashboards" }
  ]}
  correct={1}
  explanation="DynamoDB delivers single-digit-ms latency at massive scale but you must design the table around the access pattern (no joins, no ad-hoc queries). It fits known simple patterns; relational is still the answer for flexible querying, joins, and reporting."
  revisit={{ to: "/docs/cloud/cloud-managed-data#2-managed-nosql-dynamodb--firestore--cosmos-db", label: "When to use DynamoDB" }}
/>

<Question
  prompt="What does 'managed' actually take off your plate with a service like RDS — and what does it NOT?"
  options={[
    { text: "It handles everything including schema and query design" },
    { text: "It handles OS/engine patching, backup and failover mechanisms; you still own schema, queries, indexes, backup retention config, and access control" },
    { text: "It only handles billing; you still patch the OS" },
    { text: "It makes the database immune to slow queries" }
  ]}
  correct={1}
  explanation="Managed services move the shared-responsibility line: the provider runs the OS-and-process operations (patching, the backup/failover machinery), but you still own using the database well — schema, indexing, query performance, retention settings, and verifying restores."
  revisit={{ to: "/docs/cloud/cloud-managed-data#why-managed-the-build-vs-buy-of-databases", label: "What managed covers" }}
/>

</Quiz>

## What's next

→ Continue to [Infrastructure as Code](./cloud-iac) — how you describe every resource in this chapter as version-controlled files instead of clicking, so it's reproducible and reviewable.
