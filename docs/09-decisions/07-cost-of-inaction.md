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

## Common mistakes

:::caution[Where people commonly trip up]
- **Inventing the numbers to support the conclusion you already wanted.** If you can't actually measure the slowdown — instrument CI times, count flaky reruns, track wasted hours — your numbers are vibes wearing a spreadsheet. Either get the data or admit you're guessing, but don't dress up a hunch as a calculation.
- **Counting cost of doing as just the build.** The build cost is one engineer-week. The *actual* cost includes review, rollout, the bugs introduced, the rollback risk, and the opportunity cost of what else they'd have shipped. Compare apples to apples — full lifetime cost on both sides.
- **Using the formula to justify endless small refactors.** Engineers love refactors and will math their way into all of them. Apply the same skepticism on the "do" side as on the "don't" side: if you're greenlighting more than one or two refactors per quarter on cost-of-inaction grounds, you're probably tilting the math.
- **Treating "we'll fix it eventually" as a free option.** The formula's "years until fixed anyway" multiplier is the trap — teams assume they'll get to it in 12 months and then never do. If there's no concrete commitment, assume "never" and re-run the math; the answer often flips.
:::

## Page checkpoint

<Quiz id="decisions-cost-of-inaction-page" title="Did cost of inaction stick?" sampleSize={2}>

<Question
  prompt="Your CI takes 15 minutes instead of 3. Ten engineers run it 4x/day. The chapter calculates roughly $24,000/month of lost productivity. A one-engineer-week fix costs ~$3,000. The chapter's recommendation:"
  options={[
    { text: "Wait until you have spare capacity — refactors aren't urgent" },
    { text: "Do it now — payback is about 3 days" },
    { text: "Only fix it if a senior engineer volunteers" },
    { text: "Document the slowness and move on" }
  ]}
  correct={1}
  explanation="The math is overwhelming: $3k cost vs $24k/month savings. The chapter's general rule is that if cost of inaction exceeds cost of doing × 12 months, you do it now."
  revisit={{ to: "/docs/decisions/cost-of-inaction#concrete-example", label: "Concrete example" }}
/>

<Question
  prompt="A proposed ORM migration would take 6 engineer-months (~$75k) and save about 5 minutes per developer per week across 10 devs. What does the chapter conclude?"
  options={[
    { text: "Do it — any productivity gain is worth it" },
    { text: "Skip it — payback is 12+ years; the math doesn't work" },
    { text: "Do it next quarter when there's more time" },
    { text: "Do half the migration to capture some of the gains" }
  ]}
  correct={1}
  explanation="The Highlight does this calc: 5min × 10 devs × 50 weeks ≈ 40 hours/year ≈ $6k saved against $75k spent. Payback is over a decade. The cost-of-inaction framework also says no — it keeps you honest both ways."
  revisit={{ to: "/docs/decisions/cost-of-inaction#the-trap", label: "When cost of doing wins" }}
/>

<Question
  prompt="What's the 'trap' the chapter warns about when evaluating refactors?"
  options={[
    { text: "Counting only the cost of doing the refactor and missing the accumulated cost of not doing it" },
    { text: "Refactoring before writing any tests" },
    { text: "Always agreeing with the engineer proposing the refactor" },
    { text: "Discussing refactors in a meeting instead of via RFC" }
  ]}
  correct={0}
  explanation="People reflexively count build cost but miss the compounding cost of accumulated slowdowns. The chapter's whole point is making both sides of the trade-off concrete and numeric."
  revisit={{ to: "/docs/decisions/cost-of-inaction#the-trap", label: "The trap" }}
/>

<Question
  prompt="A flaky test suite causes ~20 failures/week, each costing ~30 minutes to investigate. A 3-week, $9k stabilization is proposed. The chapter's recommendation:"
  options={[
    { text: "Skip it — flakes are unavoidable" },
    { text: "Do it — at ~$78k/year of waste, the fix pays back in ~6 weeks" },
    { text: "Add automatic retries and ignore the failures" },
    { text: "Hire another QA engineer to investigate the flakes" }
  ]}
  correct={1}
  explanation="The worked example does the math: ~10 engineer-hours/week × $150/hr × 52 weeks ≈ $78k/year. A $9k fix paying back in weeks is an easy yes — yet teams sit on flakes for years 'because there's no time.'"
  revisit={{ to: "/docs/decisions/cost-of-inaction#concrete-example", label: "Worked example" }}
/>

</Quiz>

## What's next

→ Continue to [The Migration Strategy Framework](./migration-strategy) — once you've decided to migrate, how to actually do it without disaster.
