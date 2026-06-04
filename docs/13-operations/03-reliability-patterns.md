---
id: reliability-patterns
title: Reliability Patterns
sidebar_position: 4
sidebar_label: Reliability patterns
description: Timeouts, retries with exponential backoff and jitter, circuit breakers, bulkheads, load shedding, backpressure, and graceful degradation — the toolkit that stops one failure from becoming an outage.
---

# Reliability Patterns

> **In one line:** In any system that calls other systems, failure is normal, not exceptional — and these patterns (timeout everything, retry carefully, break circuits, isolate with bulkheads, shed load, degrade gracefully) are the standard toolkit that keeps one slow or broken dependency from cascading into a full outage.

:::tip[In plain English]
Your service depends on other things — a database, a payment API, another team's service — and those things will be slow or down sometimes. The naive code ("just call it and wait") turns *their* problem into *your* outage: if the payment API hangs, your threads pile up waiting, and soon your whole service is frozen and *everything* is down, not just payments. These patterns are the hard-won defenses. Put a **timeout** on every external call so you never wait forever. **Retry** failed calls — but carefully, with delays, or you'll hammer a struggling service into the ground. Use a **circuit breaker** to stop calling something that's clearly down. **Isolate** subsystems so one failing piece can't consume all your resources. And design so that when a dependency *is* down, you **degrade gracefully** — show a slightly worse experience instead of an error page. None of these are exotic; together they're the difference between "payments is having issues" and "the whole site is down."
:::

## Timeouts: the most important one-liner in production

The default for most network clients is to wait *forever*. That's a latent outage. If a downstream call hangs, the calling thread/connection is stuck; under load, *all* of them get stuck waiting, the service runs out of capacity, and it goes down — because something *else* was slow. **Every** call that crosses a process boundary (DB query, HTTP request, cache, queue) needs an explicit, sane timeout.

```javascript
// No timeout = wait forever = a hung dependency takes YOU down.
const res = await fetch(url); // ❌ default may never time out

// Bounded: fail fast, free the resource, stay alive.
const res = await fetch(url, { signal: AbortSignal.timeout(2000) }); // ✅ 2s ceiling
```

Set timeouts based on the dependency's realistic p99, not a guess, and make the timeout *shorter* the deeper you are in a call chain (an inner call must time out before the outer one does, or the outer timeout fires first and the inner work is wasted).

## Retries — necessary and dangerous

Transient failures (a blip, a brief network drop, a momentary 503) deserve a retry. But naive retries are how a small problem becomes a **retry storm**: a dependency slows down → everyone retries immediately → the dependency now gets 3x the traffic while already struggling → it falls over completely. Three rules make retries safe:

1. **Exponential backoff** — wait longer between each attempt (200ms, 400ms, 800ms…), giving the dependency room to recover.
2. **Jitter** — add randomness to the delay so a thousand clients don't all retry at the *same* instant (a "thundering herd" / synchronized retry wave).
3. **Only retry idempotent / safe operations**, and cap the attempts. Retrying a non-idempotent "charge card" can double-charge (see [idempotency](/docs/distributed-systems/idempotency)).

```javascript
// Retry with exponential backoff + jitter, bounded attempts.
async function withRetry(fn, { attempts = 4, base = 200 } = {}) {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === attempts - 1 || !isRetryable(err)) throw err; // give up / don't retry 4xx
      const backoff = base * 2 ** i;                 // 200, 400, 800, 1600 ms
      const jitter = Math.random() * backoff;        // spread the herd
      await sleep(backoff + jitter);
    }
  }
}
// isRetryable: retry on timeouts/5xx/connection resets; NOT on 400/401/404 (won't change).
```

## Circuit breakers: stop knocking on a closed door

If a dependency is *down* (not just blipping), retrying every request just wastes your resources and delays every user with a doomed call. A **circuit breaker** wraps a dependency and tracks its failure rate. Like an electrical breaker, it has three states:

```
        failures exceed threshold
 CLOSED ───────────────────────────►  OPEN
 (calls    ◄───────────────────────   (fail FAST — don't even try;
  flow)      probe succeeds            return cached/fallback instantly)
  ▲                                         │ after a cool-down…
  │                                         ▼
  └──────────  HALF-OPEN  ◄─────────────────┘
            (let ONE trial call through; if it works, close; if not, re-open)
```

- **Closed:** normal; calls pass through, failures are counted.
- **Open:** the dependency is presumed down; calls **fail immediately** (no waiting, no hammering) and you serve a fallback. This both protects *you* (no piled-up waiting) and *them* (no traffic while they recover).
- **Half-open:** after a cool-down, allow a single probe; success closes the breaker, failure re-opens it.

The breaker converts "every user waits 2 seconds for a guaranteed failure" into "every user gets an instant fallback," and gives the dying dependency breathing room.

## Bulkheads: isolate so one leak doesn't sink the ship

Named after a ship's watertight compartments: if one floods, the others keep the ship afloat. In software, a **bulkhead** dedicates separate resource pools to different dependencies/features so one misbehaving piece can't consume *all* your capacity. Example: if all outbound calls share one connection pool of 100, and the payments API hangs, all 100 connections end up stuck on payments and *nothing else works either*. Give payments its own pool of 20 — when it hangs, you lose payments, but the other 80 connections keep search, profiles, and everything else alive. Isolation turns a total outage into a partial one.

## Load shedding & backpressure: protect yourself when overwhelmed

When demand exceeds capacity, you have two honest choices: serve everyone slowly (and eventually crash, serving *no one*) or **shed load** — reject some requests fast (HTTP 429) so the rest get served well. A system that sheds excess load stays up at a degraded rate; one that tries to accept everything falls over completely. **Backpressure** is the upstream signal that says "slow down, I'm full" — a full queue, a 429, a paused stream — propagating the limit back to the producer instead of silently buffering until memory runs out. Both are forms of admitting "I can't do all of this" gracefully instead of dying trying. (Backpressure recurs in [distributed systems](/docs/distributed-systems/messaging-patterns).)

:::info[Highlight: graceful degradation — the user-facing payoff of all of this]
Every pattern above exists so you can **degrade gracefully**: when a dependency fails, deliver a *reduced* experience instead of an error. The recommendations service is down? Show a generic best-sellers list, not a broken page. The live inventory count is unavailable? Show "in stock" from a cache and reconcile later. Search is overloaded? Serve cached popular results. The design question to ask for every feature is: *"when its dependency is down, what's the least-bad thing we can still show?"* Answering that — and building the fallback — is what separates a site that has "some features degraded" from one that's "down." Degradation should be deliberate, not the accidental error page you get when nothing was designed for failure.
:::

:::note[Worked example: an outage that was really a missing timeout]
A retailer's entire site goes down during a sale. Root cause: a *non-critical* "you might also like" recommendations call had **no timeout**. The recommendations service got slow under load; every page-render thread blocked waiting on it; the web tier ran out of threads; the whole site — checkout included — became unresponsive. A *non-essential* widget took down *checkout*. The fixes are this whole page: a 300ms timeout on the recs call, a circuit breaker so it fails fast when slow, a bulkhead so recs can't consume all threads, and graceful degradation to hide the widget when it's unavailable. Any one of these would have contained it; together they make it a non-event.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **No timeout on a network call.** The #1 cause of "a slow dependency took down the whole service." Timeout every cross-process call; make inner timeouts shorter than outer ones.
- **Retrying immediately, without backoff/jitter, or retrying non-idempotent operations.** You create retry storms that finish off a struggling dependency, or you double-charge. Backoff + jitter + cap, and only retry safe operations.
- **No circuit breaker on a flaky dependency.** You keep paying full latency for guaranteed failures and deny the dependency room to recover. Break the circuit and serve a fallback.
- **One shared resource pool for all dependencies.** One hang exhausts it and everything dies together. Bulkhead critical-vs-non-critical paths into separate pools.
- **Accepting unlimited load.** Trying to serve everyone during a spike means crashing and serving no one. Shed load (429) and apply backpressure to stay up degraded.
- **No designed fallback.** If you never decided "what do we show when X is down," the answer defaults to an error page. Design the least-bad degraded experience per feature.
:::

## Page checkpoint

<Quiz id="reliability-patterns-page" title="Did reliability patterns stick?" sampleSize={2}>

<Question
  prompt="A non-critical recommendations widget with no timeout takes down an entire site, including checkout. What's the core mechanism of that cascade?"
  options={[
    { text: "The recommendations data corrupted the database" },
    { text: "With no timeout, render threads blocked waiting on the slow dependency; under load all threads got stuck, exhausting capacity so even unrelated requests (checkout) couldn't be served" },
    { text: "The recommendations service deleted the checkout code" },
    { text: "Users retried so often they DDoSed the site" }
  ]}
  correct={1}
  explanation="An unbounded wait on one dependency ties up the resource (threads/connections) doing the waiting. Under load every resource ends up blocked on the slow call, so the whole service runs out of capacity — a non-essential widget takes down essential paths. Timeouts, circuit breakers, and bulkheads each prevent this."
  revisit={{ to: "/docs/operations/reliability-patterns#timeouts-the-most-important-one-liner-in-production", label: "Timeouts & cascades" }}
/>

<Question
  prompt="Why must retries use exponential backoff with jitter, and only on certain operations?"
  options={[
    { text: "To make the code shorter" },
    { text: "Backoff gives a struggling dependency room to recover, jitter prevents a thousand clients retrying in the same instant (thundering herd), and retrying only idempotent operations avoids double-charging — naive immediate retries cause retry storms" },
    { text: "Because TCP requires it" },
    { text: "To guarantee the request eventually succeeds" }
  ]}
  correct={1}
  explanation="Immediate, synchronized, unlimited retries hammer a slowing dependency into collapse and can duplicate side effects. Exponential backoff + random jitter + a cap + restricting retries to idempotent operations make retries help rather than harm."
  revisit={{ to: "/docs/operations/reliability-patterns#retries--necessary-and-dangerous", label: "Safe retries" }}
/>

<Question
  prompt="What does a circuit breaker in the 'open' state do, and why is that good for both sides?"
  options={[
    { text: "It retries the dependency as fast as possible until it recovers" },
    { text: "It fails calls immediately and serves a fallback — protecting the caller from piling up doomed waits and giving the failing dependency traffic-free room to recover" },
    { text: "It queues all requests until the dependency returns" },
    { text: "It permanently disables the feature" }
  ]}
  correct={1}
  explanation="An open breaker short-circuits: callers get an instant fallback instead of waiting for a guaranteed failure, and the down dependency isn't bombarded while it recovers. After a cool-down it goes half-open to probe with a single trial call."
  revisit={{ to: "/docs/operations/reliability-patterns#circuit-breakers-stop-knocking-on-a-closed-door", label: "Circuit breaker states" }}
/>

</Quiz>

## What's next

→ Continue to [On-call & alerting](./on-call-alerting) — deciding what's worth waking a human for, and what they do when woken.
