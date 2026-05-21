---
id: ai-when-not-to-use
title: When Not to Use AI
sidebar_position: 12
sidebar_label: 11. When Not to Use AI
description: AI is a hammer; not everything is a nail. When a regex, lookup table, or small ML model is cheaper and more reliable.
---

# When Not to Use AI

> **In one line:** AI is a hammer; not everything is a nail — when a regex, lookup table, or small ML model would do, AI is just an expensive, slow, non-deterministic version of the right answer.

:::tip In plain English
The hype loop pushes everyone to use LLMs for everything. That's wrong. Many tasks are cheaper, faster, more reliable, and more private if you use a regex, a SQL query, or a tiny ML model trained for the job. Reach for AI when the problem genuinely needs language understanding or generation — not when a 20-line script would handle it.
:::

AI is a hammer; not everything is a nail.

## Don't use AI when

- A regex would work.
- A simple lookup is sufficient.
- The behavior must be 100% deterministic.
- The latency budget is < 100ms.
- The cost per request can't be justified.
- The privacy implications are unacceptable.
- The failure modes are too dangerous.

## Often-misused cases

- Using AI to format data when a function would do.
- Using AI for classification when a small ML model would be cheaper.
- Using AI for math (it's bad at this; use code).
- Using AI for translation when Google Translate API exists.

The right test: "Does AI add something a simpler tool can't provide?" If not, use the simpler tool.

:::note Worked example: a $40 bug caused by using AI for math
A team builds an internal tool that summarizes spreadsheets. They ship a feature that "uses AI to compute the totals."

Two weeks later, a finance lead notices the totals are off by a few cents on a few rows. Cause: the LLM is occasionally rounding floats incorrectly when adding 100+ numbers. The behavior is *almost* right, which is worse than being clearly wrong — nobody caught it for two weeks.

The fix: do the math in regular code (`array.reduce((a,b) => a + b.amount, 0)`). The AI still writes the *narrative summary* ("revenue up 12% week-over-week"), but the numbers come from arithmetic. Cost: zero per request. Correctness: 100%.

Rule of thumb: **use AI for language; use code for math.**
:::

:::info Highlight: the substitution test
Before you reach for an LLM, ask the substitution question: **"If I replaced this with a regex, a SQL query, or a 50-line script, would it work?"**

- "Extract email addresses from text" → regex.
- "Classify into 5 fixed buckets with high accuracy" → small fine-tuned classifier or even keyword rules.
- "Sum a list of numbers" → `sum()`.
- "Translate UI strings" → professional translation or a translation API.
- "Reformat a date" → `date-fns`.
- "Open-ended Q&A about your docs" → ✅ legitimately AI.
- "Summarize a long meeting transcript" → ✅ legitimately AI.
- "Decide which tone to use in a reply email" → ✅ legitimately AI.

If a simpler tool exists, default to it. AI's strengths are language, ambiguity, and open-endedness — not deterministic transformations.
:::

## What's next

→ Continue to [The 2026 AI Stack Summary](./ai-stack-summary) — a one-page reference for the dominant tools.
