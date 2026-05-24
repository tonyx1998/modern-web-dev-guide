---
id: ai-integration
title: 10. AI Integration — Overview
sidebar_position: 1
sidebar_label: AI layer intro
description: AI as a standard layer in web apps — streaming chat, RAG, function calling, agents, production operation.
---

# Part 10: AI Integration Patterns

*The new layer in modern web applications.*

> **In one line:** AI is no longer experimental — by 2026, it's a standard layer in production web apps, with its own well-defined patterns (streaming chat, RAG, function calling, agents) and its own engineering discipline (evals, observability, cost control).

:::tip[In plain English]
Five years ago, "AI" meant a separate ML research project. In 2026, AI features — chat, summarization, search, generation — are as standard in a web app as user login. Many products are *built around* AI. The patterns are layered: streaming chat is the simplest; RAG hands the model relevant documents; function calling gives it tools; agents let it work multi-step. Each builds on the previous.
:::

## Why AI is now a "layer"

By 2026, AI is no longer experimental in production web apps. Most serious software now includes some form of LLM integration: chat assistants, semantic search, content generation, classification, agents that take actions. This chapter covers how to add AI to a web app responsibly, what the dominant patterns look like, and what's different about operating AI features in production.

:::info[Jargon for this chapter]
- **LLM (Large Language Model)** — a neural network trained on huge amounts of text that takes text in and produces text out. Examples: Claude, GPT, Gemini, Llama.
- **Token** — the unit an LLM reads and writes — roughly 4 characters of English. Bills are usually quoted per million tokens, in and out separately.
- **Prompt** — the text you send into the model (often a *system prompt* with instructions + *user messages*).
- **Hallucination** — when the model produces something confident but wrong.
- **RAG (Retrieval-Augmented Generation)** — handing the model relevant documents at query time so it can answer from real data instead of guessing.
- **Embedding** — a fixed-length vector of floats that represents the meaning of a piece of text.
- **Vector DB** — a database optimized for "find the K most similar vectors" queries.
- **Tool / function calling** — letting the model emit a structured call (function name + args) that your code then executes.
- **Agent / agentic** — a setup where the model loops: tool call → observation → next tool call → ... until done.
- **MCP (Model Context Protocol)** — an open protocol for exposing tools, resources, and prompts to AI clients in a standard way. Defined in 2024, widely adopted by 2026.
:::

This is its own discipline. The skills to build a CRUD API don't fully transfer; LLMs introduce stochasticity, cost, latency, and safety considerations that traditional software doesn't have.

## The mental model

LLMs are **stochastic functions that take text in and produce text out**. Unlike a regular function:

- The output is non-deterministic (the same input can produce different outputs).
- The output may be wrong (hallucinations).
- Each call costs money (per token in and out).
- Each call has measurable latency (often seconds, not milliseconds).
- The behavior depends on prompts, temperature, model, and provider.

Building reliable systems on top of unreliable components is the central challenge. The good news: software engineering already has patterns for this (caching, retries, validation, graceful degradation). Most AI engineering is applied software engineering with a few new techniques.

:::info[Highlight: think of an LLM as a brilliant, amnesiac colleague]
An LLM is a brilliant but isolated colleague who has no memory and no access to your systems by default.

- **RAG** is *handing them a folder of relevant documents before they answer*.
- **Function calling** is *giving them permission to use your tools*.
- **Agents** are *letting them work for hours independently*.

The patterns layer: each builds on the previous one. Master them in order.
:::

## The major providers (2026)

The model landscape:

- **Anthropic Claude** — Strong reasoning, longer context, leading for coding tasks. Models in 2026 include Claude Sonnet, Claude Opus, Claude Haiku.
- **OpenAI** — Largest ecosystem, broad capabilities. GPT-4-class and successor models.
- **Google Gemini** — Strong multimodal, competitive pricing, integrated with Google Cloud.
- **Meta Llama** — Open-weight models you can self-host.
- **Mistral** — European, strong open and proprietary models.
- **Cohere** — Focus on enterprise and embeddings.
- **xAI Grok** — X-integrated.
- **Together AI, Fireworks, Groq, Replicate** — Inference platforms serving open models.

Most production apps use multiple providers via abstraction (Vercel AI SDK, LangChain) for redundancy and cost optimization.

### Choosing a model

- **Best capability:** Claude Opus, GPT (latest), Gemini Advanced.
- **Best cost/capability:** Claude Sonnet, GPT-class mid-tier, Gemini mid-tier.
- **Cheapest/fastest:** Claude Haiku, GPT mini-tier, Gemini Flash.
- **Open self-hosted:** Llama, Mistral via inference providers.

The economics: smaller models are 10–100x cheaper and faster. Use them when possible; reach for big models only when reasoning quality matters.

:::note[Worked example: a tiered model strategy for one app]
A typical mid-sized SaaS uses *multiple* models in production:

- **Classification of incoming support tickets** → Claude Haiku (fast, cheap, good enough).
- **Customer-facing chat** → Claude Sonnet (good balance of quality and cost).
- **Complex multi-step reasoning in their AI copilot** → Claude Opus (only when needed).
- **Embeddings for search** → OpenAI `text-embedding-3-small` (industry default, low cost).

This tiering can cut total AI spend by 5–10x compared to using a single top-tier model for everything — without measurable quality loss in production.
:::

## The 2026 AI stack at a glance

- **Model providers:** Anthropic (Claude), OpenAI (GPT), Google (Gemini), Mistral, Meta (Llama, open weights)
- **SDKs:** Vercel AI SDK, LangChain, LlamaIndex, native provider SDKs
- **Vector databases (for RAG):** Pinecone, Weaviate, pgvector (Postgres extension), Turbopuffer
- **Evals / observability:** Braintrust, LangSmith, internal eval suites
- **Inference hosting:** OpenAI/Anthropic API, AWS Bedrock, Azure OpenAI, self-hosted vLLM

What's hard about AI features (and what this chapter teaches you to handle): streaming UX, evals (how do you know your AI is actually good?), latency and cost management, hallucinations, prompt-injection security, observability.

:::info[Highlight: AI features are still software features]
If you only remember one thing from this chapter: **AI features need the same engineering discipline — version control, testing (evals), monitoring, rollback — as the rest of your app.**

The fact that the output is non-deterministic doesn't excuse you from instrumenting it. If anything, it raises the bar.
:::

## How this chapter is organized

Each page focuses on a single AI pattern or production concern. Read in order the first time; revisit individual pages later.

### The patterns (in order of complexity)

1. [Pattern 1: Streaming Chat](./ai-streaming-chat) — The most common AI feature; ChatGPT-style interfaces.
2. [Pattern 2: Retrieval-Augmented Generation (RAG)](./ai-rag) — Hand the model relevant documents before it answers.
3. [Pattern 3: Function Calling / Structured Output](./ai-function-calling) — Let the model call your code or return structured data.
4. [Pattern 4: Agentic Workflows](./ai-agents) — Multi-step planning and execution.
5. [Pattern 5: Embeddings for Semantic Search](./ai-embeddings) — Search, recommendations, deduplication.
6. [Pattern 6: Multimodal AI](./ai-multimodal) — Vision, audio, video.

### Operating AI in production

7. [AI Observability](./ai-observability) — Logging, evals, drift detection.
8. [Costs and Optimization](./ai-costs) — Tiered models, caching, prompt caching, rate limits.
9. [Safety and Privacy](./ai-safety) — Prompt injection, hallucinations, authorization.

### Putting it together

10. [A Complete Mini-Example: Customer Support RAG Bot](./ai-example) — End-to-end code.
11. [When Not to Use AI](./ai-when-not-to-use) — Not everything is a nail.
12. [The 2026 AI Stack Summary](./ai-stack-summary) — A pragmatic reference.

---

When you finish all 12 pages, move on to [Chapter 11: Career Path](/docs/career).
