---
id: ai-observability
title: AI Observability
sidebar_position: 8
sidebar_label: 7. Observability
description: Production AI needs its own logging, eval, drift detection, and cost tracking. Tools — Langfuse, Helicone, LangSmith, Braintrust.
---

# AI Observability

> **In one line:** Production AI features need their own observability layer — prompts, responses, costs, latency, errors, and *quality metrics* — because the underlying model is non-deterministic and silently changes over time.

:::tip[In plain English]
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

:::note[Worked example: catching silent quality drift]
A team ships a customer-support bot. Over two months, response quality slowly degrades but no errors are thrown — they only find out when customer complaints rise.

After adding proper observability:

1. **Logged every prompt and response** to Langfuse.
2. **Built an eval set** of 50 representative customer questions, with human-graded "good" answers.
3. **Ran the eval set nightly** against the current prompt + model.
4. **Set up an alert** for any drop in eval score > 5%.

Two weeks later, the alert fires: the provider had silently updated the model. The team's eval surfaces a measurable regression on tickets about refunds. They pin the previous model version, tune the prompt, and the eval score recovers — *before* customers complain.

Without the observability + eval setup, they'd have learned about the regression from a wave of support tickets two weeks later.
:::

:::info[Highlight: evals are tests for non-deterministic code]
Treat evals like unit tests for AI features:

- **Version-controlled** in the repo.
- **Run on every prompt change** in CI.
- **Block merges on regressions** beyond a threshold.
- **Owned by the team that ships the feature** — not "the ML team."

A team without evals can't safely change a prompt. You can't see whether you made things better or worse. An eval set of even 30–50 examples beats no eval set by a huge margin.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Logging only the final response.** When a user complains "the bot said something wrong," you also need the system prompt, the retrieved chunks, the tool calls, and the model + version that ran. Log the whole envelope — without it, every bug report is unreproducible.
- **Storing prompts and responses with PII in plaintext forever.** Your observability store is now a privacy liability and a prime exfiltration target. Redact PII at the logging boundary, set a retention window, and treat the trace store with the same access controls as your production DB.
- **Running evals once at launch and never again.** Provider models silently update, your prompt changes, your data shifts — a one-shot eval at launch tells you nothing six weeks later. Wire evals into CI on every prompt change and run a scheduled regression nightly.
- **Eval set hand-picked by the prompt author.** If the same person wrote the prompt and the eval set, the eval scores the prompt's blind spots out of existence. Build the eval set from real production traffic (sampled and labeled by someone else) and refresh it as patterns shift.
- **LLM-as-judge grading itself.** Using the same model under test to also grade the outputs leaks the model's biases into the score. Grade with a stronger, different model — and spot-check the judge against human ratings periodically to make sure it's still calibrated.
:::

## Page checkpoint

<Quiz id="ai-observability-page" title="Did AI observability stick?" sampleSize={3}>

<Question
  prompt="Why does AI need its own observability layer beyond regular APM/logging?"
  options={[
    { text: "LLM calls don't go over HTTP, so normal logging can't see them" },
    { text: "Responses are non-deterministic and silently drift — you need full prompt/response capture plus quality metrics, not just status codes" },
    { text: "Cloud providers refuse to log AI traffic" },
    { text: "Standard observability tools can't measure latency" }
  ]}
  correct={1}
  explanation="A normal service is mostly 'did it 500?' AI features can return responses that look fine but are quietly wrong. You need prompt/response capture, cost, latency, and ongoing quality measurement."
  revisit={{ to: "/docs/ai/ai-observability#what-to-track", label: "What AI observability tracks" }}
/>

<Question
  prompt="Which scenario does an eval set protect you against best?"
  options={[
    { text: "A 500 error from the provider" },
    { text: "A rate-limit spike at 3am" },
    { text: "The model provider silently updating the underlying model and quietly degrading answer quality" },
    { text: "Network packet loss between your server and the user" }
  ]}
  correct={2}
  explanation="Silent quality drift — a new model version, a tweaked prompt, a regression no exception ever throws — is exactly what evals catch. Without them you find out from angry customers."
  revisit={{ to: "/docs/ai/ai-observability#evaluation", label: "Evals catch silent drift" }}
/>

<Question
  prompt="Which statement matches the recommended way to treat evals?"
  options={[
    { text: "Run them once at launch and archive the results" },
    { text: "Treat them like unit tests: version-controlled, run on every prompt change in CI, block merges on regressions" },
    { text: "Only the ML team should ever look at evals" },
    { text: "Evals are unnecessary if you log every response" }
  ]}
  correct={1}
  explanation="Evals are tests for non-deterministic code. Pin them in the repo, run them on prompt changes, fail CI on regression, and let the team that ships the feature own them."
  revisit={{ to: "/docs/ai/ai-observability#evaluation", label: "Evals as tests" }}
/>

<Question
  prompt="What's a sensible role for 'LLM-as-judge' in an eval pipeline?"
  options={[
    { text: "Replace all human review forever" },
    { text: "Use a stronger model to score the output of a weaker one against a rubric, as a scalable proxy for human grading" },
    { text: "Let the model under test grade its own answers" },
    { text: "Have the LLM rewrite production data to fit the eval" }
  ]}
  correct={1}
  explanation="LLM-as-judge scales human-style grading. A stronger model evaluates the weaker production model's output, usually against a rubric — it's not a full replacement for human review but it makes large eval sets tractable."
  revisit={{ to: "/docs/ai/ai-observability#evaluation", label: "LLM-as-judge" }}
/>

</Quiz>

## What's next

→ Continue to [Costs and Optimization](./ai-costs) — the techniques that keep LLM bills from spiraling.
