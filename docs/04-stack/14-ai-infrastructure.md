---
id: ai-infrastructure
title: AI Infrastructure
sidebar_position: 15
sidebar_label: AI Infrastructure
description: The new layer in modern web apps — model providers, SDKs, vector databases, embeddings, streaming, AI observability.
---

# AI Infrastructure

> **In one line:** AI is now a stack layer. Pick a model provider (Claude / GPT / Gemini), wrap it with the Vercel AI SDK (for streaming), store embeddings in pgvector, and watch your costs with Langfuse or Helicone.

:::tip[In plain English]
Every modern app in 2026 has at least one AI feature — chat assistance, summarization, semantic search, content generation. The AI infrastructure layer is the set of tools that makes those features practical: who you call for the model, the SDK that handles streaming and tool calls, the database that stores embeddings, and the dashboards that track cost and latency.

For deep coverage of *patterns* for AI features, see [Chapter 10: AI Integration](/docs/ai).
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

## Common mistakes

:::caution[Where people commonly trip up]
- **Shipping a chat feature with no spend cap.** One viral post + an unbounded conversation loop + Opus on every turn = a five-figure bill before lunch. Set hard monthly limits in the provider dashboard *before* you launch, not after.
- **Routing every task through the biggest model.** Classifying a sentence, rewriting a title, extracting JSON — these don't need Opus or GPT-5. Use Haiku / Mini / Flash tier models for cheap deterministic work; reserve the heavy models for genuine reasoning.
- **Calling your provider key from the browser.** Any key shipped to the client is public — anyone can pull it out of DevTools and burn your account. Always proxy through your backend; never put `OPENAI_API_KEY` in a `NEXT_PUBLIC_*` env var.
- **Skipping prompt caching when the provider supports it.** Anthropic and OpenAI both let you mark long, stable prefixes as cached — system prompts, retrieved context, conversation history — and bill the cached portion at a fraction of the cost. If you ignore this, you're paying full price to re-encode the same tokens every turn.
- **Building RAG with a separate vector DB on day one.** pgvector inside the Postgres you already operate is the right starting point. Pinecone/Qdrant/Weaviate add a service, a sync problem, and a bill. Move to one only when pgvector hits a measured wall.
- **Treating embeddings from one model as compatible with another.** OpenAI's `text-embedding-3-large` lives in a different vector space than Voyage's or Cohere's. Switching embedding models means re-embedding your entire corpus — pick deliberately, store which model produced each vector, and plan migrations.
:::

## Page checkpoint

<Quiz id="stack-ai-infrastructure-page" title="Did AI infrastructure stick?" sampleSize={2}>

<Question
  prompt="What's the role of the Vercel AI SDK in a typical 2026 AI feature?"
  options={[
    { text: "It hosts the actual large language model" },
    { text: "It's a TypeScript abstraction over model providers that makes streaming chat and tool calls trivial" },
    { text: "It's a vector database that stores your embeddings" },
    { text: "It's a billing dashboard for AI spend" }
  ]}
  correct={1}
  explanation="The Vercel AI SDK is a thin, dominant TypeScript wrapper over providers like Anthropic and OpenAI. Calls like `streamText` + `toDataStreamResponse()` give you token-by-token streaming to the browser in a few lines."
  revisit={{ to: "/docs/stack/ai-infrastructure#sdks", label: "SDKs section" }}
/>

<Question
  prompt="What is an 'embedding' in the context of AI infrastructure?"
  options={[
    { text: "A compiled binary that runs the LLM locally" },
    { text: "A vector of numbers representing the meaning of a piece of text, image, or audio — used for similarity search" },
    { text: "A secret API key embedded in environment variables" },
    { text: "A prompt template stored on disk" }
  ]}
  correct={1}
  explanation="Embeddings are high-dimensional vectors representing meaning. Stored in a vector database (often pgvector), they power semantic search and RAG by letting you find content whose meaning is close to a query."
  revisit={{ to: "/docs/stack/ai-infrastructure#embeddings", label: "Embeddings section" }}
/>

<Question
  prompt="What's the most important cost discipline to adopt on day one of building AI features?"
  options={[
    { text: "Always use the most expensive model so quality is high" },
    { text: "Cache aggressively, use cheaper models for cheaper tasks, track per-request cost, and set monthly spend limits" },
    { text: "Disable streaming so you can count tokens manually" },
    { text: "Bill users upfront for every API call you make" }
  ]}
  correct={1}
  explanation="A single long conversation can rack up dollars in API spend. Use prompt caching where available, route easy tasks to cheaper models (Haiku, not Opus), instrument per-request cost, and set provider spend limits before shipping."
  revisit={{ to: "/docs/stack/ai-infrastructure#ai-observability", label: "AI cost discipline" }}
/>

<Question
  prompt="Why does Server-Sent Events (SSE) appear in the AI infrastructure stack?"
  options={[
    { text: "Because SSE is required to authenticate model providers" },
    { text: "Because SSE is the standard transport for streaming LLM tokens to the browser — and what the Vercel AI SDK uses under the hood" },
    { text: "Because vector databases only accept inputs over SSE" },
    { text: "Because SSE is the only way to send file uploads" }
  ]}
  correct={1}
  explanation="LLM responses come token-by-token, and SSE — one-way streaming over HTTP with automatic reconnection — is the natural fit. `toDataStreamResponse()` in the Vercel AI SDK wraps the model's token stream in an SSE response."
  revisit={{ to: "/docs/stack/ai-infrastructure#streaming", label: "Streaming section" }}
/>

</Quiz>

## What's next

→ Continue to [Hosting Platforms](./hosting) — where your code actually runs.
