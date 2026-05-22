---
id: what-would-hurt
title: The "What Would Hurt to Change" Question
sidebar_position: 13
sidebar_label: 12. What Would Hurt?
description: For any decision, ask — if this is wrong, what would it cost to fix? A practical version of the reversibility test.
---

# The "What Would Hurt to Change" Question

> **In one line:** For any decision, ask: *if this is wrong, what would it cost to fix?* — then match your deliberation to that cost.

:::tip[In plain English]
This is the practical version of the reversibility test. Don't think abstractly about whether a decision is "important." Imagine concretely that you got it wrong, then estimate the fix. A button vs link mix-up? 30 minutes. A wrong database choice? Six-month migration. That difference should drive how much time you spend up front.
:::

This is a variant of the reversibility test, but practical: imagine you're wrong, then estimate the cost.

## Examples

**"What's the framework?"** Wrong → 6-month rewrite. High cost.

**"Should this be a button or a link?"** Wrong → 30 minutes to switch. Low cost.

**"What's the API contract?"** Wrong → break all consumers. High cost.

**"What's the database schema for this new feature?"** Wrong → migration with possible data loss. Medium-high cost.

**"What library should we use for HTTP requests?"** Wrong → search-and-replace in a few files. Low cost.

When the cost is high, slow down. When it's low, move fast.

:::note[Worked example: applying the question in a planning meeting]
The team is in a one-hour planning meeting. Five decisions are on the table:

| Decision                                | "If wrong, fix cost"     | Time to spend now |
|----------------------------------------|--------------------------|-------------------|
| Which auth provider (Clerk vs Auth0)   | 1-2 weeks of integration | 15 min            |
| Database (Postgres confirmed)           | 3+ month migration       | Already decided   |
| Color of the primary CTA               | 5 min PR                  | 1 min             |
| Public API URL structure (`/v1/...`)   | Break every customer     | 20 min            |
| Logger library                          | 1-day search-replace     | 2 min             |

Total time spent: 38 of 60 minutes — concentrated almost entirely on the public API contract and the auth provider, with everything else moving fast. That's the correct allocation, and it falls out naturally from asking "what would hurt to change?"
:::

:::info[Highlight: the trick is being honest about the fix cost]
People consistently underestimate the cost of changing schemas, public APIs, and shared infrastructure — and overestimate the cost of changing UI, libraries, and folder structure.

When estimating "what would it cost to fix," include:

- The code change itself.
- All the downstream consumers (callers, customers, other services).
- The migration plan.
- The communication and coordination cost.
- The dropped-on-the-floor improvements during the migration.

That bigger number is the *real* cost. Use it to set deliberation budget.
:::

## Page checkpoint

<Quiz id="decisions-what-would-hurt-page" title="Did 'what would hurt?' stick?" sampleSize={2}>

<Question
  prompt="In a 1-hour planning meeting with 5 decisions, the chapter says you should spend the most time on:"
  options={[
    { text: "The color of the primary CTA button" },
    { text: "The public API URL structure (e.g., `/v1/...`) — getting it wrong breaks every customer" },
    { text: "The logger library — a 1-day search-and-replace if wrong" },
    { text: "Splitting time equally across all five decisions" }
  ]}
  correct={1}
  explanation="The worked example burns most of the budget on the public API contract because a wrong choice breaks every consumer. The button color and logger are sub-1-day fixes — minutes of deliberation."
  revisit={{ to: "/docs/decisions/what-would-hurt#examples", label: "Worked example" }}
/>

<Question
  prompt="The chapter says people consistently underestimate the cost of changing certain things. Which set?"
  options={[
    { text: "UI components, libraries, folder structure" },
    { text: "Schemas, public APIs, shared infrastructure" },
    { text: "Variable names, lint rules, file paths" },
    { text: "Comments, READMEs, commit messages" }
  ]}
  correct={1}
  explanation="The chapter is explicit: people underestimate schema/API/shared-infra change cost (downstream consumers, migrations, coordination) and overestimate UI/library/folder costs. That asymmetry is what miscalibrates deliberation."
  revisit={{ to: "/docs/decisions/what-would-hurt#examples", label: "Honest fix-cost estimates" }}
/>

<Question
  prompt="A developer asks: should we use NextAuth or Clerk for auth? Per the chapter, what's the appropriate deliberation budget if the realistic switch cost is ~1-2 weeks of integration work?"
  options={[
    { text: "Days of research and a formal RFC" },
    { text: "About 15 minutes — moderate cost means moderate, not heavy, deliberation" },
    { text: "30 seconds — just pick one" },
    { text: "Quarter-long evaluation with vendor pilots" }
  ]}
  correct={1}
  explanation="The worked example assigns exactly 15 minutes to choosing the auth provider, because the fix cost is 1-2 weeks of integration — moderate, not catastrophic."
  revisit={{ to: "/docs/decisions/what-would-hurt#examples", label: "Worked example table" }}
/>

<Question
  prompt="What does the chapter say you must include when honestly estimating 'what would it cost to fix?'"
  options={[
    { text: "Just the code change itself" },
    { text: "Code change + downstream consumers + migration plan + coordination cost + dropped improvements during migration" },
    { text: "Only the engineer-hours, never the calendar time" },
    { text: "Just the fully-loaded engineer cost" }
  ]}
  correct={1}
  explanation="The chapter lists all five: code change, downstream consumers, migration plan, coordination/communication cost, and dropped-on-the-floor improvements. That bigger number is the real cost, and it's what should drive the deliberation budget."
  revisit={{ to: "/docs/decisions/what-would-hurt#examples", label: "Estimating fix cost honestly" }}
/>

</Quiz>

## What's next

→ Continue to [The "Why Are You Doing This?" Question](./why-doing-this) — connect every change to a real outcome.
