---
id: mindset
title: The Small Company Mindset
sidebar_position: 2
sidebar_label: 1. Mindset
description: Move fast but don't accumulate fatal mistakes. Lean on managed services. Add process only when missing it causes pain.
---

# The Small Company Mindset

> **In one line:** Move fast, but don't accumulate fatal mistakes. The whole startup workflow is calibrated to that single tension.

:::tip In plain English
At a personal-project scale, you can be sloppy because only you suffer. At an enterprise scale, process protects hundreds of people from each other. A small company sits between those two worlds — you have customers who'll churn if you break things, but you don't have enough people to justify a 14-stage release process. Everything in this chapter is about finding the middle.
:::

## The five guiding principles

The mindset sits between personal projects and enterprises:

- **Move fast, but don't accumulate fatal mistakes.** Pick technologies that scale to 100K users without rewrites; design schemas you can extend without painful migrations.
- **Lean on managed services.** Time spent operating infrastructure is time not spent on product. Vercel, Supabase, Clerk, Stripe — they're cheaper than another engineer.
- **Process exists to enable speed.** Add process when missing it causes pain; not before. A daily standup is process; a 14-stage release approval workflow is bureaucracy.
- **Plan for 18 months, not 5 years.** Most architectural decisions can be revisited. Don't paralyze the team with multi-year predictions.
- **Hire for capability, not credentials.** Small teams need generalists who can pick up unfamiliar work. Specialists come later.

## The two failure modes

The opposite mistakes — the dual failure modes of this stage — are:

1. **Acting like a personal project at scale:** Skipping tests, skipping reviews, skipping monitoring. Things break in production, customers churn, you firefight constantly.
2. **Acting like an enterprise too early:** Microservices for 5 engineers, weeks-long architectural reviews, Kubernetes for a 100-user app. Crushing overhead, no shipping.

The right balance is uncomfortable. You'll over-build sometimes; you'll under-build sometimes. That's normal.

:::note Worked example: process earning its way in
A 12-person team has no formal code review. They ship fast. Then a bad merge takes down checkout for an hour on a Friday afternoon. Lost ~$15K in MRR.

The retro produces: "Every PR touching `apps/web/billing/*` requires one approval from anyone before merge." That's a single rule, scoped to one risky area. Not "all PRs need two approvers and a security review." Not "we adopt full Gitflow." A single rule that solves the specific pain that just happened.

That's how process should grow: incident → narrow rule → see if it helps → expand only if needed.
:::

:::info Highlight: managed services are cheaper than engineers
A fully-loaded engineer at a small US startup costs roughly $15K–25K/month. Your *entire* infrastructure bill — Vercel + Supabase + Clerk + Stripe + Sentry + Resend + Linear + PostHog combined — is typically $500–$3,500/month at this stage.

The math is brutal: choosing to build instead of buy *any* of these adds 20%+ to your headcount cost. Build what's differentiated. Buy everything else.
:::

## What's next

→ Continue to [Team Structure at This Scale](./team-structure) where we'll look at how 5, 25, and 50-person orgs differ.
