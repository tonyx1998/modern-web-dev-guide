---
id: team-structure
title: Team Structure at This Scale
sidebar_position: 3
sidebar_label: 2. Team Structure
description: How a startup engineering org shapes itself at 5, 25, and 50 people. Generalists give way to early specialization to formal teams.
---

# Team Structure at This Scale

> **In one line:** 5 people: everyone does everything. 25 people: informal teams emerge. 50 people: formal teams own services and product areas.

:::tip[In plain English]
The shape of the team changes faster than you expect as you grow. At five engineers, the same person merges PRs in the morning and rotates on-call at night. By fifty, "the auth team" and "the platform team" are real entities with hand-offs between them. Most of the pain in scaling a startup is *not* technical — it's the org chart catching up to reality.
:::

## A typical small-startup engineering org in 2026

### 5–10 Person Team

- **2–6 full-stack engineers** (no specialization yet — everyone touches everything)
- **0–1 designer** (often part-time, contract, or doubled with a PM)
- **0–1 product manager** (often the founder or a founding engineer)
- **1 founding CTO or technical lead**
- **No dedicated DevOps, QA, security, or platform engineers**

Everyone wears multiple hats. Engineers handle their own deployments, monitoring, on-call. The CTO does architecture, hiring, vendor decisions, and still ships code.

### 10–25 Person Team

- **5–15 engineers** with early specialization beginning (frontend-focused, backend-focused, infra-curious)
- **1–2 designers**
- **2–3 product managers**
- **1 engineering manager** (or the CTO still managing directly)
- **1 first-hire DevOps / platform engineer** (often joins around 15–20 engineers)
- **0–1 first-hire security or compliance person** (often around 20–25, especially if pursuing SOC 2)

You start to see "teams" emerge: maybe a frontend team, an API team, an infrastructure team. They're informal and people cross boundaries.

### 25–50 Person Team

- **15–35 engineers** organized into 3–5 product teams
- **3–8 designers**
- **5–10 PMs**
- **2–4 engineering managers**
- **A small platform team** (2–4 people)
- **A small DevOps/SRE team** (1–3 people)
- **Maybe a data team** (1–2 analysts/data engineers)
- **A security or compliance lead**

Now teams have clear ownership of services or product areas. Cross-team coordination becomes a real cost. Architecture decisions need broader buy-in.

:::note[Worked example: hiring the first DevOps engineer]
At ~17 engineers, your team is starting to lose hours every week to "the deploy is flaky," "Vercel bills are confusing," "we don't have a staging environment story." Nobody owns it; everyone touches it.

That's the signal to hire a first DevOps / platform engineer — not because the work suddenly appeared, but because it's now consuming enough cross-team attention to justify a dedicated owner. Hire too early (at five engineers) and they're a bottleneck and underused. Hire too late (at 30) and you've eaten a lot of avoidable pain.
:::

:::info[Highlight: roles are titles, not jobs]
At every size in this range, *the actual work* doesn't fit cleanly inside role boundaries. A "frontend-focused" engineer at a 15-person startup will still write SQL queries when the feature demands it. The first "platform engineer" will still ship product features when the on-call queue is quiet.

Treat the org chart as a rough guide to ownership and rotation, not a description of what people can and can't do. Specialization is a tendency at this scale, not a fence.
:::

## Page checkpoint

<Quiz id="startup-team-structure-page" title="Did team structure stick?" sampleSize={2}>

<Question
  prompt="How does the page describe the engineering org at a 5-10 person company?"
  options={[
    { text: "Two formal teams: frontend and backend" },
    { text: "Full-stack generalists with no specialization yet — everyone touches everything" },
    { text: "A dedicated platform team and product team from day one" },
    { text: "All specialists organized around specific microservices" }
  ]}
  correct={1}
  explanation="At 5-10 people the team is mostly full-stack generalists. There's no dedicated DevOps, QA, security, or platform engineer yet — everyone wears multiple hats."
  revisit={{ to: "/docs/startup/team-structure#510-person-team", label: "5-10 person team" }}
/>

<Question
  prompt="What signal does the page give that it's time to hire the first DevOps or platform engineer?"
  options={[
    { text: "When the company crosses $10M ARR" },
    { text: "As soon as Vercel bills go over $500 per month" },
    { text: "When deploy flakiness and infra ambiguity start consuming cross-team attention with nobody owning it" },
    { text: "Once a venture investor asks about infrastructure on the cap table" }
  ]}
  correct={2}
  explanation="The worked example shows the trigger is shared pain with no owner — flaky deploys, confusing bills, no staging story. That usually happens around 15-20 engineers, not earlier."
  revisit={{ to: "/docs/startup/team-structure#1025-person-team", label: "First DevOps hire" }}
/>

<Question
  prompt="What does the page say about job titles vs the actual work at this scale?"
  options={[
    { text: "Roles are titles, not jobs — specialization is a tendency, not a fence" },
    { text: "Engineers must stay strictly within their declared specialty" },
    { text: "Titles should match exactly what someone does day-to-day" },
    { text: "Title boundaries are enforced by HR once you cross 25 people" }
  ]}
  correct={0}
  explanation="The highlight calls out that frontend-focused engineers still write SQL when needed, and platform engineers still ship product features. Specialization at this scale is a tendency, not a strict boundary."
  revisit={{ to: "/docs/startup/team-structure#a-typical-small-startup-engineering-org-in-2026", label: "Roles are titles, not jobs" }}
/>

<Question
  prompt="At 25-50 people, what changes most about how the team operates?"
  options={[
    { text: "Engineers stop writing tests because QA owns quality" },
    { text: "Teams gain clear ownership of services or product areas and cross-team coordination becomes a real cost" },
    { text: "The company adopts Kubernetes by default" },
    { text: "Pair programming becomes the only allowed workflow" }
  ]}
  correct={1}
  explanation="At this size, 3-5 product teams emerge with clear ownership. Coordination between teams becomes a real expense, and architecture decisions need broader buy-in than at 10 people."
  revisit={{ to: "/docs/startup/team-structure#2550-person-team", label: "25-50 person team" }}
/>

</Quiz>

## What's next

→ Continue to [Phase 1: Discovery & Planning](./planning) where PRDs, sprints, and OKRs replace the solo "paragraph in Notes."
