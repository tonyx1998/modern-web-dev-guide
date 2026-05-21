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

## What's next

→ Continue to [Real-Time APIs](./apis-realtime) where we look at when *request/response* isn't enough — chat, live dashboards, multiplayer games — and the protocols (gRPC, WebSockets, SSE) that handle real-time data.
