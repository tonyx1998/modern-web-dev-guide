---
id: why-now
title: The "Why Now?" Question
sidebar_position: 7
sidebar_label: 6. Why Now?
description: Before adopting any new technology or pattern, demand a concrete reason — not "it would be cool."
---

# The "Why Now?" Question

> **In one line:** Before adopting any new technology or pattern, ask: *why now, specifically?* — and demand an answer that's a concrete problem, not a feeling.

:::tip[In plain English]
"Why now?" is the single most useful question in tech-adoption meetings. If the answer is a specific, measurable problem — go. If the answer is vibes — wait. Most premature migrations die because nobody could articulate why *this quarter* was the right time.
:::

The answer should be a concrete problem, not "it would be cool" or "the team wants to."

## Good reasons

- "We're hitting Postgres limits we've measured."
- "This library version has critical security bugs we can't ignore."
- "Our hiring is constrained by language X."
- "The new framework solves a specific bug class we've had."

## Bad reasons

- "It's the latest thing."
- "Other companies use it."
- "The team is bored."
- "It would look good on our blog."
- "I read a Twitter thread."

If you can't answer "why now?" specifically, the answer is probably "not now."

## Forcing functions

Make the question explicit:

- Require justification in RFC templates.
- Include "what problem does this solve?" in tech proposals.
- Estimate the migration cost before deciding.

:::note[Worked example: rewriting from Express to Fastify]
A team proposes migrating their backend from Express to Fastify "for performance."

"Why now?" forces the real conversation:

- **Measured P99 latency?** 80ms — the framework is not the bottleneck.
- **CPU bound?** No, mostly I/O wait.
- **Cost pressure?** No, server costs are 2% of revenue.
- **Hiring pressure?** No, Express engineers are abundant.
- **Specific bug class?** No, no relevant outages.

The actual answer turns out to be "one engineer read a benchmark blog post." The proposal dies after the meeting — saving roughly six months of migration work and avoiding the cost of a partially-migrated codebase. Months later, when the team *does* have a measured latency problem, they have the budget and credibility to address it properly.
:::

:::info[Highlight: the "do nothing" baseline]
Every adoption proposal should include an explicit "do nothing" option with its costs and benefits. Often "do nothing" is the right answer — and surfacing it forces the proponent to articulate what actually changes if you wait six months.

If the cost of waiting is unclear, you're probably not at the "why now" moment yet.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Accepting a hypothetical problem as a "why now."** "We *might* need this when we scale to 10x" is not a why-now — it's a why-someday. Demand a problem that exists today and is measurable today, not a forecast that conveniently arrives whenever the proposer needs it to.
- **Letting "we already started" function as the answer.** Sunk-cost framing sneaks in: "we've already spent two months on the spike, we should just finish." If you couldn't justify starting today, you can't justify finishing — kill the work and reallocate. The two months are gone either way.
- **Confusing "why this tool" with "why now."** A team often picks a great tool to solve a real problem at the wrong moment. The right answer to "Postgres is hitting capacity in 18 months" might be "revisit in 6 months," not "migrate to a sharded database today." Match the timing to the urgency, not the elegance of the solution.
- **Skipping the "do nothing" baseline because it feels lazy.** Engineers feel uncomfortable advocating inaction — it sounds unambitious. But the do-nothing option is a real proposal with real costs, and writing it out is the cheapest way to discover that the migration nobody questioned was never worth it.
:::

## Page checkpoint

<Quiz id="decisions-why-now-page" title="Did the 'why now?' question stick?" sampleSize={2}>

<Question
  prompt="An engineer pitches migrating from Express to Fastify 'for performance.' Per the chapter, which response best applies the 'why now?' framework?"
  options={[
    { text: "Approve — performance is always worth pursuing" },
    { text: "Reject reflexively — Fastify isn't boring enough" },
    { text: "Ask for measured P99 latency, CPU bound vs I/O, cost pressure, and a specific bug class — and reject if the answer is 'I read a benchmark blog post'" },
    { text: "Run the migration on a small service first to see if it helps" }
  ]}
  correct={2}
  explanation="The worked example walks through exactly this dialog. 'Why now' demands a concrete measured problem; if the answer is 'one engineer read a blog,' the proposal dies and saves months of partial-migration work."
  revisit={{ to: "/docs/decisions/why-now#good-reasons", label: "Worked example" }}
/>

<Question
  prompt="Which of these is a GOOD answer to 'why now?', per the chapter?"
  options={[
    { text: "'It's the latest thing and other companies use it'" },
    { text: "'We're hitting measured Postgres limits and our hiring pool is constrained by the current language'" },
    { text: "'The team is bored with the current stack'" },
    { text: "'It would look great on our engineering blog'" }
  ]}
  correct={1}
  explanation="Good 'why now?' answers are concrete, measurable problems: capacity ceilings you've hit, critical security bugs, hiring constraints, or specific bug classes the new tech eliminates. The others are vibes."
  revisit={{ to: "/docs/decisions/why-now#good-reasons", label: "Good reasons" }}
/>

<Question
  prompt="The chapter argues every adoption proposal should include one specific baseline. Which one?"
  options={[
    { text: "A comparison to what FAANG companies use" },
    { text: "An explicit 'do nothing' option with its costs and benefits" },
    { text: "A vendor's marketing deck" },
    { text: "A guarantee from the proposer that they'll own it for 5 years" }
  ]}
  correct={1}
  explanation="The 'do nothing' baseline forces the proponent to articulate what actually changes if you wait six months. If the cost of waiting is unclear, you're not at the 'why now' moment yet."
  revisit={{ to: "/docs/decisions/why-now#forcing-functions", label: "The 'do nothing' baseline" }}
/>

<Question
  prompt="What forcing functions does the chapter recommend to make 'why now?' a habit rather than an afterthought?"
  options={[
    { text: "A required 'why now?' section in RFC templates, plus migration-cost estimates before deciding" },
    { text: "Banning new technology adoption company-wide" },
    { text: "Having only the CTO answer the question" },
    { text: "Requiring a unanimous vote of senior engineers" }
  ]}
  correct={0}
  explanation="The chapter prescribes structural forcing functions: RFC templates with a 'problem this solves' section, mandatory migration-cost estimation, and tech proposals that surface the question early."
  revisit={{ to: "/docs/decisions/why-now#forcing-functions", label: "Forcing functions" }}
/>

</Quiz>

## What's next

→ Continue to [The Cost-of-Inaction Calculation](./cost-of-inaction) — sometimes the cost of *not* deciding is bigger than picking the wrong option.
