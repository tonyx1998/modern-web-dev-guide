---
id: ops-slo-math
title: The Math Under SRE — Error Budgets, Burn Rate & Capacity
sidebar_position: 11
sidebar_label: SLO math & capacity
description: Turning SRE principles into numbers — error-budget arithmetic, multi-window burn-rate alerting, why percentiles beat averages, queueing theory and Little's Law for capacity, load-test interpretation, and canary metric-gating.
---

# The Math Under SRE — Error Budgets, Burn Rate & Capacity

> **In one line:** The [SRE mindset](./sre-mindset) gave you SLIs, SLOs, and error budgets as *concepts*; this page makes them *computable* — how big an error budget actually is, how **multi-window burn-rate** alerts fire fast on a real outage but stay quiet on noise, why you measure **percentiles** not averages, and how **Little's Law** and load tests turn "will it scale?" into a number you can defend.

:::tip[In plain English]
An SLO like "99.9% of requests succeed" sounds like a slogan until you do the arithmetic: 99.9% over 30 days means you're *allowed* to fail about **43 minutes** of requests — that allowance is your **error budget**, and it's a real quantity you spend and track. The follow-on questions are all numeric. How fast are we burning the budget *right now*, and is it fast enough to wake someone? (Burn-rate alerting.) Is "average latency 200ms" good — or is it hiding that 1% of users wait 4 seconds? (Percentiles.) If each request takes 200ms and 500 arrive per second, how many are in flight at once, and will my connection pool survive it? (**Little's Law**.) This page gives you those formulas. They're not heavy math — they're the small, exact calculations that separate "we think we're fine" from "here's the number."
:::

## Error-budget arithmetic

An SLO is a target reliability over a window; the **error budget** is `100% − SLO` of that window — the failure you're allowed to spend on risk (deploys, experiments) before you must stop and stabilize.

```
   SLO         allowed failure        ≈ budget over 30 days
   99%         1%                       ~7.2 hours
   99.9%       0.1%                     ~43 minutes
   99.99%      0.01%                    ~4.3 minutes
```

Each "nine" cuts the budget ~10×, and each nine costs disproportionately more engineering. Picking an SLO is really picking how many nines are *worth* it — and the budget is what makes "we can afford to ship" or "we must freeze and fix" an objective call, not a vibe.

## Burn-rate alerting: fast on outages, quiet on noise

A naïve alert ("error rate > 0.1%!") either pages on every blip or misses a slow bleed. The SRE answer is **burn rate**: how many times faster than "sustainable" you're consuming the budget. Burn rate `1` exactly exhausts the budget over the whole window; burn rate `14.4` exhausts it in 1/14.4 of the window.

The trick is **multi-window, multi-burn-rate** alerts — require a *high* burn rate over *both* a short and a long window before paging:

- **Fast-burn page:** e.g. burn rate ≥ 14.4 sustained over **1 hour *and* 5 minutes** → you'll exhaust a 30-day budget in ~2 days → wake someone now. The 5-minute window makes it react fast; the 1-hour window stops a 30-second blip from paging.
- **Slow-burn ticket:** e.g. burn rate ≥ 1 over **6 hours** → a quiet, steady bleed that won't blow the budget today but will by month-end → a ticket, not a 3am page.

This is why mature on-call is calm: alerts fire on *budget-threatening* trends confirmed across windows, not on single noisy data points.

## Percentiles, not averages

Averages lie about user experience. If 99 requests take 100ms and one takes 10s, the **mean** is ~200ms — sounds fine — but a real user hit 10 seconds. SLIs use **percentiles**: **p99 = 250ms** means 99% of requests were faster than 250ms (and 1% — often your power users with the most data — were slower). Always state latency SLOs as percentiles (p95/p99), and remember that a single backend's p99 becomes *common* once a page makes many calls (call 100 services at p99=1% each and ~63% of pages hit at least one slow call).

## Capacity: Little's Law and load tests

The cleanest law in capacity planning, **Little's Law**, relates three quantities for any stable system:

> **L = λ × W** — items *in the system* = arrival rate × time each spends in the system.

It's tiny and shockingly useful: it sizes connection pools, thread pools, and concurrency limits without a load test. You'll implement it below; then load tests *confirm* the real saturation point — the load at which latency curves sharply upward (the "knee") because a resource is exhausted. You provision headroom *below* the knee, not at it.

<CodeChallenge
  id="ops-littles-law"
  fnName="requestsInFlight"
  prompt="Apply Little's Law: L = λ × W. requestsInFlight(arrivalRatePerSec, avgLatencySec) returns the average number of requests being processed concurrently. (Example: 500 req/s each taking 0.05s ⇒ 25 in flight ⇒ your connection pool needs ≳25 slots.)"
  starter={`function requestsInFlight(arrivalRatePerSec, avgLatencySec) {\n  // Little's Law: L = lambda * W\n  // your code\n}`}
  solution={`function requestsInFlight(arrivalRatePerSec, avgLatencySec) {\n  return arrivalRatePerSec * avgLatencySec;\n}`}
  tests={[
    {args: [100, 0.2], expected: 20, label: '100 req/s × 200ms = 20 in flight'},
    {args: [500, 0.05], expected: 25, label: '500 req/s × 50ms = 25 (size the pool ≥25)'},
    {args: [1000, 0.1], expected: 100, label: '1000 req/s × 100ms = 100'},
    {args: [50, 2], expected: 100, label: 'slow 2s calls: even 50 req/s needs 100 slots'},
    {args: [0, 1], expected: 0, label: 'no traffic, nothing in flight'},
  ]}
  hint="It's literally arrivalRatePerSec * avgLatencySec. The insight is that slow calls (large W) need big concurrency even at modest arrival rates."
/>

## Canary metric-gating: deploys that judge themselves

The deploy strategies from [deploys & rollbacks](./ops-deploys) get teeth here. A **canary** sends a small % of traffic to the new version, then an **automated gate** compares the canary's SLIs (error rate, p99 latency, the metrics from the [observability stack](./ops-observability-engineering)) against the stable version. Within tolerance → ramp up; degraded → **auto-rollback**, no human in the loop. The same math — percentiles and error budgets — that defines your SLOs is what the gate evaluates, so a bad deploy is caught by numbers in minutes rather than by users in hours.

:::note[Worked example: the page that should fire, and the blip that shouldn't]
A service has a **99.9% availability SLO** over 30 days → an error budget of ~43 minutes of failed requests.

- **09:00 — a real outage.** A bad config makes 30% of requests fail. Burn rate ≈ 0.30 / 0.001 = **300×**. The fast-burn rule (≥14.4 over 5min *and* 1h) trips almost immediately on the 5-minute window, the 1-hour window confirms it isn't a one-off, and an engineer is **paged at ~09:05** — at 300× they'd torch the entire 43-minute budget in under 9 minutes, so fast paging is correct.
- **11:30 — a 20-second blip.** A node restarts; errors spike to 30% for 20 seconds, then clear. The 5-minute window sees a brief bump, but the **1-hour window's burn rate stays far below threshold** (20s of errors in an hour is trivial), so **no page fires** — correctly, because the blip consumed seconds of a 43-minute budget.
- **All day — a slow bleed.** A minor dependency makes 0.15% of requests fail continuously: burn rate ≈ 1.5×. No fast-burn page, but the **6-hour slow-burn rule files a ticket** — at 1.5× the month's budget is gone by ~day 20, so it needs attention this week, not tonight.

Same budget, three outcomes — page, silence, ticket — decided entirely by burn-rate-across-windows math. That arithmetic is what makes on-call humane.
:::

## Why it matters

This is the layer that turns SRE from posture into engineering. Error-budget math makes "ship vs. freeze" objective. Multi-window burn-rate alerting is the difference between a calm rotation and alert fatigue that gets real outages ignored. Percentiles stop averages from hiding the pain of your most valuable users. And Little's Law plus load-test knees let you answer "will it hold at 10×?" with a number and a provisioning plan instead of a shrug. Numbers you can defend are the whole job.

## Common mistakes

:::caution[Where people commonly trip up]
- **Single-threshold alerts.** "Error rate > X" pages on every blip or misses slow bleeds. Use multi-window, multi-burn-rate alerts (fast-burn pages, slow-burn tickets).
- **Reporting average latency.** The mean hides the tail. State and alert on percentiles (p95/p99); remember fan-out makes a per-call p99 common at the page level.
- **An SLO with no error-budget policy.** A target without "what happens when we breach it" is decoration. Tie budget exhaustion to a concrete freeze/stabilize action.
- **Chasing more nines than needed.** Each nine ~10×s the cost. Pick the reliability that's actually worth it; over-targeting burns engineering for no user benefit.
- **Sizing pools by guesswork.** Use Little's Law (L = λW) to size connection/thread pools; slow downstream calls need surprising concurrency.
- **Provisioning at the load-test knee.** The knee is where latency runs away. Provision headroom below it, not at it.
:::

## Page checkpoint

<Quiz id="ops-slo-math-page" title="Did the SRE math stick?" sampleSize={3}>

<Question
  prompt="A service has a 99.9% availability SLO over 30 days. What is its error budget, and what's it for?"
  options={[
    { text: "Zero — 99.9% means no failures are allowed" },
    { text: "About 43 minutes of failed requests over the 30 days (0.1% of the window) — the failure you're allowed to 'spend' on deploys and risk before you must stop and stabilize" },
    { text: "99.9 minutes per day" },
    { text: "It depends on the number of servers" }
  ]}
  correct={1}
  explanation="Error budget = (100% − SLO) of the window. 0.1% of 30 days ≈ 43 minutes. It makes 'we can afford to ship' vs 'freeze and fix' an objective, trackable decision rather than a vibe."
  revisit={{ to: "/docs/operations/ops-slo-math#error-budget-arithmetic", label: "Error budget" }}
/>

<Question
  prompt="Why do mature teams use multi-window, multi-burn-rate alerting?"
  options={[
    { text: "To send more alerts overall" },
    { text: "Requiring a high burn rate over BOTH a short and a long window pages fast on a real budget-threatening outage while staying quiet on brief blips — and a separate slow, low-rate window files a ticket for steady bleeds instead of a 3am page" },
    { text: "Because Prometheus requires exactly two windows" },
    { text: "To replace SLOs entirely" }
  ]}
  correct={1}
  explanation="Burn rate measures how fast you're consuming the budget. Confirming a fast burn across a short AND long window reacts quickly without paging on noise; a long low-rate window catches slow bleeds as tickets. This is what keeps on-call calm and trustworthy."
  revisit={{ to: "/docs/operations/ops-slo-math#burn-rate-alerting-fast-on-outages-quiet-on-noise", label: "Burn-rate alerting" }}
/>

<Question
  prompt="Using Little's Law, if 500 requests/sec each take 50ms, how many are in flight, and why does it matter?"
  options={[
    { text: "0.05 — and it doesn't affect capacity" },
    { text: "L = λ × W = 500 × 0.05 = 25 concurrent requests, so a connection/thread pool must have ≳25 slots; slow downstream calls (large W) demand surprisingly high concurrency even at modest request rates" },
    { text: "500 — one per request per second regardless of latency" },
    { text: "10,000 — latency multiplies the rate by 1000" }
  ]}
  correct={1}
  explanation="Little's Law (L = λW) gives 500 × 0.05 = 25 in flight, sizing the pool. The key intuition: concurrency scales with latency, so a slow dependency needs far more pool slots than its request rate alone suggests."
  revisit={{ to: "/docs/operations/ops-slo-math#capacity-littles-law-and-load-tests", label: "Little's Law" }}
/>

</Quiz>

## What's next

→ You've finished the operations chapter, including the math that makes SRE defensible. Take the [Chapter 6 checkpoint](./operations-checkpoint), then continue to [Chapter 7: Distributed Systems](/docs/distributed-systems) — the deep theory of why systems that span many machines behave the way they do.
