---
id: apis-graphql-trpc
title: GraphQL & tRPC
sidebar_position: 17
sidebar_label: GraphQL & tRPC
description: Two alternatives to REST. GraphQL lets clients specify exactly what they want; tRPC eliminates the API layer entirely for TypeScript-to-TypeScript apps.
---

# GraphQL & tRPC

> **In one line:** GraphQL lets the client ask for exactly what it wants. tRPC eliminates the API layer entirely for TypeScript-to-TypeScript apps.

:::tip[In plain English]
REST's main weakness: the client often needs *less* than (or more than) what the server returns, and assembling a screen takes several round trips. GraphQL fixes this by letting the *client* specify the exact shape of the response. tRPC takes it further: for TypeScript apps where both client and server are yours, it makes API calls feel like calling local functions — fully typed, no separate API contract to maintain.
:::

## GraphQL

GraphQL has a single endpoint (`/graphql`) and a query language for asking exactly what you want:

```graphql
query {
  user(id: 42) {
    name
    email
    posts(limit: 5) {
      title
      createdAt
    }
  }
}
```

The server returns exactly that shape, nothing more:

```json
{
  "data": {
    "user": {
      "name": "Tony",
      "email": "tony@x.com",
      "posts": [
        {"title": "Hello", "createdAt": "..."},
        {"title": "World", "createdAt": "..."}
      ]
    }
  }
}
```

**Pros:**
- **No over-fetching** — client asks for exactly what it needs.
- **Strong typing** via the schema — every field's type is known.
- **One round trip per screen** — instead of REST's "fetch user, then fetch posts, then fetch comments..." chain.
- **Great tooling** — schema introspection, generated TypeScript types, GraphiQL explorer.

**Cons:**
- **Complex server setup** — schema, resolvers, dataloaders, N+1 query problems.
- **Harder to cache** — every query is different, so HTTP caching mostly fails.
- **Can hide expensive queries** from operators.

:::info[Highlight: GraphQL's 2026 status]
GraphQL was hyped massively in 2017–2020 as "the future of APIs." By 2026 it's settled into a stable niche: **larger organizations with many clients consuming overlapping data benefit most.** Examples: GitHub's API, Shopify's storefront API, big enterprise federations.

For a small/mid product with one client and one backend, REST or tRPC is usually simpler. Don't introduce GraphQL just because it sounds modern — it adds real complexity.
:::

## tRPC — TypeScript Without the API

If both your frontend and backend are TypeScript, **tRPC** eliminates the API layer entirely (or at least the friction).

You define server functions:

```typescript
// server
export const appRouter = router({
  user: {
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => {
        return db.user.findUnique({ where: { id: input.id } });
      }),
  },
});
```

> **In English:** Declare one server "procedure" called `user.getById`. The `.input(z.object(...))` line uses **Zod** (a runtime schema-validation library that TypeScript can also read) to validate that callers pass `{ id: number }`. The `.query(...)` callback is what actually runs — here, a DB lookup. tRPC infers the return type automatically from that callback.

On the client, you call them like local functions:

```typescript
// client
const user = await trpc.user.getById.query({ id: 42 });
// `user` is fully typed; if you change the server signature,
// the client gets a compile error
```

> **In English:** Same name as on the server, called like a method. There's no fetch URL, no manual JSON parsing, no separate type definition — under the hood tRPC still sends an HTTP request, but you never write it by hand. The compile-time linkage between client and server is the whole selling point.

**Pros:**
- **Zero boilerplate** — no OpenAPI specs, no GraphQL schemas, no generated types.
- **End-to-end type safety** — rename a field on the server, every client usage gets a compile error.
- **Refactoring is safe** — the compiler catches mistakes that would be runtime bugs in REST/GraphQL.

**Cons:**
- **Only works for TypeScript-to-TypeScript** — not for public APIs or mobile clients in other languages.
- **Locks you into a tight coupling** between client and server.

Dominant in 2026 for full-stack TypeScript apps (Next.js + tRPC is one of the most popular combos).

:::note[Worked example: when each approach makes sense]
**Scenario 1: Personal todo app, you're the only developer.**
→ Use **tRPC**. Zero overhead, full type safety. REST is overkill.

**Scenario 2: SaaS API consumed by 5 partner companies in different languages.**
→ Use **REST** (with OpenAPI spec). Universal, well-documented.

**Scenario 3: Large org with web, iOS, Android, and 3 internal services all consuming the same data.**
→ Use **GraphQL** with a federated gateway. Each client asks for what it needs; teams iterate independently.
:::

## A side-by-side summary

| Aspect              | REST                    | GraphQL                       | tRPC                              |
|---------------------|-------------------------|-------------------------------|-----------------------------------|
| Style               | Resources + verbs       | Single endpoint + queries     | Function calls                    |
| Client specifies fields | No                  | Yes                           | Yes (by which fields the type has) |
| Caching             | HTTP-level (CDN-friendly) | Hard                       | Hard                              |
| Type safety         | Loose (OpenAPI helps)   | Strong (schema)               | Strongest (compile-time)          |
| Cross-language      | Yes                     | Yes                           | TypeScript only                   |
| Server complexity   | Low                     | High                          | Low                               |
| Best for            | Public APIs, broad reach | Large orgs, many clients    | TypeScript full-stack apps        |

:::info[Highlight: how to choose, simply]
Default to **REST**. Upgrade to **tRPC** if your stack is full-TypeScript and you control both ends. Reach for **GraphQL** only when you have multiple clients pulling overlapping data from the same source.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Adopting GraphQL for a small app "for flexibility."** GraphQL pays off when many clients pull overlapping data. For one app talking to one backend, it adds schema, resolvers, N+1 mitigations, and harder caching — without solving any problem you actually have. REST or tRPC will ship faster and break less.
- **Ignoring the N+1 query problem in resolvers.** A naive `Post.author` resolver runs one DB query per post — fetch 100 posts, run 101 queries. Use **DataLoader** (or your framework's equivalent batching primitive) from the first day, not as an emergency fix at 50,000 users.
- **Exposing tRPC as a public API.** tRPC's entire value is the end-to-end TypeScript type link between *your* server and *your* client. The moment a third party in Python or Swift needs to consume it, you've lost the magic and gained a bespoke protocol no one else understands. Use REST for the public surface; keep tRPC internal.
- **Caching GraphQL with HTTP semantics.** Every GraphQL request is a `POST /graphql` with a different body — CDNs can't cache by URL. If you want caching, you need persisted queries (turn the query into a stable ID) or a GraphQL-aware cache layer like Apollo, Urql, or a gateway.
- **Treating "fully typed" as "fully validated."** TypeScript types vanish at runtime. tRPC uses Zod (or similar) for runtime validation on the server, and you must keep those schemas honest. A type-only check passes garbage data straight to your DB.
:::

## Page checkpoint

<Quiz id="apis-graphql-trpc-page" title="Did GraphQL & tRPC stick?" sampleSize={2}>

<Question
  prompt="What's the main thing GraphQL lets the client do that REST does not?"
  options={[
    { text: "Send binary payloads" },
    { text: "Specify the exact shape of the data it wants — fields, nested relations, limits — in a single query" },
    { text: "Bypass authentication" },
    { text: "Avoid using JSON" }
  ]}
  correct={1}
  explanation="A GraphQL query describes the precise response shape: which fields, which nested relations, how many. The server returns exactly that — no over-fetching, no under-fetching, one round trip per screen."
  revisit={{ to: "/docs/foundations/apis-graphql-trpc#graphql", label: "GraphQL" }}
/>

<Question
  prompt="What's the key constraint that limits where tRPC can be used?"
  options={[
    { text: "It requires WebSockets" },
    { text: "It only works when both client and server are TypeScript — not for public APIs or non-TS mobile clients" },
    { text: "It can't talk to a database" },
    { text: "It only works on Linux servers" }
  ]}
  correct={1}
  explanation="tRPC's selling point is end-to-end type safety from the TS server to the TS client. That magic only works when both ends share TypeScript types — so it's perfect for full-stack TS apps but unsuitable for public, cross-language APIs."
  revisit={{ to: "/docs/foundations/apis-graphql-trpc#trpc--typescript-without-the-api", label: "tRPC" }}
/>

<Question
  prompt="You're building a SaaS API that 5 different partner companies will consume from Python, Ruby, and Go. Which is the best fit?"
  options={[
    { text: "tRPC, because of type safety" },
    { text: "REST (with OpenAPI), because it's universal across languages and well-documented" },
    { text: "WebSockets, because they're modern" },
    { text: "Pure GraphQL with no documentation" }
  ]}
  correct={1}
  explanation="Public APIs across multiple languages favor REST + OpenAPI. tRPC is TypeScript-only. GraphQL works but adds complexity that's only worth it when you have many clients pulling overlapping data — the partner-API case can go either way, but REST is the safe default."
  revisit={{ to: "/docs/foundations/apis-graphql-trpc#trpc--typescript-without-the-api", label: "When each approach makes sense" }}
/>

<Question
  prompt="A common downside of GraphQL compared to REST is…"
  options={[
    { text: "GraphQL can't return JSON" },
    { text: "HTTP-level caching is hard because every query is different, and server setup (resolvers, dataloaders, N+1 problems) is more complex" },
    { text: "GraphQL requires gRPC under the hood" },
    { text: "GraphQL doesn't support type definitions" }
  ]}
  correct={1}
  explanation="REST GETs are trivially cached by CDNs. GraphQL POSTs the same /graphql URL with different bodies, so HTTP caching mostly fails. Plus servers need schemas, resolvers, and N+1 mitigations — more setup."
  revisit={{ to: "/docs/foundations/apis-graphql-trpc#graphql", label: "GraphQL cons" }}
/>

</Quiz>

## What's next

→ Continue to [Real-Time APIs](./apis-realtime) where we look at when *request/response* isn't enough — chat, live dashboards, multiplayer games — and the protocols (gRPC, WebSockets, SSE) that handle real-time data.
