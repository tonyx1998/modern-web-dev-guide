---
id: cost-picture
title: A Realistic Cost Picture
sidebar_position: 15
sidebar_label: 14. Cost Picture
description: What enterprise cloud infrastructure actually costs — compute, storage, observability, third-party SaaS — and how it compares to payroll.
---

# A Realistic Cost Picture

> **In one line:** Cloud infrastructure for a major SaaS or consumer product runs $2M–$50M+ per month — but engineering payroll dwarfs that, often 3–5x larger.

:::tip[In plain English]
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

:::info[Highlight: the FinOps insight]
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

:::note[Worked example: should we self-host Datadog?]
A common enterprise question: our Datadog bill is $4M/year. Should we self-host Prometheus + Grafana + Loki + Tempo to save money?

The naive math: "We could run that on $400K/year of EC2." But:

- An open-source observability stack at this scale needs a dedicated team of ~5 engineers to keep running. That's ~$3M/year fully loaded.
- You lose features Datadog ships continuously (anomaly detection, ML-based alerting, integrations).
- You take on the on-call burden for your own observability platform — which is itself critical infrastructure.

Net: self-hosting "saves $3.6M" and costs $3M+ in headcount, *plus* features lost, *plus* risk. Usually a wash or worse. Most enterprises that *do* self-host are at a scale where they need features the SaaS doesn't offer — not because it's cheaper.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Optimizing the cloud bill while ignoring the payroll bill.** A team spending two engineer-weeks to save $5K/month on EC2 just lost the company money. Always compare the saving against fully-loaded engineering time — that's the math FinOps actually cares about.
- **Self-hosting open-source "to save money."** Every self-host story starts with the savings spreadsheet and ends with a five-engineer team running critical infrastructure on the side. If the SaaS bill terrifies you, negotiate the contract before you rebuild the product.
- **Letting observability spend grow unbounded because "we need the data."** Petabyte-scale logging will eat your second-largest line item before you notice. Set retention policies, sample high-volume services, and treat the observability bill like the database bill — actively managed, not "whatever it costs."
- **Chargeback without consequences.** If teams see their cloud bill on a dashboard but no one's budget is affected, the dashboard is a feel-good chart. Either tie chargeback to real budget pressure or accept that cost discipline will only happen during a panic.
- **Cutting reserved capacity to "stay flexible."** Three-year RIs and savings plans on the workloads you genuinely won't shrink are free money you're declining. Run a quarterly review — anything stable for 12+ months should be on committed capacity.
:::

## Page checkpoint

<Quiz id="enterprise-cost-picture-page" title="Did the cost picture stick?" sampleSize={3}>

<Question
  prompt="At enterprise scale, how does engineering payroll compare to cloud infrastructure spend?"
  options={[
    { text: "Cloud spend is typically 5–10x larger than payroll" },
    { text: "They're roughly equal" },
    { text: "Payroll dwarfs infrastructure — often 3–5x larger, even at a $30M/month cloud bill" },
    { text: "Payroll is usually only 10% of total tech spend" }
  ]}
  correct={2}
  explanation="The shock isn't how big enterprise cloud bills are — it's how small they are relative to payroll. A 1,000-engineer org costs $300M+/year in fully-loaded comp, while a $30M/month AWS bill is a fraction of that. Infrastructure is typically 20–30% of total tech spend."
  revisit={{ to: "/docs/enterprise/cost-picture#people-dominate", label: "People dominate" }}
/>

<Question
  prompt="What is the central FinOps insight the page argues for?"
  options={[
    { text: "Always pick the cheapest infrastructure option" },
    { text: "Engineering time is your most expensive resource by a wide margin — it's almost always worth spending more on infra to save engineering hours" },
    { text: "Only optimize the top three cost line items" },
    { text: "Always self-host to control costs" }
  ]}
  correct={1}
  explanation="A $500K/year tool that saves 1,000 engineers an hour a week is a massive win. People who treat the cloud bill in isolation make decisions that cost the company net money; people who optimize total cost (infra + engineering time) make the right call almost every time."
  revisit={{ to: "/docs/enterprise/cost-picture#people-dominate", label: "FinOps insight" }}
/>

<Question
  prompt="The worked example concludes that self-hosting Datadog usually isn't worth it. Why?"
  options={[
    { text: "Datadog is the cheapest SaaS on the market" },
    { text: "Open-source observability at scale needs ~5 dedicated engineers (~$3M/year), and you lose features and take on on-call burden — usually a wash or worse" },
    { text: "Datadog has an exclusivity contract" },
    { text: "Self-hosting is technically impossible at scale" }
  ]}
  correct={1}
  explanation="The naive math says self-hosting saves $3.6M. The real math includes ~$3M in headcount for a dedicated observability team, lost features (anomaly detection, ML alerting), and the on-call burden of running your own critical infrastructure. Usually a wash or worse."
  revisit={{ to: "/docs/enterprise/cost-picture#worked-example", label: "Self-host trade-off" }}
/>

<Question
  prompt="Which line item is described as 'shockingly expensive' at high data volumes?"
  options={[
    { text: "Compute (EKS, EC2)" },
    { text: "Storage" },
    { text: "Observability (Datadog, Splunk) — millions per month are routine" },
    { text: "CDN" }
  ]}
  correct={2}
  explanation="Observability bills in the millions per month are routine at large scale. The volume of metrics, logs, and traces from hundreds of services adds up fast — which is why log sampling, trace sampling, and retention policies become real engineering decisions, not afterthoughts."
  revisit={{ to: "/docs/enterprise/cost-picture#where-the-spend-really-goes", label: "Spend patterns" }}
/>

</Quiz>

## What's next

→ Continue to [Common Pitfalls Even at This Scale](./pitfalls) — what still goes wrong even with all this investment.
