---
id: ai-observability
title: AI Observability
sidebar_position: 8
sidebar_label: 7. Observability
description: Production AI needs its own logging, eval, drift detection, and cost tracking. Tools — Langfuse, Helicone, LangSmith, Braintrust.
---

# AI Observability

> **In one line:** Production AI features need their own observability layer — prompts, responses, costs, latency, errors, and *quality metrics* — because the underlying model is non-deterministic and silently changes over time.

:::tip In plain English
With normal code, "did it work?" is a yes-or-no question. With AI, the response was probably *correct enough* but might be slightly wrong in a way no exception will catch. Observability for AI means logging every prompt and response, tracking cost and latency per call, and running eval datasets continuously — because that's the only way to notice your AI silently getting worse.
:::

Production AI requires its own observability layer.

## What to track

- **Every prompt and response.** For debugging, eval, and audit.
- **Cost per call.** Token counts in and out, model used, cost.
- **Latency.** Time to first token, total time.
- **Errors.** Rate limit hits, timeouts, malformed responses.
- **Quality metrics.** User feedback (thumbs up/down), task success rates.
- **Drift.** Are responses getting worse over time?

## Tools

- **Langfuse** — Open-source, comprehensive AI observability.
- **Helicone** — Drop-in proxy that adds observability.
- **LangSmith** — LangChain's own.
- **Braintrust** — Eval-focused.
- **OpenLLMetry** — OpenTelemetry-based.

## Evaluation

Beyond observability: how do you know your AI feature is good?

**Eval datasets.** A set of test inputs + expected outputs. Run regularly.

**LLM-as-judge.** Use a stronger model to evaluate the output of a weaker one.

**Human review.** Sample a percentage of production interactions for human grading.

**A/B testing.** Compare two prompt versions in production; measure user behavior.

Evaluation is genuinely hard for open-ended generation. Quality is often subjective; metrics like BLEU/ROUGE don't capture what matters. Most teams end up with custom human-graded rubrics.

:::note Worked example: catching silent quality drift
A team ships a customer-support bot. Over two months, response quality slowly degrades but no errors are thrown — they only find out when customer complaints rise.

After adding proper observability:

1. **Logged every prompt and response** to Langfuse.
2. **Built an eval set** of 50 representative customer questions, with human-graded "good" answers.
3. **Ran the eval set nightly** against the current prompt + model.
4. **Set up an alert** for any drop in eval score > 5%.

Two weeks later, the alert fires: the provider had silently updated the model. The team's eval surfaces a measurable regression on tickets about refunds. They pin the previous model version, tune the prompt, and the eval score recovers — *before* customers complain.

Without the observability + eval setup, they'd have learned about the regression from a wave of support tickets two weeks later.
:::

:::info Highlight: evals are tests for non-deterministic code
Treat evals like unit tests for AI features:

- **Version-controlled** in the repo.
- **Run on every prompt change** in CI.
- **Block merges on regressions** beyond a threshold.
- **Owned by the team that ships the feature** — not "the ML team."

A team without evals can't safely change a prompt. You can't see whether you made things better or worse. An eval set of even 30–50 examples beats no eval set by a huge margin.
:::

## What's next

→ Continue to [Costs and Optimization](./ai-costs) — the techniques that keep LLM bills from spiraling.
