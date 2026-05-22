---
id: checklist
title: A Decision-Making Checklist
sidebar_position: 16
sidebar_label: 15. Checklist
description: Ten questions to run through on any significant decision. Not every decision needs the full checklist — reach for it on high-stakes ones.
---

# A Decision-Making Checklist

> **In one line:** Ten questions to run through on any significant decision — reach for the full list on high-stakes calls, keep it light for everyday ones.

:::tip[In plain English]
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

:::note[Worked example: applying the checklist to "should we add a job queue?"]
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

:::info[Highlight: the checklist's real job is to surface unknowns]
The questions on the list aren't meant to *answer* the decision. They're meant to surface where you *don't yet have information*. If you find yourself answering "uh, I'm not sure" on questions 2, 8, or 9 — that's the signal that you need more data before deciding.

Half of good decision-making is realizing which question you can't answer yet.
:::

## Page checkpoint

<Quiz id="decisions-checklist-page" title="Did the decision checklist stick?" sampleSize={2}>

<Question
  prompt="Per the chapter, when should you reach for the full 10-question checklist?"
  options={[
    { text: "Every decision, including button colors" },
    { text: "Only for high-stakes decisions; keep it light for everyday ones" },
    { text: "Only when the CTO mandates it" },
    { text: "Never — it's purely theoretical" }
  ]}
  correct={1}
  explanation="The chapter is explicit: the checklist is for high-stakes calls. Running it on every micro-decision would be its own kind of process bloat — exactly the failure mode discussed in the team-size chapter."
  revisit={{ to: "/docs/decisions/checklist#the-checklist", label: "Reach for it on high-stakes" }}
/>

<Question
  prompt="The Highlight argues the checklist's REAL job isn't to answer the decision. What is it?"
  options={[
    { text: "To force a unanimous vote among stakeholders" },
    { text: "To surface where you don't yet have information — half of good decision-making is realizing which question you can't answer" },
    { text: "To make the decision auditable for compliance" },
    { text: "To slow the team down so they don't ship too fast" },
  ]}
  correct={1}
  explanation="The checklist is a diagnostic tool. If you're saying 'uh, not sure' to the cost-of-inaction, success metric, or rollback question — that's the signal you need data before deciding, not that the decision is wrong."
  revisit={{ to: "/docs/decisions/checklist#the-checklist", label: "The checklist's real job" }}
/>

<Question
  prompt="Which of these IS one of the 10 checklist questions?"
  options={[
    { text: "Has anyone on the team blogged about this?" },
    { text: "What's the rollback plan if it goes wrong?" },
    { text: "Will this make the engineering team happier?" },
    { text: "Does it use the latest version of every dependency?" }
  ]}
  correct={1}
  explanation="The 10 questions are: why now, cost of nothing, cost of doing, alternatives, reversibility, scale, who weighs in, success metric, rollback plan, documented. Engineer happiness and dependency versions aren't on the list."
  revisit={{ to: "/docs/decisions/checklist#the-checklist", label: "The checklist" }}
/>

<Question
  prompt="The worked example runs through 'should we adopt BullMQ for background jobs?' What feature of the checklist makes it a 'slam-dunk' decision?"
  options={[
    { text: "BullMQ is cheaper than any alternative" },
    { text: "Cost of inaction (~$10k/month in lost signups) dwarfs the build cost (~$5k), alternatives are weak, and the rollback plan via feature flag is concrete" },
    { text: "The team already had Redis running" },
    { text: "BullMQ is the boring choice" }
  ]}
  correct={1}
  explanation="The checklist exposes the asymmetry: huge cost of waiting, modest cost of doing, weak alternatives, real rollback. When the math is that lopsided AND the failure paths are concrete, the answer is obvious — and the upfront work makes implementation unblocked."
  revisit={{ to: "/docs/decisions/checklist#the-checklist", label: "Worked example" }}
/>

</Quiz>

## What's next

→ Continue to [When to Override These Frameworks](./overriding) — frameworks are heuristics, not laws.
