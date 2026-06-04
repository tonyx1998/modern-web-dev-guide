---
id: performance-deep
title: Performance Engineering
sidebar_position: 8
sidebar_label: Performance
description: Performance as a measured discipline — profile before you optimize, the latency numbers every engineer should know, frontend Core Web Vitals, the database as the usual backend bottleneck, caching as the biggest lever, and knowing when to stop.
---

# Performance Engineering

> **In one line:** Performance is measured, never guessed — you find the actual bottleneck with a profiler, fix the biggest one, and repeat; and the bottleneck is almost never where your intuition says, because most web slowness is the network and the database, not your CPU.

The skill isn't "writing fast code" — it's *knowing what's actually slow* and fixing that, instead of micro-optimizing code that was never the problem.

:::info[Where this connects in the rest of the guide]
- Frontend perf basics (Core Web Vitals, what LCP/INP/CLS mean) are in [Performance (Foundations)](/docs/foundations/performance).
- The backend levers connect to [Caching](/docs/foundations/caching), [Advanced SQL](/docs/stack/databases-advanced), [Capacity & scaling](/docs/operations/capacity-scaling), and [Cloud cost](/docs/cloud/cloud-cost).

This page is the *method*: how to find and fix the bottleneck that matters.
:::

## 1. Measure first — the only rule that always applies

The cardinal sin of performance work is optimizing without measuring. Your intuition about what's slow is reliably wrong, because the slow part is usually I/O (a query, a network call) hiding behind code you assumed was the cost. **Amdahl's law** makes this concrete: speeding up something that's 5% of the runtime can improve total time by at most 5%, no matter how clever the fix. So:

1. **Profile** the real workload (Chrome DevTools Performance panel, a flame graph, your APM's traces).
2. **Find the single biggest contributor** to the time.
3. **Fix that one thing**, then re-measure (the bottleneck *moves* — what was #2 is now #1).
4. **Stop** when you're under budget.

"Make it work, make it right, make it fast — in that order, and only profile to decide what 'fast' even means." Optimizing on a hunch is how you spend a week shaving 2ms off a function that runs once while ignoring the 400ms query on the hot path.

## 2. The latency numbers every engineer should know

You can't reason about performance without an intuition for *relative* cost. Orders of magnitude (rounded, 2026-ish):

| Operation | Time | Relative |
|---|---|---|
| L1/CPU cache reference | ~1 ns | 1× |
| Main memory (RAM) read | ~100 ns | 100× |
| SSD random read | ~100 µs | 100,000× |
| **Same-datacenter network round trip** | ~0.5 ms | 500,000× |
| **Database query (simple, local)** | ~1–10 ms | millions× |
| **Cross-continent network round trip** | ~100–150 ms | hundreds of millions× |

The lesson screams off the table: **a single network/DB round trip dwarfs almost any amount of in-process computation.** This is why the [N+1 query problem](/docs/stack/databases-advanced) and "chatty" service calls destroy performance — 50 sequential round trips at 1ms each is 50ms of doing nothing but waiting. The highest-leverage backend optimization is almost always *making fewer round trips*, not faster code.

## 3. Frontend performance: Core Web Vitals and the network

On the frontend, the user's experience is dominated by what you ship over the network and when. The metrics Google grades (and users feel):

- **LCP (Largest Contentful Paint)** — when the main content appears. Hurt by big images, render-blocking resources, slow servers.
- **INP (Interaction to Next Paint)** — responsiveness to clicks/taps. Hurt by long JS tasks blocking the main thread.
- **CLS (Cumulative Layout Shift)** — visual stability. Hurt by images/ads without reserved space.

The big levers: **ship less JavaScript** (code-split, lazy-load below-the-fold, prefer Server Components so code never ships), **optimize images** (right format/size, `loading="lazy"`, modern formats), **eliminate request waterfalls** (parallelize independent fetches; don't serialize what could be concurrent), and **cache aggressively at the CDN**. A Lighthouse run names your specific offenders in 30 seconds.

## 4. Backend performance: it's (almost always) the database

When a backend endpoint is slow, the database is the first and usually the last suspect. The recurring culprits — covered deeply in [Advanced SQL](/docs/stack/databases-advanced):

- **N+1 queries** — 1 + N round trips where 1–2 would do. The #1 ORM-shaped slowdown.
- **Missing indexes** — a sequential scan over a million rows to return 20. `EXPLAIN ANALYZE` reveals it.
- **Doing in app code what SQL does better** — pulling 100k rows into the app to sum them, instead of `SELECT sum(...)`.
- **Connection exhaustion** — especially serverless; a pooler is mandatory (see [Cloud compute](/docs/cloud/cloud-compute)).

The pattern: **push work toward the data** (aggregate/filter in the query), and **reduce round trips** (batch, join, cache). CPU-bound backend work is real but rare in typical web apps — confirm with a profile before assuming it.

## 5. Caching: the biggest lever (and the hardest to get right)

Caching is the highest-impact performance tool because it removes work entirely — a cache hit is *infinitely* faster than the fastest query. The layers, outermost (cheapest) to innermost:

```
Browser cache → CDN edge → application cache (Redis) → database cache → the work itself
```

The deeper a request gets, the more it cost; the goal is to serve it as early as possible. But — *"there are only two hard things in computer science: cache invalidation and naming things."* The hard part isn't caching, it's **knowing when the cached value is stale** and serving fresh-enough data without serving wrong data. Practical patterns: short TTLs for tolerably-stale data, **stale-while-revalidate** (serve the old value instantly, refresh in the background), and explicit invalidation on write for data that must be correct. This is the deep version of the [caching foundations](/docs/foundations/caching), and it ties to the [scaling lever order](/docs/operations/capacity-scaling): cache *before* you add read replicas, replicas before you shard.

## 6. Concurrency: don't wait when you don't have to

A lot of "slow" is really "serial when it could be parallel." If three independent things each take 100ms, doing them one after another is 300ms; doing them together is 100ms:

```ts
// SLOW — 3 sequential round trips = sum of all three
const user = await getUser(id);
const orders = await getOrders(id);
const prefs = await getPrefs(id);

// FAST — independent I/O in parallel = the slowest single one
const [user, orders, prefs] = await Promise.all([getUser(id), getOrders(id), getPrefs(id)]);
```

The two rules: **parallelize independent I/O** (`Promise.all`), and **never block the event loop** with heavy synchronous CPU work in a single-threaded runtime like Node (offload it to a worker, a queue, or a different service — see [Node's event loop](/docs/foundations/concurrency)). Streaming results as they're ready (rather than buffering everything) is the same idea applied to time-to-first-byte.

## 7. Know when to stop — performance is a budget, not a quest

Performance work has sharply diminishing returns, and past a point the user can't tell. Set a **performance budget** (e.g. "LCP under 2.5s on a mid-tier phone on 4G," "p99 API latency under 300ms") and optimize *to the budget*, then stop and ship. Two refinements: optimize for **p99, not the average** (the average hides the slow tail where real users suffer — the same lesson as [observability percentiles](/docs/operations/ops-observability)), and remember **perceived performance** — a skeleton screen, an optimistic UI update, or a streamed first paint can make a system *feel* fast without being faster. Beyond the budget, engineering time is better spent elsewhere; chasing milliseconds nobody notices is [premature optimization](/docs/decisions/premature-optimization) wearing a lab coat.

## Why this matters for you

Slow apps lose users and cost money (and, on a cloud, [literal dollars in compute and egress](/docs/cloud/cloud-cost)). But the deeper payoff is judgment: knowing *not* to optimize is as valuable as knowing how. The engineer who profiles, fixes the one real bottleneck, and ships beats the one who hand-tunes code that was never slow — every time.

## Going further (optional)

*This page plus the **First step** below are self-contained — you don't need to leave the site to learn or apply this. If you want to go even deeper, these are the best tools and resources:*

Open Chrome DevTools → Performance, record a page interaction, and read the flame chart — find the longest bar. Run Lighthouse on a real page and fix its top recommendation. For the backend, `EXPLAIN ANALYZE` your slowest query (see [Advanced SQL](/docs/stack/databases-advanced)). For the deep backend theory, *Designing Data-Intensive Applications* (Kleppmann) is the canonical book; Brendan Gregg's work is the reference for systems profiling and flame graphs.

## First step

Pick your slowest page or endpoint. **Before changing anything, measure it** (DevTools Performance for frontend, `EXPLAIN ANALYZE` or an APM trace for backend) and write down where the time actually goes. You'll almost certainly find it's somewhere other than you guessed — usually a query or a waterfall of round trips. Fix that one thing, re-measure, and confirm the number moved. That loop *is* performance engineering.

## Common mistakes

:::caution[Where people commonly trip up]
- **Optimizing without profiling.** Your guess about the bottleneck is usually wrong. Measure first, fix the biggest contributor, re-measure. Always.
- **Micro-optimizing the wrong layer.** Shaving nanoseconds off a function while a 400ms query sits on the hot path. The network and the database dominate; start there.
- **Ignoring N+1 and missing indexes.** The two most common backend slowdowns, both invisible until you look at the emitted SQL / query plan.
- **Optimizing the average instead of p99.** A great average can hide a miserable slow tail. Track and optimize the percentiles real users land in.
- **Serial I/O that could be parallel.** Awaiting independent calls one by one. Use `Promise.all` for anything that doesn't depend on the previous result.
- **No performance budget — optimizing forever.** Past a threshold users can't tell, and the time is better spent elsewhere. Set a budget, hit it, ship. Don't chase invisible milliseconds.
:::

## Page checkpoint

<Quiz id="performance-deep-page" title="Did performance thinking stick?" sampleSize={3}>

<Question
  prompt="What's the first rule of performance optimization?"
  options={[
    { text: "Rewrite the hottest function in a faster language" },
    { text: "Measure first — profile the real workload to find the actual biggest bottleneck, because intuition about what's slow is reliably wrong (it's usually I/O, not your CPU code)" },
    { text: "Add caching everywhere immediately" },
    { text: "Switch to a faster framework" }
  ]}
  correct={1}
  explanation="Optimizing without measuring wastes effort on code that was never the problem. Amdahl's law: speeding up 5% of the runtime helps at most 5%. Profile, fix the single biggest contributor, re-measure (the bottleneck moves), and stop at your budget."
  revisit={{ to: "/docs/roadmap/part-3-beyond/performance-deep#1-measure-first--the-only-rule-that-always-applies", label: "Measure first" }}
/>

<Question
  prompt="Why is reducing the number of network/database round trips usually the highest-leverage backend optimization?"
  options={[
    { text: "Round trips use more electricity than computation" },
    { text: "A single network or DB round trip (~0.5–10ms) dwarfs almost any in-process computation (nanoseconds), so 50 sequential round trips (e.g. an N+1) is mostly time spent waiting — fewer round trips beats faster code" },
    { text: "Databases can't handle many queries per second" },
    { text: "Network calls always fail and need retries" }
  ]}
  correct={1}
  explanation="The latency hierarchy spans orders of magnitude: CPU/RAM in nanoseconds, a DB round trip in milliseconds — millions of times slower. So waiting on round trips, not computing, dominates web backend time. That's why N+1 queries and chatty service calls are so destructive, and why batching/joining/caching to cut round trips is the big win."
  revisit={{ to: "/docs/roadmap/part-3-beyond/performance-deep#2-the-latency-numbers-every-engineer-should-know", label: "The latency numbers" }}
/>

<Question
  prompt="Three independent data fetches each take ~100ms and the endpoint awaits them one after another (300ms total). What's the fix, and what's the limit?"
  options={[
    { text: "Cache all three; nothing else can help" },
    { text: "Run them concurrently with Promise.all since they're independent — total time drops to ~the slowest single call (~100ms); you can't go below the slowest one" },
    { text: "Move them to the frontend" },
    { text: "Combine them into one giant query regardless of whether they're related" }
  ]}
  correct={1}
  explanation="Independent I/O should run in parallel: Promise.all turns sum-of-all into max-of-all (~100ms here). Only serialize calls that genuinely depend on a previous result. (Separately, don't block the event loop with heavy synchronous CPU work — offload it.)"
  revisit={{ to: "/docs/roadmap/part-3-beyond/performance-deep#6-concurrency-dont-wait-when-you-dont-have-to", label: "Parallelize independent I/O" }}
/>

</Quiz>

---

→ Next: [Part IV — Meta-skills](/docs/roadmap/part-4-meta) · [Back to Part III overview](/docs/roadmap/part-3-beyond)
