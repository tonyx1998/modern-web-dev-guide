---
id: cost-breakdown
title: A Realistic Cost Breakdown
sidebar_position: 15
sidebar_label: 14. Cost Breakdown
description: What a startup at ~$1M ARR and ~5,000 active users actually spends on infrastructure each month — and why it's noise next to payroll.
---

# A Realistic Cost Breakdown

> **In one line:** $500–$3,500/month covers the entire stack for a startup at $1M ARR. That's noise next to a single engineer's payroll.

:::tip[In plain English]
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

:::note[Worked example: trading infra cost for engineer time]
A team debates whether to "save money" by self-hosting Postgres instead of paying $200/month for Supabase Pro. The math:

- **Self-hosted Postgres:** ~$50/month for a VM + storage. But: someone has to set up backups (~1 day to do well), monitor disk space, handle Postgres upgrades, configure connection pooling, troubleshoot when it falls over. Realistically that's 4–8 engineer-hours per month, perpetually.
- **Supabase Pro:** $200/month. Backups, monitoring, pooling, upgrades all handled. ~0 engineer-hours per month.

If an engineer costs $150/hour fully loaded, the "savings" of self-hosting are *negative* — you're spending $600–$1,200/month in engineer time to save $150 in infrastructure. The Supabase math is obviously right.

This pattern repeats across every managed service.
:::

:::info[Highlight: when costs *do* matter]
Infra costs become non-noise once you're at hundreds of thousands of MAUs *or* when a specific service has a runaway line item (Vercel bandwidth spikes, PostHog event volume). The trigger isn't "we should save money in general" — it's "this one bill grew 5x and we can't explain it." Then you investigate and optimize the specific line. The rest you leave alone.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Spending an engineer-week to shave $80/month off Vercel.** A senior engineer's time is roughly $1,000/day. A multi-week migration to save under $100/month never pays back at this stage. Track hours-spent-saving-dollars and you'll catch this fast.
- **Not setting *any* billing alerts.** The first time you'll learn about runaway costs is the invoice — usually two weeks after the spike started. Every paid service should have alerts at 2x, 5x, and 10x your normal spend, on day one.
- **Confusing seat-based costs for usage costs.** Adding 10 engineers triples your Linear, GitHub, Notion, and Vanta bills overnight in a way Vercel's per-request pricing never will. Plan headcount with a "tooling cost per seat" line item.
- **Optimizing the cheap bills and ignoring the expensive ones.** Founders love agonizing over a $40 Sentry tier while a $1,800/month observability vendor renews quietly. Sort the bills by absolute dollars, not by emotional weight, before deciding what to cut.
- **Reading the AI bill as fixed.** GenAI line items (OpenAI, Anthropic, embeddings) are increasingly the largest variable cost in a 2026 startup. Treat them like compute — cache aggressively, choose smaller models for routine work, and audit token spend quarterly the same way you audit Postgres.
:::

## Page checkpoint

<Quiz id="startup-cost-breakdown-page" title="Did the cost breakdown stick?" sampleSize={3}>

<Question
  prompt="What range does the page give for a typical $1M ARR startup's total monthly infrastructure bill?"
  options={[
    { text: "$10-$50 per month — basically free" },
    { text: "$500-$3,500 per month across the entire managed stack" },
    { text: "$25,000-$50,000 per month" },
    { text: "$200,000+ per month" }
  ]}
  correct={1}
  explanation="The whole managed stack — Vercel, Supabase, Clerk, Sentry, PostHog, Better Stack, background jobs, email, source control, project management, secrets — typically totals $500-$3,500/month at $1M ARR with ~5,000 active users."
  revisit={{ to: "/docs/startup/cost-breakdown#a-startup-at-1m-arr-with-5000-active-users", label: "Total monthly cost" }}
/>

<Question
  prompt="Why does the page argue infrastructure costs are usually noise at this scale?"
  options={[
    { text: "Cloud providers offer unlimited free tiers" },
    { text: "A single mid-level engineer at $15-25K/month dwarfs the entire managed stack bill" },
    { text: "Most startups don't actually use any paid services" },
    { text: "Revenue grows faster than any conceivable infrastructure spend" }
  ]}
  correct={1}
  explanation="Fully-loaded engineer cost ($15-25K/month) is roughly 5-50x the entire managed-stack bill. That ratio is the whole reason buy-don't-build wins at this stage."
  revisit={{ to: "/docs/startup/cost-breakdown#a-startup-at-1m-arr-with-5000-active-users", label: "Costs vs payroll" }}
/>

<Question
  prompt="In the self-hosted Postgres worked example, why is the apparent savings actually negative?"
  options={[
    { text: "Self-hosted databases lose data more often" },
    { text: "The 4-8 engineer-hours per month spent on backups, upgrades, and pooling cost more than the $200/month Supabase fee" },
    { text: "Cloud Postgres is always cheaper than self-hosted" },
    { text: "Supabase offers a permanent free tier that makes the math irrelevant" }
  ]}
  correct={1}
  explanation="At $150/hour fully loaded, 4-8 monthly engineer-hours on a self-hosted Postgres is $600-$1,200 to save $150 in infra. The math is firmly against self-hosting once you value engineer time."
  revisit={{ to: "/docs/startup/cost-breakdown#a-startup-at-1m-arr-with-5000-active-users", label: "Trading infra for engineer time" }}
/>

<Question
  prompt="When does the page say infrastructure costs do start to matter and warrant investigation?"
  options={[
    { text: "When a CFO randomly asks about it" },
    { text: "When you're at hundreds of thousands of MAUs, or one specific line item grows 5x with no explanation" },
    { text: "Whenever the total bill exceeds $100/month" },
    { text: "Never — costs always remain noise" }
  ]}
  correct={1}
  explanation="Investigate when you cross into hundreds of thousands of MAUs, or when one specific service spikes 5x unexpectedly. The trigger is a specific, unexplained line item — not a general we should save money initiative."
  revisit={{ to: "/docs/startup/cost-breakdown#a-startup-at-1m-arr-with-5000-active-users", label: "When costs matter" }}
/>

</Quiz>

## What's next

→ Continue to [Sample Day-in-the-Life](./day-in-life) for a concrete picture of what a startup engineer's day actually looks like.
