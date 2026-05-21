---
id: cost-of-inaction
title: The Cost-of-Inaction Calculation
sidebar_position: 8
sidebar_label: 7. Cost of Inaction
description: When tempted to refactor, calculate the cost of NOT refactoring. The hidden cost is everything that gets slower.
---

# The Cost-of-Inaction Calculation

> **In one line:** When tempted to refactor, calculate the cost of *not* refactoring — the hidden cost is everything that gets slower if you don't.

:::tip[In plain English]
A common mistake: weighing only the cost of doing a refactor. The hidden cost is everything that gets slower if you don't. A slow build that costs the team $24,000/month is worth a one-week, $3,000 fix on day one — but most teams never actually do the math.
:::

## The formula

```
Cost of Doing = engineer-weeks × hourly rate

Cost of Not Doing = (slowdown per feature) × (features per year)
                  × (years until problem gets fixed anyway)
                  × hourly rate

If Cost of Not Doing > Cost of Doing × 12 months: do it now.
If Cost of Not Doing < Cost of Doing × 36 months: probably don't.
In between: judgment call.
```

## Concrete example

You have a slow build. Every CI run takes 15 minutes when it should take 3.

**Cost of fixing:** 1 engineer × 1 week = ~$3,000.

**Cost of not fixing:**

- 10 engineers × 4 CI runs/day × 12 extra minutes = 8 engineer-hours/day wasted.
- ~$1,200/day in lost productivity.
- $24,000/month.

The fix pays for itself in 3 days. Obviously do it.

Conversely: a big migration that takes 6 engineer-months and saves 10 minutes per week per engineer probably doesn't pay back in any reasonable timeframe.

## The trap

People only count the cost of doing. They miss the cost of accumulated slowdowns. Make the costs concrete.

:::note[Worked example: refactor or live with it?]
A 20-person team has a flaky test suite. Tests fail randomly ~1 in 10 runs. The proposal: spend 3 weeks of one engineer's time to stabilize it.

- **Cost of doing:** 3 weeks × ~$3,000/week = $9,000.
- **Cost of not doing:** Each flaky failure costs ~30 minutes (re-run, investigate). The team sees ~20 flaky failures/week → 10 engineer-hours/week. At $150/hour fully-loaded, that's $1,500/week = $78,000/year.

The fix pays back in roughly 6 weeks. Easy yes — and yet many teams sit on flakiness for *years* because "we don't have time to fix it." The math says they can't afford *not* to.
:::

:::info[Highlight: when the cost of doing wins]
The formula also keeps you honest in the other direction. Example: a "huge migration from one ORM to another" that takes 6 engineer-months ($75k+) and saves *maybe* 5 minutes per developer per week.

5 min/week × 10 devs × 50 weeks = ~40 hours/year saved. At $150/hour that's $6,000/year. Payback: 12+ years. Don't do it.

The point of the calculation isn't to greenlight every refactor — it's to make both sides of the trade-off visible.
:::

## What's next

→ Continue to [The Migration Strategy Framework](./migration-strategy) — once you've decided to migrate, how to actually do it without disaster.
