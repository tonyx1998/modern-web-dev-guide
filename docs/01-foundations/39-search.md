---
id: search
title: 'Search: full-text, vector, and hybrid'
sidebar_position: 39
sidebar_label: Search
description: How search actually works under the hood — inverted indexes, BM25, tokenization, vector embeddings, ANN, and the 2026 default of hybrid search (BM25 + vector reranking).
---

# Search: full-text, vector, and hybrid

> **In one line:** Search is the problem of "given a query, return the most relevant items." There are two families — lexical (BM25 / inverted index, matches words) and semantic (vector / embedding, matches meaning) — and in 2026 the default for serious search is *hybrid*: combine both, plus a reranker for the top results.

:::tip[In plain English]
A SQL `LIKE '%foo%'` is not search. Real search ranks. Lexical search (Postgres tsvector, Elasticsearch, Meilisearch) ranks by word matches with cleverness around stems, synonyms, and rare terms. Vector search (pgvector, Pinecone, Qdrant) ranks by semantic similarity using embeddings — "car" matches "automobile." Neither alone is great for all queries: hybrid takes the best results from each and reranks them. This page is how all of that works, well enough to pick the right tool.
:::

This is a foundations-level tour. Anyone building a "find me the right thing" feature — docs search, product search, code search, RAG retrieval — needs to know what's in the toolbox.

## Why `LIKE '%foo%'` isn't search

```sql
SELECT * FROM articles WHERE body LIKE '%search%';
```

- Returns ALL matching rows, in DB order. No relevance ranking.
- Doesn't understand stemming ("search," "searching," "searches" are different to LIKE).
- Doesn't handle synonyms, typos, plurals.
- Scans every row — slow on a large table.

Real search has:
- **Ranking** (which match is best?)
- **Tokenization** (split text into terms)
- **Stemming** (treat "running" and "ran" as the same root)
- **Stop-word handling** (ignore "the," "a")
- **Synonym handling**
- **Typo tolerance** (Levenshtein distance, etc.)
- **Speed via index** (not full table scans)

## Lexical search: BM25 and the inverted index

The classical approach. Two ideas do most of the work:

### Inverted index

For each unique term in your corpus, store a sorted list of documents containing it.

```
"cat":   [doc 3, doc 7, doc 18, doc 92, ...]
"sleep": [doc 1, doc 7, doc 33, doc 92, ...]
"dog":   [doc 5, doc 18, doc 41, ...]
```

Query "cat sleep" → intersect the lists for "cat" and "sleep" → docs 7 and 92. Instant, regardless of corpus size.

### BM25 — the ranking formula

Given the matching docs, rank by relevance. BM25 (Best Matching 25) is the standard. Intuitively:

- **TF** (term frequency) — more occurrences in the doc = higher score, but with diminishing returns.
- **IDF** (inverse document frequency) — rare terms are more meaningful than common ones. ("AI" appearing isn't useful if every doc has it.)
- **Length normalization** — shorter docs with the same terms are usually more relevant.

You won't tune BM25 by hand. You'll use a search engine that does, and twiddle a few knobs (per-field boost, language).

### Stemming and tokenization

The pipeline that turns "The cats were sleeping" into searchable terms:

1. **Tokenize** — split on whitespace/punctuation → ["The", "cats", "were", "sleeping"].
2. **Lowercase** → ["the", "cats", "were", "sleeping"].
3. **Stop-word remove** → ["cats", "sleeping"] (drop "the", "were").
4. **Stem** → ["cat", "sleep"].
5. Index those.

A query "the cat sleeps" goes through the same pipeline → ["cat", "sleep"] → matches.

Language-specific: English stemming (Porter, Snowball), CJK tokenization (different — no whitespace separators), agglutinative languages (Finnish, Turkish — different stemming).

## Lexical search engines (2026)

| Engine | Strengths | Where it fits |
|--------|-----------|---------------|
| **Postgres full-text (tsvector + GIN)** | Built into your DB. No extra service. | Small/medium apps with modest search needs. |
| **Meilisearch** | Fast, typo-tolerant, simple. Good DX. | Small-medium products wanting "good search" without ops weight. |
| **Typesense** | Similar to Meilisearch; OSS-first. | Same niche; preference is taste. |
| **Elasticsearch / OpenSearch** | Full-featured, vast ecosystem, high scalability | Large products, log analytics ("the ELK stack"), complex queries. |
| **Solr** | Long-running, mature, less common in new builds | Legacy and certain enterprise. |
| **Algolia** | Hosted, fast, great DX, expensive at scale | Mid-market product search, autocomplete. |
| **Bonsai / Elastic Cloud / OpenSearch Service** | Hosted ES/OS | When you want ES but not the ops. |

**Default for v1:** Postgres tsvector. It's free, in your stack, and good enough for tens of thousands of rows. Migrate to a dedicated engine when you actually need typo tolerance, cross-language stemming, or scale Postgres can't deliver.

Postgres example:

```sql
-- Add a generated tsvector column
ALTER TABLE articles ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(body, '')), 'B')
  ) STORED;

CREATE INDEX articles_search_idx ON articles USING GIN (search_vector);

-- Query
SELECT id, title, ts_rank(search_vector, query) AS rank
FROM articles, websearch_to_tsquery('english', 'machine learning') query
WHERE search_vector @@ query
ORDER BY rank DESC
LIMIT 20;
```

Surprisingly capable. Up to ~1M rows, this performs fine.

## Vector search: semantic similarity

Lexical search misses synonyms and conceptual matches. Query "car" doesn't match "automobile" without explicit synonyms. Query "best lightweight database for embedded" doesn't match a doc titled "SQLite review" unless SQLite is in the query.

**Vector search** solves this by turning text into a numeric "embedding" — a high-dimensional vector (typically 384-3072 dimensions in 2026) where semantically similar texts have similar vectors.

```
"car"        → [0.12, -0.34, 0.55, ..., 0.91]
"automobile" → [0.13, -0.30, 0.58, ..., 0.89]
"banana"     → [-0.42, 0.71, 0.03, ..., -0.21]
```

Distance between "car" and "automobile" is small. Distance to "banana" is large.

### Embedding models

| Model | Dimensions | When |
|-------|-----------|------|
| **OpenAI `text-embedding-3-small`** | 1536 | The 2026 default. Cheap (~$0.02/M tokens), good. |
| **OpenAI `text-embedding-3-large`** | 3072 | Better quality, more cost/storage. |
| **Cohere `embed-english-v3.0`** | 1024 | Competitive; multilingual variant available. |
| **Voyage AI** | 1024 | Strong on niche domains (code, finance). |
| **`bge-large-en-v1.5`** (open) | 1024 | Self-hostable; strong on MTEB benchmark. |
| **`nomic-embed-text`** | 768 | Open, smaller. |
| **Multimodal** (CLIP, etc.) | 512+ | Embeds text + images into the same space. |

You take your corpus, embed each document (or chunk), store the vectors. At query time, embed the query, find the K nearest vectors.

### Approximate nearest neighbor (ANN)

Finding the K nearest vectors in a million-vector corpus by brute force is O(N × D) — slow. **ANN algorithms** trade a tiny bit of accuracy for huge speed gains.

Common algorithms:
- **HNSW** (Hierarchical Navigable Small World) — graph-based, the 2026 default. Very fast, very memory-hungry.
- **IVF** (Inverted File Index) — clusters the space, searches within nearest clusters. Less memory, slightly slower.
- **PQ** (Product Quantization) — compresses vectors. Lower memory, lower accuracy.
- **HNSW + PQ** — hybrid that many production systems use.

You don't implement these. The library/database does. Knobs you'll see:
- `ef_construction`, `M` (HNSW build params — quality/speed tradeoff)
- `ef_search` (query-time speed/recall knob)
- `nprobe` (IVF — how many clusters to search)

### Vector databases (2026)

| Store | Strengths |
|-------|-----------|
| **pgvector** (Postgres extension) | Vectors in your existing DB. Good up to millions of rows. The boring-and-correct choice. |
| **Qdrant** | Rust, fast, OSS-first. Self-host or cloud. |
| **Weaviate** | Schema-aware, hybrid built-in. |
| **Pinecone** | Hosted, very simple API. Pricier. |
| **Milvus / Zilliz** | High scale, complex. |
| **Turbopuffer** | Hosted, serverless, hybrid-first. Newer. |
| **LanceDB** | Embedded, file-based. Local apps. |
| **Chroma** | Lightweight, dev-friendly. |
| **Redis vector** | Vectors in Redis. Decent. |
| **Elasticsearch / OpenSearch** | Vector support in modern versions; pair with their lexical for hybrid. |

**Default for v1:** pgvector. Just like full-text, "vectors in Postgres" is the path of least resistance and usually enough.

pgvector example:

```sql
CREATE EXTENSION vector;

ALTER TABLE documents ADD COLUMN embedding vector(1536);

-- Index for fast similarity (HNSW)
CREATE INDEX ON documents USING hnsw (embedding vector_cosine_ops);

-- Query
SELECT id, title
FROM documents
ORDER BY embedding <=> $1   -- $1 is the query embedding
LIMIT 20;
```

`<=>` is cosine distance. `<->` is L2. `<#>` is inner product. Choice depends on how your embeddings are normalized; cosine is usually right.

## Hybrid search: the 2026 default

Lexical search and vector search make different mistakes. Lexical misses synonyms; vector misses exact-keyword matches.

- Query: "OpenAI gpt-4 pricing"
- Lexical: matches docs with those exact tokens. Wins on "gpt-4" being a literal string.
- Vector: matches "Anthropic Claude pricing" too, because semantically similar. Misses on exact model name.

**Hybrid search** runs both, combines the rankings.

### Reciprocal Rank Fusion (RRF)

The simplest combiner. Given two ranked lists:

```
score(doc) = sum over ranked lists of 1 / (k + rank_in_list)

where k is typically 60.
```

If doc X is rank 3 in lexical and rank 5 in vector: `score = 1/63 + 1/65`. Combined ranking sorts by score descending.

Works surprisingly well. Most "hybrid search" implementations are RRF under the hood.

### Reranking

After hybrid retrieval gives you a top-50, run them through a **cross-encoder reranker** — a model that scores query/doc pairs together (more expensive than embedding similarity, but more accurate).

Common cross-encoders:
- **Cohere Rerank** (hosted, multilingual)
- **bge-reranker-large** (open)
- **OpenAI's reranking endpoint** (newer)

Flow:

1. Retrieve top-50 via hybrid (BM25 + vector + RRF). Fast.
2. Rerank top-50 with cross-encoder. Slower, ~50-300ms.
3. Return top-10 to the user.

This three-step (lexical + vector + rerank) is the 2026 RAG retrieval default.

## Chunking and indexing strategy

For documents longer than a paragraph, you can't embed the whole thing — embeddings have a max input length and quality drops past a few hundred tokens.

**Chunk** documents into pieces (paragraphs, ~500-token windows, etc.), embed each chunk, index by chunk. Search retrieves chunks; you can deduplicate to parent documents in the UI.

Chunking strategies:

- **Fixed-size windows** (e.g., 512 tokens with 50-token overlap). Simple. Works.
- **Semantic chunks** — split on natural boundaries (paragraphs, sections). Better quality for human-readable text.
- **Hierarchical** — chunk at multiple granularities; small for precision, large for context.

For RAG (using chunks as context for an LLM), more isn't always better — you want the most relevant chunks, not all of them. See [RAG](../ai/ai-rag).

## Other patterns worth knowing

### Autocomplete / typeahead

Different from search. Latency budget: ~50ms. Prefix matching is the dominant approach.

- **Edge n-grams in Elasticsearch / Meilisearch** — pre-index every prefix.
- **Trie data structure** for small in-memory dictionaries.
- **Algolia, Typesense** — purpose-built for autocomplete.

### Faceted search

"Filter by category, price range, brand." Each facet is a sidebar count. Search engines (ES, Algolia, Meilisearch) return facet counts in the query response.

### Spelling correction / "Did you mean?"

Levenshtein distance against the dictionary of indexed terms. Most engines have this built in (`fuzziness: AUTO` in Elasticsearch, automatic in Meilisearch).

### Personalization

User's history influences ranking. Build a per-user feature vector, factor into the ranking formula. ML-heavy territory; learning-to-rank (LTR) is the technique.

### Permission filtering

Users only see what they're allowed to. Index per-doc ACLs and add a filter to every query: `AND (acl_user IN (current_user_id) OR acl_team IN current_user_teams)`.

This is one of the harder operational pieces — see [Authorization](./authorization).

## When to use what

| Use case | Stack |
|----------|-------|
| Small-medium app, "good enough" search | Postgres tsvector |
| "Search the docs" with synonyms and concepts | pgvector + tsvector + RRF |
| Product catalog with filters | Meilisearch / Typesense / Algolia |
| Logs / events at scale | Elasticsearch / OpenSearch |
| RAG retrieval | pgvector or Qdrant + reranker |
| Recommendations | Embeddings + ANN + business filters |
| Autocomplete | Algolia or edge n-grams in your engine |

:::info[Highlight: hybrid > either alone, for almost every "find me the right doc" problem]
A team picking between lexical and vector usually picks the wrong answer. Lexical is great for exact-keyword recall and very fast; vector is great for semantic matches and synonyms; *combined* you get both, and a reranker on top gives quality that beats either alone by a meaningful margin. The pgvector + tsvector + RRF combo is free, lives in Postgres, and is what most teams should default to before reaching for a specialty engine.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **`LIKE '%foo%'` for search.** No ranking, no stemming, full table scan. Almost always wrong past 1000 rows. Use Postgres' full-text or a search engine.
- **Embedding the whole document.** Past ~500 tokens, embedding quality drops. Chunk first.
- **Vector-only search.** Misses exact-keyword matches that users explicitly type (model names, SKUs, error codes). Pair with BM25.
- **No filter for permissions.** "Search returns 23 results" but the user is only allowed to see 4 of them. Filter at index time *and* query time.
- **No reranker on RAG retrieval.** Top-50 from hybrid is good; top-10 from a reranker is much better. The ~200ms latency cost is often worth it for downstream LLM quality.
- **Re-indexing entire corpus on schema change.** A million-doc reindex takes hours. Build a version-aware index swap (write to new index, switch alias, drop old).
- **Synchronous index updates on writes.** Each write blocks on the search engine. Batch and async-index instead (queue write events; a worker pushes to the index).
- **Not measuring relevance.** Search has its own evals — MRR, NDCG@K, recall@K. Build a relevance test set with example queries and expected good results; track metrics over time. Without it, "search got worse" is an angry-user-only signal.
- **Stop-word removal in domain-specific cases.** Default English stop-words (the, a, of) work for prose; for technical docs ("the" might be part of a model name) defaults can be wrong. Audit your stop-word list.
- **Skipping language analysis.** Indexing Chinese with English tokenization → garbage. Use language-aware analyzers; detect language per document if your corpus is mixed.
:::

## Page checkpoint

<Quiz id="foundations-search-page" title="Did search stick?" sampleSize={3}>

<Question
  prompt="Why is BM25 (with an inverted index) usually better than `WHERE body LIKE '%query%'` for search?"
  options={[
    { text: "LIKE doesn't work on text columns" },
    { text: "BM25 ranks by relevance (TF + IDF + length), uses an inverted index for speed at any scale, and handles stemming/stop-words. LIKE does a full table scan and returns all matches in arbitrary order with no relevance" },
    { text: "BM25 is faster than LIKE by definition" },
    { text: "LIKE doesn't support wildcards" }
  ]}
  correct={1}
  explanation="LIKE returns matches; BM25 returns *ranked* matches via an index. The combination (inverted index + ranking formula) is what makes search feel like search — and it scales."
  revisit={{ to: "/docs/foundations/search#lexical-search-bm25-and-the-inverted-index", label: "BM25 + inverted index" }}
/>

<Question
  prompt="A team's vector search returns 'Anthropic Claude pricing' when the user searches 'OpenAI gpt-4 pricing.' What's the right fix?"
  options={[
    { text: "Use a bigger embedding model" },
    { text: "Hybrid search — combine BM25 (which catches the exact 'gpt-4' string match) with vector (which catches synonyms), fuse rankings via Reciprocal Rank Fusion. Vector alone misses keyword precision; lexical alone misses semantic matches" },
    { text: "Switch to LIKE queries" },
    { text: "Train a custom embedding model" }
  ]}
  correct={1}
  explanation="Vector search excels at semantic similarity but can drift on exact keywords. Lexical handles exact strings. Hybrid (BM25 + vector + RRF) catches both — the modern default for production retrieval."
  revisit={{ to: "/docs/foundations/search#hybrid-search-the-2026-default", label: "Hybrid search" }}
/>

<Question
  prompt="A team wants the simplest possible search for their B2B SaaS, ~50k records. What should they reach for first?"
  options={[
    { text: "Self-hosted Elasticsearch cluster" },
    { text: "Postgres `tsvector` + GIN index — full-text search built into the DB you already run. Handles tens of thousands to low millions of rows comfortably, no extra service. Upgrade to a dedicated engine when you hit specific limits (typo tolerance, multi-language, scale)" },
    { text: "Pinecone" },
    { text: "Pure vector search" }
  ]}
  correct={1}
  explanation="Postgres FTS is free, in your stack, and surprisingly capable. The boring choice is the right choice until you can articulate a specific need that requires more (typos, very high scale, multi-language stemming)."
  revisit={{ to: "/docs/foundations/search#when-to-use-what", label: "Postgres FTS as default" }}
/>

<Question
  prompt="A team has a 5,000-word legal contract document. They embed the whole document as one vector. Why is search quality poor?"
  options={[
    { text: "Legal docs can't be embedded" },
    { text: "Embedding quality drops past ~500 tokens — long docs become an averaged, smeared representation that matches everything weakly. Chunk into smaller pieces (paragraphs or ~500-token windows with overlap), embed each chunk, index by chunk" },
    { text: "Vectors are too small" },
    { text: "Embeddings don't work in English" }
  ]}
  correct={1}
  explanation="One vector trying to summarize a long document loses specificity. Chunking lets each piece have its own focused representation; the query matches the most relevant chunk. Standard RAG practice."
  revisit={{ to: "/docs/foundations/search#chunking-and-indexing-strategy", label: "Chunking strategy" }}
/>

</Quiz>

## What's next

→ Continue to [SEO fundamentals](./seo).
