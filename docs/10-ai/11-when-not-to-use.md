---
id: ai-when-not-to-use
title: When Not to Use AI
sidebar_position: 12
sidebar_label: 11. When Not to Use AI
description: AI is a hammer; not everything is a nail. When a regex, lookup table, or small ML model is cheaper and more reliable.
---

# When Not to Use AI

> **In one line:** AI is a hammer; not everything is a nail — when a regex, lookup table, or small ML model would do, AI is just an expensive, slow, non-deterministic version of the right answer.

:::tip[In plain English]
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

:::note[Worked example: a $40 bug caused by using AI for math]
A team builds an internal tool that summarizes spreadsheets. They ship a feature that "uses AI to compute the totals."

Two weeks later, a finance lead notices the totals are off by a few cents on a few rows. Cause: the LLM is occasionally rounding floats incorrectly when adding 100+ numbers. The behavior is *almost* right, which is worse than being clearly wrong — nobody caught it for two weeks.

The fix: do the math in regular code (`array.reduce((a,b) => a + b.amount, 0)`). The AI still writes the *narrative summary* ("revenue up 12% week-over-week"), but the numbers come from arithmetic. Cost: zero per request. Correctness: 100%.

Rule of thumb: **use AI for language; use code for math.**
:::

:::info[Highlight: the substitution test]
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

## Common mistakes

:::caution[Where people commonly trip up]
- **Using an LLM as a deterministic formatter.** "Make this date look like MM/DD/YYYY" or "trim this to 200 chars" through a model call introduces non-determinism, latency, and cost for a problem `date-fns` and `String.slice` solve for free. If the rule fits on a sticky note, write the function.
- **AI for arithmetic.** Models are great at *describing* numbers and terrible at *computing* them, especially across many rows or with currency. Always compute totals, percentages, taxes, and aggregations in code; let the model write the narrative around the numbers, never produce them.
- **Reaching for AI because it's faster to prototype, then never going back.** "I'll replace this with real code later" rarely happens — the AI version ships, the costs accumulate, and nobody owns the migration. Set the bar upfront: if a simple tool would work, build the simple tool, even if the AI version is 30 minutes faster to demo.
- **Ignoring the latency floor.** Even a fast frontier model adds 300-800ms minimum. For autocomplete, keystroke validation, or anything inside a tight render budget, that's disqualifying. Use a local heuristic or a small classifier; reserve the model call for the slower, higher-value paths.
- **Underrating privacy implications.** "We'll just send the row to the LLM and have it decide" can quietly route customer data, internal documents, or regulated content through a third party. Even with enterprise no-training tiers, every AI call is a data-egress decision — apply the same review you'd apply to adding any new vendor.
:::

## Page checkpoint

<Quiz id="ai-when-not-to-use-page" title="Did 'when not to use AI' stick?" sampleSize={3}>

<Question
  prompt="What is the 'substitution test' for deciding whether to use AI?"
  options={[
    { text: "Try the largest model first, then substitute smaller ones" },
    { text: "Ask: 'If I replaced this with a regex, SQL query, or 50-line script, would it work?' — if yes, prefer the simpler tool" },
    { text: "Substitute open-source models in for hosted ones to save money" },
    { text: "Substitute embeddings for keyword search by default" }
  ]}
  correct={1}
  explanation="The substitution test forces a comparison with the boring alternative. AI's strengths are language, ambiguity, and open-endedness — not deterministic transformations a regex can do for free."
  revisit={{ to: "/docs/ai/ai-when-not-to-use#often-misused-cases", label: "The substitution test" }}
/>

<Question
  prompt="A team uses an LLM to 'compute totals' from a spreadsheet and rounding errors quietly corrupt the numbers. What's the right fix?"
  options={[
    { text: "Use a bigger model" },
    { text: "Do the arithmetic in regular code; let the AI only write the narrative summary around the numbers" },
    { text: "Add more examples to the prompt" },
    { text: "Disable streaming for math responses" }
  ]}
  correct={1}
  explanation="Use AI for language; use code for math. Have the model summarize ('revenue up 12%') but compute the values with regular arithmetic — deterministic, cheap, and correct."
  revisit={{ to: "/docs/ai/ai-when-not-to-use#often-misused-cases", label: "AI for language, code for math" }}
/>

<Question
  prompt="Which task is a LEGITIMATE fit for AI rather than a simpler tool?"
  options={[
    { text: "Extracting email addresses from text" },
    { text: "Reformatting a date string" },
    { text: "Summarizing a long meeting transcript into key decisions and action items" },
    { text: "Summing a list of numbers" }
  ]}
  correct={2}
  explanation="Long-form summarization is exactly where LLMs shine. The other tasks are deterministic and better served by a regex, date-fns, or sum() — cheaper, faster, and 100% reliable."
  revisit={{ to: "/docs/ai/ai-when-not-to-use#often-misused-cases", label: "Where AI legitimately wins" }}
/>

<Question
  prompt="Which of these is a strong signal you should NOT use an LLM?"
  options={[
    { text: "The output must be open-ended natural language" },
    { text: "You need 100% deterministic behavior and a sub-100ms latency budget" },
    { text: "The input might contain synonyms and paraphrases" },
    { text: "The task involves classifying ambiguous tone" }
  ]}
  correct={1}
  explanation="LLMs are non-deterministic and add hundreds of ms of latency at minimum. Tight latency budgets plus a hard determinism requirement is exactly the wrong shape for an LLM."
  revisit={{ to: "/docs/ai/ai-when-not-to-use#dont-use-ai-when", label: "When AI is the wrong tool" }}
/>

</Quiz>

## What's next

→ Continue to [The 2026 AI Stack Summary](./ai-stack-summary) — a one-page reference for the dominant tools.
