---
id: premature-optimization
title: The Premature Optimization Principle
sidebar_position: 11
sidebar_label: 10. Premature Optimization
description: Make it work, then make it right, then make it fast — in that order.
---

# The Premature Optimization Principle

> **In one line:** Make it work, then make it right, then make it fast — in that order.

:::tip[In plain English]
Donald Knuth: "Premature optimization is the root of all evil." Most code doesn't need to be fast. When you guess at what's slow without measuring, you're almost always wrong — and you've made the code harder to read in exchange for nothing. Build it. Clean it up. *Then* profile.
:::

## The rule

1. **Make it work.** Build the feature end-to-end. Don't worry about performance yet.
2. **Make it right.** Clean up the code, add tests, handle edge cases.
3. **Measure performance.** If performance is fine, you're done.
4. **Optimize the bottlenecks.** Profile-guided, not guess-guided.

## Why it matters

- Most code doesn't need to be fast. Network and I/O dominate.
- "Optimizations" often turn out to be irrelevant when you measure.
- Premature optimization makes code harder to read, modify, and debug.
- You don't know what's slow until you profile.

## When to optimize early

- **Algorithm choice.** O(n²) vs O(n log n) matters at any scale.
- **Database query patterns.** N+1 queries should never ship.
- **Network calls inside loops.** Always batch.
- **Bundle size for client-side JS.** Page weight matters from day one.

These are not premature — they're structural choices that are expensive to change later.

:::note[Worked example: where the time actually went]
An engineer spends a week micro-optimizing an inner loop, hand-rolling a buffer pool, avoiding allocations. Benchmark shows ~3% speedup overall.

Meanwhile, a profiler run reveals the *actual* hot path: a function calling the database inside a `.map()` over user IDs. Replacing it with a single `WHERE id IN (...)` query cuts total response time by 80%.

The lesson: **measure first**. The intuition about what's slow is reliably wrong. Profilers are not optional — they're the only honest source of truth about where time goes.
:::

:::info[Highlight: the difference between "early optimization" and "structural"]
"Premature optimization is the root of all evil" is often misread as "never think about performance." It actually means: don't tune *implementations* before measuring.

You should *always* think about **structural** performance choices from the start:

- An O(n²) algorithm where n grows with users will eventually melt.
- An N+1 query that ships will cause a 3 a.m. page.
- A 5 MB JS bundle is broken on mobile from day one.

These are not "optimizations" — they're correctness at scale. Fixing them after the fact is much more expensive than choosing right initially.
:::

## What's next

→ Continue to [The Documentation Trade-Off](./documentation-tradeoff) — document the things that don't change, not the things that do.
