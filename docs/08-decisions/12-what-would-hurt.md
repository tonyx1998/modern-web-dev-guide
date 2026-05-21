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

## What's next

→ Continue to [The "Why Are You Doing This?" Question](./why-doing-this) — connect every change to a real outcome.
