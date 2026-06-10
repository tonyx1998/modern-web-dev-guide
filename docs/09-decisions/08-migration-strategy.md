---
id: migration-strategy
title: The Migration Strategy Framework
sidebar_position: 9
sidebar_label: 8. Migration Strategy
description: Big-bang migrations are usually disasters. Incremental migrations work. Strangler fig, branch by abstraction, parallel run, feature flags.
---

# The Migration Strategy Framework

> **In one line:** Big-bang migrations are usually disasters. Incremental migrations — strangler fig, branch by abstraction, parallel run, feature flags — work.

:::tip[In plain English]
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

:::note[Worked example: strangler fig for a billing rewrite]
The old billing system is a tangle of cron jobs and stored procedures. The team decides to migrate to a clean, event-driven service.

Their plan (using strangler fig + parallel run + feature flags):

1. Build the new billing service in parallel. Mirror writes to it from the old system.
2. Have the new service emit invoices in shadow mode — no customer impact, just compared to the old output.
3. Once shadow output matches old for 4 weeks, flip 1% of customers to the new service's invoices via feature flag.
4. Watch error rates and customer support tickets. Ramp to 10%, 50%, 100% over six weeks.
5. Old code is removed only after 30 days of 100% rollout with no issues.

Total migration: 4 months — slower than a "big bang" plan would have estimated, but actually *finished* and with no billing incidents. A big-bang version of the same migration almost certainly would have had a billing outage.
:::

:::info[Highlight: half-migrated is the worst state]
The single worst migration outcome isn't "old system stays" or "new system ships." It's **"both run forever, neither is canonical."**

Half-migrated systems double maintenance cost, double the surface area for bugs, and create a perpetual question of "which one is the truth?" If you start a migration, commit a date to finishing it. If you can't commit, don't start.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Starting a migration with no committed finish date.** "We'll get to the rest later" is how you end up in the half-migrated trap that's worse than either old or new. Before the first PR lands, write down the date by which the old system is *deleted* — not just unused, deleted — and hold yourself to it.
- **Treating shadow mode and parallel run as the destination.** Running old and new side-by-side is a tool to build confidence, not a steady state. If you've been "running both" for more than a quarter, you've stopped migrating and started doubling your maintenance burden. Pick a side.
- **Building a kill switch you never actually test.** Rollback plans rot fast — a flag that flips back to "old" stops working the moment the old code path drifts. Exercise the rollback at least monthly during the migration, or assume it's broken when you need it most.
- **Migrating a system you don't fully understand yet.** Strangler fig works because you can see what the old system does at each callsite. If the legacy system has uncatalogued behaviors (cron jobs, side effects, hidden consumers), discovery happens *during* the cutover — which means outages. Map first, migrate second.
:::

## Page checkpoint

<Quiz id="decisions-migration-strategy-page" title="Did migration strategy stick?" sampleSize={3}>

<Question
  prompt="Your team wants to replace a tangled legacy billing system. Which approach does the chapter explicitly call 'almost always disastrous'?"
  options={[
    { text: "Strangler fig — build new alongside old and route traffic gradually" },
    { text: "Big-bang rewrite — freeze the old, build a clean replacement, switch over in one cutover" },
    { text: "Parallel run — run both and compare results" },
    { text: "Feature-flagged rollout from 1% to 100%" }
  ]}
  correct={1}
  explanation="The chapter is emphatic: big-bang rewrites blow past their estimates while the old system keeps adding features, and the cutover risk is enormous. Incremental approaches are the reliable path."
  revisit={{ to: "/docs/decisions/migration-strategy#anti-patterns", label: "Anti-patterns" }}
/>

<Question
  prompt="The chapter says the SINGLE WORST migration outcome is:"
  options={[
    { text: "The new system is slower than the old one for a few weeks" },
    { text: "Half-migrated — both run forever and neither is canonical" },
    { text: "The migration finishes a quarter late" },
    { text: "Customer support is briefly overwhelmed" }
  ]}
  correct={1}
  explanation="Half-migrated doubles maintenance cost and creates a permanent 'which one is the truth?' question. The chapter's prescription: commit to a finish date before you start. If you can't commit, don't start."
  revisit={{ to: "/docs/decisions/migration-strategy#rules-for-migrations", label: "Half-migrated is the worst state" }}
/>

<Question
  prompt="The strangler fig pattern is named after a tree that gradually grows around and replaces a host. In software, it means:"
  options={[
    { text: "Run a one-shot script that copies all data into a new system overnight" },
    { text: "Build the new system alongside the old, route some traffic to it, gradually shift more, then retire the old" },
    { text: "Block all new features until the old system is removed" },
    { text: "Force every customer onto the new system on day one and patch issues as they come" }
  ]}
  correct={1}
  explanation="Strangler fig = parallel new + old, gradual traffic shift, eventual retirement of the old. It gives you a rollback path at every step."
  revisit={{ to: "/docs/decisions/migration-strategy#successful-migration-patterns", label: "Strangler fig pattern" }}
/>

<Question
  prompt="Which is NOT one of the chapter's five rules for migrations?"
  options={[
    { text: "Never let old and new diverge for long" },
    { text: "Have a kill switch — be able to roll back instantly" },
    { text: "Freeze all feature development until the migration is done" },
    { text: "Measure progress concretely; '80% migrated' should mean something specific" }
  ]}
  correct={2}
  explanation="The chapter explicitly calls 'stop-the-world' an anti-pattern that revolts the product team and damages credibility. The real rules are: don't diverge, kill switch, concrete progress, communicate, commit to finishing."
  revisit={{ to: "/docs/decisions/migration-strategy#rules-for-migrations", label: "Rules for migrations" }}
/>

</Quiz>

## What's next

→ Continue to [The "Two Versions of the Same Code" Principle](./two-versions) — when duplication is a bug and when it's actually fine.
