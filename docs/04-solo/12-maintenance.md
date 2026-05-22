---
id: maintenance
title: 'Phase 10: Maintenance'
sidebar_position: 13
sidebar_label: 12. Maintenance
description: Once shipped, the work changes — watch Sentry, reply to users, merge Dependabot, watch the bills. Performance and costs both stay small if you let them.
---

# Phase 10: Maintenance

> **In one line:** Once shipped, the work shifts from building to watching, replying, and iterating. The hardest discipline is *not* accumulating a half-built backlog.

:::tip[In plain English]
Maintenance isn't glamorous, but it's where projects either survive or die. Half-built backlog items rot; ignored error reports compound; angry users become churned users. The fix is a small weekly routine — fifteen minutes of looking at the right dashboards — that catches almost everything before it becomes a crisis.
:::

## Regular Maintenance

Once shipped, the work changes:

- **Watch Sentry weekly** for new error patterns.
- **Watch your Stripe dashboard** for failed payments.
- **Reply to user emails promptly** — early users are gold.
- **Merge Dependabot PRs** weekly (or daily, with caution).
- **Back up data** — most managed databases (Neon, Supabase) auto-backup, but check your settings.

## Adding Features

Use the same loop: pick one feature, build it end-to-end, ship it. Don't accumulate a half-built backlog.

## Performance

Most personal projects don't have performance problems. If they do:
- Check the slow query log in Neon/Supabase.
- Add indexes on columns you filter/sort on.
- Add caching with `unstable_cache` (Next.js) or Redis.
- Optimize images with Next.js `<Image>`.

## Costs

Watch your bills. A typical personal project at low traffic:

| Item                   | Cost/month       |
|------------------------|------------------|
| Domain (annualized)    | $1               |
| Vercel (free tier)     | $0               |
| Neon (free tier)       | $0               |
| Clerk (up to 10K MAU)  | $0               |
| Sentry (free tier)     | $0               |
| Stripe (per transaction)| variable        |
| **Total**              | **~$1/month**    |

If you grow beyond free tiers:

| Item                   | Cost/month       |
|------------------------|------------------|
| Vercel Hobby → Pro     | $20              |
| Neon Pro               | $19              |
| Clerk paid             | $25–100          |
| Sentry Team            | $26              |
| Better Stack           | $24              |
| Total at small scale   | $100–200         |

Still trivial for a project earning anything meaningful.

:::note[Try it yourself]
Schedule a recurring 15-minute calendar block, once a week, called "ShelfTrack tending." In that block:

1. Open Sentry — scan for new issues. Triage one if there is one.
2. Open Stripe — check for failed charges or chargebacks.
3. Open your inbox — reply to user emails (even just "got it, looking into it").
4. Open your GitHub PRs page — merge any Dependabot updates that look safe.

Fifteen minutes, once a week. That's the whole maintenance routine for a small SaaS until you have hundreds of users.
:::

:::info[Highlight: early users are disproportionately valuable]
At a big company, one customer is one of millions. For your indie project, one of your first ten users is *ten percent of your user base*. Reply to their emails. Ask them questions. Ship the feature they asked about. Treat them like co-founders, because that's basically what they are.
:::

## Page checkpoint

<Quiz id="solo-maintenance-page" title="Did the maintenance routine stick?" sampleSize={2}>

<Question
  prompt="What's the suggested weekly maintenance routine for a small solo SaaS?"
  options={[
    { text: "A full Saturday of code review" },
    { text: "A 15-minute block: Sentry, Stripe, inbox, Dependabot" },
    { text: "Two hours of refactoring legacy code" },
    { text: "A daily standup with yourself" }
  ]}
  correct={1}
  explanation="Fifteen minutes a week is enough until you have hundreds of users. Triage one Sentry issue, check Stripe for failed charges, reply to user emails, merge safe Dependabot PRs."
  revisit={{ to: "/docs/solo/maintenance#regular-maintenance", label: "Weekly routine" }}
/>

<Question
  prompt="Why are early users disproportionately valuable?"
  options={[
    { text: "They pay more than later users" },
    { text: "One of your first ten users is 10% of your user base" },
    { text: "They give five-star reviews automatically" },
    { text: "They count more in SEO rankings" }
  ]}
  correct={1}
  explanation="At a big company one customer is one in millions; for your indie project they're 10% of the user base. Reply to their emails, ask questions, ship their requests — treat them like co-founders."
  revisit={{ to: "/docs/solo/maintenance#regular-maintenance", label: "Early users matter" }}
/>

<Question
  prompt="At low traffic with the default stack, what's the typical monthly cost?"
  options={[
    { text: "About $1 per month (mostly the domain)" },
    { text: "About $50 per month" },
    { text: "About $200 per month" },
    { text: "About $1000 per month" }
  ]}
  correct={0}
  explanation="The table shows the domain (~$1/month annualized) plus free tiers on Vercel, Neon, Clerk, and Sentry. Stripe fees are per-transaction. Total is about $1/month at low traffic."
  revisit={{ to: "/docs/solo/maintenance#costs", label: "Cost table" }}
/>

<Question
  prompt="What's the first thing to check when a personal project actually has a performance problem?"
  options={[
    { text: "Switch to a faster framework" },
    { text: "Add Redis caching everywhere" },
    { text: "Check the slow query log in Neon/Supabase" },
    { text: "Rewrite the frontend in Svelte" }
  ]}
  correct={2}
  explanation="Most performance problems are database queries missing an index. Check the slow query log first, add indexes on the columns you filter/sort on, then consider caching and image optimization if needed."
  revisit={{ to: "/docs/solo/maintenance#performance", label: "Performance" }}
/>

</Quiz>

## What's next

→ Continue to [Realistic Time Investment](./time-investment) where we'll look at how long indie SaaS v1s actually take.
