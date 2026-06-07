---
id: ai-stack-summary
title: The 2026 AI Stack Summary
sidebar_position: 13
sidebar_label: 12. Stack Summary
description: A one-page reference for the dominant AI tools in 2026 — chat, embeddings, vector storage, observability, orchestration.
---

# The 2026 AI Stack Summary

> **In one line:** A pragmatic one-page reference — what most teams reach for, by job, when starting an AI feature in 2026.

:::tip[In plain English]
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

:::note[Worked example: the boring AI stack]
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

:::info[Highlight: when to deviate from the boring stack]
Most teams should follow the table. Reasonable reasons to deviate:

- **Self-hosted models (Llama, Mistral)** — strict data-residency requirements, or sustained high volume where the cost math flips.
- **Pinecone / Qdrant / Weaviate / Turbopuffer** — more than ~10M vectors, or workloads pgvector can't serve cheaply.
- **LangGraph** — a genuinely complex agent with branching state, retries, and human-in-the-loop steps.
- **Temporal** — agents that must survive infrastructure crashes and run for hours-to-days.

Every deviation is an *innovation token* (see [the boring technology rule](/docs/decisions/boring-technology)) — spend it deliberately.
:::

## Wrapping up Part 8

AI is now a standard layer in modern web apps, not an experimental novelty. The patterns are clear:

- **Streaming chat** for conversational interfaces.
- **RAG** for answering questions about your data.
- **Function calling / structured output** for connecting AI to actions.
- **Agents** for multi-step reasoning tasks.
- **Embeddings** for search, recommendations, and more.

The hard parts are cost management, evaluation, safety, and the new mental model of building with non-deterministic components. Treat AI features like any other production system — instrumented, tested, monitored — and they become reliable.

## Common mistakes

:::caution[Where people commonly trip up]
- **Picking the trendy tool over the boring one.** Adopting LangGraph for a 3-step pipeline, or Pinecone for 50k vectors, spends an innovation token you didn't need to spend. Pick the boring default unless you have a concrete, written reason the boring choice fails for *your* workload.
- **Hard-coding a single provider deep in the codebase.** Calling `anthropic.messages.create` directly all over the app means a model swap or a provider outage is a refactor. Go through the SDK's abstraction (or a thin internal wrapper) so changing models or providers is a single config edit.
- **Skipping observability "until we have real users."** By the time you have real users, you have a quality regression you can't reproduce. Wire Langfuse/Helicone on day one — free tier, ten minutes of setup, pays for itself the first time something acts up.
- **Treating self-hosted models as a free lunch.** "We'll save money by running Llama ourselves" sounds great until you're maintaining GPU infra, autoscaling, and a quantization pipeline. Self-host when you have a *specific* driver (data residency, sustained volume at scale), not as a default optimization.
- **No exit strategy from the chosen stack.** Every piece in the table is replaceable, but only if you don't let provider-specific features (custom file formats, exotic tools, proprietary eval syntax) leak everywhere. Keep prompts, schemas, and eval sets in your repo as portable artifacts — the stack is rented, the artifacts are owned.
:::

## Page checkpoint

<Quiz id="ai-stack-summary-page" title="Did the AI stack summary stick?" sampleSize={2}>

<Question
  prompt="In the 2026 'boring' AI stack, what's the default choice for vector storage in most apps?"
  options={[
    { text: "A dedicated vector DB like Pinecone, from day one" },
    { text: "pgvector inside the existing Postgres database" },
    { text: "A flat JSON file with cosine similarity computed in Node" },
    { text: "Redis with vector modules" }
  ]}
  correct={1}
  explanation="For most apps under ~10M vectors, pgvector is plenty. One database for relational and vector data keeps ops simple — only reach for a dedicated vector DB when you have a specific reason."
  revisit={{ to: "/docs/ai/ai-stack-summary", label: "The boring stack table" }}
/>

<Question
  prompt="What does 'spending an innovation token' mean in the context of deviating from the boring stack?"
  options={[
    { text: "You have to pay extra to use newer tools" },
    { text: "Every deviation from boring defaults costs team complexity and learning effort — spend it deliberately, only when the boring choice genuinely doesn't fit" },
    { text: "Innovation tokens are a feature flag system" },
    { text: "You must wait a quarter between adoption decisions" }
  ]}
  correct={1}
  explanation="Innovation tokens are a metaphor: novelty has a real cost in team capacity. Pick LangGraph, Temporal, or a specialty vector DB only when you have a concrete reason the boring choice fails."
  revisit={{ to: "/docs/ai/ai-stack-summary", label: "Innovation tokens" }}
/>

<Question
  prompt="Which scenario is a reasonable trigger to move OFF the default pgvector + hosted-model setup?"
  options={[
    { text: "You shipped your first AI feature last week" },
    { text: "You have strict data-residency requirements, or sustained high volume where the cost math flips" },
    { text: "You read a blog post praising another stack" },
    { text: "Your dev who knows pgvector left the company" }
  ]}
  correct={1}
  explanation="The page lists concrete reasons: data residency, sustained volume that justifies self-hosted, >10M vectors, agents with branching state, agents that must survive crashes. These are deliberate trade-offs, not vibes."
  revisit={{ to: "/docs/ai/ai-stack-summary", label: "When to deviate" }}
/>

<Question
  prompt="The chapter wrap-up frames cost, evaluation, and safety as the 'hard parts' of building AI. What's the common thread across all three?"
  options={[
    { text: "They are all solved by picking a better model" },
    { text: "They all force you to engineer around the fact that the LLM is a non-deterministic component — instrumented, tested, monitored — just like any other production system" },
    { text: "They are unique problems that don't apply to non-AI systems" },
    { text: "They are pure ML research problems, not software engineering" }
  ]}
  correct={1}
  explanation="The mental shift is treating the LLM as a non-deterministic production dependency. Once you instrument, eval, monitor, and guardrail it like any other critical system, AI features become reliable."
  revisit={{ to: "/docs/ai/ai-stack-summary#wrapping-up-part-8", label: "Wrapping up Part 8" }}
/>

</Quiz>

## What's next

→ Continue to [Chapter 9: Mobile & Other Ecosystems](/docs/ecosystems) — stepping beyond the web stack to mobile platforms and the major backend language ecosystems.
