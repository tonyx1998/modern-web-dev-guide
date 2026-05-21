---
id: ai-stack-summary
title: The 2026 AI Stack Summary
sidebar_position: 13
sidebar_label: 12. Stack Summary
description: A one-page reference for the dominant AI tools in 2026 — chat, embeddings, vector storage, observability, orchestration.
---

# The 2026 AI Stack Summary

> **In one line:** A pragmatic one-page reference — what most teams reach for, by job, when starting an AI feature in 2026.

:::tip In plain English
This is the "default stack" the way [Postgres + Next.js + Vercel] is the boring web default. None of these picks are mandatory — but if you don't have a *specific* reason to pick differently, these are the safe choices that most teams converge on by 2026.
:::

A typical modern app using AI:

| Need                  | Tool                                    |
|-----------------------|-----------------------------------------|
| Chat / generation     | Vercel AI SDK + Anthropic/OpenAI/Google |
| Embeddings            | OpenAI, Voyage, or Cohere               |
| Vector storage        | pgvector inside Postgres                |
| Reranking             | Cohere reranker                         |
| Streaming             | SSE via the SDK                         |
| Observability         | Langfuse or Helicone                    |
| Eval                  | Langfuse, Braintrust, or custom         |
| Agent orchestration   | Vercel AI SDK (simple) or LangGraph     |
| Durable agents        | Inngest / Trigger.dev                   |
| Self-hosted models    | Llama via Together/Fireworks/Replicate  |

:::note Worked example: the boring AI stack
A founder starts a new AI feature on a weekend. Using the table above as a "boring default":

- **Chat:** Vercel AI SDK + Claude Sonnet (Anthropic).
- **Embeddings:** OpenAI `text-embedding-3-small`.
- **Vector storage:** pgvector on the existing Postgres database (Neon free tier).
- **Streaming:** Server-Sent Events via `streamText().toDataStreamResponse()`.
- **Observability:** Langfuse free tier.
- **Eval:** Langfuse + ~50 hand-written test cases in a JSON file.

Total monthly fixed cost at the start: **$0** (free tiers). Time from `npm create` to a working streamed RAG chat: **one evening**.

Every piece can be swapped later: change model with one line, switch to Pinecone if pgvector struggles, move observability to Helicone if Langfuse stops fitting. Boring defaults compose well.
:::

:::info Highlight: when to deviate from the boring stack
Most teams should follow the table. Reasonable reasons to deviate:

- **Self-hosted models (Llama, Mistral)** — strict data-residency requirements, or sustained high volume where the cost math flips.
- **Pinecone / Qdrant / Weaviate / Turbopuffer** — more than ~10M vectors, or workloads pgvector can't serve cheaply.
- **LangGraph** — a genuinely complex agent with branching state, retries, and human-in-the-loop steps.
- **Temporal** — agents that must survive infrastructure crashes and run for hours-to-days.

Every deviation is an *innovation token* (see [the boring technology rule](/docs/decisions/boring-technology)) — spend it deliberately.
:::

## Wrapping up Part 9

AI is now a standard layer in modern web apps, not an experimental novelty. The patterns are clear:

- **Streaming chat** for conversational interfaces.
- **RAG** for answering questions about your data.
- **Function calling / structured output** for connecting AI to actions.
- **Agents** for multi-step reasoning tasks.
- **Embeddings** for search, recommendations, and more.

The hard parts are cost management, evaluation, safety, and the new mental model of building with non-deterministic components. Treat AI features like any other production system — instrumented, tested, monitored — and they become reliable.

## What's next

→ Continue to [Chapter 10: Career Path](/docs/career) — paths and learning resources for becoming (or staying) a great web developer in the AI era.
