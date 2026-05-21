---
id: day-in-life
title: Sample Day-in-the-Life
sidebar_position: 16
sidebar_label: 15. Day-in-the-Life
description: A concrete example of a startup engineer's day — stand-up, code review, deep work, pair debugging, deploy, triage. The actual rhythm of the role.
---

# Sample Day-in-the-Life

> **In one line:** Stand-up, two PR reviews, deep work on a feature, pair debugging, deploy, Sentry triage. Iterative, collaborative, focused.

:::tip[In plain English]
Job descriptions tell you what you'll work on. They almost never tell you what a *day* actually looks like. The pattern below is genuinely representative — most days at a small-company engineering job land within an hour or two of this rhythm. Read it before applying to startup roles, not after.
:::

## A concrete example

Concrete example of a small-company engineer's day:

**9:00 AM** — Coffee + check Linear inbox. Reply to PM about acceptance criteria for the new feature.

**9:30 AM** — Stand-up (15 min): what I did yesterday, what I'll do today, blockers.

**9:45 AM** — Review two PRs from teammates. Approve one; leave comments on the other.

**10:30 AM** — Deep work: implementing the bulk export feature. Branch off main, write a Drizzle migration, write the Server Action, write the UI.

**12:00 PM** — Lunch.

**1:00 PM** — Push WIP branch, open draft PR for early feedback.

**1:30 PM** — Pair with another engineer on a tricky Stripe webhook bug. Find and fix.

**3:00 PM** — Back to bulk export. Write Playwright test for the critical path.

**4:00 PM** — Push, mark PR as ready. CI runs.

**4:30 PM** — Triage a new error in Sentry. Quick fix, separate PR.

**5:00 PM** — Wrap up. Tomorrow: address PR feedback, ship the export feature, start the next ticket.

This is the rhythm. Iterative, collaborative, focused.

:::note[Try it yourself]
If you're currently solo and considering startup work, time yourself across a normal day this week. Note when you're in deep code, when you're in communication, when you're in review-or-meeting overhead.

Most solo developers are 70%+ in deep code. Most startup engineers are 40–60% in deep code with the rest split between review, communication, planning, and triage. If you'd dislike that ratio shift, the startup environment may not suit you — that's good information to have before you take the job.
:::

:::info[Highlight: meetings are coordination cost]
The two meetings in the day above (stand-up, pair debugging) take ~75 minutes combined. That feels like a lot if you're coming from solo work. The justification: those 75 minutes prevent the *much* larger cost of two engineers working at cross-purposes for a week.

Beyond a certain team size, coordination cost is unavoidable. The lever is *how* you coordinate — async by default, synchronous when it actually helps. Meetings that don't pay for themselves get killed in the retro.
:::

## What's next

→ Continue to [Common Pitfalls at This Scale](./pitfalls) where we'll cover the most common startup-stage failure modes.
