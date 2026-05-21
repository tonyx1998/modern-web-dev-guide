---
id: ai-rag
title: 'Pattern 2: Retrieval-Augmented Generation (RAG)'
sidebar_position: 3
sidebar_label: 2. RAG
description: Hand the model relevant documents before it answers. The dominant pattern for "AI that knows about your data."
---

# Pattern 2: Retrieval-Augmented Generation (RAG)

> **In one line:** LLMs are great at reading but bad at memorizing — RAG fixes that by retrieving relevant documents from your data and stuffing them into the prompt before the model answers.

:::tip In plain English
The base LLM was trained months or years ago and has never seen your customer database, your internal docs, or last week's product update. RAG is the standard fix: turn the user's question into a vector, search your data for similar vectors, paste the top matches into the prompt, and let the model answer using that context. It plays to the LLM's strength (reading and summarizing) and around its weakness (poor memorization of specifics).
:::

LLMs can answer questions about general knowledge but not your specific data. RAG bridges that gap.

## The concept

```
User question
    │
    ▼
Convert to embedding (semantic vector)
    │
    ▼
Search vector DB for similar documents
    │
    ▼
Retrieve top K matching chunks
    │
    ▼
Construct prompt:
   "Given these documents: [retrieved chunks]
    Answer this question: [user question]"
    │
    ▼
Send to LLM
    │
    ▼
LLM answers using retrieved context
```

## Why it works

LLMs are good at:

- Reading and summarizing text.
- Answering questions from provided context.

LLMs are bad at:

- Memorizing your specific data.
- Knowing what they don't know.

RAG plays to the strength (good reading) and around the weakness (poor memorization).

## A practical RAG pipeline

**Step 1: Ingest documents.**

Take your data (PDFs, web pages, support tickets, code, whatever) and chunk it into pieces of 200–1,000 tokens.

```typescript
// Pseudo-code for ingestion
async function ingest(documents) {
  for (const doc of documents) {
    const chunks = chunkText(doc.content, { maxTokens: 500 });
    for (const chunk of chunks) {
      const embedding = await getEmbedding(chunk.text);
      await db.insert(embeddings).values({
        content: chunk.text,
        documentId: doc.id,
        embedding,  // vector of, e.g., 1536 floats
        metadata: { ...doc.metadata },
      });
    }
  }
}
```

**Step 2: Get an embedding for a query.**

Embeddings turn text into vectors in a space where similar meanings are close together.

```typescript
async function getEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });
  return response.data[0].embedding;
}
```

**Step 3: Search the vector DB.**

```typescript
async function findRelevantChunks(query: string, k = 5) {
  const queryEmbedding = await getEmbedding(query);

  // Using pgvector inside Postgres:
  return db.execute(sql`
    SELECT content, document_id
    FROM embeddings
    ORDER BY embedding <=> ${JSON.stringify(queryEmbedding)}
    LIMIT ${k}
  `);
}
```

The `<=>` operator is cosine distance. Lower distance = more similar.

**Step 4: Construct the prompt.**

```typescript
async function answer(question: string) {
  const chunks = await findRelevantChunks(question, 5);
  const context = chunks.map(c => c.content).join('\n\n---\n\n');

  const result = await generateText({
    model: anthropic('claude-sonnet-4-5'),
    system: 'Answer the user\'s question using only the provided context. If the answer isn\'t in the context, say so.',
    messages: [
      { role: 'user', content: `Context:\n${context}\n\nQuestion: ${question}` },
    ],
  });

  return result.text;
}
```

## Vector database choices

- **pgvector** (Postgres extension) — Most popular 2026 choice. One database for everything.
- **Pinecone** — Managed, easy to start with.
- **Qdrant** — Open-source, fast.
- **Weaviate** — Open-source, feature-rich.
- **Turbopuffer** — Newer, cost-optimized for large datasets.

For most apps with under 10M vectors, **pgvector is enough.** Don't add a separate vector DB unless you need to.

## Chunking strategies

How you split documents matters enormously:

- **Fixed-size chunks** — Simple; works for plain text.
- **Sentence-boundary chunks** — Don't split mid-sentence.
- **Semantic chunking** — Group related content (more sophisticated, more compute).
- **Hierarchical chunking** — Multiple chunk sizes; retrieve at different granularities.

Document type matters:

- **Markdown:** Chunk by sections.
- **Code:** Chunk by functions/classes.
- **PDFs:** Often need OCR or special parsing first.
- **Conversations:** Chunk by message groups, preserve context.

## Improving RAG quality

Out of the box, RAG often works "okay." Improvements:

1. **Hybrid search.** Combine semantic search (embeddings) with keyword search (BM25). Often better than either alone.
2. **Reranking.** After initial retrieval, use a more expensive model to rerank the top K. Cohere's reranker is popular.
3. **Query expansion.** Rephrase the user's question multiple ways; search with all variants.
4. **Better prompts.** Tell the model exactly how to use the context.
5. **Better chunks.** Iterate on chunking strategy with eval data.
6. **Metadata filtering.** Filter results by date, author, document type, etc., before semantic ranking.
7. **Citations.** Have the model cite which chunks it used; build a UI that shows sources.

## When RAG doesn't help

- **General knowledge questions.** The base model already knows.
- **Math or precise computation.** Use function calling instead.
- **Real-time data.** RAG queries an indexed snapshot; for live data, query directly.
- **Aggregations.** "How many users signed up last month?" — query the database, not embeddings.

:::note Worked example: docs bot that actually works
A team builds a "ask our docs" feature. Their iterations:

1. **v1 — naive RAG.** Chunk every doc into 500-token blocks, embed, retrieve top 5, ask the model. Result: "okay" answers, often missing key info.
2. **v2 — better chunking.** Chunk by markdown section, preserve heading context. Retrieval quality improves measurably.
3. **v3 — hybrid search.** Combine semantic search + BM25 keyword search. Catches exact-term queries the embeddings missed.
4. **v4 — reranking.** Retrieve top 20, rerank with Cohere, keep top 5. Quality jumps again.
5. **v5 — citations.** Have the model cite chunks; show them as links in the UI. Trust and verifiability up.

Each step is a measurable improvement. The lesson: RAG is not a single technique — it's a pipeline you iterate on with eval data.
:::

:::info Highlight: the most common RAG mistake
The most common RAG failure isn't bad embeddings — it's **bad chunks**. If your chunks split mid-sentence, mid-section, or away from their headings, the model gets context with no coherent meaning.

Before you optimize anything else, look at the chunks you're feeding the model. If you wouldn't be able to answer the question from those chunks alone, the model won't either.
:::

## What's next

→ Continue to [Pattern 3: Function Calling / Structured Output](./ai-function-calling) — let the AI call your code or return strictly typed JSON.
