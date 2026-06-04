---
id: operations
title: 6. Site Reliability & Operations — Overview
sidebar_position: 1
sidebar_label: Operations intro
description: The discipline of keeping software running — SRE, SLOs and error budgets, observability, reliability patterns, on-call, incident response, safe deploys, capacity, and chaos engineering.
---

# Part 6: Site Reliability & Operations

*Building software is half the job. Keeping it running — correct, fast, and available, at 3am, while it changes every day — is the other half.*

> **In one line:** Operations is the engineering discipline of running software in production reliably; its modern form, SRE (Site Reliability Engineering), turns "keep it up" from heroics into a measurable practice — define how reliable you need to be (SLOs), see what's actually happening (observability), build systems that fail gracefully (reliability patterns), and respond to and learn from failure without blame (incidents and postmortems).

:::tip[In plain English]
The earlier chapters got your code written and deployed. This chapter is everything that happens *after* the deploy, forever. Real software isn't "done" — it runs continuously, serves real users, depends on flaky networks and third parties, and changes every day. Operations is the craft of keeping that alive: knowing it's healthy *before* a user complains, building it so one failure doesn't cascade into an outage, getting woken up only for things that truly matter, fixing incidents calmly, and learning from them so they don't recur. Google's name for doing this with engineering rigor instead of late-night heroics is **SRE — Site Reliability Engineering** — and its ideas have become the industry standard. This is the layer that separates "it works on my machine" from "it works for a million people at 3am on a holiday weekend."
:::

:::note[New to web dev? How to read this chapter]
**Level: intermediate.** This chapter is about *running* software in production — it pays off most once you've actually shipped and operated something real. If you're reading straight through and haven't built your first project yet, the [Solo / Personal chapter](/docs/solo) is the place to start; this will mean far more afterward.

Reading it now is still worthwhile for the mental model: take the **"In plain English"** intros and the **worked-example** callouts on each page (why a missing timeout takes a whole site down; why blameless postmortems work), and let the specific metrics/alerting/tooling details land later when you have a system to apply them to. It builds on the Foundations and [Cloud](/docs/cloud) chapters.
:::

## Why this is its own discipline

Writing a feature and operating it are genuinely different skills. A feature is judged by "does it do the thing?" Operating it is judged by questions the feature code never asks:

- How do I know it's *working right now*, without a user telling me?
- When the database it depends on slows down, does my service degrade gracefully or fall over and take three other services with it?
- A deploy went out 20 minutes ago and errors are climbing — how fast can I tell, and how fast can I undo it?
- It's 3am and something's broken. Who gets paged? What do they do? How do we make sure we *learn* from it instead of just surviving it?

These don't have framework answers; they have *operational* answers. And as systems move from one server to many ([the cloud chapter](/docs/cloud)) and from monoliths to many services ([distributed systems](/docs/distributed-systems)), the number of things that can go wrong multiplies — so the discipline of running them well becomes more, not less, important.

:::info[Highlight: reliability is a feature, and 100% is the wrong target]
The central insight of SRE is counterintuitive: **your reliability target should not be 100%.** Chasing perfect uptime costs exponentially more for each "nine" and slows you to a crawl (every change is a risk, so you stop changing). Instead you pick a target that's *good enough for users* — say 99.9% — and treat the remaining 0.1% as a **budget you're allowed to spend** on shipping features, taking risks, and doing maintenance. Reliability becomes a number you manage against other goals, not an absolute you sacrifice everything for. That reframing — from "never go down" to "be exactly as reliable as users need, and spend the rest on velocity" — is what the next page is about.
:::

:::info[Jargon for this chapter]
- **SRE (Site Reliability Engineering)** — running production systems using software-engineering discipline; treating operations as an engineering problem.
- **SLI / SLO / SLA** — a *measurement* of reliability (Indicator), a *target* for it (Objective), and a *contractual promise* with consequences (Agreement).
- **Error budget** — the allowed amount of unreliability (100% minus your SLO); spend it on velocity.
- **Observability** — the ability to ask arbitrary questions about your system's behavior from its outputs (metrics, logs, traces) without shipping new code.
- **Toil** — manual, repetitive operational work that scales with traffic and could be automated; SRE aims to cap and reduce it.
- **MTTR / MTBF** — Mean Time To Recovery; Mean Time Between Failures. SRE optimizes recovery *speed* over failure *prevention* alone.
- **Blast radius** — how much breaks when one thing fails.
- **Postmortem** — a blameless written analysis of an incident: timeline, root cause, and action items.
- **Canary / blue-green** — deployment strategies that limit the blast radius of a bad release.
- **Runbook** — a step-by-step guide for handling a specific alert or task.
:::

## How this chapter is organized

### The framework
1. [The SRE mindset](./sre-mindset) — SLIs, SLOs, error budgets, toil, and "reliability as a feature you budget."

### Seeing and surviving
2. [Observability](./ops-observability) — metrics, logs, and traces; the three pillars, OpenTelemetry, and how to debug what you can't see.
3. [Reliability patterns](./reliability-patterns) — timeouts, retries with backoff, circuit breakers, bulkheads, load shedding, graceful degradation.

### Responding
4. [On-call & alerting](./on-call-alerting) — alert on symptoms, not causes; fighting alert fatigue; runbooks.
5. [Incident response & postmortems](./incident-response) — incident command, severity levels, comms, and blameless learning.

### Changing safely
6. [Deploys & rollbacks](./ops-deploys) — progressive delivery, canaries, blue-green, feature flags, and the DORA metrics.
7. [Capacity & scaling](./capacity-scaling) — load testing, autoscaling, capacity planning, the USE and RED methods.
8. [Chaos & resilience](./chaos-engineering) — chaos engineering, game days, and disaster recovery (RTO/RPO, backups you've actually tested).

---

When you finish, take the [checkpoint](./operations-checkpoint), then continue to [Chapter 7: Distributed Systems](/docs/distributed-systems).
