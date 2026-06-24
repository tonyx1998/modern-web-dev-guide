---
id: cloud-platform-engineering
title: Platform Engineering & Resilient Architecture
sidebar_position: 14
sidebar_label: Platform engineering & resilience
description: Treating the platform as a product — internal developer platforms, golden paths, and self-service — and designing for survival across multi-region HA, active-active vs active-passive, failover, and the RPO/RTO framing of disaster recovery.
---

# Platform Engineering & Resilient Architecture

> **In one line:** Two senior-infrastructure ideas finish the cloud chapter — **platform engineering**, which treats your internal infrastructure as a *product* with paved "golden paths" so every developer ships safely without re-learning Kubernetes/Terraform/secrets each time; and **resilient architecture**, designing across regions so that a whole data-center outage costs you a measured, *chosen* amount of data and downtime instead of an existential one.

:::tip[In plain English]
You now know the machinery — [Kubernetes](./cloud-kubernetes), [GitOps and IaC](./cloud-gitops), [networking](./cloud-networking), [IAM](./cloud-iam). The problem at a real company is that you can't expect *every* developer to master all of it to ship a service. **Platform engineering** is the discipline of packaging that machinery into a smooth, self-service path — a "golden path" — so a developer fills in a template and gets a production-ready service (CI, deploy, secrets, monitoring, the works) without hand-wiring any of it. The platform team's *customers are the other engineers*, and the product is "shipping is easy and safe here." The second half is **resilience**: a single region (a cluster of data centers in one geography) *will* eventually have a bad day. Designing so that survives — and deciding *in advance* how much data loss and downtime you can tolerate — is what separates a service that shrugs off an outage from one that makes the news.
:::

## Platform engineering: the platform is a product

The anti-pattern: every team independently figures out how to build a pipeline, wire secrets, set up monitoring, and configure Kubernetes — re-solving the same problems slightly differently, each slightly wrong. Platform engineering fixes this by treating internal infrastructure as a **product** with users (developers) and a value proposition (ship safely, fast, without deep infra expertise):

- **Golden paths (paved roads).** An opinionated, supported, end-to-end way to build and run a typical service — scaffold a new service from a template and you *automatically* get CI/CD, deploy, secrets wiring, observability, and sensible defaults. You *can* step off the path, but you don't *have* to be an expert to be productive on it.
- **Internal Developer Platform (IDP).** The self-service layer — often a portal — where developers request environments, spin up services, and see their systems. A **service catalog** (e.g. **Backstage**) gives one place to find "what services exist, who owns them, where are their docs/dashboards."
- **Self-service with guardrails.** Developers provision what they need *within* policy (the [policy-as-code](./cloud-gitops) from the last page) — fast for them, safe for the org. No ticket-and-wait, no free-for-all.

The measure of a good platform: a new engineer ships a real service on day one without a platform expert hand-holding them, and *can't* easily do something dangerous.

## Resilient architecture: surviving a region outage

A **region** is a geographic cluster of data centers; an **availability zone (AZ)** is an isolated data center within it. Spreading across AZs survives one data center failing — table stakes. Surviving an entire *region* outage is the harder, deliberate choice:

- **Active-passive (failover).** One region serves; a second stands by with replicated data. On a region failure you **fail over** — promote the standby, redirect traffic (via DNS or a global load balancer). Cheaper; recovery isn't instant.
- **Active-active.** Both regions serve live traffic simultaneously behind global load balancing. Survives a region loss with little or no downtime — but you now own the hard problems of cross-region data consistency and conflict (the [replication](/docs/distributed-systems/ds-replication) and [consensus](/docs/distributed-systems/ds-consensus) realities from the distributed-systems chapter). More expensive, more complex.

## RPO and RTO: decide your loss *before* the outage

Two numbers turn "be resilient" into an engineering target and a budget:

- **RPO (Recovery Point Objective)** — how much *data* you can afford to lose, measured in time. "RPO = 5 minutes" means after a disaster you may lose up to the last 5 minutes of writes. It's set by **replication lag / backup frequency** (and maps straight to the sync-vs-async [replication](/docs/distributed-systems/ds-replication) trade and the [WAL](/docs/distributed-systems/ds-storage-internals) shipping behind it).
- **RTO (Recovery Time Objective)** — how long you can afford to be *down*, measured in time. "RTO = 30 minutes" means you must be serving again within 30 minutes. It's set by how automated your failover is.

```
   ──writes──►  💥 disaster at T
        │◄── RPO ──►│           │◄────── RTO ──────►│
   last durable     T        service              service
   replicated point          goes down            restored
   (data after here lost)
```

Smaller RPO/RTO cost real money (synchronous cross-region replication, hot standbys, automated failover). The point of naming them is to make that trade **explicitly**, per system — your billing database might demand RPO≈0, while an analytics pipeline happily tolerates an hour.

:::note[Worked example: a region goes dark, traced against RPO/RTO]
A payments service runs **active-passive**: region A serves; region B is a warm standby with the database replicated **asynchronously** at ~10 seconds of lag. Target: **RPO = 30s, RTO = 5 min.**

1. **T+0** Region A loses power. Health checks from the global load balancer to A start failing.
2. **T+40s** After a few failed checks (tuned not to flap on a blip), the system declares A down and triggers failover.
3. **Promote B's database replica to primary.** Because replication was async at ~10s lag, **up to ~10 seconds of the most recent writes never reached B and are lost** — within the 30s RPO. ✔
4. **Shift traffic.** The global load balancer / DNS points at region B; B's app tier (kept warm) takes live traffic.
5. **T+3 min** Service is restored in region B — within the 5-min RTO. ✔
6. **The fork in the road:** had this been **active-active** with **synchronous** replication, RPO would approach 0 (no committed write lost) and RTO near-instant — at materially higher cost and the cross-region consistency complexity of [consensus](/docs/distributed-systems/ds-consensus). The team chose async active-passive because losing ≤30s of payments on a rare region outage was an acceptable, *priced* risk. That sentence — written down *before* the outage — is what made the 2am response a checklist instead of a panic.
:::

## Why it matters

Platform engineering is how an organization scales *engineering throughput* without every team drowning in infrastructure — the paved road is the highest-leverage thing an infra team builds. Resilient architecture, framed by RPO/RTO, is how you convert "what if a region dies?" from an unbounded fear into a line item with a known cost and a tested runbook. Both are the senior moves that separate "we run some servers" from "we run a platform."

## Common mistakes

:::caution[Where people commonly trip up]
- **A platform with no paved road.** Handing teams raw Kubernetes/Terraform and calling it a platform. Without golden paths, everyone re-solves the basics slightly wrong. Provide an opinionated, supported default path.
- **Self-service without guardrails (or guardrails without self-service).** All freedom invites dangerous mistakes; all tickets kills velocity. Pair self-service with policy-as-code.
- **Confusing multi-AZ with multi-region.** Spreading across AZs survives a data-center failure, not a whole-region outage. Know which you actually need.
- **Choosing active-active by default.** It's expensive and drags in cross-region consistency/conflict problems. Active-passive failover is often the right, cheaper call.
- **No stated RPO/RTO.** "Be resilient" with no numbers can't be designed or budgeted. Set RPO (tolerable data loss) and RTO (tolerable downtime) per system, deliberately.
- **A failover that's never tested.** An untested failover is a hope. Game-day it (see [chaos engineering](/docs/operations/chaos-engineering)) so the runbook works under real pressure.
:::

## Page checkpoint

<Quiz id="cloud-platform-engineering-page" title="Did platform engineering & resilience stick?" sampleSize={3}>

<Question
  prompt="What is the core idea of platform engineering?"
  options={[
    { text: "Forcing every developer to become a Kubernetes expert" },
    { text: "Treating internal infrastructure as a product whose customers are developers — providing golden paths (opinionated, supported, end-to-end defaults) and self-service within guardrails, so teams ship safely without re-solving infra each time" },
    { text: "Outsourcing all infrastructure to a vendor" },
    { text: "Replacing all servers with serverless functions" }
  ]}
  correct={1}
  explanation="Platform engineering packages the machinery (CI/CD, deploy, secrets, monitoring) into a paved 'golden path' so a developer scaffolds a production-ready service without deep infra expertise — fast for them, safe for the org, with the platform team's customers being the other engineers."
  revisit={{ to: "/docs/cloud/cloud-platform-engineering#platform-engineering-the-platform-is-a-product", label: "Platform engineering" }}
/>

<Question
  prompt="What do RPO and RTO measure, and how do they differ?"
  options={[
    { text: "RPO is request latency; RTO is request throughput" },
    { text: "RPO (Recovery Point Objective) is how much DATA you can lose, in time (set by replication lag/backup frequency); RTO (Recovery Time Objective) is how long you can be DOWN, in time (set by how automated failover is)" },
    { text: "They both measure CPU usage during a failover" },
    { text: "RPO is for databases only; RTO is for frontends only" }
  ]}
  correct={1}
  explanation="RPO bounds acceptable data loss (drive it down with more frequent/synchronous replication); RTO bounds acceptable downtime (drive it down with automated failover). Naming both per system turns 'be resilient' into a priced engineering target."
  revisit={{ to: "/docs/cloud/cloud-platform-engineering#rpo-and-rto-decide-your-loss-before-the-outage", label: "RPO / RTO" }}
/>

<Question
  prompt="What's the trade-off between active-passive and active-active multi-region setups?"
  options={[
    { text: "Active-active is always cheaper and simpler" },
    { text: "Active-passive keeps a standby region you fail over to — cheaper, with non-instant recovery; active-active serves both regions live for near-zero downtime but forces you to solve cross-region data consistency/conflict and costs more" },
    { text: "Active-passive can't survive any outage" },
    { text: "They are the same thing at different prices" }
  ]}
  correct={1}
  explanation="Active-passive is cheaper but recovery takes a failover; active-active survives a region loss with little downtime but inherits hard cross-region consistency problems (replication/consensus) and higher cost. Pick deliberately against your RPO/RTO and budget."
  revisit={{ to: "/docs/cloud/cloud-platform-engineering#resilient-architecture-surviving-a-region-outage", label: "Multi-region" }}
/>

</Quiz>

## What's next

→ You've finished the cloud chapter — including the senior layer of platform engineering and resilience. Take the [Chapter 5 checkpoint](./cloud-checkpoint), then continue to [Chapter 6: Site Reliability & Operations](/docs/operations) — keeping all of this alive and healthy in production.
