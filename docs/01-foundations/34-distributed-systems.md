---
id: distributed-systems
title: 'Distributed systems primer: CAP, consistency, idempotency, sagas'
sidebar_position: 34
sidebar_label: Distributed systems
description: The conceptual primer — why distributed systems are different from a single machine, the CAP theorem in working-engineer terms, consistency models, leader election, distributed transactions, and the saga pattern that replaces them.
---

# Distributed systems primer: CAP, consistency, idempotency, sagas

> **In one line:** A distributed system is anything where two or more computers cooperate over an unreliable network — and that unreliability fundamentally changes what's possible, forcing tradeoffs (consistency vs availability), patterns (idempotency, leader election, sagas), and a new vocabulary every backend engineer needs.

:::tip[In plain English]
A single machine fails atomically — it works or it crashes. A distributed system fails *partially* — some parts work, others don't, and you can't tell which from the outside. That's the central twist. Once you accept "the network is unreliable, machines fail independently, time isn't synchronized," a bunch of formerly-simple things (read your own writes, atomic transactions, exactly-once messaging) become impossible-or-very-expensive.
:::

You don't have to design distributed systems from scratch to need this material. Anyone using two databases, a cache + DB, a queue + worker, microservices, or even one Node process behind a load balancer is operating a distributed system whose surprises will eventually find them.

## The eight fallacies of distributed computing

Coined at Sun in the 1990s; still right:

1. The network is reliable.
2. Latency is zero.
3. Bandwidth is infinite.
4. The network is secure.
5. Topology doesn't change.
6. There is one administrator.
7. Transport cost is zero.
8. The network is homogeneous.

Each one is intuitive on a single machine and false across a network. Every distributed-systems bug is, in some form, a designer who briefly forgot one.

## The CAP theorem (in working-engineer terms)

The classic, oft-misquoted result. Plain version: **in the presence of a network partition (P), a distributed system must choose between consistency (C) and availability (A)**. You can't have both during a partition.

A partition is "two parts of the system can't talk to each other." It can be a flaky link, a dead switch, a full DC outage.

| Choice | Meaning | When it makes sense |
|--------|---------|---------------------|
| **CP** (consistency + partition tolerance) | Refuse to serve when you can't talk to peers. Wait until partition heals. | Banking, anything where wrong > unavailable |
| **AP** (availability + partition tolerance) | Keep serving with potentially stale data; reconcile later | Social feeds, anything where unavailable > slightly-wrong |

"CA without P" is a marketing claim — no real distributed system can skip partition tolerance, because partitions happen.

The practical takeaway: you don't choose CAP — your **storage system** does. Postgres single-primary is CP. DynamoDB and Cassandra are tunably AP-leaning. Pick the storage whose tradeoff matches your problem.

## PACELC — the underdiscussed sequel

CAP focuses on partitions. **PACELC** extends it: *in case of a Partition, choose A or C; Else, choose Latency or Consistency.*

Most of the time, there's no partition. You're still trading **latency** for **consistency**:

- A read can return immediately from the local replica → fast, possibly stale.
- A read can require contacting other replicas / the leader to confirm → slow, definitely fresh.

DynamoDB's "consistent read" option, Redis' replica-read vs primary-read — these are the everyday PACELC knobs.

## Consistency models (the actual spectrum)

"Eventual consistency" gets thrown around as if it's one thing. There's a spectrum:

| Model | What clients see | Example |
|-------|------------------|---------|
| **Linearizable** | Operations appear to happen instantly in a global order; every read sees the latest write | etcd, Spanner, Postgres single-primary |
| **Sequential** | All clients see operations in the same order, but not necessarily the "real-time" order | Some replicated logs |
| **Causal** | If A causes B, all clients see A before B; unrelated ops may be reordered | Some CRDTs |
| **Read-your-writes** | A client sees its own writes immediately; other clients may not | Sessions stickied to a replica |
| **Monotonic reads** | A client never sees data go "backward" in time | Common in cached systems |
| **Eventual** | Eventually, all replicas converge; no per-read guarantees | DNS, S3 (historically), gossip systems |

The further down the table, the easier it is to provide at scale; the harder it is to reason about correctness. **Pick the weakest consistency model that satisfies your use case.** A social feed tolerates eventual; a balance check does not.

## The hardest bits

### Time isn't synchronized

Two machines' clocks drift. NTP keeps them within ~10ms, usually. But "usually" isn't "always," and many bugs come from assuming `timestamp_a < timestamp_b` implies "A happened before B."

For ordering in a distributed system:

- **Logical clocks** (Lamport timestamps): every operation gets a monotonic counter; you can establish a partial order.
- **Vector clocks**: extend Lamport to capture causality across nodes.
- **HLC** (Hybrid Logical Clock): combines physical time with logical counters; used by CockroachDB et al.
- **TrueTime** (Google Spanner): atomic clocks + GPS + bounded error; the only commercial system with a physical-clock-based global order.

For your app: prefer **DB-server-generated timestamps** over client-generated ones, never rely on "the timestamp is monotonic across all writers," and don't use "now() > x.created_at" for security-critical ordering without considering clock skew.

### Network partitions are real and routine

Once per few weeks somewhere in your cloud provider, two AZs briefly can't talk. Application engineers learn this when they assume "all my microservices can reach each other within 1ms."

Defenses:

- **Timeouts on every network call.** Default to fail-fast (a few seconds), not infinite wait.
- **Circuit breakers** — see [Concurrency](./concurrency).
- **Graceful degradation** — when service X is unreachable, can you serve a cached version, a degraded UI, a queue for later?
- **Don't tightly couple** — a request that needs five microservices in sequence has five chances to fail. Reduce hops, batch, cache.

### Distributed transactions: the thing you almost never want

Two-phase commit (2PC), three-phase commit, XA transactions — all attempts to make a transaction atomic across multiple databases. They work, *sometimes*, at the cost of:

- Bad failure modes (a coordinator crashing mid-protocol can leave participants holding locks forever).
- High latency (multiple round trips).
- Tight coupling.

Most modern systems **avoid distributed transactions entirely**. Instead:

### Sagas — the practical alternative

A **saga** is a sequence of local transactions, each producing an event that triggers the next. If any step fails, compensating transactions undo the previous ones.

Example: book a trip (flight + hotel + car).

```
1. Book flight     →  if fail: done, nothing to undo
2. Book hotel      →  if fail: refund flight (compensating tx)
3. Book car        →  if fail: refund flight + cancel hotel
```

Two flavors:

- **Choreography**: each service emits events; others react. Decentralized. Good for ~3-5 step sagas.
- **Orchestration**: a central coordinator (a saga engine — Temporal, AWS Step Functions) drives the steps. Better for long, complex sagas.

Sagas trade **strong consistency** for **eventual consistency with explicit compensation logic**. Each step is atomic locally; the saga as a whole is eventually consistent.

The catch: compensations aren't always perfect — "refund flight" might not exactly undo "book flight" if the airline ran out of inventory. You design for the imperfection, and you treat each compensation step as another saga step that itself might fail (and retry).

### Leader election

Some operations should happen on exactly one node at a time:
- Running a scheduled job (don't run the nightly invoice job from all 10 workers).
- Coordinating writes to a shared resource.
- Maintaining a consistent view.

You need **leader election**: a protocol where N nodes agree on which one of them is the leader, and re-elect if the leader dies.

Production options (in order of cost):
- **Postgres advisory locks** — `SELECT pg_try_advisory_lock(42)`. The first caller wins; others retry. Cheap, requires Postgres.
- **Redis with SET NX EX** + auto-renewal — first to claim the key is leader; key expires if leader dies. Has subtle correctness issues with clock drift; OK for non-critical use.
- **Redlock** — Redis-based, multi-instance, designed for distributed locking. Still has critics (Martin Kleppmann's writeup); fine for many uses, not for "split-brain would be catastrophic."
- **ZooKeeper / etcd** — purpose-built, used by Kafka, Kubernetes, lots of infrastructure. Strong correctness; operational cost.
- **Raft / Paxos** in your application — almost never. Use etcd or a library that embeds Raft (e.g., dqlite).

For "I just don't want two crons to run the nightly job," Postgres advisory locks are fine. For "the system must have exactly one writer," use a real consensus system.

### Idempotency and at-least-once delivery

Covered in [Concurrency & async](./concurrency#idempotency-the-property-that-lets-retries-be-safe) and [Rate limiting](./rate-limiting). The short version: **assume every message can be delivered more than once; make your consumers idempotent.**

This is the single most important pattern in distributed systems. Everything else (sagas, retries, queues) builds on it.

### Read replicas and replication lag

Most production setups have one writer (primary) and N readers (replicas). Writes go to primary; replicas catch up asynchronously, typically within milliseconds — but not always.

Failure mode: user submits a form (write goes to primary), is redirected to a "your changes have been saved" page (read goes to replica), sees their old data because the replica hasn't caught up.

Defenses:
- **Read-your-writes via session stickiness** to primary for the next N seconds after a write.
- **Read primary for the user's own data** post-write; replica for everyone else's data.
- **Use causal consistency tokens** if your DB supports it (Postgres' `pg_current_wal_lsn` + replica's `lsn`).
- **Embrace eventual consistency** in the UI — "saved; will appear within a few seconds."

### Split brain

When network partitions break communication, two parts of the cluster may each elect themselves leader and accept writes. When the partition heals, you have conflicting state.

Defenses:
- **Quorum** — require a majority of nodes (N/2 + 1) to acknowledge writes. A minority partition can't reach quorum and won't accept writes.
- **Fencing** — a leader gets a token; writes include the token; old leaders' tokens are rejected. Used in distributed locks (the linked Kleppmann article on Redlock is about this).
- **Single-writer constraint** — sometimes the right answer is "the DB is single-writer; if the primary is unreachable, we're down until we promote a replica."

Most managed databases (RDS, Cloud SQL, MongoDB Atlas) handle this; rolling your own is an expert-level project.

## The 2026 landscape

Some buzzwords you'll meet:

- **Spanner / CockroachDB / YugabyteDB** — globally-distributed SQL databases that aim for linearizable consistency. Pricier than single-region Postgres; cheaper than building it yourself.
- **DynamoDB / Cassandra / ScyllaDB** — AP-leaning key-value stores. Choose for very high throughput, locality, predictable latency.
- **Kafka / Pulsar / Redpanda** — distributed logs. The substrate for event-driven architecture. See [Message queues & event-driven](./message-queues).
- **Temporal / AWS Step Functions** — saga orchestrators. Reliable long-running workflows with retries, timeouts, compensations.
- **etcd / Consul / ZooKeeper** — coordination services. Service discovery, leader election, distributed locks.
- **Service meshes** (Istio, Linkerd) — handle retries, circuit breaking, mTLS between microservices as infrastructure rather than application code.

## When you can pretend it's not distributed

If your app is a single Postgres + a Node service in one region:

- Treat Postgres as your source of truth. Its transactions are real.
- Use `SELECT … FOR UPDATE` and serializable isolation where ordering matters.
- Don't add Redis-based locks; the DB has them.
- Run a single primary; let the cloud failover replicas during maintenance.

You're still a distributed system (the Node ↔ Postgres link can fail), but most of the hard problems are taken care of by Postgres. **Don't introduce microservices because it sounds cool.** The complexity tax is real.

The day you outgrow this — multiple DCs, multiple writers, billion-row tables — read the actual books (Kleppmann's *Designing Data-Intensive Applications*, the Spanner paper, *Database Internals*). This page is the orientation; the depth is in those.

:::info[Highlight: the network is the boundary]
Within a process, function calls succeed or throw. Across a network, they succeed, throw, *or never return*. That third option is the entire reason distributed systems are hard. Build defenses (timeouts, retries with idempotency, circuit breakers) into every network call as a habit, not as an afterthought.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **"Eventually consistent" treated as "consistent in a few ms." Sometimes it's seconds, or minutes during incidents. Design for the worst case, not the median.
- **No timeouts on network calls.** A hanging dependency = a hanging request thread, then 100 hanging request threads, then OOM. Every HTTP call gets a timeout (a few seconds default).
- **Trusting client-generated timestamps.** Clients lie, clocks drift, attackers spoof. Always use server-side timestamps for ordering you care about.
- **Two-phase commit across services.** Almost always wrong — a coordinator crash blocks participants. Use sagas instead.
- **Distributed locks for everything.** Each lock is a new failure mode, a new chance for split-brain. Prefer atomic DB operations or queues with single workers when possible.
- **'We can just sync them later.'** Conflict resolution is hard; design for it explicitly (CRDTs, last-write-wins with vector clocks, manual reconciliation) or avoid the conflict (single writer).
- **Read-your-writes broken via replicas.** User updates, is redirected, sees old data. Either stick to primary briefly, or design the UI to expect eventual visibility.
- **Microservices because it sounds cool.** A network of 8 services is a distributed system with 8× the failure modes of a monolith. Split only when you've measured a pain (deployment coupling, scaling skew, team coordination) that justifies it.
- **Logging that crosses service boundaries with no trace ID.** Debugging a request that touched 5 services without a trace ID is hours of grep. Always propagate `traceparent`.
- **No idempotency on consumers of at-least-once queues.** "Why are we sometimes sending two emails?" Because the queue redelivered after a timeout. Add a `processed_message_ids` table or deduplication key.
- **Treating the cache and DB as one consistent thing.** They're two systems with their own failure modes. A successful DB write + failed cache invalidation = stale cache. See [Caching](./caching) for invalidation patterns.
:::

## Page checkpoint

<Quiz id="foundations-distributed-systems-page" title="Did distributed systems stick?" sampleSize={2}>

<Question
  prompt="A common mis-statement of CAP is 'you can have any two of consistency, availability, partition tolerance.' What's the right phrasing?"
  options={[
    { text: "All three are always available" },
    { text: "In the presence of a network *partition*, a distributed system must choose between consistency and availability. There's no skipping partition tolerance — partitions happen — so the real choice is per-incident: CP (refuse to serve) or AP (keep serving, possibly stale)" },
    { text: "CAP applies only to NoSQL" },
    { text: "Two out of three is always achievable" }
  ]}
  correct={1}
  explanation="P isn't optional; it's a fact of nature. CAP says: during a partition, pick C or A. PACELC extends this with: in the *absence* of a partition, you're still trading latency for consistency."
  revisit={{ to: "/docs/foundations/distributed-systems#the-cap-theorem-in-working-engineer-terms", label: "CAP in plain terms" }}
/>

<Question
  prompt="Why is two-phase commit (2PC) across microservices generally a bad idea?"
  options={[
    { text: "It's too fast" },
    { text: "It tightly couples services, has high latency, and most importantly — a crash of the coordinator mid-protocol can leave participants holding locks indefinitely. Sagas (sequence of local transactions + compensating actions) are the practical alternative" },
    { text: "It's not supported by Postgres" },
    { text: "It requires special hardware" }
  ]}
  correct={1}
  explanation="2PC has well-known liveness issues — coordinator failure leaves participants stuck. Sagas accept eventual consistency in exchange for fault tolerance: each step is locally atomic, with explicit compensations on failure."
  revisit={{ to: "/docs/foundations/distributed-systems#sagas--the-practical-alternative", label: "Sagas as 2PC alternative" }}
/>

<Question
  prompt="A user submits a form (write hits the primary DB), is redirected to a 'saved!' page (read goes to a replica), and sees their old data. Root cause?"
  options={[
    { text: "Browser cache" },
    { text: "Replication lag — the replica hasn't caught up to the primary's write yet. Defenses: stick the user's session to the primary for a brief window after writes; or read the user's own data from the primary post-write; or design the UI to tolerate eventual visibility" },
    { text: "Cookie expired" },
    { text: "JS framework bug" }
  ]}
  correct={1}
  explanation="The classic read-your-writes failure on a replicated DB. The write is durable; the replica hasn't seen it yet. Choose: read-primary post-write, session stickiness, or UI that says 'saved, will appear shortly.'"
  revisit={{ to: "/docs/foundations/distributed-systems#read-replicas-and-replication-lag", label: "Read-your-writes" }}
/>

<Question
  prompt="A team adds 8 microservices to replace a monolith for 'scalability.' Their bug rate triples. Most likely cause?"
  options={[
    { text: "Microservices are inherently bad" },
    { text: "They've introduced a distributed system: 8× the failure modes, partial-failure scenarios, replication lag, latency hops, traceability problems — without yet feeling the monolith pain (deployment coupling, team-scaling) that justifies the complexity. Split when you have a measured pain, not preemptively" },
    { text: "The new language is bad" },
    { text: "Network speed is too slow" }
  ]}
  correct={1}
  explanation="Microservices are a solution to specific problems (team scaling, independent deployment, isolation under load). If you don't have those problems, you're paying their tax (more failure modes, more ops) without the benefit. Split when the pain is real."
  revisit={{ to: "/docs/foundations/distributed-systems#when-you-can-pretend-its-not-distributed", label: "Don't split prematurely" }}
/>

</Quiz>

## What's next

→ Continue to [Performance & Core Web Vitals](./performance).
