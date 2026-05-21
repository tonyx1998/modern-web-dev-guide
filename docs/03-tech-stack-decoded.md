---
id: tech-stack-decoded
title: 3. The Tech Stack, Decoded
sidebar_position: 4
sidebar_label: 3. Tech Stack
description: Every major tool in the 2026 web stack — what it does, when to use it, why it exists.
---

# Part 3: The 2026 Tech Stack Decoded

*Every major tool in modern web development — what it does, when to use it, why it exists.*

:::tip Beginner orientation
**Why this chapter looks overwhelming:** It is overwhelming — there are hundreds of tools in modern web development, and this chapter catalogs the important ones. Don't read it front-to-back like a novel. **Skim once to know what exists, then come back to specific sections when you need to make a decision.**

**The "stack" mental model:** A web application is built in layers. Each layer has its own tools:
- **Language layer:** what you write code in (TypeScript, Python, Go...)
- **Framework layer:** the scaffolding (Next.js, Django, Rails...)
- **Styling layer:** how it looks (Tailwind, CSS Modules...)
- **Data layer:** where information is stored (Postgres, MongoDB, Redis...)
- **Auth layer:** who can do what (Clerk, Auth0, custom JWT...)
- **Hosting layer:** where it runs (Vercel, AWS, Cloudflare...)
- **Observability layer:** how you know it's working (Sentry, Datadog...)

A "stack" is just one specific choice for each layer. The famous acronyms (MERN, LAMP, T3) are all just specific stack combinations.

**Why so many tools exist:** Three reasons. (1) Different tradeoffs — simple but slow, or complex but fast. (2) Different scales — a side project and an enterprise app have very different needs. (3) Different fashion cycles — JavaScript is especially prone to new frameworks emerging every few years.

**How to actually use this chapter:** When you're starting a project, read the relevant workflow chapter (4, 5, or 6) first — it'll tell you which specific tools to pick. Use this chapter as the *reference* explaining what each of those tools does and why.

**If you only remember one thing:** You don't need to know every tool. You need to know one tool per layer well enough to ship a working app, then expand from there.
:::

This file is a reference, not a tutorial. Read it linearly to get a complete map of the landscape, or jump to specific sections as needed.

For each category, you'll find: what problem the category solves, the dominant choices in 2026, what each tool is best at, and how to choose between them.

---

## 3.1 Languages

The language you choose constrains everything else: frameworks, libraries, hiring, ecosystem.

### TypeScript — The Default for Web

TypeScript adds a type system to JavaScript. Variables, function parameters, and return values can be annotated; the compiler catches type errors before runtime.

```typescript
function getUser(id: number): Promise<User | null> {
  return db.user.findUnique({ where: { id } });
}

// Error caught at compile time:
getUser("42"); // Type 'string' is not assignable to type 'number'
```

**Why it won:**
- Catches an enormous class of bugs (typos, wrong shapes, null/undefined).
- Enables industrial-strength refactoring; rename a function and the compiler finds every caller.
- Excellent editor support — autocomplete, jump-to-definition, find-references all "just work."
- The cost (a build step, occasional type wrangling) is negligible compared to the benefit at any non-trivial size.

**In 2026:** TypeScript is the default for almost every new web project. Job listings increasingly require it. Plain JavaScript persists in small scripts, learning contexts, and legacy code.

### JavaScript (Plain)

Still everywhere — runs in every browser. Plain JS is fine for:
- Tiny scripts (< 100 lines)
- Learning the fundamentals
- Legacy codebases
- Quick prototypes you'll throw away

For anything that ships, prefer TypeScript.

### Python

Dominant in AI/ML, data science, scripting, and rapid web prototyping.

**Web frameworks:**
- **FastAPI** — Modern, async, automatic OpenAPI generation. The leading choice for new Python APIs.
- **Django** — Batteries-included, mature, opinionated. Excellent for content-heavy sites.
- **Flask** — Minimal, flexible, classic.

**When to choose Python over TypeScript:**
- Heavy ML/data work (the ecosystem is unmatched).
- Existing Python team or codebase.
- Scientific computing or numerical work.
- Rapid prototyping where types feel like overhead.

**When not to choose Python:**
- You want maximum throughput (slower than Go/Rust/Node).
- You need a unified frontend/backend language.
- Strict static typing matters more than dynamic flexibility.

### Go

Designed for simple, fast, concurrent backend services.

**Strengths:**
- Compiles to a single static binary — trivial deployment.
- Fast compilation, fast runtime.
- First-class concurrency via goroutines.
- Small, learnable syntax.
- Excellent standard library.
- Dominant in cloud infrastructure (Kubernetes, Docker, Terraform are all Go).

**Web frameworks:** Gin, Echo, Fiber, Chi.

**When to choose:** Performance-sensitive services, infrastructure tools, networking-heavy code, microservices in large companies.

**Trade-off:** Less expressive than TS or Rust; some find it tedious for complex business logic.

### Rust

Systems language with memory safety, no garbage collector, and remarkable performance.

**Strengths:**
- C-level performance with safety guarantees.
- Modern type system, excellent error handling.
- Growing web ecosystem (Axum, Actix, Rocket).
- Used by Cloudflare, Discord, AWS, Microsoft for high-performance components.

**When to choose:** Latency-critical services, tooling that needs to be fast (Biome, Turbopack, Bun internals), WebAssembly modules.

**Trade-off:** Steep learning curve. Borrow checker is famously challenging. Slower iteration than dynamically-typed languages.

### Java / Kotlin

Enterprise stalwarts. Spring Boot remains the dominant Java web framework.

**Strengths:**
- Massive ecosystem, mature tooling.
- Excellent for large-team, long-lived enterprise applications.
- JVM performance is excellent.
- Kotlin is a more modern Java that runs on the JVM (also Android default).

**When you'll encounter it:** Banking, finance, healthcare, large enterprises, anywhere with a 20-year codebase.

### C# / .NET

Microsoft's enterprise platform. ASP.NET Core is genuinely modern and fast.

**Strengths:**
- Excellent performance.
- First-class Windows and Azure integration.
- Strong typing, mature tooling (Visual Studio, Rider).
- Unity (game dev) is C#.

**When you'll encounter it:** Microsoft-heavy environments, gaming, enterprise.

### PHP

Powers a huge portion of the web — WordPress alone runs ~40% of all sites.

**Modern PHP:** Laravel is genuinely productive and modern. PHP 8.x has solid type hints, JIT compilation, async features.

**When to choose:** WordPress sites, existing PHP teams, when Laravel's "convention over configuration" appeals.

### Ruby

In slow decline by usage but beloved by its remaining community.

**Rails 8** is a remarkable productivity tool — auth, deployment, background jobs, real-time, all built in. The "one-person framework" branding fits.

**When to choose:** Solo developers who want maximum productivity, teams with existing Rails expertise.

### Other Notable Languages

- **Swift** — iOS/macOS default. SwiftUI for cross-platform Apple apps.
- **Dart** — Flutter's language; popular for mobile.
- **Elixir** — Functional, BEAM VM, exceptional for real-time/concurrent systems. Phoenix LiveView is interesting.
- **Zig** — Newer systems language, used to implement Bun.

---

## 3.2 Frontend Frameworks

:::note Beginner: what is a "framework," really?
A **library** is code you call. A **framework** is code that calls you.

When you use a *library* (like Lodash or Day.js), you decide when to call it: `import { format } from 'date-fns'; format(date)`. You're in charge.

When you use a *framework* (like Next.js, Django, Rails), the framework is in charge. It runs your application. You write *pieces* (a page component, a route handler) and the framework decides when to call them. You're filling in slots in someone else's machine.

This is why people say "you don't pick libraries lightly, but you really don't pick frameworks lightly" — switching frameworks means rewriting the structure of your whole app. Switching libraries usually means changing a few function calls.
:::

The component-based UI paradigm dominates. You pick a framework based on team familiarity, ecosystem fit, and specific requirements.

### React 19 + Next.js 15 — The Dominant Combination

**React** is a library for building UIs from components. It's not a framework — it has no built-in router, data fetching, or build system. It's almost always used inside a framework.

**Next.js** is the dominant React framework. Maintained by Vercel. Includes routing, SSR, RSC, image optimization, font handling, and deployment integration.

**What's new in React 19:**
- **React Server Components (RSCs)** — Components that render only on the server. They can `await` data directly, and they ship zero JavaScript to the client.
- **`use()` hook** — Read promises and contexts inline.
- **Actions** — First-class form handling, with optimistic updates.
- **React Compiler** — Automatic memoization (no more manual `useMemo`/`useCallback`).
- **Asset loading APIs** — Better control over scripts, styles, fonts.

**What's new in Next.js 15:**
- App Router is mature (vs Pages Router which is legacy).
- **Partial Prerendering (PPR)** — Static shell + dynamic streaming holes.
- **Server Actions** — Call server functions from client components without writing API routes.
- **Turbopack** stable for dev (Webpack replacement, written in Rust).

**Why this stack dominates:**
- Largest ecosystem of components, libraries, and tutorials.
- Easiest hiring market.
- Vercel's developer experience is genuinely best-in-class.
- shadcn/ui (see styling section) was built for it.

**When not to use:**
- Content-heavy site with little interactivity → Astro is better.
- Tiny site → overkill.
- Team strongly prefers another framework.

### Vue 3.5 + Nuxt 4

**Vue** is React's main competitor. The Composition API with `<script setup>` is widely considered the most elegant frontend syntax:

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';

const count = ref(0);
const doubled = computed(() => count.value * 2);
</script>

<template>
  <button @click="count++">
    Count: {{ count }} (doubled: {{ doubled }})
  </button>
</template>
```

**Nuxt** is the Next.js equivalent — Vue with routing, SSR, modules, and deployment.

**Strengths:**
- Cleaner template syntax than JSX (subjective).
- Strong defaults and conventions.
- Massive in Europe and Asia.
- Excellent documentation.

**Trade-offs:**
- Smaller US job market than React.
- Smaller ecosystem of third-party libraries (still huge, just smaller than React).

### Svelte 5 + SvelteKit

Svelte compiles your components to vanilla JS at build time. The runtime is tiny, bundle sizes are small, and the syntax is minimalistic.

```svelte
<script lang="ts">
  let count = $state(0);
  let doubled = $derived(count * 2);
</script>

<button onclick={() => count++}>
  Count: {count} (doubled: {doubled})
</button>
```

Svelte 5 introduced **runes** (`$state`, `$derived`, `$effect`), replacing the magical reactivity of Svelte 4 with explicit primitives.

**Strengths:**
- Smaller bundles than React/Vue.
- Less boilerplate.
- Loved by developers in surveys.

**Trade-offs:**
- Smallest of the "big three" by market share.
- Fewer mature third-party components.

### SolidJS

Looks like React (JSX), but uses fine-grained reactivity instead of virtual DOM diffing. Extremely fast — often the top performer in benchmarks.

**When to choose:** Performance-critical apps, teams that want React-like ergonomics with better runtime.

**Trade-off:** Much smaller ecosystem than React.

### Astro 5 — The Content Framework

Astro is fundamentally different: **content-first, ship zero JavaScript by default.** You use components (in any framework — React, Vue, Svelte, plain HTML), and Astro figures out what actually needs JS in the browser ("islands of interactivity").

```astro
---
import Layout from '../layouts/Default.astro';
import ReactCounter from '../components/Counter.tsx';

const posts = await fetch('/api/posts').then(r => r.json());
---

<Layout>
  <h1>Blog</h1>
  {posts.map(post => <article><h2>{post.title}</h2></article>)}
  <!-- Only this component ships JS -->
  <ReactCounter client:visible />
</Layout>
```

**Best for:** Blogs, marketing sites, documentation, portfolios, anywhere content matters more than interactivity.

**Why it's special in 2026:** It produces faster, lighter sites than any JS-framework competitor for content-heavy use cases.

### Other Notable Frameworks

- **Remix** — Merged with React Router (now React Router v7). Focused on web standards.
- **Qwik** — Innovative "resumability" instead of hydration; niche but interesting.
- **Angular 19** — Still dominant in enterprises. Recently adopted signals for reactivity, modernizing significantly. Strong in banking and healthcare.
- **HTMX + AlpineJS** — A counter-movement: server-rendered HTML with small sprinklings of JS. Popular for backend-heavy stacks (Django, Rails, Laravel) that don't want a full SPA framework.

### Choosing a Frontend Framework

A decision matrix:

| Need                                | Recommendation              |
|-------------------------------------|-----------------------------|
| New full-stack web app              | Next.js (React)             |
| Content-heavy site (blog, docs)     | Astro                       |
| Vue-shop building a new app         | Nuxt                        |
| Maximum performance, small bundle   | Svelte / SolidJS            |
| Existing Angular team or enterprise | Stay with Angular           |
| Static site with bits of JS         | Astro + HTMX or vanilla     |

---

## 3.3 Styling

How you write CSS shapes the entire development experience.

### Tailwind CSS v4 — The Dominant Approach

Tailwind is **utility-first CSS**: instead of writing custom classes, you compose utilities directly in your markup.

```html
<button class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
  Click me
</button>
```

**Tailwind v4 (released 2024–2025) brings:**
- Rust-based engine (much faster than v3).
- CSS-first configuration (theme defined in CSS itself, not `tailwind.config.js`).
- Native CSS features (cascade layers, container queries, color-mix).
- Better integration with browser DevTools.

**The "Tailwind is ugly" debate (largely settled):**
Critics: "Long class strings are unreadable." Defenders: "It's actually faster to read and write than naming abstractions." By 2026 the dominant view is that Tailwind is fine — most teams that try it stay with it.

### shadcn/ui — Not a Library, a Collection

shadcn/ui is **not** an npm package. It's a CLI that copies React components into your project. The components use Radix UI primitives for accessibility and Tailwind for styling.

```bash
bunx shadcn@latest add button card input form dialog
```

This creates `components/ui/button.tsx` (etc.) in your project. You own the code; you can customize freely.

**Why it took over:**
- Beautiful, accessible defaults.
- No version lock-in (you copy the code).
- Easy to customize (just edit the file).
- Works perfectly with Tailwind and Next.js.

Almost every new React project in 2026 starts with shadcn/ui.

### CSS Modules

Locally-scoped CSS files. Class names are automatically prefixed to avoid global collisions.

```typescript
// Button.tsx
import styles from './Button.module.css';
export const Button = () => <button className={styles.primary}>Click</button>;
```

```css
/* Button.module.css */
.primary { background: blue; color: white; }
```

**When to use:** Teams that want regular CSS with scoping; non-Tailwind shops; gradual migration paths.

### Vanilla Extract / Panda CSS

Type-safe CSS-in-JS at build time. You write CSS in TypeScript; it compiles to static CSS files.

```typescript
import { style } from '@vanilla-extract/css';

export const button = style({
  padding: '8px 16px',
  background: 'blue',
  ':hover': { background: 'darkblue' },
});
```

**When to use:** Large teams that want type-safe theming and don't like Tailwind's utility approach.

### Styled-Components / Emotion

Runtime CSS-in-JS (the libraries inject styles at runtime). Popular in 2018–2022.

**Status in 2026:** Falling out of favor. They don't play nicely with React Server Components (which can't run client-side JS to inject styles), and they have runtime performance costs.

### Choosing a Styling Approach

| Project Type               | Recommendation                |
|----------------------------|-------------------------------|
| New React app              | Tailwind + shadcn/ui          |
| Vue app                    | Tailwind                      |
| Design-system-heavy team   | Tailwind + custom components OR Vanilla Extract |
| Backend-heavy / minimal JS | Tailwind + handwritten HTML   |
| Legacy migration           | CSS Modules                   |

---

## 3.4 Build Tools

The build tool transforms your source code into something browsers can run.

### Vite 6 — The Dominant Bundler

Vite uses native ES modules during development (no bundling needed, instant updates) and Rollup for production builds.

**Why it won:**
- Dev server starts in milliseconds, even for huge projects.
- Hot module replacement (HMR) is genuinely instant.
- Works with React, Vue, Svelte, Solid, Lit, vanilla.
- Excellent default configuration.

For non-Next.js projects, Vite is the obvious choice in 2026.

### Turbopack

Vercel's Rust-based bundler, designed as a Webpack replacement. Used inside Next.js for dev (stable in v15) and increasingly for production builds.

You don't choose Turbopack directly — it comes with Next.js.

### Bun — Runtime + Bundler + Package Manager

Bun is multiple tools in one binary:
- A JavaScript runtime (Node.js alternative).
- A package manager (faster than npm/yarn/pnpm).
- A bundler (faster than esbuild).
- A test runner.

```bash
bun install   # 10-30x faster than npm install
bun run dev   # Runs your scripts
bun test      # Runs tests
bun build src/index.ts   # Bundles
```

**In 2026:** Bun is widely adopted for development tooling (especially the package manager). Using Bun as the runtime for production servers is rising but less universal than Node.

### esbuild

Go-based bundler. Powers many other tools (Vite uses it for dependency pre-bundling). Rarely used directly; mostly a behind-the-scenes engine.

### Webpack — Legacy

The dominant bundler from 2014–2022. Still around in many projects but rarely chosen for new work. Slower, more configuration, more cognitive load than Vite/Turbopack.

---

## 3.5 Package Managers

How dependencies get installed and managed.

### pnpm — Fast and Efficient

pnpm uses a content-addressable store: every package version is stored once on disk and hardlinked into projects. Saves enormous amounts of disk space; install is fast.

```bash
npm install -g pnpm
pnpm install
pnpm add react
```

**Why teams choose it:**
- Faster than npm.
- Disk-efficient (huge for monorepos).
- Strict dependency resolution (catches phantom dependencies).
- Excellent monorepo support.

### Bun (as a package manager)

The fastest package installer available. Compatible with `package.json`.

### npm

Comes bundled with Node.js. Fine for simple projects. Slower than alternatives but universally available.

### Yarn

Was the popular alternative to npm in the late 2010s. Yarn 1 is legacy; Yarn 4 (modern, with PnP and workspaces) is innovative but niche.

### Recommendation

- **Solo projects / small teams:** Bun for speed.
- **Larger teams / monorepos:** pnpm for strictness.
- **Just learning:** npm is fine.

---

## 3.6 State Management

The mental model: there are two kinds of state, and they need different tools.

### Server State

Data fetched from your backend (or any external source).

**TanStack Query (formerly React Query)** is dominant. It handles:
- Caching by query key.
- Background refetching.
- Optimistic updates.
- Pagination, infinite scroll.
- Deduplication of in-flight requests.
- Stale-while-revalidate patterns.

```typescript
import { useQuery } from '@tanstack/react-query';

function UserList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(r => r.json()),
  });

  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  return <List users={data} />;
}
```

**SWR** (by Vercel) is a simpler alternative; nearly identical model.

**In React Server Components**, much server state is fetched directly in the component (no library needed).

### Client State

UI state, form state, ephemeral data.

**React built-ins** handle most needs:
- `useState` — Local component state.
- `useReducer` — Complex local state with explicit transitions.
- `useContext` — Share state across the tree (avoid for high-frequency updates).

**Zustand** — Simple, popular global state store.

```typescript
import { create } from 'zustand';

const useCart = create((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
}));

// In a component:
const items = useCart((s) => s.items);
const addItem = useCart((s) => s.addItem);
```

**Jotai** — Atomic state model. Fine-grained reactivity.

**Redux Toolkit** — Still used in large/legacy codebases. New projects rarely choose it; it's heavier than alternatives.

### Form State

**React Hook Form** + **Zod** is the dominant combination.

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

function SignupForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      <input type="password" {...register('password')} />
      <button type="submit">Sign up</button>
    </form>
  );
}
```

### URL State

The URL is also state. Use the framework's router (Next.js's `useSearchParams`, React Router's `useSearchParams`) to read/update URL state.

For complex URL state, **nuqs** is a popular library.

---

## 3.7 Backend Frameworks

What you use to build the server side.

### Hono — The 2026 Rising Star

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

**Why it's gaining traction:**
- Tiny (the core is ~14KB).
- Truly portable across runtimes (write once, deploy anywhere).
- Excellent TypeScript support.
- Fast (often tops benchmarks).

### Express / Fastify

Classic Node.js frameworks:
- **Express** is the historical default. Simple, ubiquitous, slower than alternatives.
- **Fastify** is faster, more modern, with better TypeScript support.

For new Node-only backends, **Fastify** is the conservative choice; **Hono** is the modern choice.

### NestJS

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

### Next.js (as a backend)

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

This is the dominant pattern for small/medium apps in 2026.

### FastAPI (Python)

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

The dominant choice for Python web APIs in 2026.

### Django (Python)

Batteries-included full-stack framework: ORM, auth, admin UI, templating, forms. Mature, opinionated, productive.

**When to choose:** Content-heavy sites (CMS-like), teams with existing Python/Django expertise, projects valuing convention over flexibility.

### Go Frameworks

- **Gin** — Most popular, expressive.
- **Echo** — Similar to Gin.
- **Fiber** — Express-inspired API, very fast.
- **Chi** — Idiomatic, minimal, standard-library-friendly.

### Axum (Rust)

Modern Rust web framework with excellent ergonomics:

```rust
use axum::{Router, routing::get, Json};

async fn list_users() -> Json<Vec<User>> {
    Json(vec![/* ... */])
}

let app = Router::new().route("/users", get(list_users));
```

### Spring Boot (Java)

The enterprise Java default. Mature, comprehensive, slow to start but powerful.

### ASP.NET Core (C#)

Microsoft's modern web framework. Genuinely fast and pleasant to use, especially for Windows/Azure shops.

### Laravel (PHP)

Elegant, productive PHP framework with strong ecosystem (Forge for deployment, Vapor for serverless, Nova for admin, Cashier for billing).

### Rails 8 (Ruby)

Includes everything: ORM, auth, background jobs, real-time (Hotwire), deployment (Kamal). "One person framework" branding.

### Choosing a Backend Framework

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

---

## 3.8 APIs

How frontends and backends (or services and services) communicate.

### REST

The default for public APIs and most internal ones. Universal, simple, language-agnostic.

**Specification:** Use **OpenAPI 3.x** to document REST APIs. Tools can generate client code, mock servers, and tests from an OpenAPI spec.

**Best practices:**
- Use plural nouns for resources (`/users`, not `/user`).
- Use proper HTTP methods and status codes.
- Version your API (`/v1/users`).
- Use pagination for list endpoints (cursor-based preferred over offset for large datasets).
- Return errors in a consistent format.

### tRPC

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

**When to use:** Full-stack TypeScript apps where both sides are yours.
**When not to use:** Public APIs, APIs consumed by non-TS clients.

### GraphQL

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

**When not to use:**
- Simple CRUD APIs (REST or tRPC is simpler).
- Small teams (GraphQL adds operational complexity).
- Public APIs where clients expect REST conventions.

**2026 status:** Stable but less hyped than 2018. Still strong in large orgs; rarely chosen for new small projects.

### gRPC

Binary protocol, very fast. Used for service-to-service communication inside large architectures.

**When to use:** Internal services in microservices architectures, especially polyglot ones.
**When not to use:** Browser clients (requires gRPC-Web proxy, awkward).

### WebSockets

Persistent, bidirectional connection.

**When to use:** Chat, multiplayer games, collaborative editing, anywhere two-way real-time is essential.

Libraries: `ws` (Node), Socket.io (adds reconnection and rooms), Partykit (edge-friendly).

### Server-Sent Events (SSE)

Long-lived HTTP connection where the server streams text events to the client. One-way only.

**When to use:** Streaming LLM responses (the dominant use case), live dashboards, notifications.

**Why SSE over WebSockets for these:** Simpler, works with HTTP/2 multiplexing, automatic reconnection in browsers.

### Webhooks

The server calls back to your endpoint when something happens (Stripe payments, GitHub events, etc.).

**Implementation tips:**
- Always verify the signature (don't trust the source IP).
- Be idempotent — webhooks can fire multiple times.
- Return 200 quickly; do work async.
- Have a replay mechanism for missed webhooks.

---

## 3.9 Databases

The store of truth for your application's state.

### PostgreSQL — The Default

In 2026, PostgreSQL is the default relational database for almost every new project.

**Why:**
- Open-source, no licensing concerns.
- Feature-rich (JSON, full-text search, GIS, time-series, vectors).
- Excellent extension ecosystem.
- Mature managed offerings (Supabase, Neon, Railway, AWS RDS, Google Cloud SQL).
- Strong ACID guarantees.

**Notable extensions:**
- **pgvector** — Vector similarity search (for AI/RAG).
- **PostGIS** — Geographic data.
- **TimescaleDB** — Time-series optimization.
- **pg_search** — Full-text search.
- **pg-boss** — Background jobs.

### Managed Postgres Providers

- **Supabase** — Postgres + Auth + Storage + Realtime + Edge Functions. All-in-one backend.
- **Neon** — Serverless Postgres with branching (each PR can have its own DB branch). Generous free tier.
- **Railway** — Simple managed DB alongside app hosting.
- **PlanetScale (now Postgres-only after MySQL deprecation)** — Branching, schema changes without locks.
- **AWS RDS** — Mature, full control, more operational burden.
- **Google Cloud SQL / Azure Database** — Same idea for other clouds.

### SQLite

A single-file database. Used to be considered "embedded only," but in 2026 it's production-viable via:

- **Cloudflare D1** — SQLite at the edge.
- **Turso** — Distributed SQLite with replication.
- **Litestream** — Streaming backup for SQLite to S3.

**When SQLite makes sense:** Edge-first apps, single-region apps with moderate write volume, apps that benefit from running queries with zero network latency.

### MySQL

Still common in legacy systems. PlanetScale popularized serverless MySQL (now deprecated in favor of Postgres).

For new projects, Postgres is almost always preferred.

### MongoDB

Document database. Popular in 2015–2020.

**Where it still fits:** Apps with genuinely schemaless data, content management systems, certain analytics workloads.

**Where Postgres beats it:** Almost everything else. Postgres's JSON columns + relational data are usually better.

### DynamoDB (AWS)

Serverless NoSQL store. Scales infinitely, predictable performance.

**When to use:** AWS-native apps with simple access patterns; massive scale where Postgres limits are real.
**Trade-off:** Hard to query in flexible ways; "you must know your access patterns up front."

### Redis / Valkey

In-memory key-value store. Used for:
- Caching
- Session storage
- Rate limiting
- Job queues (with BullMQ)
- Leaderboards (sorted sets)
- Pub/sub messaging

**Managed:** Upstash (serverless), Redis Cloud, AWS ElastiCache.

**Valkey** is the open-source fork after Redis Labs's license change. Many cloud providers are migrating to it.

### Search Engines

- **Typesense** — Modern, fast, easy to operate. Popular for new projects.
- **Meilisearch** — Similar to Typesense; great DX.
- **Algolia** — Hosted, very fast, expensive at scale.
- **Elasticsearch** — Powerful, complex, dominant historically.

**Often, Postgres full-text search is enough** — one less service to operate.

### Vector Databases

For storing embeddings (high-dimensional vectors that represent meaning).

- **pgvector** — Postgres extension; the popular 2026 choice.
- **Pinecone** — Managed, easy to start.
- **Qdrant** — Open-source, fast.
- **Weaviate** — Open-source, feature-rich.
- **Turbopuffer** — Newer, cost-optimized.

**Recommendation:** Use pgvector unless you have specific needs that justify a separate service.

### Analytics Databases

For OLAP (analytical queries on large datasets):

- **ClickHouse** — Columnar, blazing fast.
- **DuckDB** — In-process analytics; great for local data work.
- **Snowflake / BigQuery** — Cloud data warehouses.

### Graph Databases

For data with complex relationships (social networks, recommendations).

- **Neo4j** — Most popular, Cypher query language.
- **Amazon Neptune** — AWS managed.

Often a Postgres + recursive CTEs is enough for "I just need some graph queries" use cases.

---

## 3.10 ORMs and Database Tools

The layer between your code and SQL.

### Drizzle ORM — The 2026 Leader

TypeScript-first, lightweight, SQL-like syntax. Schema is defined in TypeScript:

```typescript
import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').unique().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
});
```

Queries look like SQL:

```typescript
const result = await db
  .select({ id: users.id, postCount: count(posts.id) })
  .from(users)
  .leftJoin(posts, eq(posts.userId, users.id))
  .groupBy(users.id);
```

**Why it's popular:**
- Excellent TypeScript inference (your query result type is exactly the columns you selected).
- Lightweight (no separate query engine).
- SQL-like — easy to translate mental models.
- Edge-runtime compatible.

### Prisma

The dominant ORM from 2020–2024. Schema-first (you write a `.prisma` file).

```prisma
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  posts Post[]
}

model Post {
  id     Int    @id @default(autoincrement())
  title  String
  user   User   @relation(fields: [userId], references: [id])
  userId Int
}
```

Queries are object-style:

```typescript
const user = await prisma.user.findUnique({
  where: { id: 42 },
  include: { posts: true },
});
```

**Strengths:**
- Beautiful schema syntax.
- Excellent migrations.
- Prisma Studio (GUI for browsing data).

**Weaknesses:**
- Larger runtime than Drizzle.
- Some performance issues in serverless environments (cold start with Rust query engine).
- Less SQL-like.

In 2026, Drizzle is rising fast and Prisma remains widely used. New projects are increasingly choosing Drizzle.

### Kysely

Type-safe SQL query builder. Lower-level than Drizzle/Prisma — you write SQL-like code with full type safety, no migration tooling included.

```typescript
const users = await db
  .selectFrom('users')
  .where('email', '=', 'tony@example.com')
  .selectAll()
  .execute();
```

**When to use:** Teams that want type safety but reject ORM abstractions.

### SQLAlchemy (Python)

The Python standard. Powerful, complex.

### GORM (Go)

The Go standard. Simpler than SQLAlchemy.

### Hibernate / JPA (Java)

The Java enterprise standard. Mature, complex.

### Raw SQL

Sometimes the right answer. For complex queries, a hand-tuned SQL string is often clearer than an ORM equivalent.

Most modern ORMs (Drizzle, Prisma) let you write raw SQL when needed.

### Migrations

Schema changes versioned in code:

```typescript
// drizzle/0001_add_email_index.ts
export const up = sql`CREATE INDEX users_email_idx ON users(email);`;
export const down = sql`DROP INDEX users_email_idx;`;
```

Run with `drizzle-kit migrate`, `prisma migrate deploy`, etc.

**Best practices:**
- Migrations are immutable once committed.
- Migrations should be reversible when possible.
- Test migrations against production data copies.
- Backward-compatible migrations let you deploy code and schema independently.

---

## 3.11 Authentication

(Covered in depth in 01-foundational-concepts.md; here is the tool landscape.)

### Clerk

Drop-in auth as a service. Pre-built React components.

```typescript
import { SignIn, SignUp, UserButton } from '@clerk/nextjs';

export default function Page() {
  return <SignIn />;  // Full sign-in UI in one component
}
```

**Strengths:** Best UX, fast to integrate, lots of features (multi-factor, social, magic links, passkeys).
**Trade-offs:** Expensive at scale (~$25/month base, scales by MAU).

### Better Auth

Open-source, TypeScript-native, self-hostable. Rising fast in 2026.

```typescript
import { betterAuth } from 'better-auth';

export const auth = betterAuth({
  database: { provider: 'postgres', ... },
  emailAndPassword: { enabled: true },
  socialProviders: { google: { ... } },
});
```

**Strengths:** Free, full control, modern API.
**Trade-offs:** You self-host (more responsibility); newer (less battle-tested than Clerk/Auth0).

### Auth.js (formerly NextAuth)

Open-source, framework-integrated. The historical default for Next.js.

### Auth0

Mature, enterprise-friendly. Acquired by Okta.

**When to use:** Enterprise customers, complex compliance requirements, established product.

### Supabase Auth

Bundled with Supabase. Convenient if you're already using Supabase for DB.

### WorkOS

Enterprise SSO/SAML/SCIM as a service. The go-to when selling B2B and customers demand enterprise auth.

### Choosing

| Need                              | Recommendation     |
|-----------------------------------|--------------------|
| Fast time-to-market, paid OK      | Clerk              |
| Open-source, self-host            | Better Auth        |
| Existing Supabase user            | Supabase Auth      |
| Enterprise B2B                    | Clerk + WorkOS, or Auth0 |
| Maximum customization             | Build on Better Auth or Auth.js |

---

## 3.12 Background Jobs

Long-running or scheduled work that shouldn't block HTTP requests.

### Trigger.dev

Modern, TypeScript-native job runner. Functions feel like normal code:

```typescript
import { task } from '@trigger.dev/sdk';

export const sendWelcomeEmail = task({
  id: 'send-welcome-email',
  run: async (payload: { userId: string }) => {
    const user = await db.user.findUnique({ where: { id: payload.userId } });
    await resend.emails.send({ to: user.email, ... });
  },
});

// Trigger it:
await sendWelcomeEmail.trigger({ userId: '42' });
```

**Strengths:** Excellent DX, durable (retries on failure), good observability dashboard.

### Inngest

Event-driven workflow engine. Similar to Trigger.dev with a different model (events trigger functions).

### BullMQ

Redis-backed job queue for Node.js. Self-hosted classic. Lower-level than Trigger.dev/Inngest but more control.

### Sidekiq (Ruby)

The Ruby standard. Battle-tested.

### Celery (Python)

The Python standard. Powerful, complex.

### Temporal

Heavy-duty workflow orchestration. Use for complex, long-running business processes (multi-step approvals, financial transactions, etc.).

---

## 3.13 Payments, Email, Files, and Other Services

The boring-but-essential services every app needs.

### Payments

**Stripe** — Default for almost everyone. Excellent API and docs.

**Paddle / Lemon Squeezy** — Merchant of Record (they handle global tax compliance). Great for indie SaaS.

**Adyen** — Large enterprises.

### Email (Transactional)

**Resend** — Modern, developer-friendly, React Email integration.

**Postmark** — High deliverability, focused on transactional.

**AWS SES** — Cheap at scale, more setup.

**SendGrid** — Legacy choice, still widely used.

### Email (Marketing)

**Loops** — Modern, developer-friendly.

**Customer.io** — Event-driven sequences.

**Mailchimp** — Classic, broad features.

### File Storage

**Cloudflare R2** — S3-compatible, **no egress fees** (a major cost win). Increasingly the default.

**AWS S3** — The original. Mature, integrated with everything AWS.

**Backblaze B2** — Cheap, S3-compatible.

### Image Optimization & CDN

**Cloudflare Images** — Bundled with Cloudflare.

**Imgix / Cloudinary** — Image transformation as a service.

**Framework built-ins** — Next.js `<Image>`, Astro `<Image>` handle most needs.

### Video

**Mux** — Best DX for video. Upload → get adaptive streaming.

**Cloudflare Stream** — Bundled with Cloudflare.

### SMS

**Twilio** — Default.

**MessageBird / Plivo** — Alternatives.

### Maps

**Google Maps** — Most familiar, expensive at scale.

**Mapbox** — Customizable, designer-friendly.

**MapTiler / MapLibre** — Open-source alternatives.

### Push Notifications

**OneSignal** — Most popular.

**Knock** — Multi-channel notifications.

### Analytics

**PostHog** — Open-source, all-in-one (analytics, replay, flags, experiments). Often self-hosted.

**Mixpanel / Amplitude** — Mature product analytics.

**Plausible / Fathom** — Privacy-friendly, simple website analytics.

**Vercel Analytics** — Built-in for Vercel sites.

---

## 3.14 AI Infrastructure

The new layer in modern web apps (covered in depth in 09-ai-integration.md).

### Model APIs

- **Anthropic Claude** — Strong reasoning, longer context, excellent for coding.
- **OpenAI GPT** — Largest ecosystem, broad capabilities.
- **Google Gemini** — Strong on multimodal, good pricing.
- **Cohere, Mistral, Together AI** — Open-weight model hosting.

### SDKs

- **Vercel AI SDK** — Dominant TypeScript abstraction; streaming chat is trivial.
- **LangChain.js / LlamaIndex** — More complex agentic workflows.

### Vector Databases

(Covered in 3.9.) pgvector is the popular 2026 choice.

### Embeddings

- **OpenAI** — `text-embedding-3-small/large`
- **Voyage AI** — High-quality.
- **Cohere** — Multilingual.

### Streaming

Server-Sent Events (SSE) is the standard for streaming LLM responses to the browser.

### AI Observability

- **Langfuse** — Open-source, comprehensive.
- **Helicone** — Simple proxy that adds observability.
- **LangSmith** — LangChain's own.
- **Braintrust** — Eval-focused.

---

## 3.15 Hosting Platforms

(Covered in depth in 04, 05, 06.)

### Edge Platforms (Most Popular for New Apps)

- **Vercel** — Best for Next.js. Premium pricing.
- **Cloudflare (Workers + Pages)** — Fastest, cheapest, most global.
- **Netlify** — Older, solid Jamstack pioneer.

### App Platforms

- **Railway** — Simple, predictable pricing.
- **Render** — Similar to Railway.
- **Fly.io** — Globally distributed VMs, indie-developer-friendly.
- **Heroku** — Original PaaS, declining but still used.

### Cloud Providers

- **AWS** — Dominant at scale; 200+ services.
- **Google Cloud** — Cloud Run is excellent.
- **Azure** — Dominant in Microsoft-heavy enterprises.
- **DigitalOcean / Linode / Vultr / Hetzner** — Simpler clouds, cheaper, fewer services.

### Choosing

| Project Type                     | Recommendation                |
|----------------------------------|-------------------------------|
| Next.js indie/startup app        | Vercel                        |
| Need edge globally + low cost    | Cloudflare                    |
| Long-running Node/Python service | Railway / Render / Fly.io     |
| Enterprise scale                 | AWS / GCP / Azure             |
| Want one global server cheaply   | Hetzner / DigitalOcean        |

---

## 3.16 DevOps and Infrastructure

(Covered in depth in 06-large-company-workflow.md.)

### Containers

- **Docker** — Universal containerization standard.
- **Podman** — Daemonless alternative.

### Orchestration

- **Kubernetes** — Dominant at scale.
- **Docker Compose** — For local multi-container setups.
- **Nomad** — Simpler K8s alternative; declining.

### Infrastructure as Code

- **Terraform / OpenTofu** — Most popular. OpenTofu is the open-source fork after Terraform's license change.
- **Pulumi** — IaC in real programming languages (TS, Python, Go).
- **AWS CDK** — AWS-specific, TS/Python.
- **SST** — Modern serverless IaC built on AWS CDK.

### CI/CD

(Covered in 02.) GitHub Actions dominates.

### Secret Management

- **HashiCorp Vault** — Industry standard, self-host.
- **AWS Secrets Manager / Google Secret Manager / Azure Key Vault** — Cloud-native.
- **Doppler / 1Password Secrets Automation** — Modern, developer-friendly.

---

## 3.17 Monitoring and Observability

(Covered in 02 and 06.)

### Errors

- **Sentry** — Default for almost everyone.

### Logs

- **Datadog** — Enterprise.
- **Better Stack / Axiom / Logtail** — Modern, developer-friendly.
- **Grafana Loki** — Open-source, self-host.

### Metrics

- **Datadog** — Enterprise.
- **Grafana + Prometheus** — Open-source, self-host.

### Traces

- **Datadog APM**
- **Honeycomb** — Excellent for distributed systems.
- **Jaeger / Tempo** — Open-source.

### Standard

- **OpenTelemetry** — Vendor-neutral instrumentation. Send to any backend.

### Product Analytics

- **PostHog** — All-in-one, open-source.
- **Mixpanel / Amplitude** — Mature.

### Feature Flags

- **PostHog** — Bundled.
- **Statsig** — Strong on experimentation.
- **LaunchDarkly** — Enterprise standard.

### Incident Management

- **PagerDuty** — Enterprise.
- **Opsgenie**
- **Incident.io** — Modern, developer-friendly.
- **Better Stack On-call** — Bundled with Better Stack.

---

## 3.18 Code Quality and Developer Tools

### Biome

Fast, unified linter + formatter, written in Rust. Replacing the ESLint + Prettier combo for many new projects.

```bash
bunx biome check .   # Lint and format check
bunx biome format .  # Auto-format
```

### ESLint v9

Still widely used, especially in legacy. The "flat config" format is the new standard.

### TypeScript

In **strict mode** (`"strict": true`), ideally. Catches many bugs.

### Husky / lefthook

Git hooks. Run scripts before commits/pushes.

### Changesets

Version and changelog management for monorepos.

### Turborepo / Nx

Monorepo build tools. Turborepo is simpler; Nx is more featured.

---

## 3.19 Editors and AI Coding Assistants

### Editors

- **VS Code** — Free, dominant.
- **Cursor** — VS Code fork with deep AI integration. Massive in 2026.
- **Zed** — Fast, collaborative, Rust-based.
- **JetBrains (WebStorm, IntelliJ)** — Powerful, paid, popular in enterprises.
- **Neovim** — Beloved by power users.

### AI Coding Assistants

- **Claude Code** — Anthropic's terminal-based AI coding agent. Used heavily for autonomous coding tasks.
- **GitHub Copilot** — Inline AI completions; the original mainstream AI coding tool.
- **Cursor's built-in AI** — Best-in-class tab completion + chat.
- **Windsurf** — Cursor competitor with strong agentic mode.
- **Continue** — Open-source assistant, works in VS Code/JetBrains.

In 2026, AI coding assistants are not optional for competitive productivity. The skill is reviewing and editing AI output, not generating it from scratch.

---

## Wrapping Up Part 3

This is the working vocabulary of modern web development. You don't need every tool — you need to know *what exists* so you can reach for the right one.

The key choices in 2026 for a new full-stack app:

- **Language:** TypeScript
- **Framework:** Next.js (or Astro for content sites)
- **Styling:** Tailwind + shadcn/ui
- **Database:** Postgres (Supabase or Neon)
- **ORM:** Drizzle
- **Auth:** Clerk or Better Auth
- **Hosting:** Vercel or Cloudflare
- **Observability:** Sentry + PostHog + Better Stack
- **AI:** Vercel AI SDK + Anthropic/OpenAI

This is the "boring" path. It's boring because it works. Save creativity for your product.

**Next:** Part 4 walks through how all this comes together for a personal website.
