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

## What's next

→ Continue to [Realistic Time Investment](./time-investment) where we'll look at how long indie SaaS v1s actually take.
