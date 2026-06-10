---
id: partitioning
title: Partitioning & Sharding
sidebar_position: 5
sidebar_label: Partitioning & sharding
description: Splitting data across nodes — partition by key range vs hash, hot spots and the celebrity problem, the cross-partition query cost, and rebalancing with consistent hashing.
---

# Partitioning & Sharding

> **In one line:** When data is too big or too busy for one node, you **partition** (shard) it — split it across nodes by some key — which lets you scale writes and storage almost without limit, at the cost of two hard new problems: keeping the load *evenly* spread (avoiding hot spots) and handling queries that need data from *many* partitions.

:::tip[In plain English]
Replication (last page) keeps full *copies* of your data on several machines — great for reads and durability, but every machine still holds *everything*, so it doesn't help when the dataset itself is too big or the *write* volume is too high for one machine. **Partitioning** (a.k.a. **sharding**) is the other axis: instead of copying all the data everywhere, you *split* it — user A–M on node 1, N–Z on node 2 — so each node holds and serves only a slice. Now you can scale almost indefinitely by adding nodes. The catch is twofold. First, you must split it *evenly*, or one node ends up with all the popular data and becomes a bottleneck while the others idle — a **hot spot**. Second, any query that needs data from *multiple* shards (e.g. "all orders across all users sorted by date") now has to hit many nodes and combine the results, which is slow and complex. Choosing the partition key well is the whole game.
:::

## Partitioning vs replication (don't confuse them)

They're orthogonal and almost always used *together*:

```
 REPLICATION: copy the SAME data to many nodes   → read scaling, durability
 PARTITIONING: split DIFFERENT data across nodes  → write/storage scaling

 Real systems do both: each PARTITION is itself REPLICATED.
 ┌── Shard A (users A–M) ──► replicated to 3 nodes
 ├── Shard B (users N–Z) ──► replicated to 3 nodes
 └── …add shards to scale writes; replicate each for safety
```

Replication answers "what if a node dies / how do I scale reads"; partitioning answers "what if the data/writes don't fit on one node." You need both at scale.

## How to choose the partition key

The partition key (and strategy) decides which node holds each record. Two main strategies:

**Range partitioning** — split by key ranges (users A–M / N–Z; orders by date). 
- ✅ Efficient range queries ("all orders in March" lands on one or few partitions).
- ⚠️ Prone to hot spots: if you partition by timestamp, *today's* partition gets all the writes while historical ones are idle.

**Hash partitioning** — hash the key and assign by hash (`hash(user_id) % N`). 
- ✅ Spreads load evenly (a good hash scatters keys uniformly) — the default for even distribution.
- ⚠️ Destroys range queries (adjacent keys land on different nodes) and you still get hot spots if a *single key* is enormously popular.

The dominant rule: **pick a high-cardinality key whose access spreads evenly.** `user_id` is usually good (many users, roughly balanced). `country` is usually bad (a few countries dominate → those partitions are hot). `status` is terrible (a handful of values → only a few partitions used at all). This is the same partition-key discipline the [DynamoDB section](/docs/cloud/cloud-managed-data) warned about — now you know *why*.

:::info[Highlight: the celebrity (hot-key) problem]
Even a perfect hash can't save you from a *single* key that's wildly more popular than the rest. Partition a social network by `user_id`, and a celebrity with 200 million followers makes *their* partition a hot spot — every read of that account hammers one node while others idle. Hashing doesn't help: it's one key, so it's one partition. This is the **hot-key / celebrity problem**, and it needs application-level tricks: **cache** the hot key aggressively (serve it without touching the partition), **split** the hot key into sub-keys (`celebrity#1`, `celebrity#2`, …) and aggregate, or **replicate** just that key to extra nodes. The general lesson: partitioning balances *many keys* well but cannot fix a skewed *distribution of popularity* — that's an application-design problem on top of the partitioning scheme.
:::

## The cross-partition query problem

Partitioning is wonderful when every query targets *one* partition (by its key). It's painful when a query needs data from *many*:

- A **single-partition** query ("get user 42's orders," partitioned by user) hits one node — fast and scalable.
- A **cross-partition** query ("the 100 most recent orders across all users") must **scatter-gather**: query every partition, then merge/sort the results — slower, harder, and it gets worse as you add partitions.

So the partition key should be chosen around your *dominant access pattern*. If you almost always query by user, partition by user. The mistake is partitioning by one key and then needing to query by a different one constantly — every such query becomes a scatter-gather. (When you genuinely need two access patterns, you maintain a second, differently-partitioned index of the data — duplicating storage to buy query locality, the NoSQL way.)

## Rebalancing & consistent hashing

When you add or remove nodes, data must move to rebalance. The naive `hash(key) % N` has a brutal flaw: change `N` (add one node) and *almost every* key remaps to a different node — a massive, system-stalling data shuffle. **Consistent hashing** fixes this: keys and nodes are placed on a hash ring, and each key belongs to the next node clockwise; adding/removing a node only moves the keys in *one segment* of the ring (≈ 1/N of the data), not all of it. Virtual nodes smooth out the distribution further. Consistent hashing is the standard technique behind partition rebalancing in systems like Cassandra and DynamoDB — the reason they can grow without re-shuffling everything.

:::note[Worked example: the partition key that doomed the analytics query]
A team shards their orders table by `order_id` (hashed — nicely even). Writes scale beautifully. Then the business needs a dashboard: "show each *customer's* order history and lifetime value." But orders are partitioned by `order_id`, not `customer_id`, so a single customer's orders are *scattered across every shard*. Every dashboard query becomes a scatter-gather across all nodes — slow and getting slower as they add shards. The lesson: **partition by the key you'll query by.** Had they sharded by `customer_id`, each customer's orders would live on one shard and the dashboard query would hit one node. (Since they also need to look up by `order_id`, the mature fix is a secondary index partitioned by `order_id`.) The partition key isn't a storage detail — it's a commitment to an access pattern, and changing it later means re-sharding the whole dataset.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Confusing partitioning with replication.** Replication copies all data (read scaling/durability); partitioning splits different data (write/storage scaling). At scale you need both — each shard replicated.
- **A low-cardinality or skewed partition key (country, status).** A few values means only a few partitions get used — uneven load, wasted nodes. Pick a high-cardinality, evenly-accessed key.
- **Ignoring the hot-key/celebrity problem.** Hashing balances many keys but not one super-popular key. Cache, split, or replicate the hot key at the application level.
- **Partitioning by one key but querying by another.** Every such query becomes a slow scatter-gather. Partition around the dominant access pattern; add a secondary index for others.
- **Using `hash % N` for assignment.** Adding a node remaps nearly all keys — a catastrophic reshuffle. Use consistent hashing so only ~1/N of keys move.
- **Sharding too early.** It adds serious complexity (cross-partition queries, transactions, rebalancing). Exhaust [caching and read replicas](/docs/operations/capacity-scaling) first; shard only when one node genuinely can't hold the writes/data.
:::

## Page checkpoint

<Quiz id="partitioning-page" title="Did partitioning stick?" sampleSize={3}>

<Question
  prompt="What's the difference between replication and partitioning, and how are they used together?"
  options={[
    { text: "They're synonyms" },
    { text: "Replication copies the SAME data to many nodes (read scaling, durability); partitioning splits DIFFERENT data across nodes (write/storage scaling). At scale you do both — each partition is itself replicated" },
    { text: "Replication is for SQL, partitioning is for NoSQL" },
    { text: "Partitioning copies data; replication splits it" }
  ]}
  correct={1}
  explanation="They're orthogonal axes. Replication gives every node a full copy (helps reads and survival); partitioning gives each node a slice (helps when data/writes outgrow one machine). Production systems combine them: shard the data, then replicate each shard."
  revisit={{ to: "/docs/distributed-systems/partitioning#partitioning-vs-replication-dont-confuse-them", label: "Replication vs partitioning" }}
/>

<Question
  prompt="A social network is partitioned by user_id with a good hash, yet one node is overloaded. What's the likely cause and an appropriate fix?"
  options={[
    { text: "The hash function is broken; switch hash algorithms" },
    { text: "The celebrity/hot-key problem — one user (key) is vastly more popular, and hashing can't spread a single key; cache that key aggressively, or split/replicate it at the application level" },
    { text: "Too few replicas; add more replicas of everything" },
    { text: "Range partitioning is being used by mistake" }
  ]}
  correct={1}
  explanation="Hashing balances many keys but a single ultra-popular key is still one partition. The hot-key/celebrity problem is solved at the application level: cache the hot key, split it into sub-keys and aggregate, or give it extra dedicated replicas."
  revisit={{ to: "/docs/distributed-systems/partitioning#the-cross-partition-query-problem", label: "Celebrity problem" }}
/>

<Question
  prompt="Why is `hash(key) % N` a poor way to assign keys to nodes, and what replaces it?"
  options={[
    { text: "It's too slow to compute; replace with a faster hash" },
    { text: "Changing N (adding/removing a node) remaps almost every key, forcing a massive data reshuffle; consistent hashing places keys and nodes on a ring so only ~1/N of keys move when membership changes" },
    { text: "Modulo isn't uniform; replace with range partitioning" },
    { text: "It can't handle string keys; replace with integer keys" }
  ]}
  correct={1}
  explanation="With `% N`, incrementing N changes the result for nearly all keys, so adding one node reshuffles the whole dataset. Consistent hashing (keys/nodes on a hash ring, key → next node clockwise) limits movement to one ring segment (~1/N), enabling smooth growth."
  revisit={{ to: "/docs/distributed-systems/partitioning#rebalancing--consistent-hashing", label: "Consistent hashing" }}
/>

</Quiz>

## What's next

→ Continue to [Time & ordering](./ds-time) — with data spread across nodes, "what happened first?" becomes a surprisingly deep question, because the clocks don't agree.
