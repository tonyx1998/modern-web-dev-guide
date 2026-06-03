---
id: distributed-systems
title: 7. Distributed Systems — Overview
sidebar_position: 1
sidebar_label: Distributed systems intro
description: The deep theory of systems that span many machines — the fallacies, consistency and CAP, replication, partitioning, time and ordering, consensus, distributed transactions, and idempotency.
---

# Part 7: Distributed Systems

*Why everything gets harder the moment your system spans more than one machine — and the concepts that let you reason about it instead of being surprised by it.*

> **In one line:** A distributed system is any system where components on separate machines coordinate over a network — which sounds routine and is in fact a different universe, because the network can drop, delay, duplicate, and reorder messages, machines fail independently, and there is no shared clock or shared memory; this chapter is the conceptual toolkit (consistency, replication, partitioning, ordering, consensus, idempotency) for reasoning about that universe.

:::tip[In plain English]
On one computer, things are blissfully simple: function calls always arrive, memory is shared and instantaneous, and there's one clock everyone agrees on. The moment your system is *two* computers talking over a network — which is essentially every real web app once you have a separate database, a cache, a queue, and a third-party API — all of those guarantees evaporate. Messages get lost, delayed, or delivered twice. One machine thinks another is dead when it's just slow. Two machines disagree about what time it is and about what the "current" value of some data is. None of this is exotic edge-case territory; it's the *normal* condition of distributed systems, and most production incidents have a distributed-systems concept hiding underneath them. The earlier [cloud](/docs/cloud) and [operations](/docs/operations) chapters showed you how to *build and run* these systems; this chapter explains *why they behave the way they do*, so the surprises become things you designed for.
:::

:::note[New to web dev? How to read this chapter]
**Level: advanced — this is the most theory-heavy chapter in the guide.** You do *not* need any of it to build, ship, or run a normal web app, and if you're reading top-to-bottom and haven't shipped anything yet, skip ahead to the [Solo / Personal chapter](/docs/solo) and come back to this much later.

When you do read it, you can still get the *intuition* on a first pass without the formal machinery: read each page's **"In plain English"** box and the **highlight** callouts — they explain *why* the scary production bugs happen (double charges, stale reads, split brain) in plain terms. Treat the formal parts (CAP, consensus, vector clocks) as reference you'll grow into, not a wall you must climb today. It builds on the Foundations networking/database pages and the [Cloud](/docs/cloud) and [Operations](/docs/operations) chapters.
:::

## Why this is hard (and worth a chapter)

There's a foundational intro to distributed systems back in [Chapter 1](/docs/foundations/distributed-systems) — the realities you can't ignore once you pass one machine. This chapter goes deep: it's the theory that turns "the cache and the database disagree and a user saw stale data" from a baffling bug into a named, understood, *designed-for* property of your system.

The reason it deserves serious study: **distributed-systems problems are invisible until they aren't, and then they're brutal.** Your code works perfectly in development (one machine, no real network) and in the demo. Then in production, under load, with real network partitions and concurrent writes and clock skew, you hit the failure modes — double charges, lost updates, split brain, data that's stale in ways you didn't think possible. Engineers who don't know this material treat each one as a unique mystery; engineers who do recognize them instantly ("that's a read-after-write consistency problem," "that's a missing idempotency key," "that's a partition tolerance tradeoff") and reach for the standard solution.

:::info[Highlight: you are already running a distributed system]
You might think "distributed systems" means Google-scale infrastructure with thousands of nodes. But the moment your web app talks to a *separate* database, you have two machines coordinating over a network — a distributed system. Add a cache (now three), a queue, a payment provider, a CDN, read replicas — a totally ordinary web app is a distributed system with half a dozen independently-failing components. The consistency and ordering and idempotency problems in this chapter aren't waiting for you at hyperscale; they're in the app you're building right now. That's why this is core knowledge, not advanced trivia.
:::

:::info[Jargon for this chapter]
- **Node** — one machine/process participating in the system.
- **Partition (network)** — a network failure that splits nodes into groups that can't talk to each other. (Distinct from a *data* partition / shard — same word, watch context.)
- **Consistency** — informally, whether everyone sees the same data; formally, a spectrum of guarantees (strong → eventual).
- **Availability** — whether the system responds to requests even when components have failed.
- **Replication** — keeping copies of data on multiple nodes for durability and read scaling.
- **Partitioning / sharding** — splitting data across nodes so no single node holds (or serves) it all.
- **Consensus** — getting multiple nodes to agree on a single value despite failures (e.g. who's the leader).
- **Quorum** — a minimum number of nodes that must acknowledge an operation for it to count.
- **Idempotency** — an operation safe to apply multiple times with the same effect as once.
- **Eventual consistency** — replicas converge to the same value *given enough time without new writes*; in the meantime they may disagree.
:::

## How this chapter is organized

### The ground truth
1. [The fallacies & why it's hard](./ds-fallacies) — the eight false assumptions that sink naive distributed code.
2. [Consistency & CAP](./ds-consistency) — the consistency spectrum, CAP, and PACELC; the central tradeoff.

### Spreading data across machines
3. [Replication](./ds-replication) — leader/follower, multi-leader, quorums, and the consistency knobs.
4. [Partitioning & sharding](./partitioning) — splitting data, partition strategies, hot spots, and rebalancing.

### Agreeing on reality
5. [Time & ordering](./ds-time) — why clocks lie, and logical/vector clocks that don't need them.
6. [Consensus](./ds-consensus) — Raft and Paxos, leader election, and what consensus is actually for.

### Getting work done correctly
7. [Distributed transactions & sagas](./ds-transactions) — why 2PC is avoided, and the saga/outbox patterns that replace it.
8. [Idempotency & exactly-once](./idempotency) — the "exactly-once delivery" illusion and how to actually get correct effects.

### Moving data between systems
9. [Messaging patterns](./messaging-patterns) — delivery semantics, deduplication, and ordering.
10. [Event streaming](./event-streaming) — the log as a primitive; Kafka and its model in depth.

---

When you finish, take the [checkpoint](./distributed-systems-checkpoint), then continue to [Chapter 8: AI Integration](/docs/ai).
