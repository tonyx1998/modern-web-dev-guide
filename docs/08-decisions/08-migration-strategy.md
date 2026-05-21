---
id: migration-strategy
title: The Migration Strategy Framework
sidebar_position: 9
sidebar_label: 8. Migration Strategy
description: Big-bang migrations are usually disasters. Incremental migrations work. Strangler fig, branch by abstraction, parallel run, feature flags.
---

# The Migration Strategy Framework

> **In one line:** Big-bang migrations are usually disasters. Incremental migrations — strangler fig, branch by abstraction, parallel run, feature flags — work.

:::tip In plain English
The temptation with a painful old system is to "just rewrite it from scratch." That almost never works: the rewrite always takes longer than planned, the original system keeps adding features in the meantime, and switching cost is huge. The reliable approach is to migrate piece by piece, with traffic that you can flip back the moment something breaks.
:::

## Successful migration patterns

**Strangler fig pattern** (named after the *Ficus aurea* tree that grows around a host tree, eventually replacing it):

1. Build new system alongside old.
2. Route some traffic to new system (start small).
3. Gradually shift more traffic.
4. Eventually retire old system.

**Branch by abstraction:**

1. Introduce an abstraction layer over the thing you want to replace.
2. Both old and new implementations satisfy the abstraction.
3. Gradually migrate callers to use the new implementation.
4. Remove the old one when nothing uses it.

**Parallel run:**

1. Both old and new systems do the work.
2. Compare results; alert on differences.
3. When you trust the new system, retire the old.

**Feature flag rollout:**

- New code path behind a flag.
- Enable for 1% → 10% → 100% over time.
- Easy rollback (flip the flag).

## Anti-patterns

**Big-bang rewrite:**

- "We'll spend 6 months rebuilding from scratch."
- Original system continues to accumulate features during the rewrite.
- Project always takes longer than planned.
- Switching cost is huge.
- Almost always disastrous.

**Stop-the-world:**

- "We'll freeze feature work for 3 months to migrate."
- Product team revolts.
- Customers churn.
- Engineering credibility damaged.

## Rules for migrations

1. **Never let old and new diverge for long.** Sync as you go.
2. **Have a kill switch.** Be able to roll back instantly.
3. **Measure progress.** "We're 80% migrated" should mean something specific.
4. **Communicate clearly.** Other teams need to know what's happening.
5. **Commit to finishing.** Half-migrated systems are worse than either old or new.

:::note Worked example: strangler fig for a billing rewrite
The old billing system is a tangle of cron jobs and stored procedures. The team decides to migrate to a clean, event-driven service.

Their plan (using strangler fig + parallel run + feature flags):

1. Build the new billing service in parallel. Mirror writes to it from the old system.
2. Have the new service emit invoices in shadow mode — no customer impact, just compared to the old output.
3. Once shadow output matches old for 4 weeks, flip 1% of customers to the new service's invoices via feature flag.
4. Watch error rates and customer support tickets. Ramp to 10%, 50%, 100% over six weeks.
5. Old code is removed only after 30 days of 100% rollout with no issues.

Total migration: 4 months — slower than a "big bang" plan would have estimated, but actually *finished* and with no billing incidents. A big-bang version of the same migration almost certainly would have had a billing outage.
:::

:::info Highlight: half-migrated is the worst state
The single worst migration outcome isn't "old system stays" or "new system ships." It's **"both run forever, neither is canonical."**

Half-migrated systems double maintenance cost, double the surface area for bugs, and create a perpetual question of "which one is the truth?" If you start a migration, commit a date to finishing it. If you can't commit, don't start.
:::

## What's next

→ Continue to [The "Two Versions of the Same Code" Principle](./two-versions) — when duplication is a bug and when it's actually fine.
