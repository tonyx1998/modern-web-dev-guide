---
id: capacity-scaling
title: Capacity & Scaling
sidebar_position: 8
sidebar_label: Capacity & scaling
description: Load testing, autoscaling and its limits, the database as the usual bottleneck, capacity planning for known spikes, and graceful behavior at the edge of capacity.
---

# Capacity & Scaling

> **In one line:** Capacity work is making sure there's enough system to serve the load *before* the load arrives — which means load-testing to find your real limits, autoscaling the parts that can scale, knowing that the database is almost always the bottleneck that *can't* trivially scale, and planning explicitly for the spikes you can see coming.

:::tip[In plain English]
Your system can handle some amount of traffic; past that, it slows down and then falls over. Capacity work is knowing where that line is and staying ahead of it. You find the line by **load testing** — deliberately throwing traffic at a copy of your system until it breaks, so you learn its limits in a controlled test instead of during a real spike. You stay ahead of it with **autoscaling** — automatically adding servers when traffic rises — but with a crucial catch: your stateless web tier scales easily, while your *database* usually doesn't, so it becomes the real ceiling. And for spikes you can *predict* (a product launch, Black Friday, a marketing email going out), you don't wait for autoscaling to catch up — you pre-scale. The failure you're avoiding is the classic one: the big moment finally arrives, traffic spikes, and the site falls over at exactly the worst time.
:::

## Load testing: find the limit on purpose

You cannot plan capacity you haven't measured. Load testing drives synthetic traffic at the system to answer: how many requests/sec can it serve within the SLO? Where does latency start climbing? What breaks *first*? Common types:

- **Load test** — expected peak traffic; does it hold the SLO?
- **Stress test** — push past the limit to find the breaking point and see *how* it breaks (gracefully, or catastrophically?).
- **Soak test** — sustained load for hours/days to expose slow leaks (memory, connection exhaustion) that a short test misses.
- **Spike test** — sudden surge; does autoscaling react fast enough, or do you fall over before it catches up?

```javascript
// A k6 load test: ramp to 1,000 virtual users, assert the p95 SLO holds.
import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "2m", target: 1000 },  // ramp up
    { duration: "5m", target: 1000 },  // hold at peak
    { duration: "2m", target: 0 },     // ramp down
  ],
  thresholds: { http_req_duration: ["p(95)<500"] }, // SLO: p95 under 500ms or the test fails
};

export default function () {
  const res = http.get("https://staging.example.com/api/products");
  check(res, { "status 200": (r) => r.status === 200 });
  sleep(1);
}
```

Run load tests against a production-like environment (same instance sizes, same data volume) — a test against a tiny staging DB tells you nothing about prod. Ideally wire a load test into CI so a performance regression is caught like any other bug.

## Autoscaling and its limits

**Horizontal autoscaling** adds/removes identical instances based on a signal (CPU, request rate, queue depth, or a custom SLO-linked metric). It's the cloud's answer to variable load — pay for what you need, when you need it. But it has hard limits people forget:

- **It's not instant.** Spinning up an instance (boot, warm up, pass health checks, join the load balancer) takes seconds to minutes. A traffic spike *faster* than your scale-up time will overwhelm you before help arrives — which is why **predictable** spikes get pre-scaled rather than left to reactive autoscaling.
- **It requires statelessness.** You can only add interchangeable instances if any instance can serve any request — no session state in local memory. (Same requirement as [horizontal scaling in the compute chapter](/docs/cloud/cloud-compute).)
- **It scales the tier you point it at — usually the easy one.** The web/app tier is stateless and scales beautifully. Which moves the bottleneck downstream…

:::info[Highlight: the database is almost always the real bottleneck]
You can autoscale your stateless app tier to a thousand instances in minutes — and all you'll do is point a thousand instances at one database that can't be cloned with a click. **Stateful data is the part that doesn't scale by adding copies.** This is why the database is where capacity problems actually bite, and why the levers are different and harder:
- **Read scaling:** [read replicas](/docs/cloud/cloud-managed-data) (offload reads), aggressive [caching](/docs/foundations/caching) (serve hot data without touching the DB at all — often the highest-leverage move).
- **Write scaling:** much harder — vertical scaling (a bigger DB box) buys time; eventually [sharding/partitioning](/docs/distributed-systems/partitioning) splits the data, with real complexity.
- **Connection limits:** as [the serverless section](/docs/cloud/cloud-compute) warned, a scaled app tier can exhaust DB connections — a pooler is mandatory.

The practical sequence when load climbs: cache first (cheapest, biggest win), then read replicas, then vertical scale, and only then the genuinely hard work of sharding. Reaching for sharding before you've exhausted caching is doing the hardest thing first.
:::

## Capacity planning for known spikes

Some load you can *see coming*: a launch, a marketing campaign, a seasonal peak, a TV mention, a scheduled batch job. For these, reactive autoscaling is too slow — you **pre-scale**:

1. **Estimate the peak** from history or comparable events (×N expected multiplier, with margin).
2. **Pre-warm** capacity *before* the event — raise minimum instance counts, pre-scale the database, warm caches with the data the spike will hit.
3. **Load-test at the expected peak** beforehand so you find the breaking point in a test, not live.
4. **Have a degradation plan** ([reliability patterns](./reliability-patterns)): if you still exceed capacity, what do you shed or simplify to stay up?

:::note[Worked example: the launch that fell over (and the one that didn't)]
**Team A** announces a product launch for noon. At 12:00 traffic 20×'s. Autoscaling *starts* adding instances — but they take 90 seconds to boot and pass health checks, and meanwhile the surge has already saturated the existing fleet and exhausted the database connection pool. The site is down for the first ten minutes of its biggest moment, and the new instances, once up, all pile onto the already-drowning database. **Team B**, same launch, pre-scaled at 11:30: raised min instances to the load-tested peak, bumped the DB to a larger size for the day, pre-warmed the product cache, and had a "hide non-essential widgets" flag ready. At noon the spike lands on a system already sized for it; p99 wobbles and recovers. Same traffic, opposite outcome — the difference was treating a *predictable* spike as planning, not as something to autoscale into reactively.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **No load testing — discovering your limit during a real spike.** Find the breaking point on purpose, in a test, against a production-like environment.
- **Trusting autoscaling for sudden, predictable spikes.** Scale-up isn't instant; a fast surge overwhelms you before instances arrive. Pre-scale known events.
- **Scaling the app tier and forgetting the database.** A thousand app instances on one database just moves (and worsens) the bottleneck. Cache and add read replicas; mind connection limits.
- **Reaching for sharding before caching.** Caching and read replicas are far cheaper and usually enough. Sharding is the hardest lever — exhaust the easy ones first.
- **Load testing against a tiny staging environment.** Results don't transfer. Test against production-like instance sizes and data volumes.
- **No degradation plan at the capacity edge.** When you do exceed capacity, undirected failure is worse than deliberate shedding. Decide in advance what to drop to stay up.
:::

## Page checkpoint

<Quiz id="capacity-scaling-page" title="Did capacity & scaling stick?" sampleSize={3}>

<Question
  prompt="You autoscale your stateless app tier to handle more load, but performance still collapses under traffic. What's the usual real bottleneck?"
  options={[
    { text: "The load balancer can't handle that many instances" },
    { text: "The database — stateful data doesn't scale by adding identical copies, so a thousand app instances just overwhelm the one database (and can exhaust its connections); cache and add read replicas first" },
    { text: "DNS propagation delays" },
    { text: "The CDN cache expired" }
  ]}
  correct={1}
  explanation="The stateless app tier scales easily, which pushes the bottleneck to the database, which can't be cloned with a click. The lever sequence is cache → read replicas → vertical scale → (only if needed) shard, plus a connection pooler so the scaled app tier doesn't exhaust DB connections."
  revisit={{ to: "/docs/operations/capacity-scaling#autoscaling-and-its-limits", label: "Database bottleneck" }}
/>

<Question
  prompt="Why is reactive autoscaling insufficient for a predictable noon product launch?"
  options={[
    { text: "Autoscaling only works at night" },
    { text: "Scale-up isn't instant (instances take seconds-to-minutes to boot and pass health checks), so a sudden surge saturates the existing fleet before new capacity arrives — predictable spikes should be pre-scaled" },
    { text: "Autoscaling is more expensive than manual scaling" },
    { text: "Launches don't generate enough traffic to trigger autoscaling" }
  ]}
  correct={1}
  explanation="Autoscaling reacts after load rises and new instances take time to become useful. A fast, foreseeable spike overwhelms you in that gap. Pre-scale known events: raise minimums, pre-scale the DB, warm caches, and load-test at the expected peak beforehand."
  revisit={{ to: "/docs/operations/capacity-scaling#capacity-planning-for-known-spikes", label: "Pre-scaling known spikes" }}
/>

<Question
  prompt="What's the point of a stress test (as opposed to a load test at expected peak)?"
  options={[
    { text: "To verify the SLO holds at normal traffic" },
    { text: "To push past the limit and discover the breaking point and HOW the system fails — gracefully (sheds load) or catastrophically — so you can fix the failure mode before it happens for real" },
    { text: "To measure cold-start latency" },
    { text: "To test the database backup process" }
  ]}
  correct={1}
  explanation="A load test confirms you hold the SLO at expected peak; a stress test deliberately exceeds capacity to find where and how it breaks. Knowing whether it degrades gracefully or collapses — and at what level — lets you add shedding/degradation before a real surge exposes it."
  revisit={{ to: "/docs/operations/capacity-scaling#load-testing-find-the-limit-on-purpose", label: "Load test types" }}
/>

</Quiz>

## What's next

→ Continue to [Chaos & resilience](./chaos-engineering) — deliberately breaking things to prove your reliability work actually holds, and planning for the disaster you hope never comes.
