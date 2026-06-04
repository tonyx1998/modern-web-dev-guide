---
id: apis-advanced
title: Advanced API Design
sidebar_position: 17
sidebar_label: Advanced API design
description: Beyond "return JSON" — resource modeling, versioning, pagination, idempotency, error contracts, auth/rate-limit placement, and the REST vs GraphQL vs gRPC vs tRPC decision for real systems.
---

# Advanced API Design

> **In one line:** Anyone can return JSON; the expert skill is designing an API that stays usable as it evolves — stable contracts, sane versioning, cursor pagination, idempotent writes, and consistent errors — because an API is a *promise to clients you can't redeploy*.

:::note[Level: advanced — read after you've built a CRUD API]
You've built endpoints that read and write data. This is the layer that decides whether your API is still pleasant (and unbroken) two years and a hundred clients later. It pairs with the Foundations API pages and the [Distributed Systems](/docs/distributed-systems/idempotency) idempotency material.
:::

← New here? Start with the on-ramp: [REST APIs](/docs/foundations/apis-rest).

:::tip[In plain English]
The hard part of APIs isn't making one work today — it's that *other people build on it*, and once they do, you can't casually change it without breaking them. So API design is really *contract design*: pick shapes you can live with, make changes additive, and handle the messy realities (huge result sets, retried requests, partial failures) with established patterns instead of inventing your own. Get those right and your API scales from one caller to thousands without a painful rewrite.
:::

:::info[Jargon for this chapter]
- **Contract** — the agreed shape of requests/responses clients depend on; breaking it breaks them.
- **Idempotent** — a request that has the same effect whether it runs once or many times.
- **Cursor pagination** — paging by an opaque pointer to the last item, not by page number/offset.
- **Backward-compatible change** — additive change (new optional field/endpoint) that doesn't break existing clients.
- **N+1** — making one query per item in a list instead of one batched query; a top API performance killer.
- **Idempotency key** — a client-supplied id letting the server dedupe retried writes.
:::

## Design the contract, not the endpoint

A good API is **predictable and consistent**: resources are nouns (`/orders/42/items`), HTTP verbs carry meaning (`GET` safe, `PUT`/`DELETE` idempotent, `POST` creates), status codes are honest (`201` created, `409` conflict, `422` validation, `429` rate-limited), and the *same* error shape comes back everywhere. The discipline that matters most: **changes must be backward-compatible by default** — add optional fields and new endpoints; never remove or repurpose a field clients might read. Treat every shipped field as load-bearing, because some client somewhere reads it.

## Versioning: plan for change before you need it

You will need to make breaking changes eventually. Decide *how* up front:

- **URL versioning** (`/v1/...`, `/v2/...`) — explicit, cache-friendly, the common default.
- **Header versioning** (`Accept: application/vnd.api.v2+json`) — cleaner URLs, less visible/discoverable.
- **Additive evolution** — the best "version" is often *not* versioning: keep one version and only add. Reserve a new major version for genuinely breaking redesigns, and run old + new in parallel with a deprecation window.

The mistake is shipping `/v1` with no plan, then making a breaking change *in place* and paging every integrator at once.

## Pagination: never return an unbounded list

Any endpoint returning a collection must paginate — an unbounded list is a latent outage the day the table grows. Two approaches, and the choice matters:

```http
# Offset pagination — simple, but slow on deep pages and skips/dupes rows under writes
GET /orders?limit=20&offset=10000      # DB must scan+discard 10,000 rows

# Cursor pagination — opaque pointer to the last seen item. Stable under inserts, fast at any depth.
GET /orders?limit=20&cursor=eyJpZCI6IjQyIn0
→ { "data": [...], "next_cursor": "eyJpZCI6IjYyIn0" }
```

**Prefer cursor pagination** for anything large or frequently written: offset gets linearly slower as the offset grows and silently skips/duplicates rows when items are inserted mid-paging. Offset is fine only for small, stable datasets.

:::info[Highlight: idempotent writes are how clients survive an unreliable network]
A client that sends `POST /payments` and gets no response *cannot know* whether the charge happened (the request or the reply may have been lost — see [distributed systems](/docs/distributed-systems/idempotency)). Its only safe move is to retry — which, on a naive API, double-charges. The fix is an **idempotency key**: the client sends a unique key with the write; the server records it and returns the *original* result on any repeat.

```http
POST /payments
Idempotency-Key: 9f1c-ab32-...        # client generates once, reuses on every retry
```

This is exactly how Stripe's API works, and it's non-negotiable for any write with real-world side effects (charges, emails, orders). Design the key in *before* the first duplicate charge, not after the incident. The same thinking applies to webhooks you *send*: deliver at-least-once and tell consumers to dedupe — because you can't guarantee exactly-once either.
:::

## Where cross-cutting concerns belong

Auth, rate limiting, and validation should sit at the **edge of the request, before expensive work**: authenticate → authorize → rate-limit → validate → *then* touch the database or call other services. Putting the rate-limit check first means an abusive client gets a cheap `429` instead of triggering the expensive query behind it (cost control *is* abuse control). Validation at the boundary (with a schema like Zod) means malformed data never reaches your business logic, and the validated shape becomes your trusted type from there inward.

## REST vs GraphQL vs gRPC vs tRPC

| Style | Sweet spot | Cost |
|---|---|---|
| **REST/JSON** | Public APIs, broad compatibility, caching, simplicity | Over/under-fetching; many round trips for nested data |
| **GraphQL** | Many clients with different data needs; deep nested graphs | Server complexity; caching & rate-limiting are harder; N+1 risk |
| **gRPC** | Internal service-to-service, high throughput, strict contracts | Binary, not browser-native, less human-debuggable |
| **tRPC** | Full-stack TypeScript monorepo — end-to-end types, no codegen | Tightly couples a TS client to a TS server (by design) |

The decision is about *who consumes it*: a public API → REST; a TS frontend talking to a TS backend you own → tRPC for free end-to-end types; internal microservices → gRPC; a mobile+web+partner matrix with divergent needs → GraphQL. Don't adopt GraphQL "because it's modern" — its flexibility buys real server-side complexity you only want when multiple clients genuinely need different shapes.

## Common mistakes

:::caution[Where people commonly trip up]
- **Breaking the contract in place.** Removing/renaming a field or changing a status code breaks clients you can't redeploy. Make changes additive; version for true breaks with a deprecation window.
- **Returning unbounded collections.** Fine in dev, an outage at scale. Always paginate; prefer cursors for large/active data.
- **Non-idempotent writes with no idempotency key.** Network retries double-charge/double-create. Add idempotency keys to side-effecting writes.
- **Inconsistent errors.** Different shapes/status codes per endpoint make clients write fragile special-casing. One error envelope, honest status codes, everywhere.
- **Rate-limiting/validating *after* the expensive work.** Check auth, limits, and schema at the edge so abuse and bad input are rejected cheaply.
- **Adopting GraphQL/gRPC by fashion.** Match the style to who consumes the API; the "modern" choice often adds complexity you don't need.
- **N+1 queries behind a list endpoint.** One query per row melts the DB under load. Batch/join, or use a dataloader.
:::

## Practice on your own project

:::tip[Do this on an API you've built]
1. Pick a `POST` that creates something and make it **idempotent** with an idempotency key, so a retry can't double-create.
2. Replace an `OFFSET`-based list endpoint with **cursor (keyset) pagination**.
3. Write down the **error contract** for one endpoint (response shape + status codes) and make every error path conform to it.
4. Decide where auth and rate-limiting live for that route — in shared middleware, not scattered across handlers.
:::

## Page checkpoint

<Quiz id="stack-apis-advanced-page" title="Did advanced API design stick?" sampleSize={2}>

<Question
  prompt="Why must API changes be backward-compatible (additive) by default?"
  options={[
    { text: "Because the framework enforces it" },
    { text: "Because an API is a contract that external clients you can't redeploy depend on — removing or repurposing a field breaks them; you add optional fields/endpoints and version only for genuine breaks" },
    { text: "Because JSON can't represent removed fields" },
    { text: "Because additive changes are faster to deploy" }
  ]}
  correct={1}
  explanation="Once clients build on your API you can't change its shape without breaking them, and you don't control their deploys. The discipline is additive evolution (new optional fields/endpoints), reserving a new major version + deprecation window for truly breaking redesigns."
  revisit={{ to: "/docs/stack/apis-advanced#design-the-contract-not-the-endpoint", label: "Design the contract" }}
/>

<Question
  prompt="Why prefer cursor pagination over offset pagination for large or frequently-written collections?"
  options={[
    { text: "Cursor pagination returns more results per page" },
    { text: "Offset gets linearly slower as the offset grows (the DB scans and discards rows) and skips/duplicates rows when items are inserted mid-paging; cursors are stable and fast at any depth" },
    { text: "Offset pagination doesn't work with JSON" },
    { text: "Cursor pagination avoids the need for a limit" }
  ]}
  correct={1}
  explanation="A deep `offset=10000` forces the database to scan and throw away 10,000 rows, and inserts during paging shift offsets so rows are skipped or repeated. A cursor points to the last item seen, so it's stable under writes and fast regardless of depth."
  revisit={{ to: "/docs/stack/apis-advanced#pagination-never-return-an-unbounded-list", label: "Cursor vs offset" }}
/>

<Question
  prompt="A client sends `POST /payments`, gets no response, and retries. How do you prevent a double charge?"
  options={[
    { text: "Block all retries on the client" },
    { text: "Require an idempotency key: the client sends a unique key per logical request and reuses it on retries; the server records it and returns the original result instead of charging again" },
    { text: "Switch from POST to GET" },
    { text: "Add a longer timeout so the response always arrives" }
  ]}
  correct={1}
  explanation="A lost response is indistinguishable from a lost request, so the client must retry — and a naive API double-charges. An idempotency key lets the server dedupe the retry and return the original result. It's how Stripe works and is mandatory for side-effecting writes."
  revisit={{ to: "/docs/stack/apis-advanced#where-cross-cutting-concerns-belong", label: "Idempotent writes" }}
/>

</Quiz>

## What's next

→ Continue to [Databases](/docs/stack/databases) — and its advanced companion — for the layer your API reads and writes.
