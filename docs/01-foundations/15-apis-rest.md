---
id: apis-rest
title: REST APIs
sidebar_position: 16
sidebar_label: REST
description: The dominant style for web APIs. Resources addressed by URLs, manipulated via HTTP methods. Universal, simple, and cacheable.
---

# REST APIs

> **In one line:** Treat your data as **resources** addressed by URLs, and use HTTP methods (GET/POST/PATCH/DELETE) as the verbs. That's REST.

→ **Going deeper:** [Advanced API Design](/docs/stack/apis-advanced) covers contracts and versioning, cursor pagination, idempotency keys, and choosing between REST/GraphQL/gRPC/tRPC.

:::tip[In plain English]
A "REST API" is just a polite naming convention for web servers. URLs name *things* (`/users`, `/orders/42`). HTTP methods name *actions* on those things (GET = read, POST = create, PATCH = update, DELETE = delete). Almost every public web API in the last 15 years has used this pattern. If you can describe what you want as "do this *verb* on this *thing*," REST is a natural fit.
:::

## The pattern

REST (Representational State Transfer) treats your data as **resources** addressed by URLs, manipulated via HTTP methods.

```
GET    /users           → list users
GET    /users/42        → get user 42
POST   /users           → create a new user (with body)
PATCH  /users/42        → update part of user 42 (with body)
DELETE /users/42        → delete user 42

GET    /users/42/posts  → list posts by user 42
POST   /users/42/posts  → create a post for user 42
GET    /users/42/posts/7 → get post 7 by user 42
```

The URL describes *what*; the method describes *what to do with it*.

:::note[Worked example: design a tiny REST API in 60 seconds]
You're building a todo app. Endpoints:

```
GET    /todos          → list all my todos
POST   /todos          → create a todo (body: {title})
GET    /todos/42       → get one todo
PATCH  /todos/42       → update it (body: {done: true})
DELETE /todos/42       → delete it
```

That's it. Every modern app you've ever used has CRUD endpoints that follow this pattern.
:::

## Why REST won

REST is:

- **Universal** — Any client in any language can call it. Curl, Postman, Python's `requests`, the browser's `fetch` — all just speak HTTP.
- **Stateless** — Each request contains everything needed; no server-side session required. Any server can handle any request.
- **Cacheable** — GET responses can be cached by browsers and CDNs (huge performance win).
- **Discoverable** — URLs themselves communicate structure. A new developer can guess endpoints.

## The downsides

REST is **chatty** — assembling a single screen often requires multiple round trips:

```
1. GET /users/42        → user info
2. GET /users/42/posts  → their posts (200 of them)
3. GET /users/42/friends → their friends
4. ... per friend, GET /users/N/avatar
```

It's also prone to **over-fetching** (the API returns more than the UI needs) and **under-fetching** (the UI needs more than the API returns, requiring extra calls).

These two problems are exactly what GraphQL and tRPC were designed to solve — covered in the next page.

## REST conventions that matter

Beyond the basics, real-world REST APIs follow conventions:

- **Plural nouns for collections:** `/users` not `/user`.
- **Nested URLs for relationships:** `/users/42/posts`.
- **Query strings for filters and pagination:** `/users?role=admin&page=2&limit=20`.
- **Status codes for outcomes:** `201 Created` after a successful POST, `404 Not Found` for missing resources.
- **JSON for bodies:** Almost universal in 2026 (`Content-Type: application/json`).
- **Versioning in the URL or header:** `/v1/users` or `Accept: application/vnd.example.v1+json`.

:::info[Highlight: there is no REST police]
"RESTful" is an ideal more than a standard. Real-world APIs deviate constantly (mixing snake_case and camelCase, using POST for actions that aren't really creates, etc.). What matters is *consistency within your API* and *clear documentation*. A pragmatically-imperfect REST API beats a religiously-pure one that ships late.
:::

## Worked example: a complete REST exchange

```http
# Create a todo
POST /todos HTTP/1.1
Host: api.example.com
Content-Type: application/json
Authorization: Bearer abc123

{"title": "Buy milk"}
```

Server replies:

```http
HTTP/1.1 201 Created
Location: /todos/87
Content-Type: application/json

{"id": 87, "title": "Buy milk", "done": false, "createdAt": "2026-05-20T14:00:00Z"}
```

Then later:

```http
PATCH /todos/87 HTTP/1.1
Content-Type: application/json

{"done": true}
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{"id": 87, "title": "Buy milk", "done": true, "createdAt": "2026-05-20T14:00:00Z"}
```

That's a complete create-then-update REST flow. Every API call in every framework boils down to messages like these.

:::note[Try it yourself]
The Pokémon API is free, public, and a perfect way to practice REST:

```bash
curl https://pokeapi.co/api/v2/pokemon?limit=5
curl https://pokeapi.co/api/v2/pokemon/pikachu
curl https://pokeapi.co/api/v2/pokemon/pikachu | jq '.types[].type.name'
```

Try paginating, filtering, fetching related resources (`/pokemon/pikachu/encounters`). You'll see textbook REST design in action.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Encoding verbs in the URL.** `POST /createUser` and `POST /getUserById` aren't REST — they're RPC dressed up. The URL is the *noun* (`/users`, `/users/42`), the method is the verb. When you find yourself naming an endpoint with a verb, you've usually picked the wrong method.
- **Returning a top-level array.** `GET /users` returning `[...]` instead of `{ "data": [...], "nextCursor": "..." }` paints you into a corner — you can't add pagination metadata, total counts, or a `meta` field later without breaking every client. Wrap collections in an object from day one.
- **Using offset pagination on anything that changes.** `?page=2&limit=20` skips or duplicates rows when records are inserted between page loads. For feeds and anything mutating, use cursor-based pagination (`?cursor=...&limit=20`).
- **Versioning by changing the response shape with no warning.** Renaming `user_name` to `username` in an existing field breaks every consumer overnight. Either keep both fields for a deprecation window or bump the version (`/v2/users`).
- **Returning 200 with an `"error": "..."` body.** That's not REST — it tells every retry policy, every monitoring system, and every CDN that the request succeeded. Use the right 4xx/5xx code; put the human-readable details in the body.
:::

## Page checkpoint

<Quiz id="apis-rest-page" title="Did REST APIs stick?" sampleSize={2}>

<Question
  prompt="In REST, what's the typical way to update only the 'done' field of an existing todo without replacing the whole record?"
  options={[
    { text: "POST /todos/42 with {done: true}" },
    { text: "PATCH /todos/42 with {done: true}" },
    { text: "PUT /todos/42 with {done: true}" },
    { text: "DELETE /todos/42" }
  ]}
  correct={1}
  explanation="PATCH is the partial-update verb — merge these fields into the existing resource. PUT would REPLACE the whole todo with just {done: true}, nuking the title. POST is for creating new resources."
  revisit={{ to: "/docs/foundations/apis-rest#the-pattern", label: "The REST pattern" }}
/>

<Question
  prompt="Which of these is the strongest argument FOR REST winning so broadly?"
  options={[
    { text: "It's the fastest possible protocol" },
    { text: "It's universal: any language with an HTTP client can call it, and GETs are naturally cacheable by browsers and CDNs" },
    { text: "It enforces strict type safety" },
    { text: "It eliminates the need for a database" }
  ]}
  correct={1}
  explanation="REST won because it's just HTTP. Every language, every tool (curl, Postman, fetch) speaks it. Stateless, cacheable GETs are a huge performance win — CDNs can cache them transparently."
  revisit={{ to: "/docs/foundations/apis-rest#why-rest-won", label: "Why REST won" }}
/>

<Question
  prompt="What problem does REST struggle with that GraphQL was invented to solve?"
  options={[
    { text: "REST can't use HTTPS" },
    { text: "Chattiness — assembling one screen often requires multiple round trips and risks over-fetching or under-fetching" },
    { text: "REST requires WebSockets" },
    { text: "REST is incompatible with JSON" }
  ]}
  correct={1}
  explanation="A typical REST screen might GET /user, then GET /user/posts, then per-friend GET /user/N/avatar. That's chatty. GraphQL lets the client describe the exact shape it wants in one query."
  revisit={{ to: "/docs/foundations/apis-rest#the-downsides", label: "REST downsides" }}
/>

<Question
  prompt="After a successful POST that creates a new resource, what status code is most idiomatic for the server to return?"
  options={[
    { text: "200 OK" },
    { text: "201 Created (often with a Location header pointing at the new resource)" },
    { text: "204 No Content" },
    { text: "302 Found" }
  ]}
  correct={1}
  explanation="201 Created is the conventional REST response after a successful POST, signaling a new resource was created. 200 is acceptable but less specific; 204 means 'no body' (often used after DELETE)."
  revisit={{ to: "/docs/foundations/apis-rest#rest-conventions-that-matter", label: "REST conventions" }}
/>

</Quiz>

## What's next

→ Continue to [GraphQL & tRPC](./apis-graphql-trpc) where we'll look at the two leading alternatives to REST — both invented to fix REST's over-fetching/under-fetching problems.
