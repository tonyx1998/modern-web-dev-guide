---
id: mindset
title: The Small Company Mindset
sidebar_position: 2
sidebar_label: 1. Mindset
description: Move fast but don't accumulate fatal mistakes. Lean on managed services. Add process only when missing it causes pain.
---

# The Small Company Mindset

> **In one line:** Move fast, but don't accumulate fatal mistakes. The whole startup workflow is calibrated to that single tension.

:::tip[In plain English]
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

:::note[Worked example: process earning its way in]
A 12-person team has no formal code review. They ship fast. Then a bad merge takes down checkout for an hour on a Friday afternoon. Lost ~$15K in MRR.

The retro produces: "Every PR touching `apps/web/billing/*` requires one approval from anyone before merge." That's a single rule, scoped to one risky area. Not "all PRs need two approvers and a security review." Not "we adopt full Gitflow." A single rule that solves the specific pain that just happened.

That's how process should grow: incident → narrow rule → see if it helps → expand only if needed.
:::

:::info[Highlight: managed services are cheaper than engineers]
A fully-loaded engineer at a small US startup costs roughly $15K–25K/month. Your *entire* infrastructure bill — Vercel + Supabase + Clerk + Stripe + Sentry + Resend + Linear + PostHog combined — is typically $500–$3,500/month at this stage.

The math is brutal: choosing to build instead of buy *any* of these adds 20%+ to your headcount cost. Build what's differentiated. Buy everything else.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Copy-pasting a FAANG engineering blog as your operating model.** What works for 500 engineers will crush 12. When you read a post about platform teams, RFC councils, or eventing architectures, ask first: *would this exist if our headcount were 10x smaller?* If not, skip it.
- **Confusing "managed services" with "no work."** Vercel and Supabase still need someone watching bills, rotating secrets, and reading the slow-query log. The savings are real, but they don't include "you can ignore infrastructure entirely."
- **Treating the founder/CTO as the architecture committee forever.** At 5 engineers it works; at 15 it becomes a bottleneck that blocks every decision. Hand off design ownership *before* people start routing around you.
- **Adding process in response to anxiety, not pain.** Reading a horror story on Hacker News and instituting a new policy on Monday is theater. Wait for an actual incident with your name on it before you adopt a rule.
- **Confusing "moving fast" with "never writing things down."** Two-line ADRs in the repo cost nothing and save the team from re-litigating the same decision every six weeks.
:::

## Page checkpoint

<Quiz id="startup-mindset-page" title="Did the startup mindset stick?" sampleSize={2}>

<Question
  prompt="The page summarizes the startup mindset as a balance between which two extremes?"
  options={[
    { text: "Open source vs proprietary software" },
    { text: "Personal-project sloppiness and enterprise overhead" },
    { text: "Frontend specialists and backend specialists" },
    { text: "Cloud-hosted services and self-hosted infrastructure" }
  ]}
  correct={1}
  explanation="The mindset sits between solo sloppiness (where only you suffer) and enterprise process (which protects hundreds of people). Startups have paying customers but not enough headcount to justify heavyweight workflows."
  revisit={{ to: "/docs/startup/mindset#the-five-guiding-principles", label: "Five guiding principles" }}
/>

<Question
  prompt="When should a startup add a new piece of process, according to the guiding principles?"
  options={[
    { text: "When a respected blog post recommends it" },
    { text: "Up front, before the team ever feels pain from missing it" },
    { text: "Only after an incident or recurring pain identifies a specific gap" },
    { text: "Whenever a new engineer joins the team" }
  ]}
  correct={2}
  explanation="Process should earn its way in. The worked example shows a single narrow rule added after a real incident — not a blanket policy adopted on principle."
  revisit={{ to: "/docs/startup/mindset#the-five-guiding-principles", label: "Process earns its place" }}
/>

<Question
  prompt="Why does the page argue managed services are cheaper than building in-house at this scale?"
  options={[
    { text: "Managed services are free at startup-tier usage" },
    { text: "A single fully-loaded engineer costs far more than the entire managed stack combined" },
    { text: "Managed services automatically scale to infinite revenue with no work" },
    { text: "Self-hosting is forbidden by most cloud providers" }
  ]}
  correct={1}
  explanation="An engineer runs $15K-$25K/month fully loaded while the whole managed stack often totals $500-$3,500/month. Building instead of buying any single service adds more than 20% to headcount cost."
  revisit={{ to: "/docs/startup/mindset#the-five-guiding-principles", label: "Managed services math" }}
/>

<Question
  prompt="Which is described as one of the two dual failure modes for a startup engineering team?"
  options={[
    { text: "Adopting microservices and weeks-long architectural reviews far too early" },
    { text: "Choosing TypeScript over JavaScript" },
    { text: "Hosting on Vercel rather than self-hosting" },
    { text: "Using shadcn/ui instead of building a custom design system" }
  ]}
  correct={0}
  explanation="Acting like an enterprise too early — microservices for 5 engineers, Kubernetes for 100 users, weeks-long reviews — is one of the two failure modes. The other is acting like a personal project once you have real customers."
  revisit={{ to: "/docs/startup/mindset#the-two-failure-modes", label: "Two failure modes" }}
/>

</Quiz>

## What's next

→ Continue to [Team Structure at This Scale](./team-structure) where we'll look at how 5, 25, and 50-person orgs differ.
