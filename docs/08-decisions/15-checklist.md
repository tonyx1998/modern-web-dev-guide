---
id: checklist
title: A Decision-Making Checklist
sidebar_position: 16
sidebar_label: 15. Checklist
description: Ten questions to run through on any significant decision. Not every decision needs the full checklist — reach for it on high-stakes ones.
---

# A Decision-Making Checklist

> **In one line:** Ten questions to run through on any significant decision — reach for the full list on high-stakes calls, keep it light for everyday ones.

:::tip In plain English
The frameworks in this chapter aren't independent — they're a system. When a decision is big enough to matter, walk through this checklist. It forces you to ask the question instead of the assumption.
:::

## The checklist

For any significant decision, run through:

1. **Why now?** What specific problem does this solve?
2. **What's the cost of doing nothing?** Quantify.
3. **What's the cost of doing this?** Build cost + maintenance + risk.
4. **What are the alternatives?** List at least three (including "do nothing").
5. **How reversible is this?** One-way door or two-way?
6. **How does this scale?** Will it work at 10x size? 100x?
7. **Who needs to weigh in?** Affected teams, security, legal.
8. **What's the success metric?** How will we know if it worked?
9. **What's the rollback plan?** If it goes wrong, how do we recover?
10. **Have we documented this?** Future-you needs context.

Not every decision needs the full checklist. Reach for it on high-stakes ones.

:::note Worked example: applying the checklist to "should we add a job queue?"
The team is considering adopting BullMQ for background jobs (currently doing them inline in API requests).

| # | Question                       | Answer                                                                     |
|---|--------------------------------|----------------------------------------------------------------------------|
| 1 | Why now?                       | API requests with email sending are timing out at the edge (15s limit).   |
| 2 | Cost of doing nothing?         | ~5% of signups fail, ~$10k/month in lost conversions.                      |
| 3 | Cost of doing this?            | ~2 engineer-weeks to integrate + ongoing Redis costs (~$30/month).         |
| 4 | Alternatives?                  | (a) BullMQ, (b) Trigger.dev (managed), (c) raise the edge timeout (no), (d) do nothing. |
| 5 | Reversible?                    | Moderately — extracting jobs is harder to undo than to add.                |
| 6 | Scale?                         | Fine to 1M jobs/day; will revisit at higher volume.                        |
| 7 | Who weighs in?                 | Platform team (they own Redis), security (queues touch PII).               |
| 8 | Success metric?                | Signup success rate goes from 95% → 99.5%+ within 2 weeks.                 |
| 9 | Rollback plan?                 | Keep inline code path behind a feature flag for 30 days.                   |
| 10 | Documented?                   | ADR-018 in the repo.                                                       |

The checklist exposes that this is a slam-dunk — the cost of inaction ($10k/month) dwarfs the build cost (one-time ~$5k), the alternatives are weak, and the rollback plan is real. **Decision: do it.** And because all the work happened upfront, the actual implementation is unblocked.
:::

:::info Highlight: the checklist's real job is to surface unknowns
The questions on the list aren't meant to *answer* the decision. They're meant to surface where you *don't yet have information*. If you find yourself answering "uh, I'm not sure" on questions 2, 8, or 9 — that's the signal that you need more data before deciding.

Half of good decision-making is realizing which question you can't answer yet.
:::

## What's next

→ Continue to [When to Override These Frameworks](./overriding) — frameworks are heuristics, not laws.
