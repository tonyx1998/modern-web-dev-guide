---
id: ai-infrastructure
title: AI Infrastructure
sidebar_position: 15
sidebar_label: 14. AI Infrastructure
description: The new layer in modern web apps — model providers, SDKs, vector databases, embeddings, streaming, AI observability.
---

# AI Infrastructure

> **In one line:** AI is now a stack layer. Pick a model provider (Claude / GPT / Gemini), wrap it with the Vercel AI SDK (for streaming), store embeddings in pgvector, and watch your costs with Langfuse or Helicone.

:::tip[In plain English]
Every modern app in 2026 has at least one AI feature — chat assistance, summarization, semantic search, content generation. The AI infrastructure layer is the set of tools that makes those features practical: who you call for the model, the SDK that handles streaming and tool calls, the database that stores embeddings, and the dashboards that track cost and latency.

For deep coverage of *patterns* for AI features, see [Chapter 9: AI Integration](/docs/ai).
:::

## Model APIs

| Provider           | Strengths                                                          |
|--------------------|--------------------------------------------------------------------|
| **Anthropic Claude** | Strong reasoning, longer context, excellent for coding.           |
| **OpenAI GPT**       | Largest ecosystem, broad capabilities.                            |
| **Google Gemini**    | Strong on multimodal, good pricing.                                |
| **Cohere, Mistral, Together AI** | Open-weight model hosting.                              |

You'll often use *multiple* providers in production — different models for different tasks, with fallbacks.

## SDKs

- **Vercel AI SDK** — Dominant TypeScript abstraction; streaming chat is trivial.
- **LangChain.js / LlamaIndex** — More complex agentic workflows.

```typescript
// Vercel AI SDK — streaming chat in 10 lines:
import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

const result = streamText({
  model: anthropic('claude-opus-4-7'),
  messages: [{ role: 'user', content: 'Hello!' }],
});

// Stream to the browser:
return result.toDataStreamResponse();
```

> **In English:** `streamText` calls the Anthropic API and returns a streaming result object — *not* a finished string. `toDataStreamResponse()` wraps that stream in an HTTP response using Server-Sent Events so the browser sees tokens land one at a time. That "typewriter" effect every ChatGPT-style chat UI has is just this one-liner under the hood.

## Vector databases

(Also covered in [Databases](./databases).) **pgvector** is the popular 2026 choice — a Postgres extension, so you don't need a separate database.

## Embeddings

Models that turn text/images/audio into vectors (lists of numbers representing meaning):

- **OpenAI** — `text-embedding-3-small / large`
- **Voyage AI** — High-quality.
- **Cohere** — Multilingual.

## Streaming

Server-Sent Events (SSE) is the standard for streaming LLM responses to the browser. The Vercel AI SDK handles this for you; under the hood it uses SSE.

## AI observability

| Tool             | Notes                                                              |
|------------------|--------------------------------------------------------------------|
| **Langfuse**      | Open-source, comprehensive.                                       |
| **Helicone**      | Simple proxy that adds observability.                              |
| **LangSmith**     | LangChain's own.                                                   |
| **Braintrust**    | Eval-focused (testing prompts the way you'd test code).            |

:::info[Highlight: AI cost discipline starts on day one]
The biggest 2026 surprise for new AI feature developers: cost. A single user with a long conversation can rack up dollars in API spend if you're not careful. Habits to adopt early:

- **Cache aggressively.** Use prompt caching when the provider supports it (Anthropic and OpenAI both do).
- **Use cheaper models for cheaper tasks.** Don't call Claude Opus to classify a single sentence — use Haiku.
- **Track per-request cost.** Helicone, Langfuse, or your own metric collection.
- **Set monthly spend limits** on the provider dashboard before you ship.

One viral tweet about your app + no spend limit = an awful Monday morning.
:::

## What's next

→ Continue to [Hosting Platforms](./hosting) — where your code actually runs.
