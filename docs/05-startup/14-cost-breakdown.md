---
id: cost-breakdown
title: A Realistic Cost Breakdown
sidebar_position: 15
sidebar_label: 14. Cost Breakdown
description: What a startup at ~$1M ARR and ~5,000 active users actually spends on infrastructure each month — and why it's noise next to payroll.
---

# A Realistic Cost Breakdown

> **In one line:** $500–$3,500/month covers the entire stack for a startup at $1M ARR. That's noise next to a single engineer's payroll.

:::tip In plain English
The conversation about hosting and tooling bills sounds dramatic until you compare it to people costs. A mid-level engineer is fifteen to twenty-five thousand dollars a month, fully loaded. Your *entire* infrastructure bill at startup scale is rarely more than two thousand. That math is the whole reason "buy, don't build" wins at this stage.
:::

## A startup at ~$1M ARR with ~5,000 active users

For a startup at ~$1M ARR with ~5,000 active users:

| Item                  | Monthly Cost     | Notes                            |
|-----------------------|------------------|----------------------------------|
| Vercel Team           | $20–500          | Scales with bandwidth & functions |
| Supabase Pro          | $25–500          | Scales with DB size + bandwidth  |
| Clerk                 | $25–300          | Per-MAU pricing                  |
| Sentry                | $30–200          | Per-event pricing                |
| PostHog               | $0–300           | Generous free tier               |
| Better Stack          | $30–100          | Logs + uptime + on-call          |
| Trigger.dev / Inngest | $20–200          | Background jobs                  |
| Resend                | $20–100          | Email volume                     |
| Stripe                | 2.9% + 30¢/txn   | Revenue-based                    |
| GitHub Team           | $4/user          | $40 for 10 engineers             |
| Linear                | $8/user          | $80 for 10 engineers             |
| Doppler               | $0–20/user       | Secrets                          |
| Vanta (if SOC 2)      | $300–1,000       | Compliance platform              |
| Domain + misc         | $20              |                                  |
| **Total**             | **$500–$3,500**  | Negligible vs payroll            |

For comparison, a single mid-level engineer costs $15–25K/month fully loaded. Infrastructure costs at this scale are noise.

:::note Worked example: trading infra cost for engineer time
A team debates whether to "save money" by self-hosting Postgres instead of paying $200/month for Supabase Pro. The math:

- **Self-hosted Postgres:** ~$50/month for a VM + storage. But: someone has to set up backups (~1 day to do well), monitor disk space, handle Postgres upgrades, configure connection pooling, troubleshoot when it falls over. Realistically that's 4–8 engineer-hours per month, perpetually.
- **Supabase Pro:** $200/month. Backups, monitoring, pooling, upgrades all handled. ~0 engineer-hours per month.

If an engineer costs $150/hour fully loaded, the "savings" of self-hosting are *negative* — you're spending $600–$1,200/month in engineer time to save $150 in infrastructure. The Supabase math is obviously right.

This pattern repeats across every managed service.
:::

:::info Highlight: when costs *do* matter
Infra costs become non-noise once you're at hundreds of thousands of MAUs *or* when a specific service has a runaway line item (Vercel bandwidth spikes, PostHog event volume). The trigger isn't "we should save money in general" — it's "this one bill grew 5x and we can't explain it." Then you investigate and optimize the specific line. The rest you leave alone.
:::

## What's next

→ Continue to [Sample Day-in-the-Life](./day-in-life) for a concrete picture of what a startup engineer's day actually looks like.
