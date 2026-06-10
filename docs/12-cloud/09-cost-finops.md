---
id: cloud-cost
title: Cost & FinOps
sidebar_position: 10
sidebar_label: Cost & FinOps
description: How cloud pricing actually works, the five line items that surprise everyone (egress, NAT, idle, storage tiers, cross-AZ), and the levers that control spend.
---

# Cost & FinOps

> **In one line:** The cloud bill surprises people not because compute is expensive but because of the *invisible* line items — data egress, NAT processing, idle resources, and cross-AZ traffic — and FinOps is the discipline of making spend visible (tags, budgets, alerts) and then pulling the few levers that actually move it.

:::tip[In plain English]
Cloud pricing is pay-per-use, which sounds simple and isn't, because you're billed for *dozens* of dimensions you can't see while coding — not just "the server," but every gigabyte that leaves the cloud, every hour an idle thing exists, every cross-zone hop, every API call to storage. The classic story is a startup whose bill triples and nobody knows why; the answer is almost always one of five culprits below. The job, called **FinOps**, is two halves: (1) make the bill *legible* — tag everything, set budgets, get alerts — so you can see where money goes, and (2) pull the handful of levers (right-size, schedule-off, commit-for-discount, fix egress) that actually reduce it. You don't need to be cheap; you need to not be *surprised*.
:::

## How pricing actually works

Three pricing models stack across most services:

| Model | What it is | Tradeoff |
|---|---|---|
| **On-demand** | Pay per second/hour/request, no commitment | Most flexible, most expensive per unit |
| **Committed (Reserved / Savings Plans / CUDs)** | Commit to 1–3 years of usage for ~30–70% off | Big discount, but you pay even if usage drops |
| **Spot / Preemptible** | Bid on spare capacity for up to ~90% off | Can be reclaimed with ~2 min notice — only for interruptible work |

The pro pattern: cover your **steady baseline** with commitments (you know you'll run *something* 24/7 for a year — pay less for it), serve **variable load** on-demand, and run **fault-tolerant batch** (CI, data processing, ML training) on spot for up to 90% off. Mixing these is where the big savings live, and it requires zero code change.

## The five bills that surprise everyone

**1. Data egress (the big one).** Getting data *into* the cloud is usually free. Getting it *out* — to users, to the internet, to another region — costs per GB, and it adds up shockingly fast for media-heavy or high-traffic apps. This is also the cloud's lock-in mechanism: leaving is expensive because you pay to move your data out.
- *Lever:* put a **CDN** in front of anything served to users (CDN egress is far cheaper and cached); keep traffic inside one region; use [VPC endpoints](./cloud-networking) so AWS-service traffic doesn't route out and back.

**2. NAT Gateway data processing.** Every GB your private resources send through a NAT gateway is charged *on top of* the hourly fee. A busy app pulling large dependencies or calling external APIs through NAT can rack up hundreds a month silently.
- *Lever:* VPC endpoints for AWS services (so that traffic skips the NAT), and don't route bulk traffic through NAT that doesn't need to.

**3. Idle / forgotten resources.** The single most common waste: a big instance someone launched for a test, an unattached EBS volume after a VM was deleted, an old snapshot, a load balancer for a dead service, a dev environment running nights and weekends.
- *Lever:* scheduled shutdown of non-prod (nights/weekends ≈ 70% off dev), automated cleanup of unattached volumes/old snapshots, and **scale-to-zero** options ([Cloud Run](./cloud-compute), serverless) so idle literally costs nothing.

**4. Storage that never gets tiered.** Logs, backups, and old data sitting in expensive hot-storage tiers forever.
- *Lever:* [lifecycle policies](./cloud-storage) to move cold data to cheaper classes and expire what you don't need.

**5. Cross-AZ and cross-region traffic.** Traffic between availability zones (and especially regions) is charged per GB. A chatty microservice mesh spread across AZs can quietly pay for every internal call.
- *Lever:* be aware of it in architecture; for very chatty paths, keep the talkers in the same AZ (balanced against the availability reasons to spread).

:::note[Worked example: a $9K/month bill, diagnosed]
A team's bill jumps from $3K to $9K with "no changes." Cost Explorer, grouped by service and usage type, shows: **+$2.5K data egress** (they'd launched a video feature serving files straight from S3 to users, no CDN), **+$1.8K NAT processing** (all that S3 traffic *and* image-processing dependencies routed through NAT), **+$1.2K idle** (three oversized GPU instances from an abandoned ML experiment, still running), and the rest spread across cross-AZ chatter. The fixes were a weekend: put CloudFront in front of S3 (egress drops ~80% and skips NAT), add an S3 VPC endpoint, terminate the GPU boxes, and set a budget alert. Bill back under $4K. **None of this required writing application code** — it was visibility plus four levers.
:::

## FinOps: making spend governable

The discipline (the cloud-cost analogue of [observability](/docs/foundations/observability-fundamentals)):

1. **Tag everything.** Every resource tagged with `team`, `environment`, `service`. Untagged spend is unattributable spend — you can't fix what you can't see. Enforce tags via policy in [IaC](./cloud-iac).
2. **Budgets + alerts.** Set a monthly budget per account/project with alerts at 50/80/100%. The goal is to learn about a runaway *the day it starts*, not on the invoice.
3. **Anomaly detection.** Cloud-native cost-anomaly tools flag "this service's spend is 3x its normal" automatically.
4. **Showback / chargeback.** Attribute cost back to the team that incurred it. Spend nobody owns is spend nobody optimizes.
5. **Right-size continuously.** Most instances are over-provisioned. Utilization metrics tell you which `db.r5.4xlarge` is running at 8% CPU and could be a quarter of the size.

:::info[Highlight: the most expensive resource is engineering time — spend accordingly]
It's easy to over-index on the bill and forget the other side of the ledger. Spending a senior engineer's week to shave $200/month off a $40K bill is a *loss*. The earlier chapters' advice — ship on a platform, don't prematurely adopt the cloud — is partly a cost argument: the platform premium is often *cheaper than the engineering time* the raw cloud demands, until you're big enough that the math flips. FinOps isn't "minimize the cloud bill"; it's "make spend visible and pull the high-leverage levers," while remembering that engineer-hours are usually the pricier resource. Optimize the bill where it's a quick win or a big number; don't turn it into a hobby.
:::

## When the platform→cloud cost crossover actually happens

The recurring question from earlier chapters: *when is the cloud actually cheaper than Vercel/Railway/etc.?* A rough framing:

- Below ~$1–2K/month of platform spend, the platform is almost certainly cheaper *all-in* (including your time). Stay.
- In the ~$2–20K/month range, it depends on your workload and whether you have someone who can run cloud infra. Model it honestly, including the loaded cost of the engineering time.
- Above that, dedicated cloud (with commitments) is usually meaningfully cheaper per unit — *if* you have the operational maturity to run it well. If you don't, you can spend the savings (and more) on incidents.

The mistake in both directions: migrating off a platform too early (you trade a small bill for a large time sink) or staying too long (you pour real money into convenience you've outgrown). Decide with a spreadsheet, not a vibe.

## Common mistakes

:::caution[Where people commonly trip up]
- **Ignoring egress until the bill arrives.** Serving media straight from object storage to users with no CDN is the classic egress blowup. Put a CDN in front of anything user-facing.
- **Running everything on-demand.** Your 24/7 baseline should be on a commitment (30–70% off); interruptible batch should be on spot (up to 90% off). Same workload, much smaller bill.
- **No tags, no budgets, no alerts.** You find out about a runaway on the invoice instead of the day it started. Tag everything; set budget alerts at 50/80/100%.
- **Leaving dev/test environments running 24/7.** Schedule them off nights and weekends, or make them scale to zero.
- **Forgetting unattached volumes and old snapshots.** They bill forever after the VM is gone. Automate cleanup.
- **Optimizing the bill at the expense of far-more-expensive engineering time.** Chase the big numbers and quick wins; don't spend a week to save pennies.
:::

## Page checkpoint

<Quiz id="cloud-cost-page" title="Did cost & FinOps stick?" sampleSize={3}>

<Question
  prompt="A media app's cloud bill spikes after launching a video feature served directly from object storage to users. What's the most likely culprit and the fix?"
  options={[
    { text: "Compute cost; switch to a bigger instance" },
    { text: "Data egress (per-GB charge for data leaving the cloud); put a CDN in front so most delivery is cached, cheaper egress that also skips the NAT gateway" },
    { text: "Database cost; add read replicas" },
    { text: "IAM cost; reduce the number of roles" }
  ]}
  correct={1}
  explanation="Egress — data leaving the cloud to users — is the line item that blows up for media/high-traffic apps and is largely invisible while coding. A CDN caches content at the edge with far cheaper egress and avoids routing that traffic through (also-billed) NAT gateways."
  revisit={{ to: "/docs/cloud/cloud-cost#the-five-bills-that-surprise-everyone", label: "Egress" }}
/>

<Question
  prompt="What's the pro pricing pattern for a workload with a steady 24/7 baseline plus spiky extra load plus nightly batch jobs?"
  options={[
    { text: "Run all of it on-demand for maximum flexibility" },
    { text: "Cover the baseline with committed/reserved pricing (30–70% off), serve spiky load on-demand, and run interruptible batch on spot (up to ~90% off)" },
    { text: "Put everything on spot to get the biggest discount" },
    { text: "Commit all of it to a 3-year reservation" }
  ]}
  correct={1}
  explanation="Match the pricing model to the load shape: commitments for the predictable always-on baseline, on-demand for variable bursts, and spot/preemptible for fault-tolerant batch. This mix cuts cost dramatically with no code change — putting everything on spot would break the baseline when capacity is reclaimed."
  revisit={{ to: "/docs/cloud/cloud-cost#how-pricing-actually-works", label: "Pricing models" }}
/>

<Question
  prompt="What's the FinOps reason that tagging every resource matters?"
  options={[
    { text: "Tags make resources run faster" },
    { text: "Untagged spend is unattributable — you can't see which team/service/environment is costing what, so you can't target the fix; tags make the bill legible" },
    { text: "Cloud providers require tags to launch resources" },
    { text: "Tags reduce the per-unit price of compute" }
  ]}
  correct={1}
  explanation="FinOps starts with visibility. Tagging by team/environment/service lets you attribute spend, spot which workload spiked, and do showback so the team that incurs cost owns optimizing it. Spend nobody can see is spend nobody fixes."
  revisit={{ to: "/docs/cloud/cloud-cost#finops-making-spend-governable", label: "Tag everything" }}
/>

</Quiz>

## What's next

→ Continue to [Choosing a cloud](./cloud-choosing) — AWS vs GCP vs Azure vs staying on a platform, for decisions you'll actually face.
