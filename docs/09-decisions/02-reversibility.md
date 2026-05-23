---
id: reversibility
title: The Reversibility Test
sidebar_position: 3
sidebar_label: 2. Reversibility
description: Spend deliberation proportionally to how hard a decision is to reverse. One-way doors versus two-way doors.
---

# The Reversibility Test

> **In one line:** Spend deliberation proportionally to how hard a decision is to reverse — agonize over one-way doors, walk briskly through two-way ones.

:::tip[In plain English]
Jeff Bezos calls these **Type 1** (one-way doors, hard to reverse) and **Type 2** (two-way doors, easy to reverse) decisions. The mistake most teams make is *uniform deliberation*: spending a week debating button colors while picking a database in twenty minutes. Match the time you spend to how stuck you'd be if you were wrong.
:::

## Categorizing decisions

**Easily reversible (try freely):**

- UI components.
- Styling approach.
- Minor libraries (date utility, validation library).
- Linter rules.
- Folder structure.
- Variable names.

**Moderately reversible (some thought required):**

- Frontend framework.
- Auth provider.
- Email provider.
- Hosting platform.
- Major libraries.

**Hard to reverse (think carefully):**

- Programming language.
- Database technology.
- Cloud provider (especially as you accumulate services).
- Major architectural patterns (monolith vs microservices).
- Data model (schemas accumulate dependencies).
- Public API design.

**Very hard or impossible to reverse:**

- Selling user data.
- Open-sourcing proprietary code.
- Public commitments to APIs.
- Decisions baked into customer integrations.

## How to apply it

For each decision:

1. Place it on the reversibility spectrum.
2. Allocate deliberation accordingly:
   - **Easily reversible** → 5 minutes; just decide.
   - **Moderate** → an hour to research, a discussion with a colleague.
   - **Hard** → days of research, prototyping, peer review.
   - **Very hard** → formal process, multiple reviewers, written justification.

The mistake is uniform deliberation: spending weeks debating button colors while picking databases in 20 minutes.

## The "bias for action" corollary

For reversible decisions, **just decide**. Endless deliberation is its own cost. If you're wrong, you'll fix it.

For irreversible decisions, **slow down**. The cost of being wrong dominates the cost of careful thought.

:::note[Worked example: a week of planning, an afternoon of building]
A small team is starting a project. Time budget for decisions before writing a line of code:

| Decision               | Time budget |
|------------------------|-------------|
| Database (Postgres)    | 1 day — research, schema sketch |
| Cloud provider         | 1 day — pricing, lock-in analysis |
| Frontend framework     | 2 hours — quick prototype |
| Auth provider          | 1 hour — read pricing, pick |
| CSS approach           | 15 minutes — pick Tailwind |
| Folder structure       | 0 minutes — copy from a template |

Total: ~2.5 days on hard-to-reverse decisions, ~2 hours on the moderate ones, near-zero on reversible ones. That ratio is correct.
:::

:::info[Highlight: the asymmetry]
Most engineers err on the side of too much deliberation on reversible decisions (bike-shedding) and too little on irreversible ones ("we'll figure it out"). The discipline is *consciously asking*: "If we're wrong about this, what does the fix look like?"

If the answer is "a 10-line PR," move fast. If it's "a year of migration work," slow down.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Using "it's reversible" as a license to never decide.** Two-way doors are meant to be walked *through*, not stood in. If your team has been "experimenting" with three frontend frameworks for six months, the cost of indecision now exceeds the cost of being wrong. Pick one and move.
- **Misjudging reversibility by looking at the code, not the consumers.** A database swap looks like a code change; in reality it's coordinating with every team that writes a query, every dashboard, every cron job. The reversibility cost lives in the *dependencies*, not the lines of code.
- **Conflating "hard to reverse" with "needs a committee."** Slow deliberation isn't the same as good deliberation. A one-way door benefits from one or two people doing deep research, not from a Slack thread with 30 opinions. Match the depth, not just the duration.
- **Forgetting that early-stage two-way doors become one-way later.** Your auth provider is reversible at week two and nearly fixed by year two — customer integrations, audit trails, and admin tooling have all baked it in. Re-classify decisions as the codebase ages instead of trusting the original label.
:::

## Page checkpoint

<Quiz id="decisions-reversibility-page" title="Did reversibility stick?" sampleSize={2}>

<Question
  prompt="In Bezos's framing, what is a Type 1 decision?"
  options={[
    { text: "A two-way door — easy to walk back if you're wrong" },
    { text: "A one-way door — hard or impossible to reverse" },
    { text: "Any decision involving more than one team" },
    { text: "A decision that requires written documentation" }
  ]}
  correct={1}
  explanation="Type 1 = one-way door (hard to reverse, agonize over it). Type 2 = two-way door (easy to reverse, walk briskly through it). The mistake is treating both the same."
  revisit={{ to: "/docs/decisions/reversibility#categorizing-decisions", label: "Categorizing decisions" }}
/>

<Question
  prompt="Your team has spent three meetings debating folder structure for a new repo while burning through choices about the database in 15 minutes. According to the chapter, what's wrong?"
  options={[
    { text: "Folder structure deserves more time — it shapes the codebase forever" },
    { text: "The team has inverted the deliberation budget — folder structure is easily reversible, database choice is hard to reverse" },
    { text: "Three meetings is the right amount for any structural decision" },
    { text: "The database choice is reversible because most ORMs abstract it" }
  ]}
  correct={1}
  explanation="This is the canonical anti-pattern: weeks on button colors, 20 minutes on databases. Folder structure is a near-zero-cost change; the database accumulates dependencies and is one of the hardest things to swap."
  revisit={{ to: "/docs/decisions/reversibility#how-to-apply-it", label: "How to apply it" }}
/>

<Question
  prompt="You're choosing between two CSS frameworks for an internal tool. The chapter's deliberation budget would be roughly:"
  options={[
    { text: "Days of research and a written ADR" },
    { text: "An hour with a quick prototype" },
    { text: "Around 5–15 minutes — just pick one" },
    { text: "A formal RFC with multiple reviewers" }
  ]}
  correct={2}
  explanation="A CSS approach is easily reversible — pick Tailwind or whatever and move on. The chapter explicitly budgets 5 minutes for this class and a written process only for hard-to-reverse decisions."
  revisit={{ to: "/docs/decisions/reversibility#how-to-apply-it", label: "Time allocation" }}
/>

<Question
  prompt="Which of these belongs in the 'very hard or impossible to reverse' bucket the chapter warns about?"
  options={[
    { text: "Switching ESLint rules" },
    { text: "Choosing between two date-utility libraries" },
    { text: "Open-sourcing proprietary code" },
    { text: "Renaming a private internal variable" }
  ]}
  correct={2}
  explanation="Open-sourcing code is genuinely irreversible — once it's out, it's out. Linter rules, date libraries, and variable names are textbook two-way doors."
  revisit={{ to: "/docs/decisions/reversibility#categorizing-decisions", label: "Categorizing decisions" }}
/>

</Quiz>

## What's next

→ Continue to [The Team Size Heuristic](./team-size-heuristic) — your team's size limits which practices and tools are realistic.
