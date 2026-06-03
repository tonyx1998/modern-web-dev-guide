---
id: ds-replication
title: Replication
sidebar_position: 4
sidebar_label: Replication
description: Single-leader, multi-leader, and leaderless replication; synchronous vs asynchronous; replication lag; and quorum reads/writes (W + R > N).
---

# Replication

> **In one line:** Replication keeps copies of your data on multiple nodes — for durability, read scaling, and locality — and the design choices (who accepts writes, whether copies update synchronously, how many must agree) are exactly the knobs that place you on the consistency spectrum from the previous page.

:::tip[In plain English]
Replication means keeping the same data on several machines. You do it for three reasons: if one machine dies, the others still have the data (durability/availability); reads can be spread across the copies (scale); and copies can sit near users worldwide (low latency). The hard part is keeping the copies in sync when writes come in. Three big questions decide everything: **Who is allowed to accept writes?** (one designated leader, several leaders, or any node?) **Does a write wait for the copies to confirm before it's "done"?** (synchronous = safe but slow; asynchronous = fast but the copies lag.) And **how many copies must agree** for a read or write to count? Your answers land you somewhere between "always consistent, slower" and "fast, sometimes stale" — the same tradeoff as CAP/PACELC, now as concrete configuration.
:::

## The three topologies

**1. Single-leader (primary/replica) — the default, and what your managed database does.** One node is the *leader*; all writes go to it. The leader streams changes to *follower* replicas, which serve reads. This is [RDS/Aurora's multi-AZ + read replicas](/docs/cloud/cloud-managed-data) and what most apps run.

```
        writes ──► LEADER ──┬─ replicates ─► follower (read)
                            ├─ replicates ─► follower (read)
        reads  ◄────────────┴───────────────  (reads can hit leader OR followers)
```
- ✅ Simple; no write conflicts (one writer); strong consistency available if you read from the leader.
- ⚠️ The leader is a write bottleneck and a failure point — if it dies, you need **failover** (promote a follower), which is where things get tricky (below).

**2. Multi-leader.** Several nodes accept writes (e.g. one leader per region, for low-latency local writes). Leaders replicate to each other. Powerful for multi-region write performance, but introduces **write conflicts**: two regions edit the same record simultaneously, and now you must *resolve* the conflict (last-write-wins, merge rules, or CRDTs — see [collaborative editing](/docs/foundations/crdts)). Conflict resolution is the price of multiple writers.

**3. Leaderless (Dynamo-style, e.g. Cassandra, DynamoDB).** No designated leader; clients write to *several* nodes directly and read from several, using **quorums** (below) to stay consistent enough. Highly available and partition-tolerant (AP-leaning), at the cost of more complex client-side logic and tunable-but-not-free consistency.

## Synchronous vs asynchronous: the durability/latency knob

When a write hits the leader, does it wait for replicas before telling the client "done"?

- **Synchronous:** the write isn't acknowledged until (some) replicas confirm they have it. **No data loss** if the leader then dies — but every write pays the replication round-trip, and if a sync replica is slow/down, writes stall.
- **Asynchronous:** the leader acks immediately and replicates in the background. **Fast**, but if the leader dies before a write propagates, that write is **lost** — and reads from a follower can be stale (replication lag).

Most systems use a pragmatic middle: **semi-synchronous** — synchronous to *one* replica (so there's always a durable second copy), asynchronous to the rest.

:::info[Highlight: replication lag is where read-replica bugs live]
Asynchronous followers are always slightly behind the leader — **replication lag**, usually milliseconds, but seconds-to-minutes under load or big writes. This single fact causes a whole family of confusing bugs, all of which trace back to a read hitting a follower that hasn't caught up:
- **Read-your-writes violation:** a user updates their profile (write → leader), the page reloads (read → lagging follower), and they see the *old* value. Fix: route a user's reads-after-write to the leader, or to a replica known to be caught up.
- **Monotonic-reads violation:** two reads hit two followers at different lag; the user sees data *go backwards* in time. Fix: pin a user's session to one replica.

These aren't database bugs — they're the *designed* behavior of asynchronous replication. Knowing the cause turns "the data is randomly stale sometimes" into "we're reading from a lagging replica; here's the routing fix." This is the deep version of the [managed-data replica-lag warning](/docs/cloud/cloud-managed-data).
:::

## Quorums: agreeing without a leader

In leaderless (and tunable) systems, consistency is set by three numbers:
- **N** — how many replicas hold each piece of data.
- **W** — how many must acknowledge a *write* for it to succeed.
- **R** — how many must respond to a *read*.

The key inequality: **if W + R > N, every read overlaps with the latest write on at least one node**, so a read is guaranteed to see the newest value (strong-ish consistency). You *tune* these:

```
N = 3 (three copies)
  W=3, R=1  → writes slow/fragile (need all 3), reads fast.  W+R=4 > 3 ✓ consistent reads
  W=1, R=1  → both fast, but W+R=2 < 3 → reads may be STALE (eventual)
  W=2, R=2  → balanced; W+R=4 > 3 ✓  the common quorum choice
```

This is the consistency spectrum made into arithmetic: crank W+R above N for consistency, drop it below for availability and speed. The same data store can offer different guarantees per query by varying R.

:::note[Worked example: failover and the "split brain" nightmare]
A single-leader system's leader appears to die, so the system promotes a follower to be the new leader. But the old leader wasn't actually dead — it was just unreachable (a network partition; remember "[you can't tell slow from dead](./ds-fallacies)"). Now there are **two leaders**, both accepting writes: **split brain.** They diverge, and when the partition heals you have two conflicting versions of reality and no clean way to merge them — potentially lost or corrupted data. Preventing this is exactly why [consensus](./ds-consensus) algorithms exist: they ensure *at most one* leader is elected even amid partitions and disagreement, typically by requiring a *majority* quorum to elect a leader (a minority partition can't elect one, so it can't become a second leader). Split brain is the canonical demonstration that "just promote a replica" is harder than it sounds — leader election is a consensus problem.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Reading from async replicas for consistency-sensitive data.** Replication lag means stale reads; route read-after-write and other consistency-sensitive reads to the leader.
- **Assuming async replication is lossless.** A leader that dies before propagating a write loses it. Use synchronous/semi-sync replication for data you cannot lose.
- **Adopting multi-leader without a conflict-resolution plan.** Multiple writers means concurrent edits to the same record *will* conflict; decide last-write-wins / merge / CRDT up front.
- **Naive failover causing split brain.** Promoting a replica when the old leader is only unreachable creates two leaders and divergence. Use majority-quorum leader election (consensus), not a simple health check.
- **Misconfiguring quorums (W+R ≤ N) while expecting consistency.** If the read and write sets don't overlap, reads can miss the latest write. Set W+R > N when you need consistent reads.
- **Pointing all reads at the leader and wondering why it's a bottleneck.** Offload lag-tolerant reads to followers; reserve the leader for writes and consistency-critical reads.
:::

## Page checkpoint

<Quiz id="ds-replication-page" title="Did replication stick?" sampleSize={2}>

<Question
  prompt="A user updates their profile and immediately reloads, but sees the old value. The system uses single-leader replication with async followers. What's happening?"
  options={[
    { text: "The database is corrupted" },
    { text: "Replication lag — the write went to the leader but the reload's read hit a follower that hadn't caught up yet (a read-your-writes violation); route the user's post-write reads to the leader" },
    { text: "The write failed silently" },
    { text: "The cache returned a deleted entry" }
  ]}
  correct={1}
  explanation="Async followers lag the leader. A write to the leader followed by a read from a not-yet-updated follower returns stale data — the read-your-writes violation. It's designed behavior of async replication, fixed by routing read-after-write to the leader (or a caught-up replica)."
  revisit={{ to: "/docs/distributed-systems/ds-replication#synchronous-vs-asynchronous-the-durabilitylatency-knob", label: "Replication lag" }}
/>

<Question
  prompt="In a leaderless system with N=3 replicas, which quorum setting guarantees a read sees the latest write?"
  options={[
    { text: "W=1, R=1 (both fast)" },
    { text: "W=2, R=2 — because W + R = 4 > N = 3, so the read and write sets always overlap on at least one node holding the newest value" },
    { text: "W=1, R=2 (W+R=3)" },
    { text: "Any setting works; quorums don't affect consistency" }
  ]}
  correct={1}
  explanation="The rule is W + R > N. With N=3, W=2/R=2 gives 4 > 3, guaranteeing overlap so reads see the latest write. W=1/R=1 (sum 2) and W=1/R=2 (sum 3) don't exceed N, so reads can be stale."
  revisit={{ to: "/docs/distributed-systems/ds-replication#quorums-agreeing-without-a-leader", label: "W + R > N" }}
/>

<Question
  prompt="A leader appears dead (it's actually just unreachable), so a follower is promoted — and now two nodes accept writes. What is this, and how is it prevented?"
  options={[
    { text: "Replication lag; prevented by faster networks" },
    { text: "Split brain; prevented by consensus-based leader election that requires a majority quorum, so a minority partition can't elect a second leader" },
    { text: "A quorum failure; prevented by adding more replicas" },
    { text: "A cache stampede; prevented by request coalescing" }
  ]}
  correct={1}
  explanation="Two simultaneous leaders diverging is split brain — a direct consequence of not being able to distinguish 'slow/unreachable' from 'dead.' Consensus algorithms require a majority to elect a leader, so a minority partition can't create a competing leader."
  revisit={{ to: "/docs/distributed-systems/ds-replication#quorums-agreeing-without-a-leader", label: "Split brain & failover" }}
/>

</Quiz>

## What's next

→ Continue to [Partitioning & sharding](./partitioning) — replication copies the *whole* dataset; partitioning splits it so no single node has to hold it all.
