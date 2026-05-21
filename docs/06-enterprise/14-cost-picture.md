---
id: cost-picture
title: A Realistic Cost Picture
sidebar_position: 15
sidebar_label: 14. Cost Picture
description: What enterprise cloud infrastructure actually costs — compute, storage, observability, third-party SaaS — and how it compares to payroll.
---

# A Realistic Cost Picture

> **In one line:** Cloud infrastructure for a major SaaS or consumer product runs $2M–$50M+ per month — but engineering payroll dwarfs that, often 3–5x larger.

:::tip In plain English
The shock isn't how big enterprise cloud bills are — it's how *small* they are relative to payroll. Even a $30 million-per-month AWS bill is a fraction of what the same company pays its engineers.

This shapes every cost decision: it's almost always worth spending more on infrastructure to save engineering time. A team of ten engineers costs more per year than a fully-utilized $10M Kubernetes cluster.
:::

## Approximate monthly costs

| Category                          | Approximate monthly cost  |
|-----------------------------------|---------------------------|
| Compute (EKS, EC2, etc.)          | $1M–$30M+                 |
| Storage and data transfer         | $500K–$10M                |
| Databases (RDS, Spanner, etc.)    | $500K–$10M                |
| Observability (Datadog, Splunk)   | $200K–$5M                 |
| CDN (Cloudflare, Akamai)          | $100K–$5M                 |
| Third-party SaaS (GitHub Enterprise, JetBrains, security tools) | $100K–$2M |
| **Total cloud + tools**           | **$2M–$50M+/month**       |

The ranges are wide because enterprise scales vary by orders of magnitude. A regional bank and a global social network can both be "enterprises" and have wildly different bills.

## People dominate

Engineering payroll dwarfs infrastructure: a 1,000-engineer org costs $300M+/year in fully-loaded compensation. Infrastructure is typically 20–30% of total tech spend; sometimes higher for data-heavy companies.

:::info Highlight: the FinOps insight
The most important FinOps insight is that engineering time is your most expensive resource by a wide margin. That means:

- A tool that costs $500K/year but saves each of your 1,000 engineers an hour a week is a *massive* win.
- Reserved capacity that locks in a 30% discount is usually worth the inflexibility.
- A 2x more expensive database that's 5x easier to operate is almost certainly the right choice.

People who treat the cloud bill in isolation make decisions that cost the company net money. People who optimize the total — infra + engineering time — make the right call almost every time.
:::

## Where the spend really goes

A few patterns hold across most enterprises:

- **Compute is the largest line item** at most scales. Kubernetes clusters, EC2 fleets, ML training, batch jobs.
- **Observability is shockingly expensive** at high data volumes. Datadog and Splunk bills in the millions per month are routine.
- **Third-party SaaS adds up** — GitHub Enterprise, JetBrains, security tools, monitoring add-ons, productivity SaaS. Easy to forget; nontrivial in aggregate.
- **Data egress is a hidden tax** — moving data out of AWS to other providers or to users via non-CDN paths can be a major line item.

:::note Worked example: should we self-host Datadog?
A common enterprise question: our Datadog bill is $4M/year. Should we self-host Prometheus + Grafana + Loki + Tempo to save money?

The naive math: "We could run that on $400K/year of EC2." But:

- An open-source observability stack at this scale needs a dedicated team of ~5 engineers to keep running. That's ~$3M/year fully loaded.
- You lose features Datadog ships continuously (anomaly detection, ML-based alerting, integrations).
- You take on the on-call burden for your own observability platform — which is itself critical infrastructure.

Net: self-hosting "saves $3.6M" and costs $3M+ in headcount, *plus* features lost, *plus* risk. Usually a wash or worse. Most enterprises that *do* self-host are at a scale where they need features the SaaS doesn't offer — not because it's cheaper.
:::

## What's next

→ Continue to [Common Pitfalls Even at This Scale](./pitfalls) — what still goes wrong even with all this investment.
