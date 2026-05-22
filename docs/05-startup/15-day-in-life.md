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

## Page checkpoint

<Quiz id="startup-day-in-life-page" title="Did the day-in-life picture stick?" sampleSize={2}>

<Question
  prompt="What rough split between deep code and other work does the page describe for a typical startup engineer?"
  options={[
    { text: "70%+ in deep code, like a solo developer" },
    { text: "40-60% in deep code, with the rest split across review, communication, planning, and triage" },
    { text: "10% deep code and 90% meetings" },
    { text: "100% deep code with no overhead" }
  ]}
  correct={1}
  explanation="Startup engineers are typically 40-60% in deep code, with the remainder going to PR review, communication, planning, and incident triage. Solo developers usually run 70%+ deep code — the shift surprises some people."
  revisit={{ to: "/docs/startup/day-in-life#a-concrete-example", label: "Solo vs startup ratio" }}
/>

<Question
  prompt="How does the page justify the daily standup and pair-debugging time (~75 minutes combined)?"
  options={[
    { text: "It's a management-imposed cost with no real benefit" },
    { text: "It prevents the much larger cost of two engineers working at cross-purposes for a week" },
    { text: "Investors require it for funding rounds" },
    { text: "It's a legal requirement under labor law" }
  ]}
  correct={1}
  explanation="Coordination time pays for itself by preventing days or weeks of cross-purpose work. The lever is how you coordinate — async by default, sync when it actually helps — not whether to coordinate at all."
  revisit={{ to: "/docs/startup/day-in-life#a-concrete-example", label: "Meetings as coordination cost" }}
/>

<Question
  prompt="In the sample day, what does the engineer do mid-morning between stand-up and deep work?"
  options={[
    { text: "Reviews two PRs from teammates — approves one, comments on the other" },
    { text: "Runs all the end-to-end tests locally" },
    { text: "Writes a quarterly OKR document" },
    { text: "Attends three back-to-back planning meetings" }
  ]}
  correct={0}
  explanation="At 9:45 AM the engineer reviews two PRs from teammates — one approval, one with comments — before settling into deep work on the bulk export feature."
  revisit={{ to: "/docs/startup/day-in-life#a-concrete-example", label: "Mid-morning PR review" }}
/>

<Question
  prompt="What signal does the page suggest a solo developer should pay attention to before joining a startup?"
  options={[
    { text: "Whether they have an MBA" },
    { text: "How they'd feel about shifting from ~70% deep code to ~50% deep code with more review, comms, and triage" },
    { text: "Whether the startup is using Tailwind v4" },
    { text: "Whether the startup has a four-day workweek" }
  ]}
  correct={1}
  explanation="The Try It Yourself prompt says: time yourself for a normal solo day, see where the hours go, and ask whether you'd be happy with that ratio shifted toward review and coordination. If not, the startup environment may not suit you."
  revisit={{ to: "/docs/startup/day-in-life#a-concrete-example", label: "Try it yourself" }}
/>

</Quiz>

## What's next

→ Continue to [Common Pitfalls at This Scale](./pitfalls) where we'll cover the most common startup-stage failure modes.
