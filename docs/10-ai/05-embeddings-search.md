---
id: ai-embeddings
title: 'Pattern 5: Embeddings for Semantic Search'
sidebar_position: 6
sidebar_label: 5. Embeddings
description: Embeddings power semantic search, recommendations, deduplication, and clustering — useful even without an LLM.
---

# Pattern 5: Embeddings for Semantic Search

> **In one line:** Embeddings turn text into vectors where similar meanings live close together — useful for semantic search, recommendations, deduplication, and clustering, even without a chat model in the mix.

:::tip[In plain English]
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

:::note[Worked example: an embedding-powered support feature]
A SaaS team adds three features that all share one embeddings index over their support tickets:

1. **"Find similar tickets"** in the agent UI — agents instantly see how the team handled comparable issues before.
2. **Automated dedup** of incoming tickets — duplicates from the same customer get merged automatically.
3. **Weekly trend report** — embeddings clustered by week show emerging issues before they hit the dashboards.

One embedding pipeline, three features, no LLM calls at query time (embeddings are pre-computed once per ticket). Cheap, fast, and qualitatively much better than keyword search ever was.
:::

:::info[Highlight: when embeddings beat keyword search (and when they don't)]
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

## Common mistakes

:::caution[Where people commonly trip up]
- **Mixing embedding models in the same index.** Vectors from `text-embedding-3-small` and `voyage-3` live in different spaces — distances between them are meaningless. Tag every row with the model name and version, and never query across models. A migration means a full re-embed.
- **No index on the vector column.** A 1M-row pgvector table without an HNSW or IVFFlat index does a full sequential scan on every query — fine in dev, painful in prod. Add the index up front and tune `ef_search` / `lists` to your latency target.
- **Embedding raw HTML or boilerplate.** If your "documents" still contain nav menus, cookie banners, or 500 lines of repeated footer, the embeddings cluster around boilerplate instead of meaning. Strip chrome and normalize before embedding — garbage in, garbage neighbors.
- **Using cosine distance when your vectors aren't normalized.** Some embedding providers return unnormalized vectors; using cosine distance assumes unit length. Either normalize at ingest or use the distance metric the provider documents — mismatched metrics produce subtly wrong rankings that look fine until they don't.
- **Pure semantic search for exact-token lookups.** SKUs, error codes, person names, and version strings are exactly where embeddings underperform keyword search. Run hybrid (BM25 + vector) and fuse the scores — semantic for meaning, keyword for precision.
:::

## Page checkpoint

<Quiz id="ai-embeddings-page" title="Did embeddings stick?" sampleSize={2}>

<Question
  prompt="What does an embedding actually represent?"
  options={[
    { text: "A compressed copy of the original text" },
    { text: "A numeric vector positioned so that texts with similar meaning land near each other" },
    { text: "An LLM-generated summary of the text" },
    { text: "A hash that uniquely identifies the text" }
  ]}
  correct={1}
  explanation="Embeddings map text into a space where semantic similarity becomes geometric closeness. That's what makes 'find things like this' a math operation instead of a keyword match."
  revisit={{ to: "/docs/ai/ai-embeddings#semantic-search", label: "What embeddings encode" }}
/>

<Question
  prompt="A user searches for 'affordable laptops' and your embedding-based search returns results about 'budget computers' despite zero shared keywords. Why does this work?"
  options={[
    { text: "The vector DB silently translates the query for you" },
    { text: "The two phrases have similar meaning, so their embeddings sit close in vector space" },
    { text: "The LLM rewrote the query before searching" },
    { text: "Postgres pgvector includes a thesaurus by default" }
  ]}
  correct={1}
  explanation="Semantic similarity is the whole point of embeddings. Synonyms and paraphrases end up close in vector space even without shared tokens."
  revisit={{ to: "/docs/ai/ai-embeddings#semantic-search", label: "Why semantic search wins on synonyms" }}
/>

<Question
  prompt="A user searches for the exact SKU 'XJ-4471-B'. Will pure embedding search reliably find it?"
  options={[
    { text: "Yes — embeddings handle every search type well" },
    { text: "No — exact-string lookups, SKUs, and error codes are exactly where keyword search beats embeddings; hybrid search fixes this" },
    { text: "Yes, but only if you use a larger embedding model" },
    { text: "No — you must replace embeddings with full-text search entirely" }
  ]}
  correct={1}
  explanation="Embeddings struggle with rare, exact tokens. Hybrid search (embeddings + BM25 keyword search) is the standard fix — semantic for meaning, keyword for precise strings."
  revisit={{ to: "/docs/ai/ai-embeddings#semantic-search", label: "When embeddings lose" }}
/>

<Question
  prompt="In the support-team worked example, three features share one embeddings index. What does that imply about cost at query time?"
  options={[
    { text: "Every feature pays for an LLM call on each request" },
    { text: "Embeddings are computed once per ticket, so query-time cost is just the vector search — no LLM call needed" },
    { text: "Each feature must re-embed every ticket independently" },
    { text: "Embedding queries cost more than chat completions" }
  ]}
  correct={1}
  explanation="Pre-computing embeddings is the trick. At query time you embed only the user's query (or none, for item-similarity) and the vector DB does the rest — no LLM call required for search itself."
  revisit={{ to: "/docs/ai/ai-embeddings#clustering", label: "Embeddings without an LLM" }}
/>

</Quiz>

## What's next

→ Continue to [Pattern 6: Multimodal AI](./ai-multimodal) — models that handle images, audio, and video alongside text.
