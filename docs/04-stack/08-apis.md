---
id: apis
title: APIs (Tools)
sidebar_position: 9
sidebar_label: APIs
description: How frontends and backends actually talk. REST, tRPC, GraphQL, gRPC, WebSockets, SSE, webhooks — and when each is the right choice.
---

# APIs (Tools)

> **In one line:** Pick REST by default. Upgrade to tRPC if you're full-TypeScript. Use GraphQL only with many clients and overlapping data. SSE for AI streaming; WebSockets for chat; webhooks for "tell me when X happens."

→ **Going deeper:** [Advanced API Design](/docs/stack/apis-advanced) covers contracts and versioning, cursor pagination, idempotency keys, and choosing between REST/GraphQL/gRPC/tRPC.

:::tip[In plain English]
The "API" question is *how* your client and server talk. Several styles exist, each for a different shape of conversation:

- **REST** — "Here's a URL, do this verb." Universal default.
- **tRPC** — "Call my server function as if it were local." Best for full-TypeScript apps.
- **GraphQL** — "Let me ask for exactly the fields I want." Best when many clients consume the same data.
- **gRPC** — "Fast binary protocol between internal services." You'll meet this at large companies.
- **WebSockets** — "Open a phone line and we can both talk anytime."
- **SSE** — "Open a phone line, server talks, I listen." Used for AI streaming.
- **Webhooks** — "Call me back when something happens on your end."

Most apps use 2–4 of these together.
:::

## REST

The default for public APIs and most internal ones. Universal, simple, language-agnostic.

**Specification:** Use **OpenAPI 3.x** to document REST APIs. Tools can generate client code, mock servers, and tests from an OpenAPI spec.

**Best practices:**

- Use plural nouns for resources (`/users`, not `/user`).
- Use proper HTTP methods and status codes.
- Version your API (`/v1/users`).
- Use pagination for list endpoints (cursor-based preferred over offset for large datasets).
- Return errors in a consistent format.

## tRPC

End-to-end type safety for TypeScript-only stacks. Eliminates the need for explicit API contracts.

```typescript
// server/router.ts
export const appRouter = router({
  user: {
    list: publicProcedure
      .input(z.object({ limit: z.number() }))
      .query(({ input }) => db.user.findMany({ take: input.limit })),
    create: protectedProcedure
      .input(z.object({ name: z.string(), email: z.string().email() }))
      .mutation(({ input, ctx }) => db.user.create({ data: input })),
  },
});

// client.tsx
const users = await trpc.user.list.query({ limit: 10 });
await trpc.user.create.mutate({ name: 'Tony', email: 'tony@example.com' });
```

> **In English:** On the server, you declare two procedures: `user.list` (a read, hence `.query`) and `user.create` (a write, hence `.mutation`). `publicProcedure` is open to anyone; `protectedProcedure` requires authentication (its `ctx` carries the logged-in user). On the client, you call them by name with the *same* shape the server expects — and if you ever rename `limit` to `take` on the server, the client gets a TypeScript error immediately.

**When to use:** Full-stack TypeScript apps where both sides are yours.
**When not to:** Public APIs, APIs consumed by non-TS clients.

## GraphQL

Single endpoint, client specifies query shape.

```graphql
query GetUserWithPosts($id: ID!) {
  user(id: $id) {
    name
    email
    posts(limit: 5) {
      title
      createdAt
    }
  }
}
```

**When to use:**
- Many clients (web, iOS, Android, partners) consuming overlapping data.
- Federated architectures (multiple teams contributing to one schema).
- Mobile clients on slow networks (one request instead of many).

**When not to:** Simple CRUD APIs; small teams; public APIs where clients expect REST conventions.

**2026 status:** Stable but less hyped than 2018. Still strong in large orgs; rarely chosen for new small projects.

## gRPC

Binary protocol, very fast. Used for service-to-service communication inside large architectures.

**When to use:** Internal services in microservices architectures, especially polyglot ones.
**When not to use:** Browser clients (requires gRPC-Web proxy, awkward).

## WebSockets

Persistent, bidirectional connection.

**When to use:** Chat, multiplayer games, collaborative editing, anywhere two-way real-time is essential.

**Libraries:** `ws` (Node), Socket.io (adds reconnection and rooms), Partykit (edge-friendly).

## Server-Sent Events (SSE)

Long-lived HTTP connection where the server streams text events to the client. One-way only.

**When to use:** Streaming LLM responses (the dominant 2026 use case), live dashboards, notifications.

**Why SSE over WebSockets for these:** Simpler, works with HTTP/2 multiplexing, automatic reconnection in browsers.

## Webhooks

The server calls back to your endpoint when something happens (Stripe payments, GitHub events, etc.).

**Implementation tips:**

- Always verify the signature (don't trust the source IP).
- Be idempotent — webhooks can fire multiple times.
- Return 200 quickly; do work async.
- Have a replay mechanism for missed webhooks.

:::info[Highlight: webhook security is non-negotiable]
A webhook endpoint is, by definition, accessible to the internet. Anyone can hit it. If you don't verify that the request *actually* came from Stripe (or whoever you expect), you're letting strangers trigger your "process payment" logic.

Every payment processor sends a signature header (`Stripe-Signature`, etc.). *Always* verify it before processing the payload. This is a 5-line code change that prevents catastrophic abuse.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Adopting GraphQL for a single web client.** GraphQL pays off when many clients (web, iOS, Android, partners) need overlapping data. For a Next.js app talking to its own Postgres, you're paying schema + resolver + N+1 tax for zero benefit. Use REST, tRPC, or RSC.
- **Picking tRPC then needing a mobile or partner client.** tRPC's magic is sharing TypeScript types between server and client — non-TS clients see a barely-documented JSON-RPC blob. If you might publish your API, start with REST + OpenAPI.
- **Returning 200 with `{ error: "..." }`.** HTTP has status codes for a reason. 4xx for client errors, 5xx for server errors, 200 only when it worked. Consistent status codes make every monitoring tool, retry library, and `curl` user instantly correct.
- **Using WebSockets for one-way streaming.** Chat needs two-way; LLM token streaming, live scores, and notifications are one-way. SSE is simpler, plays nicely with HTTP/2 and proxies, reconnects automatically in the browser, and skips the WebSocket upgrade dance.
- **Trusting webhook source IPs or skipping signature verification.** A webhook endpoint is on the public internet; anyone can hit it. Always verify the provider signature (`Stripe-Signature`, `X-Hub-Signature-256`, etc.) before processing — a 5-line change that prevents strangers from triggering your "charge the user" code path.
- **Building non-idempotent webhook handlers.** Providers will retry. If your "create order" webhook fires twice on a flaky network, you create two orders. Key off the provider's event ID and dedupe.
:::

## Page checkpoint

<Quiz id="stack-apis-page" title="Did API styles stick?" sampleSize={2}>

<Question
  prompt="When is tRPC the right pick over REST?"
  options={[
    { text: "When you're publishing a public API consumed by non-TypeScript clients" },
    { text: "When both the server and the client are TypeScript and you own both ends — you get end-to-end type safety without a separate API contract" },
    { text: "When you need binary, low-latency service-to-service traffic" },
    { text: "When you need to stream tokens from an LLM to the browser" }
  ]}
  correct={1}
  explanation="tRPC eliminates the need for an explicit contract by sharing TypeScript types directly between server procedures and the client. It's only useful when you control both sides and they're both TS."
  revisit={{ to: "/docs/stack/apis#trpc", label: "tRPC section" }}
/>

<Question
  prompt="Which API style is the dominant 2026 choice for streaming LLM responses to a browser?"
  options={[
    { text: "WebSockets" },
    { text: "gRPC" },
    { text: "Server-Sent Events (SSE)" },
    { text: "GraphQL subscriptions" }
  ]}
  correct={2}
  explanation="SSE is one-way (server → client) over plain HTTP, with automatic browser reconnection and HTTP/2 multiplexing. That's exactly the shape of a streaming LLM response, which is why it's the standard."
  revisit={{ to: "/docs/stack/apis#server-sent-events-sse", label: "SSE section" }}
/>

<Question
  prompt="What's the non-negotiable rule for any webhook endpoint you expose?"
  options={[
    { text: "Always respond with 500 if you can't process the payload" },
    { text: "Trust the source IP as a security check" },
    { text: "Verify the signature header (e.g., Stripe-Signature) before processing the payload" },
    { text: "Only accept GET requests so they can be replayed easily" }
  ]}
  correct={2}
  explanation="A webhook endpoint is on the public internet — anyone can hit it. Verifying the provider's signature header is a 5-line change that prevents strangers from triggering sensitive logic."
  revisit={{ to: "/docs/stack/apis#webhooks", label: "Webhook security" }}
/>

<Question
  prompt="When is GraphQL most likely to pay for its added complexity?"
  options={[
    { text: "A small CRUD app with one client" },
    { text: "A public API where consumers expect REST conventions" },
    { text: "Many clients (web, iOS, Android, partners) consuming overlapping data, or federated schemas across teams" },
    { text: "Internal service-to-service binary traffic" }
  ]}
  correct={2}
  explanation="GraphQL shines when multiple clients fetch overlapping data and want to ask for exactly the fields they need, or when many teams contribute to one federated schema. For simple CRUD with one client, the overhead isn't worth it."
  revisit={{ to: "/docs/stack/apis#graphql", label: "GraphQL section" }}
/>

</Quiz>

## What's next

→ Continue to [Databases](./databases) — where your data lives. Spoiler: probably Postgres.
