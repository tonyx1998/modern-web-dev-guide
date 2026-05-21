---
id: apis-rest
title: REST APIs
sidebar_position: 16
sidebar_label: 15. REST
description: The dominant style for web APIs. Resources addressed by URLs, manipulated via HTTP methods. Universal, simple, and cacheable.
---

# REST APIs

> **In one line:** Treat your data as **resources** addressed by URLs, and use HTTP methods (GET/POST/PATCH/DELETE) as the verbs. That's REST.

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

## What's next

→ Continue to [GraphQL & tRPC](./apis-graphql-trpc) where we'll look at the two leading alternatives to REST — both invented to fix REST's over-fetching/under-fetching problems.
