---
id: backend-frameworks
title: Backend Frameworks
sidebar_position: 8
sidebar_label: Backend Frameworks
description: What you use to build the server side. Hono, Express, Fastify, NestJS, FastAPI, Django, Rails, Spring — and when to pick each.
---

# Backend Frameworks

> **In one line:** A backend framework provides routing, request handling, middleware, and conventions for building HTTP servers. Pick based on your *language*, then on your *team's experience* — almost never on benchmarks.

:::tip[In plain English]
A backend framework is to a server what Next.js is to a UI — scaffolding that handles the boring parts (routing, parsing requests, returning JSON) so you can focus on the business logic. In TypeScript, **Hono** and **Fastify** are popular for standalone APIs; for full-stack apps, **Next.js itself is the backend** via Server Actions and route handlers. Python? **FastAPI**. Go? **Gin**. Each ecosystem has clear defaults.
:::

## Hono — the 2026 rising star

Hono is an ultra-fast, edge-friendly web framework that runs on any JavaScript runtime: Node, Bun, Deno, Cloudflare Workers, Vercel, AWS Lambda.

```typescript
import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => c.json({ hello: 'world' }));
app.post('/users', async (c) => {
  const body = await c.req.json();
  const user = await db.user.create({ data: body });
  return c.json(user, 201);
});

export default app;
```

> **In English:** Create an app, attach two route handlers (GET `/` and POST `/users`), and export it. The `c` parameter is the **context** — Hono's all-in-one wrapper around request + response. `c.req.json()` parses the request body; `c.json(user, 201)` returns a JSON response with HTTP status 201. The exported `app` is a plain handler that any runtime (Node, Bun, Cloudflare Workers) can boot directly.

**Why it's gaining traction:**

- Tiny (the core is ~14KB).
- Truly portable across runtimes (write once, deploy anywhere).
- Excellent TypeScript support.
- Fast (often tops benchmarks).

## Express / Fastify

Classic Node.js frameworks:

- **Express** is the historical default. Simple, ubiquitous, slower than alternatives.
- **Fastify** is faster, more modern, with better TypeScript support.

For new Node-only backends, **Fastify** is the conservative choice; **Hono** is the modern choice.

## NestJS

Opinionated, modular, Angular-inspired. Uses decorators, dependency injection, and a strict module system.

```typescript
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
```

**When to choose:** Larger teams, teams with Java/Spring background, projects that benefit from strong conventions.

## Next.js (as a backend)

For full-stack apps, you often don't need a separate backend at all. Next.js Server Actions and Route Handlers cover most needs:

```typescript
// app/api/users/route.ts
export async function POST(request: Request) {
  const body = await request.json();
  const user = await db.user.create({ data: body });
  return Response.json(user, { status: 201 });
}

// app/users/page.tsx (Server Component)
export default async function UsersPage() {
  const users = await db.user.findMany();
  return <UserList users={users} />;
}
```

> **In English:** The first file is a Next.js **Route Handler** — exporting a function named after an HTTP method (`POST`, `GET`, etc.) wires it up to that verb on the URL `/api/users`. The second file is a **Server Component** (because it has no `"use client"` and uses `await`) that runs entirely on the server, queries the DB directly, and ships rendered HTML — no separate API call from the client needed.

This is the dominant pattern for small/medium apps in 2026.

## FastAPI (Python)

Modern Python framework with async support, automatic OpenAPI documentation, and Pydantic for validation.

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class User(BaseModel):
    name: str
    email: str

@app.post("/users")
async def create_user(user: User):
    return {"id": 1, **user.dict()}
```

> **In English:** **Pydantic** is FastAPI's validation library — declaring `User` with typed fields means any request body that doesn't match (missing `name`, wrong type) gets auto-rejected with a 422 before your function runs. The `@app.post("/users")` decorator binds the function to that URL, and FastAPI also auto-generates OpenAPI/Swagger docs from these type hints — for free.

The dominant choice for Python web APIs in 2026.

## Django (Python)

Batteries-included full-stack framework: ORM, auth, admin UI, templating, forms. Mature, opinionated, productive.

**When to choose:** Content-heavy sites, teams with existing Python/Django expertise, projects valuing convention over flexibility.

## Other notable choices

| Framework            | Language    | Notes                                          |
|----------------------|-------------|------------------------------------------------|
| **Gin / Echo / Fiber / Chi** | Go    | Most popular Go web frameworks.                |
| **Axum**             | Rust        | Modern, ergonomic Rust web framework.          |
| **Spring Boot**      | Java        | The enterprise Java default.                   |
| **ASP.NET Core**     | C#          | Microsoft's modern framework; genuinely fast.  |
| **Laravel**          | PHP         | Elegant, productive; strong ecosystem.         |
| **Rails 8**          | Ruby        | "One-person framework"; includes everything.   |

## Decision matrix

| Need                                     | Recommendation                |
|------------------------------------------|-------------------------------|
| Full-stack TypeScript app                | Next.js (no separate backend) |
| TypeScript API, edge-friendly            | Hono                          |
| TypeScript API, Node-only                | Fastify or Hono               |
| Large, structured TS backend             | NestJS                        |
| Python API, AI/ML adjacent               | FastAPI                       |
| Python content site                      | Django                        |
| Performance-critical service             | Go (Gin) or Rust (Axum)       |
| Enterprise Java                          | Spring Boot                   |
| Maximum productivity, solo dev           | Rails 8 or Laravel            |

:::info[Highlight: in 2026, "do I need a separate backend?" is the first question]
For most small-to-medium full-stack apps, the answer is *no*. Next.js (or Remix/SvelteKit/Nuxt) handles both your frontend and your backend in one deployment. Server Actions let you call server functions directly from client components without writing an API endpoint at all.

This single integration eliminates a *lot* of complexity — no separate auth setup, no separate deploy pipeline, no CORS, no cross-service debugging. Only split frontend and backend when you have a clear reason (e.g., a mobile app sharing the API).
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Splitting frontend and backend on day one out of habit.** "We'll do React + Express" sounds normal, but it doubles your deploy pipeline, your auth setup, your CORS headaches, and your debugging surface. If you're already on Next.js or SvelteKit, do the backend there until you have a concrete reason to split.
- **Picking a framework by benchmark numbers.** Fastify is "faster than Express," Hono is "faster than Fastify," and almost none of that matters for your CRUD app — the database is your bottleneck. Pick on ecosystem, team familiarity, and runtime targets.
- **Spreading business logic across Express middleware.** Auth in one `app.use()`, validation in another, logging in a third — and now a single endpoint's behavior depends on the order they were registered. Keep middleware thin (cross-cutting concerns); put business logic in explicit handlers.
- **Confusing Server Actions with API routes.** They're not the same. Server Actions are RPC-style functions you call from a component; route handlers are HTTP endpoints exposed to the world. Forms inside your app → Server Actions. Third-party integrations or mobile clients → route handlers.
- **Reaching for NestJS on a small project for the "structure."** That structure is an Angular-style module/DI tax you pay every day. NestJS earns its complexity at team size. A solo dev or small team is faster on Hono or Fastify.
:::

## Page checkpoint

<Quiz id="stack-backend-frameworks-page" title="Did backend frameworks stick?" sampleSize={3}>

<Question
  prompt="What's the page's first question to ask before picking a backend framework for a new full-stack app in 2026?"
  options={[
    { text: "Which framework wins the latest benchmark?" },
    { text: "Do I even need a separate backend, or can Next.js (or Remix/SvelteKit/Nuxt) handle both sides?" },
    { text: "Is GraphQL or REST faster on this hardware?" },
    { text: "Do I want to write the backend in Go or in Rust?" }
  ]}
  correct={1}
  explanation="For most small-to-medium full-stack apps the answer is no — Server Actions and route handlers cover the backend. Skipping a separate backend eliminates a lot of complexity (auth, deploys, CORS, cross-service debugging)."
  revisit={{ to: "/docs/stack/backend-frameworks#nextjs-as-a-backend", label: "Next.js as backend" }}
/>

<Question
  prompt="What is Hono's distinguishing feature among TypeScript backend frameworks?"
  options={[
    { text: "It's the only framework with built-in ORM support" },
    { text: "It's tiny and runs on any JS runtime: Node, Bun, Deno, Cloudflare Workers, Vercel, AWS Lambda" },
    { text: "It only runs on Cloudflare Workers" },
    { text: "It uses decorators and dependency injection like NestJS" }
  ]}
  correct={1}
  explanation="Hono is ultra-light (~14KB core) and runtime-portable: the same handler boots on Node, Bun, Deno, Cloudflare Workers, Vercel, or AWS Lambda. Write once, deploy almost anywhere."
  revisit={{ to: "/docs/stack/backend-frameworks#hono--the-2026-rising-star", label: "Hono section" }}
/>

<Question
  prompt="When is NestJS the better TypeScript backend pick over Hono or Fastify?"
  options={[
    { text: "When you want the smallest possible bundle on Cloudflare Workers" },
    { text: "When you want maximum freedom and minimal conventions" },
    { text: "Larger teams or teams with a Java/Spring background that benefit from strong, opinionated conventions" },
    { text: "When the app is a single static page with no backend logic" }
  ]}
  correct={2}
  explanation="NestJS is opinionated and modular, with decorators and DI — Angular-style. It shines for larger teams or backgrounds (Java/Spring) that want strict conventions rather than minimalist freedom."
  revisit={{ to: "/docs/stack/backend-frameworks#nestjs", label: "NestJS section" }}
/>

<Question
  prompt="In FastAPI, what role does Pydantic play in a request handler?"
  options={[
    { text: "It runs the database migrations on startup" },
    { text: "It declares typed request/response models so invalid bodies get auto-rejected with 422 before your code runs" },
    { text: "It generates the SQL for your queries" },
    { text: "It handles authentication and authorization" }
  ]}
  correct={1}
  explanation="Pydantic models declare the expected shape of inputs. FastAPI validates incoming bodies against them and returns 422 automatically if validation fails — and uses the same models to auto-generate OpenAPI docs."
  revisit={{ to: "/docs/stack/backend-frameworks#fastapi-python", label: "FastAPI section" }}
/>

</Quiz>

## What's next

→ Continue to [APIs](./apis) — the protocols and conventions for how clients and servers actually talk to each other.
