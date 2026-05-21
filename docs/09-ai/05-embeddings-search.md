---
id: ai-embeddings
title: 'Pattern 5: Embeddings for Semantic Search'
sidebar_position: 6
sidebar_label: 5. Embeddings
description: Embeddings power semantic search, recommendations, deduplication, and clustering — useful even without an LLM.
---

# Pattern 5: Embeddings for Semantic Search

> **In one line:** Embeddings turn text into vectors where similar meanings live close together — useful for semantic search, recommendations, deduplication, and clustering, even without a chat model in the mix.

:::tip In plain English
Embeddings are how you teach software what "similar meaning" looks like. Once everything you care about (documents, items, support tickets) has an embedding, finding "things like this" becomes a math problem instead of a keyword problem. "Affordable laptops" can return results about "budget computers" with zero shared words.
:::

Even without RAG, embeddings power useful features:

## Semantic search

```typescript
// Find documents similar to a query
async function search(query: string) {
  const queryEmbedding = await getEmbedding(query);
  return db.execute(sql`
    SELECT id, title, snippet
    FROM documents
    ORDER BY embedding <=> ${queryEmbedding}
    LIMIT 20
  `);
}
```

> **In English:** Embed the query, ask Postgres for the 20 documents whose stored embeddings are most similar (the `<=>` is pgvector's cosine-distance operator). No LLM call needed — embeddings alone power this search.

Returns documents matching meaning, not just keywords. "Affordable laptops" might return results about "budget computers" even with no shared words.

## Recommendations

```typescript
// Find items similar to one the user liked
async function recommendSimilar(itemId: number) {
  const item = await db.query.items.findFirst({ where: eq(items.id, itemId) });
  if (!item) return [];

  return db.execute(sql`
    SELECT id, title FROM items
    WHERE id != ${itemId}
    ORDER BY embedding <=> ${item.embedding}
    LIMIT 10
  `);
}
```

## Deduplication

Find near-duplicate content:

```typescript
async function findDuplicates(threshold = 0.05) {
  return db.execute(sql`
    SELECT a.id AS a_id, b.id AS b_id,
           a.embedding <=> b.embedding AS distance
    FROM documents a
    JOIN documents b ON a.id < b.id
    WHERE a.embedding <=> b.embedding < ${threshold}
  `);
}
```

> **In English:** Self-join the documents table to itself and keep only pairs whose embeddings are *very* close (distance under 0.05). The `a.id < b.id` clause is the standard trick to compare each pair only once.

## Clustering

Group similar items:

- Topic clustering for support tickets.
- Theme extraction from feedback.
- Anomaly detection (items far from any cluster).

:::note Worked example: an embedding-powered support feature
A SaaS team adds three features that all share one embeddings index over their support tickets:

1. **"Find similar tickets"** in the agent UI — agents instantly see how the team handled comparable issues before.
2. **Automated dedup** of incoming tickets — duplicates from the same customer get merged automatically.
3. **Weekly trend report** — embeddings clustered by week show emerging issues before they hit the dashboards.

One embedding pipeline, three features, no LLM calls at query time (embeddings are pre-computed once per ticket). Cheap, fast, and qualitatively much better than keyword search ever was.
:::

:::info Highlight: when embeddings beat keyword search (and when they don't)
Embeddings shine on:

- **Synonyms and paraphrases.** "Refund" finds tickets that say "money back" or "reimbursement."
- **Cross-language matches** (with multilingual models).
- **Concept queries** like "billing problems" matching tickets that never use that exact phrase.

Embeddings *lose* to keyword search on:

- **Exact-string lookups** (product SKUs, error codes, person names).
- **Boolean filters** ("status=open AND priority=high").
- **Rare or domain-specific terms** the embedding model wasn't trained on.

The right answer is usually **hybrid search**: run both, combine the results, and let a reranker (or simple score fusion) decide the final order.
:::

## What's next

→ Continue to [Pattern 6: Multimodal AI](./ai-multimodal) — models that handle images, audio, and video alongside text.
