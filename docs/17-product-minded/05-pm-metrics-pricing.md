---
id: pm-metrics-pricing
title: Metrics, Pricing & Positioning Basics
sidebar_position: 6
sidebar_label: Metrics & pricing
description: Knowing the outcome actually happened — building for the metric that matters, telling actionable metrics from vanity ones, and the basics of value-based pricing and positioning a product-minded engineer should understand.
---

# Metrics, Pricing & Positioning Basics

> **In one line:** Owning an outcome means you must be able to *see* it — so instrument the **one metric that proves the job got done** (usually activation/retention, not signups or pageviews), learn to tell **actionable** metrics from **vanity** ones, and carry enough **pricing and positioning** judgment to know whether the thing is worth what it costs to make.

:::tip[In plain English]
The previous pages got you to ship the right small thing and steer with demos. This one closes the loop: *did it actually work?* You can't answer that on vibes — you need a metric, and it has to be the *right* metric. The classic trap is celebrating numbers that go up but mean nothing: total signups, pageviews, registered accounts ("vanity metrics"). They feel good and tell you almost nothing about whether people get value. The metrics that matter track whether users reach the point where the product *helps them* (activation) and keep coming back (retention). And because a product-minded engineer thinks about outcomes, you also need a working sense of **pricing** (what's this worth to the user?) and **positioning** (who is it for and against what alternative?) — not to become a marketer, but because "is this worth building/charging for?" is a question you'll now help answer.
:::

## Build for the metric from day one

Bolting analytics on after launch means you can't answer "did it work?" for the launch itself. Decide the **success metric before you build**, and instrument the events that compute it as you go. For most features the chain is:

```
   signup  →  activation  →  retention  →  revenue
   (got in)   (reached the    (came back    (paid for
              aha-moment)     and kept using) the value)
```

The further right you can honestly measure, the more real the outcome. A feature that lifts *activation* (more users reach value) is a genuine win; one that only lifts *signups* may be noise.

## Actionable vs vanity metrics

A metric is worth tracking only if a *change* in it would change what you *do*. Test each one with: "if this moved, would I act differently?"

| Vanity (feels good, guides nothing) | Actionable (reveals truth, drives decisions) |
|---|---|
| Total signups / registered users | **Activation rate** (% who reach the aha-moment) |
| Pageviews / total visits | **Retention** (% still active after 1/4 weeks) |
| Total downloads | **Conversion** (% who take the key action) |
| Followers / impressions | **Cohort behavior** (does week-2 usage hold?) |

Vanity metrics only go up (cumulative totals), so they always look like progress. Actionable metrics are *rates* and *cohorts* — they can go down, which is exactly why they're useful. Compute the rate, not the raw count.

<CodeChallenge
  id="pm-activation-rate"
  fnName="activationRate"
  prompt="Compute an actionable rate, not a vanity total. activationRate(activated, signups) returns the percentage of signups who activated, rounded to the nearest whole number. If signups is 0, return 0 (no division by zero)."
  starter={`function activationRate(activated, signups) {\n  // percentage of signups who activated, rounded to nearest integer\n  // signups === 0 => return 0\n  // your code\n}`}
  solution={`function activationRate(activated, signups) {\n  if (signups === 0) return 0;\n  return Math.round((activated / signups) * 100);\n}`}
  tests={[
    {args: [30, 100], expected: 30, label: '30 of 100 activated → 30%'},
    {args: [1, 4], expected: 25, label: '1 of 4 → 25%'},
    {args: [0, 50], expected: 0, label: 'nobody activated → 0% (not "50 signups!")'},
    {args: [5, 5], expected: 100, label: 'everyone activated → 100%'},
    {args: [0, 0], expected: 0, label: 'no signups yet → 0, no divide-by-zero'},
  ]}
  hint="Guard signups === 0 first (return 0). Otherwise Math.round((activated / signups) * 100). The point: report the RATE, which can fall, not the raw signup count, which only rises."
/>

## Pricing basics: charge for value, not for cost

A product-minded engineer doesn't need to be a pricing expert, but should hold three ideas:

- **Value-based, not cost-plus.** Price against what the problem is *worth* to the user (time saved, revenue gained, pain removed), not what it cost you to build. "It took me a weekend" is irrelevant to its value.
- **Anchor to the alternative.** Users price you against their current workaround — a competitor, a manual process, a spreadsheet, or doing nothing. You're selling the *difference*.
- **Tiers match segments.** A free/cheap tier for the curious, a paid tier for the people with the painful version of the problem. Discovery tells you who's who.

## Positioning basics: who, and against what

Positioning is one sentence: **for [who], who [need], this is a [category] that [key benefit], unlike [alternative].** It forces clarity an engineer often skips — "it's a tool that does X" isn't positioning; "for freelancers who dread invoicing, this creates and sends invoices in 30 seconds, unlike the accounting suites that take an afternoon to set up" is. If you can't fill in the blanks, you haven't decided who it's for — which usually means the scope isn't sharp either.

:::note[Worked example: the launch that looked like a hit and wasn't]
An engineer ships a free tool, posts it, and 2,000 people sign up in a week. The vanity dashboard is euphoric — signups straight up and to the right. But the *actionable* view tells the real story: **activation rate 4%** (only ~80 of 2,000 ever completed the core action) and **week-2 retention near zero**. The launch drove curiosity, not value. Because they'd instrumented activation from day one, they catch it immediately, talk to a few of the 4% who *did* activate (back to [discovery](/docs/product-minded/pm-discovery)), learn the onboarding buries the aha-moment behind a config step, cut that step, and watch activation climb to 22% on the next cohort. Had they tracked only signups, they'd have "succeeded" into a dead product. The rate that could go *down* is the one that told the truth.
:::

## Why it matters

Metrics are how outcome-ownership becomes real instead of rhetorical — without the right number you're just asserting impact. And basic pricing/positioning judgment is what lets a product-minded engineer answer the question that increasingly lands on their desk: not just "can we build it?" but "is it worth building, who is it for, and what is it worth?" These connect directly to the guide's [Solo observability](/docs/solo/observability) (instrumenting funnels) and [Launching](/docs/solo/launching) (pricing/positioning in practice) pages.

## Common pitfalls

:::caution[Where engineers go wrong]
- **Adding analytics after launch.** Then you can't measure the launch. Decide the success metric and instrument it *before* you build.
- **Celebrating vanity metrics.** Cumulative totals (signups, pageviews, downloads) only rise and mislead. Track rates and cohorts that can fall.
- **Cost-plus pricing.** What it cost you to build says nothing about its value. Price against the user's pain and their alternative.
- **No positioning.** "A tool that does X" isn't positioning. If you can't say who it's for and what it beats, the scope is probably fuzzy too.
- **Tracking everything, deciding on nothing.** A metric only earns its place if a change in it would change your actions. Pick the few that do.
:::

## Page checkpoint

<Quiz id="pm-metrics-pricing-page" title="Did metrics & pricing stick?" sampleSize={2}>

<Question
  prompt="What distinguishes an actionable metric from a vanity metric?"
  options={[
    { text: "Actionable metrics are bigger numbers" },
    { text: "An actionable metric is one where a change would change what you DO — typically a rate or cohort (activation %, retention) that can go DOWN — whereas vanity metrics are cumulative totals (signups, pageviews) that only rise and guide nothing" },
    { text: "Vanity metrics are harder to compute" },
    { text: "Actionable metrics only matter after $1M revenue" }
  ]}
  correct={1}
  explanation="Test each metric with 'if it moved, would I act differently?' Rates and cohorts reveal whether users get value (and can fall, which is why they're useful); cumulative totals always look like progress and tell you little."
  revisit={{ to: "/docs/product-minded/pm-metrics-pricing#actionable-vs-vanity-metrics", label: "Actionable vs vanity" }}
/>

<Question
  prompt="What's the core principle of value-based pricing?"
  options={[
    { text: "Price = what it cost you to build plus a margin" },
    { text: "Price against what solving the problem is WORTH to the user (time saved, revenue gained, pain removed) and against their current alternative/workaround — what it cost you to build is irrelevant to its value" },
    { text: "Always charge less than every competitor" },
    { text: "Pricing doesn't matter for software" }
  ]}
  correct={1}
  explanation="Value-based pricing anchors to the user's gain and to the alternative they'd otherwise use, not to your build cost. 'It only took a weekend' says nothing about what the problem is worth to them."
  revisit={{ to: "/docs/product-minded/pm-metrics-pricing#pricing-basics-charge-for-value-not-for-cost", label: "Value-based pricing" }}
/>

<Question
  prompt="Why instrument the success metric BEFORE building, not after launch?"
  options={[
    { text: "It's required by analytics tools" },
    { text: "If you bolt analytics on afterward you can't measure the launch itself — you decide the metric (often activation/retention) up front and emit the events to compute it as you build, so you can actually tell whether the outcome happened" },
    { text: "Because early metrics are always higher" },
    { text: "To slow down the build deliberately" }
  ]}
  correct={1}
  explanation="Outcome ownership needs evidence. Deciding the success metric first and instrumenting the events along the way means you can answer 'did it work?' for the launch — rather than discovering you have no data when it matters most."
  revisit={{ to: "/docs/product-minded/pm-metrics-pricing#build-for-the-metric-from-day-one", label: "Build for the metric" }}
/>

</Quiz>

## What's next

→ You've finished the chapter's habits. Take the [Chapter 16 checkpoint](/docs/product-minded/product-minded-checkpoint) to lock them in — then go apply them on a real project, because this is the chapter that only sticks through reps.
