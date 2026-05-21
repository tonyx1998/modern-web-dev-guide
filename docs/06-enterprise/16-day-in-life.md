---
id: day-in-life
title: A Day in the Life of a Senior Engineer at Scale
sidebar_position: 17
sidebar_label: 16. Day in the Life
description: An hour-by-hour walkthrough of what a senior engineer at a large company actually does on a typical day.
---

# A Day in the Life of a Senior Engineer at Scale

> **In one line:** A senior engineer at scale spends maybe 30–40% of the day coding; the rest is reviews, design discussions, mentoring, and incident or on-call work.

:::tip[In plain English]
If you imagine a senior engineer at a big company as someone who codes all day, you're imagining the wrong job. By the time you're senior, your highest-leverage activity is usually *helping other engineers ship* — through reviews, design feedback, mentoring, and shaping the technical direction. Writing code is part of the work, but rarely the majority.

This sometimes catches mid-career engineers off-guard when they get promoted: "I joined to write code, and now I'm in meetings." The leverage is real — your reviews shape work across many engineers — but the work itself looks different.
:::

## An hour-by-hour walkthrough

**9:00 AM** — Triage the on-call queue. One service had elevated latency overnight; root cause was a slow query. File a follow-up ticket.

**9:30 AM** — Stand-up with team. Quick sync on priorities.

**10:00 AM** — Review an RFC from a peer team about a new event schema. Leave comments about backward compatibility concerns.

**10:30 AM** — 1:1 with a more junior engineer. Discuss their growth plan; review their recent design doc.

**11:00 AM** — Coding: implementing the actual feature for this sprint. Push a draft PR.

**12:00 PM** — Lunch with cross-team colleagues. Informal alignment on an upcoming migration.

**1:00 PM** — Architecture review for a major proposal from another team. Hour-long discussion of trade-offs.

**2:00 PM** — Code review queue. Approve two PRs; request changes on one.

**3:00 PM** — Post-mortem for last week's incident. Discuss what we'll change to prevent recurrence.

**4:00 PM** — More coding. Address review feedback on yesterday's PR.

**5:00 PM** — Write a brief design doc for next sprint's work.

**6:00 PM** — Done for the day.

## The work mix

The work mix is roughly:

- **30–40% coding**
- **20% reviewing others' code/docs**
- **20% meetings and design discussions**
- **10% mentoring**
- **10% incident/on-call work**

The exact mix varies by role and seniority. Staff and Principal engineers usually code less and review/design more. New hires and senior engineers on a specific project might code more.

:::info[Highlight: "leverage" is the key word for senior IC roles]
The cultural shift from mid-level to senior IC is that your output is no longer measured in code shipped — it's measured in **how much better the work of engineers around you becomes**. A staff engineer who shipped no code this quarter but unblocked three teams via design feedback delivered enormous value.

The hardest part of the transition is letting go of "I should be coding more" as the success metric. The right metric is "is my org's overall output increasing because of the work I'm choosing?"
:::

## What's not on this schedule

A few things that *aren't* on the example day but happen regularly:

- Writing or reviewing RFCs (often blocks of focused time on a less meeting-heavy day).
- On-call shifts (typically a week at a time, every 4–8 weeks).
- Game days and incident-response drills.
- Cross-team alignment meetings for big initiatives.
- Performance and promotion calibrations (managers do these but senior ICs influence them).
- Mentoring beyond direct reports — informal coffee chats, code-review mentoring, etc.

:::note[Worked example: what changes as you grow more senior?]
A useful frame: **the more senior you are, the more your time is fragmented**. A junior engineer might get two big blocks of focus time per day. A staff engineer might get one. A principal engineer might get one or two undisturbed *hours* per week and have to be deliberate about protecting them.

That's not "growing into a worse job" — it's "growing into a higher-leverage job." But it does mean senior ICs have to actively manage their calendars and protect focus time, or they'll never code at all.
:::

## What's next

→ Continue to [When to Use This Workflow](./when-to-use) — which of these enterprise practices to adopt at your scale, and which to skip.
