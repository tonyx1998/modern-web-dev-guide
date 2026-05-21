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

## What's next

→ Continue to [Safety and Privacy](./ai-safety) — prompt injection, hallucinations, authorization, and PII handling.
