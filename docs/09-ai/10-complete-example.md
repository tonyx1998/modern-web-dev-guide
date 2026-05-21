---
id: ai-example
title: 'A Complete Mini-Example: Customer Support RAG Bot'
sidebar_position: 11
sidebar_label: 10. Complete Example
description: End-to-end code combining streaming, RAG, observability, and rate limiting — a real customer-support assistant in ~60 lines.
---

# A Complete Mini-Example: Customer Support RAG Bot

> **In one line:** A real customer-support assistant in ~60 lines — combining ingestion, vector retrieval, streaming generation, rate limiting, and observability.

:::tip In plain English
This page is the end-to-end glue: take everything from the previous patterns (RAG, streaming, observability, rate limits) and combine them into one working feature. The point isn't the exact code — it's seeing how little each part costs once you understand the pieces.
:::

Putting it all together — a customer support assistant that answers questions using your docs:

```typescript
// 1. Ingestion (run once / on doc updates)
async function ingestDocs() {
  const docs = await fetchDocsFromSource();
  for (const doc of docs) {
    const chunks = chunkMarkdown(doc.content, { maxTokens: 500 });
    for (const chunk of chunks) {
      const embedding = await embed(chunk.text);
      await db.insert(embeddings).values({
        content: chunk.text,
        docTitle: doc.title,
        docUrl: doc.url,
        embedding,
      });
    }
  }
}

// 2. Chat endpoint
// app/api/support/route.ts
export async function POST(req: Request) {
  const { messages } = await req.json();
  const userQuestion = messages[messages.length - 1].content;

  // Rate-limit per session
  const sessionId = req.headers.get('x-session-id');
  const rate = await rateLimiter.check(`support:${sessionId}`, { limit: 30, window: '1h' });
  if (!rate.allowed) {
    return Response.json({ error: 'Please slow down' }, { status: 429 });
  }

  // Retrieve relevant docs
  const queryEmbedding = await embed(userQuestion);
  const chunks = await db.execute(sql`
    SELECT content, doc_title, doc_url
    FROM embeddings
    ORDER BY embedding <=> ${queryEmbedding}
    LIMIT 5
  `);

  const context = chunks.map((c, i) =>
    `[Source ${i+1}: ${c.doc_title}]\n${c.content}`
  ).join('\n\n---\n\n');

  // Generate response
  const result = streamText({
    model: anthropic('claude-haiku-4-5'),  // Cheap for support
    system: `You are a customer support assistant for Acme Corp.

Answer questions using ONLY the provided documentation. If the answer
isn't in the docs, say "I don't have information about that. Please
contact support@acme.com for help."

Always cite sources by mentioning the document name.`,
    messages: [
      ...messages.slice(0, -1),
      {
        role: 'user',
        content: `Documentation:\n${context}\n\n---\n\nQuestion: ${userQuestion}`,
      },
    ],
    onFinish: async (event) => {
      // Log for observability
      await logInteraction({
        sessionId,
        question: userQuestion,
        response: event.text,
        tokensUsed: event.usage,
        chunks: chunks.map(c => c.doc_url),
      });
    },
  });

  return result.toDataStreamResponse();
}
```

> **In English:** Five things happen on every request, in order:
> 1. Rate-limit the session (stop runaway costs and abuse).
> 2. Embed the user's question and pull the 5 most relevant doc chunks from pgvector.
> 3. Build a context block listing each chunk with its source title.
> 4. Stream a Claude Haiku response that's instructed to use *only* those chunks and to cite sources.
> 5. On finish, log everything (question, response, tokens, which sources were used) for observability and evals.

About 60 lines of code for a real RAG-based support bot. Plus the UI, the docs ingestion script, observability, and evaluation — but the core pattern is straightforward.

:::note Worked example: mapping the code back to the patterns
Each piece of the snippet maps directly to a previous chapter:

| Code section                       | Pattern from earlier             |
|------------------------------------|----------------------------------|
| `ingestDocs()`                     | [RAG ingestion](./ai-rag)           |
| `rateLimiter.check(...)`           | [Cost control](./ai-costs)          |
| `embed(userQuestion) + ORDER BY <=>` | [Embeddings + RAG retrieval](./ai-embeddings) |
| `streamText(...)` + `toDataStreamResponse()` | [Streaming chat](./ai-streaming-chat) |
| `system: 'Answer using ONLY...'`   | [Safety: anti-hallucination](./ai-safety) |
| `onFinish: logInteraction(...)`    | [Observability](./ai-observability) |
| Choice of `claude-haiku-4-5`       | [Tiered models](./ai-costs)         |

This isn't a toy. It's the *shape* of every real RAG product in 2026 — just with more UI polish, better chunking, and a much bigger eval set.
:::

:::info Highlight: what's still missing in the snippet (and worth adding before you ship)
The 60-line snippet is honest about the happy path. Real production deployments also need:

- **Eval set** with 50+ representative questions, run on every prompt change (see [observability](./ai-observability)).
- **Citation UI** showing which sources the answer used (linking to `doc_url`).
- **Fallback path** when retrieval returns no relevant chunks (route to a human).
- **Auth check** before exposing the endpoint (rate-limiting by session is *necessary* but not *sufficient*).
- **PII redaction** if user questions might contain sensitive data (see [safety](./ai-safety)).
- **A/B testing harness** for prompt iteration.

The patterns scale to all of those. The core is unchanged.
:::

## What's next

→ Continue to [When Not to Use AI](./ai-when-not-to-use) — AI is a hammer; not everything is a nail.
