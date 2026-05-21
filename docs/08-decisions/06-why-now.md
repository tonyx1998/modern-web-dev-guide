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

## What's next

→ Continue to [The Cost-of-Inaction Calculation](./cost-of-inaction) — sometimes the cost of *not* deciding is bigger than picking the wrong option.
