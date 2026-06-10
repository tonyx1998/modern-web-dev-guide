---
id: ops-deploys
title: Deploys & Rollbacks
sidebar_position: 7
sidebar_label: Deploys & rollbacks
description: Progressive delivery — canary, blue-green, rolling — feature flags, decoupling deploy from release, fast rollback, and the DORA metrics that measure delivery health.
---

# Deploys & Rollbacks

> **In one line:** Most incidents are caused by a change, so the way you ship changes *is* a reliability practice — deploy in small increments to a fraction of traffic first (progressive delivery), separate "deployed" from "released" with feature flags, and make rollback so fast and boring that undoing a bad change is the obvious first move.

:::tip[In plain English]
The riskiest moment in production is a deploy — you're introducing change, and change is where bugs come from. The old way (push everything to everyone at once on Friday and pray) maximizes blast radius: if it's broken, *everyone* is broken, immediately. The modern way shrinks the risk of each change. **Progressive delivery** means rolling the new version out to 1% of users first, watching the metrics, then 10%, then everyone — so a bad release hurts 1% for two minutes instead of 100% for an hour. **Feature flags** let you ship code "off" and turn features on later (or instantly off) without a deploy. And the most important safety net of all: **rollback must be fast and routine.** If undoing a deploy takes one click and 60 seconds, "roll back, then investigate" becomes the reflex — which, from the incident chapter, is exactly the reflex you want.
:::

## Progressive delivery: shrink the blast radius of each change

Rather than flipping the whole fleet to a new version at once, expose it gradually:

| Strategy | How it works | Tradeoff |
|---|---|---|
| **Rolling** | Replace instances a few at a time until all run the new version | Simple, no extra capacity; both versions briefly coexist |
| **Blue-green** | Stand up a full new environment (green), switch traffic over at once, keep blue ready | Instant rollback (switch back); needs double capacity briefly |
| **Canary** | Route a small % of traffic to the new version, watch metrics, ramp up | Smallest blast radius; needs good metrics + automation |

**Canary is the gold standard** for risk control: the new version takes 1% of real traffic, an automated check compares its error rate and latency against the old version, and it only proceeds (10% → 50% → 100%) if the canary stays healthy — otherwise it auto-rolls-back. A bad deploy is caught at 1% impact, automatically, often before any human notices.

```
                ┌── 99% ──► v811 (stable)
   traffic ─────┤
                └──  1% ──► v812 (canary)  ──► metrics OK? ── yes ──► ramp to 10%, 50%, 100%
                                                          └── no  ──► auto-rollback, page
```

## Decouple deploy from release (feature flags)

A crucial distinction professionals make: **deploy** = your code is running in production; **release** = users can actually use the feature. Feature flags separate the two:

```javascript
// The new checkout flow is DEPLOYED (the code is live) but not RELEASED
// (it's behind a flag, off for everyone except internal users).
if (await flags.isEnabled("checkout.v2", { userId })) {
  return renderCheckoutV2(req);   // gradually turned on: staff → 1% → 10% → all
}
return renderCheckoutV1(req);     // everyone else, unchanged
```

This unlocks a lot:
- **Ship continuously, release deliberately.** Merge code daily (behind flags) without coupling it to a feature launch date — supports [trunk-based development](/docs/lifecycle/ci-cd).
- **Instant kill switch.** A buggy feature is turned *off* in seconds via a flag — no deploy, no rollback, no waiting for a build.
- **Gradual rollout & experiments.** Turn a feature on for 5% of users, watch, ramp — and A/B test while you're at it.
- **Decouple risky merges from launches.** The big migration can be in production, dormant, validated, long before launch day.

The caution: flags are powerful but accumulate. A codebase with hundreds of stale flags is its own mess — treat flag *removal* (once a feature is fully rolled out) as part of the work, not optional cleanup.

:::info[Highlight: fast rollback is the highest-leverage reliability investment]
From the [incident chapter](./incident-response): the first move in most incidents should be "undo the recent change." That reflex only exists if rollback is *fast and safe* — one command/click, well under a minute, with no data-loss risk. Teams that can roll back in seconds treat deploys as low-stakes and recover from bad ones almost invisibly; teams where rollback is a scary 30-minute manual ordeal hesitate, debate, and let incidents drag. So invest in rollback *before* you invest in fancier deploy strategies: automated, one-step, always-available. The corollary is **backward compatibility** — especially for databases: a deploy that changes the schema such that the *old* version can no longer run has made rollback impossible. Use expand/contract migrations (add the new column, deploy code that writes both, backfill, then later remove the old) so you can always roll the code back to the previous version.
:::

## The DORA metrics: is your delivery healthy?

The research-backed (DORA / *Accelerate*) way to measure delivery performance — and notably, speed and stability rise *together*, they're not a tradeoff:

| Metric | What it measures | Elite looks like |
|---|---|---|
| **Deployment frequency** | How often you ship | On-demand, many times/day |
| **Lead time for changes** | Commit → in production | Less than a day |
| **Change failure rate** | % of deploys causing a failure | 0–15% |
| **Time to restore (MTTR)** | How fast you recover from a failure | Less than an hour |

The counterintuitive finding: elite teams deploy *more often* **and** fail *less* and recover *faster*. Small frequent changes are each low-risk and easy to debug; big rare changes are high-risk and hard to diagnose. So "deploy more often, in smaller pieces" is itself a reliability strategy, not a threat to it. (This is the operational complement to [the CI/CD lifecycle chapter](/docs/lifecycle/ci-cd).)

:::note[Worked example: the database migration that broke rollback]
A team deploys v2, which renames a DB column and updates the code to use the new name. v2 has a bug; they hit rollback. But v811 expects the *old* column name, which no longer exists — so rolling back the code crashes against the migrated database. They're trapped: can't go forward (bug), can't go back (schema). The fix is the **expand/contract** pattern: (1) *expand* — add the new column, keep the old; deploy code that writes both and reads the old. (2) *migrate* — backfill the new column. (3) deploy code that reads the new column. (4) *contract* — only once everything's stable and you're sure you won't roll back, remove the old column. At every step, the previous code version still works against the database, so rollback is always safe. Schema changes are where "we can always roll back" quietly dies if you're not deliberate.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Big-bang deploys to 100% at once.** Maximizes blast radius — a bad release breaks everyone instantly. Roll out progressively (canary/rolling) so problems surface at small impact.
- **Slow or scary rollback.** If undoing a deploy is a 30-minute ordeal, teams hesitate during incidents. Make rollback one step and under a minute — it's the highest-leverage reliability investment.
- **Schema changes that break backward compatibility.** A migration the old code can't run against makes rollback impossible. Use expand/contract so the previous version always works.
- **Coupling every code merge to a feature launch.** This blocks continuous delivery and makes deploys huge and risky. Decouple with feature flags: deploy continuously, release deliberately.
- **Letting feature flags accumulate forever.** Hundreds of stale flags become their own maintenance swamp. Remove flags once a feature is fully rolled out.
- **Believing speed and stability trade off.** DORA shows elite teams ship more often AND fail less. Small, frequent, reversible changes are safer than big rare ones.
:::

## Page checkpoint

<Quiz id="ops-deploys-page" title="Did deploys & rollbacks stick?" sampleSize={3}>

<Question
  prompt="What is a canary deployment and why is it the gold standard for risk control?"
  options={[
    { text: "Deploying to a backup region first; it's safest because backups are isolated" },
    { text: "Routing a small % of real traffic to the new version and comparing its metrics to the old one, ramping up only if healthy (auto-rolling-back if not) — so a bad release is caught at ~1% impact, often before a human notices" },
    { text: "Deploying only on weekends to reduce user impact" },
    { text: "Running the new version with no traffic to warm it up" }
  ]}
  correct={1}
  explanation="A canary sends a small slice of live traffic to the new version and gates the rollout on its error rate/latency versus the stable version. A bad deploy harms ~1% briefly and auto-rolls-back, instead of breaking 100% of users at once."
  revisit={{ to: "/docs/operations/ops-deploys#progressive-delivery-shrink-the-blast-radius-of-each-change", label: "Canary" }}
/>

<Question
  prompt="A v2 deploy renames a DB column and the new code uses it; v2 has a bug, but rolling back to v1 crashes because v1 expects the old column. What pattern prevents this trap?"
  options={[
    { text: "Take the site into maintenance mode for every deploy" },
    { text: "Expand/contract: add the new column while keeping the old, deploy code that writes both, backfill, switch reads, and only remove the old column once you're sure you won't roll back — so the previous version always works against the DB" },
    { text: "Never change the database schema" },
    { text: "Roll back the database to a backup taken before the deploy" }
  ]}
  correct={1}
  explanation="Backward-incompatible schema changes break rollback. The expand/contract (parallel-change) pattern keeps the old and new schema valid simultaneously across several deploys, so the prior code version is always runnable against the database and rollback stays safe."
  revisit={{ to: "/docs/operations/ops-deploys#the-dora-metrics-is-your-delivery-healthy", label: "Expand/contract migrations" }}
/>

<Question
  prompt="The DORA research found which (counterintuitive) relationship between deployment speed and stability?"
  options={[
    { text: "They trade off — the faster you deploy, the more you break" },
    { text: "They rise together — elite teams deploy more frequently AND have lower change-failure rates and faster recovery, because small frequent changes are individually low-risk and easy to debug" },
    { text: "They're unrelated" },
    { text: "Stability only improves by deploying less than once a month" }
  ]}
  correct={1}
  explanation="Accelerate/DORA shows speed and stability are not opposed: elite performers ship many times a day and fail less and recover faster. Small, frequent, reversible changes lower per-change risk — so 'deploy smaller and more often' is itself a reliability strategy."
  revisit={{ to: "/docs/operations/ops-deploys#the-dora-metrics-is-your-delivery-healthy", label: "DORA metrics" }}
/>

</Quiz>

## What's next

→ Continue to [Capacity & scaling](./capacity-scaling) — making sure there's enough system to serve the load, before the load arrives.
