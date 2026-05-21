---
id: economics
title: Cost Profile and Time-to-Production
sidebar_position: 6
sidebar_label: 5. Economics
description: Monthly infrastructure costs and how long different change types take to reach users at each scale.
---

# Cost Profile and Time-to-Production

> **In one line:** Solo projects run on $1–$20/month and ship typo fixes in 2 minutes; startups spend $500–$5K/month and ship them in 10–30 minutes; enterprises spend $2M–$50M+/month and ship them in 1–4 hours.

:::tip In plain English
The two most concrete differences between scales are *how much money it costs to run* and *how long it takes to change*. Both increase dramatically with scale, but in different ways.

Cost grows roughly linearly with traffic and headcount; time-to-production grows because of the process layered on top to make change safe at scale. A solo dev's bottleneck is "did I think of the bug?" An enterprise's bottleneck is "did every gate sign off on the change?"
:::

## Cost Profile

| Category                | Personal         | Small Company           | Large Company                   |
|-------------------------|------------------|-------------------------|---------------------------------|
| **Hosting**             | $0–$20/month     | $20–$500/month          | $1M–$30M+/month                 |
| **Database**            | $0–$20/month     | $25–$500/month          | $500K–$10M/month                |
| **Observability**       | $0/month         | $30–$300/month          | $200K–$5M/month                 |
| **Auth**                | $0/month         | $25–$300/month          | $50K–$500K/month (Okta etc.)    |
| **Email**               | $0–$20/month     | $20–$100/month          | $50K–$500K/month                |
| **CI/CD**               | $0/month         | $0–$50/month            | $50K–$500K/month                |
| **Tooling (GitHub, Linear, etc.)** | $0–$20/month | $200–$2,000/month | $100K–$1M/month                  |
| **Total infra**         | $1–$20/month     | $500–$5,000/month       | $2M–$50M+/month                 |
| **Engineering payroll** | N/A              | $50K–$5M/year           | $300M+/year                     |

The pattern: infrastructure is a small percentage of total spend at every scale, dominated by people costs.

For the enterprise deep dive, see [A Realistic Cost Picture](/docs/enterprise/cost-picture).

:::info Highlight: the optimal cost decision is almost never the cheapest infra
At every scale, the dominant cost is people, not infrastructure. That means:

- **Solo:** Pay $20/month for managed Postgres instead of running it on a $5 VPS. Your time is worth more than $15/month.
- **Startup:** Pay $200/month for Vercel Pro instead of self-hosting on AWS. One engineer's time saved easily covers it.
- **Enterprise:** Pay $4M/year for Datadog instead of self-hosting the equivalent. Avoiding the ~5-engineer team to operate self-hosted observability saves more than the SaaS bill.

The cheapest infra option is almost never the cheapest *total* option once you count engineering time.
:::

## Time-to-Production

How long it takes a code change to reach users:

| Change Type         | Personal           | Small Company           | Large Company                   |
|---------------------|--------------------|------------------------|---------------------------------|
| **Typo fix**        | 2 minutes          | 10 minutes             | 1–4 hours                       |
| **Bug fix**         | 10 minutes         | 30 minutes – 2 hours   | 2 hours – 1 day                 |
| **Small feature**   | 1 hour             | Few hours              | Days (with reviews + tests)     |
| **Major feature**   | 1 day              | 1–2 weeks              | Weeks to months                 |
| **Architecture change** | Hours          | Days to weeks          | Months                          |
| **New service**     | N/A                | Days                   | Weeks (with platform onboarding)|

The 10–100x slowdown at enterprise scale comes from the surrounding process: reviews, security checks, canary rollouts, compliance gates. Each gate exists because some past incident showed why it was necessary.

:::note Worked example: where the enterprise time actually goes
Suppose you're tracking a "small feature" at three scales — say, "add a CSV export button to the dashboard":

- **Solo (1 hour):** Code (40 min) → push → live.
- **Startup (4 hours):** Code (2 hr) → PR + review (1 hr) → merge + deploy (10 min) → smoke test (50 min).
- **Enterprise (3 days):**
  - Day 1: Design discussion (1 hr) + code (4 hr) + draft PR.
  - Day 2: Two reviewers + CODEOWNERS (cumulative 1 day waiting), security check (CSV export = data exfil concern), accessibility check on new button.
  - Day 3: Merge → CI (10 min) → canary at 1% → 10% → 50% → 100% over the course of the day.

The actual *coding* takes the same 2–4 hours at every scale. The 30x slowdown at enterprise scale is almost entirely review and rollout gates — and almost all of those gates exist because some past incident proved they were needed.
:::

## What's next

→ Continue to [Trade-Offs](./tradeoffs) — the characteristic trade-offs and career implications at each scale.
