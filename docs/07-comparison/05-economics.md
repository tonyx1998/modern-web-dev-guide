---
id: economics
title: Cost Profile and Time-to-Production
sidebar_position: 6
sidebar_label: 5. Economics
description: Monthly infrastructure costs and how long different change types take to reach users at each scale.
---

# Cost Profile and Time-to-Production

> **In one line:** Solo projects run on $1–$20/month and ship typo fixes in 2 minutes; startups spend $500–$5K/month and ship them in 10–30 minutes; enterprises spend $2M–$50M+/month and ship them in 1–4 hours.

:::tip[In plain English]
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

:::info[Highlight: the optimal cost decision is almost never the cheapest infra]
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

:::note[Worked example: where the enterprise time actually goes]
Suppose you're tracking a "small feature" at three scales — say, "add a CSV export button to the dashboard":

- **Solo (1 hour):** Code (40 min) → push → live.
- **Startup (4 hours):** Code (2 hr) → PR + review (1 hr) → merge + deploy (10 min) → smoke test (50 min).
- **Enterprise (3 days):**
  - Day 1: Design discussion (1 hr) + code (4 hr) + draft PR.
  - Day 2: Two reviewers + CODEOWNERS (cumulative 1 day waiting), security check (CSV export = data exfil concern), accessibility check on new button.
  - Day 3: Merge → CI (10 min) → canary at 1% → 10% → 50% → 100% over the course of the day.

The actual *coding* takes the same 2–4 hours at every scale. The 30x slowdown at enterprise scale is almost entirely review and rollout gates — and almost all of those gates exist because some past incident proved they were needed.
:::

## Page checkpoint

<Quiz id="comparison-economics-page" title="Did economics across scales stick?" sampleSize={2}>

<Question
  prompt="At every scale, what is the dominant cost — and what does that imply for infra decisions?"
  options={[
    { text: "Infrastructure dominates spend, so you should always pick the cheapest hosting option" },
    { text: "People dominate spend, so the cheapest infra option is almost never the cheapest total option" },
    { text: "Compliance dominates spend at startups, infra dominates at enterprises" },
    { text: "Marketing dominates spend, making engineering economics irrelevant" }
  ]}
  correct={1}
  explanation="At every scale, infrastructure is a small slice of total spend — people dominate. That means paying $20/month for managed Postgres or $4M/year for Datadog is usually cheaper than the engineering time you'd burn self-hosting."
  revisit={{ to: "/docs/comparison/economics#cost-profile", label: "Cost Profile" }}
/>

<Question
  prompt="In the CSV export worked example, where does the 30x time difference between solo and enterprise actually come from?"
  options={[
    { text: "Enterprises write the same feature 30x slower because the code is harder" },
    { text: "Enterprises run 30x more unit tests, which dominates the elapsed time" },
    { text: "The coding takes roughly the same 2–4 hours at every scale — the slowdown is almost entirely review and rollout gates" },
    { text: "Enterprises rewrite the feature in a different language for compliance" }
  ]}
  correct={2}
  explanation="The actual coding is comparable at every scale. The 30x slowdown is review queues, CODEOWNERS waits, security and accessibility checks, and a staged canary rollout — gates that exist because past incidents proved they were needed."
  revisit={{ to: "/docs/comparison/economics#time-to-production", label: "Where the enterprise time goes" }}
/>

<Question
  prompt="What are typical total monthly infrastructure costs across the three scales?"
  options={[
    { text: "Solo: ~$500. Startup: ~$50K. Enterprise: ~$5M" },
    { text: "Solo: $1–$20. Startup: $500–$5,000. Enterprise: $2M–$50M+" },
    { text: "Solo: free. Startup: $100. Enterprise: $100K" },
    { text: "All three sit in the $1K–$10K/month range; only payroll changes" }
  ]}
  correct={1}
  explanation="Typical infra totals are $1–$20/month for solo, $500–$5,000/month for a startup, and $2M–$50M+/month for an enterprise. Engineering payroll dwarfs infra at every scale."
  revisit={{ to: "/docs/comparison/economics#cost-profile", label: "Cost Profile" }}
/>

<Question
  prompt="What is the main reason a typo fix takes 1–4 hours at an enterprise versus 2 minutes for a solo dev?"
  options={[
    { text: "Enterprise CI compilers are much slower than Vercel" },
    { text: "Enterprises don't have GitHub access, so deploys go through email" },
    { text: "Layered process — reviews, security checks, canary rollouts, compliance gates — each born from a past incident" },
    { text: "Enterprises always wait for a weekly release train regardless of urgency" }
  ]}
  correct={2}
  explanation="The 10–100x slowdown comes from the surrounding process at enterprise scale: reviews, security checks, canary rollouts, and compliance gates. Each gate exists because some past incident showed why it was necessary."
  revisit={{ to: "/docs/comparison/economics#time-to-production", label: "Time-to-Production" }}
/>

</Quiz>

## What's next

→ Continue to [Trade-Offs](./tradeoffs) — the characteristic trade-offs and career implications at each scale.
