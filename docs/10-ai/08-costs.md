---
id: ai-costs
title: Costs and Optimization
sidebar_position: 9
sidebar_label: 8. Costs
description: LLM costs can spiral quickly. Tiered models, response caching, prompt caching, context truncation, per-user rate limits, cost dashboards.
---

# Costs and Optimization

> **In one line:** LLM costs can spiral quickly — control them with tiered models, response caching, prompt caching, context truncation, per-user rate limits, and a real cost dashboard.

:::tip[In plain English]
The "obvious" way to use AI — biggest model for every call, full conversation history every turn, no caching — produces shocking bills the day you go viral. Cost optimization isn't a late-stage concern; it's table stakes from day one. Most of the techniques cost almost nothing to implement.
:::

LLM costs can spiral quickly. Common cost-control techniques:

## Choose the right model

A typical app uses multiple models:

- **Cheap, fast model** for simple tasks (classification, routing, simple Q&A).
- **Mid-tier model** for general use.
- **Expensive model** only for hard reasoning tasks.

## Cache aggressively

Many requests are duplicates. Cache responses for identical inputs.

```typescript
async function getCachedAnswer(question: string) {
  const cached = await redis.get(`answer:${hash(question)}`);
  if (cached) return JSON.parse(cached);

  const answer = await llm.generate(question);
  await redis.setex(`answer:${hash(question)}`, 3600, JSON.stringify(answer));
  return answer;
}
```

> **In English:** Before paying for an LLM call, check Redis for an answer to the exact same question (keyed by a hash of the text). If it's there, return it instantly for $0. If not, call the model, store the result for 1 hour (`setex`), and return it. For FAQ-style traffic this can cut bills 30–80%.

## Use prompt caching

Providers like Anthropic offer prompt caching: cache the static part of a long prompt (system instructions, document context); pay only for the dynamic part. Major cost reduction for RAG and long-context use cases.

## Truncate context

Don't send the whole conversation history on every turn. Summarize old messages; send recent ones in full.

## Rate-limit per user

Stop runaway costs from abuse:

```typescript
const rate = await rateLimiter.check(`ai:${userId}`, { limit: 100, window: '1d' });
if (!rate.allowed) {
  return Response.json({ error: 'Daily AI limit reached' }, { status: 429 });
}
```

## Monitor and alert on cost

Set up dashboards showing daily/weekly LLM spend. Alert on anomalies.

:::note[Worked example: a 10x cost reduction in one afternoon]
A startup launches an AI feature. Initial bill at week 1: ~$3,000. Projected at scale: $50,000+/month.

Their afternoon of optimizations:

1. **Switched routing/classification calls from Opus to Haiku.** ~70% of their calls. Cost on those calls drops ~30x. (Quality measured via evals — no regression.)
2. **Added response caching** for FAQ-style queries (same question hits the cache for 24h). Cache hit rate ends up around 40%.
3. **Enabled Anthropic prompt caching** for their RAG context (a static 3,000-token system prompt). Cuts input token cost by ~80% on cached calls.
4. **Truncated conversation history** to the last 5 turns + a rolling summary. Stops the per-turn cost from growing linearly.
5. **Added per-user daily rate limit** at 50 requests. Catches abuse before it produces a bill.

Total time: ~one afternoon. Result: next week's bill is ~$280, projected at scale ~$5,000/month. **10x reduction**, with no measurable quality loss.

The lesson: AI cost is highly compressible if you actually look at it. Most teams never do.
:::

:::info[Highlight: cost is a feature]
Treat cost optimization with the same seriousness as latency or correctness:

- **Cost dashboards** visible to everyone, not just finance.
- **Per-feature cost budgets** so individual features can be evaluated on ROI.
- **Cost regression tests** alongside latency regression tests in CI.
- **Cost anomaly alerts** with a runbook (rate-limit the abusing user, kill the runaway agent, roll back the prompt change).

A 10x cost regression from a prompt change is just as much a "bug" as a 10x latency regression. Catch it the same way.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **No spend dashboard until the bill arrives.** "We'll check the console weekly" turns into a $40k surprise the morning after launch. Wire usage and cost into the same dashboard as latency and errors from day one — and set an anomaly alert at a multiple of normal daily spend.
- **Cache key includes a timestamp or session id.** Hashing the full prompt with anything that varies per request gives you a 0% cache hit rate by accident. Hash only the semantically meaningful inputs (question text + relevant context), and verify the hit rate is non-trivial.
- **Breaking prompt caching by reordering the prompt.** Provider prompt caching keys on the static *prefix* of the prompt — putting the user's question before the long system instructions, or shuffling tool definitions, kills the cache. Keep the long static part first and append the variable parts at the end.
- **No per-user or per-feature rate limit.** One buggy client polling your chat endpoint at 10 req/s can do four-figure damage overnight. Apply rate limits at multiple layers (user, IP, feature) and have a runbook for who gets paged when the anomaly alert fires.
- **Optimizing the wrong axis.** Switching every call to a cheaper model when 90% of your spend is from one chatty agent's 50-step loop is rearranging deck chairs. Profile cost by feature first, fix the top contributor, then move on.
:::

## Page checkpoint

<Quiz id="ai-costs-page" title="Did cost management stick?" sampleSize={3}>

<Question
  prompt="What's the single highest-leverage cost optimization in most LLM apps?"
  options={[
    { text: "Switching cloud providers" },
    { text: "Routing classification, routing, and simple Q&A to a cheap small model, and only using a frontier model where it matters" },
    { text: "Disabling streaming" },
    { text: "Sending shorter system prompts" }
  ]}
  correct={1}
  explanation="Tiered models are usually the biggest win — small models are 10-30x cheaper, and most calls in a real app are bounded tasks they handle just fine. Measure with evals, then route accordingly."
  revisit={{ to: "/docs/ai/ai-costs#choose-the-right-model", label: "Tiered models" }}
/>

<Question
  prompt="What does provider-side prompt caching (e.g. Anthropic's) reduce?"
  options={[
    { text: "Output token cost only" },
    { text: "Input token cost for the static parts of a long prompt (system instructions, document context) on subsequent calls" },
    { text: "The latency of cold-starting your server" },
    { text: "Embedding storage cost" }
  ]}
  correct={1}
  explanation="Prompt caching lets the provider re-use the encoded representation of the static prefix. You pay full price once, then a sharply reduced rate for the cached portion — huge for RAG with long system prompts."
  revisit={{ to: "/docs/ai/ai-costs#use-prompt-caching", label: "Prompt caching" }}
/>

<Question
  prompt="Why is per-user rate limiting a cost-control technique, not just an abuse-prevention one?"
  options={[
    { text: "It speeds up the model" },
    { text: "It caps the worst-case spend per user, so a runaway client or scraper can't generate an unbounded bill" },
    { text: "It changes the model selected automatically" },
    { text: "It is required to use streaming" }
  ]}
  correct={1}
  explanation="Without per-user limits, one buggy client or one abuser can multiply your daily bill by 100x. The rate limiter caps blast radius — abuse prevention and cost control are the same lever."
  revisit={{ to: "/docs/ai/ai-costs#rate-limit-per-user", label: "Per-user rate limits" }}
/>

<Question
  prompt="Conversation history grows on every turn. What's the standard fix to stop per-turn cost from growing linearly?"
  options={[
    { text: "Resend the entire history every turn — context is free" },
    { text: "Truncate to the last few turns plus a rolling summary of older messages" },
    { text: "Stop letting the user reply after 10 turns" },
    { text: "Hash the history and send only the hash" }
  ]}
  correct={1}
  explanation="A long chat sent verbatim every turn balloons token cost. Keep the recent turns in full and summarize older context so the prompt stays bounded."
  revisit={{ to: "/docs/ai/ai-costs#truncate-context", label: "Truncate + summarize history" }}
/>

</Quiz>

## What's next

→ Continue to [Safety and Privacy](./ai-safety) — prompt injection, hallucinations, authorization, and PII handling.
