---
id: tech-stack-decoded
title: 3. The 2026 Tech Stack — Overview
sidebar_position: 1
sidebar_label: Overview
description: Every major tool in the 2026 web stack, organized by layer. Skim once; refer back when choosing.
---

# Part 3: The 2026 Tech Stack Decoded

*Every major tool in modern web development — what it does, when to use it, why it exists.*

:::tip[Absolute-beginner orientation]
**Why this chapter looks overwhelming:** It is overwhelming — there are hundreds of tools in modern web development, and this chapter catalogs the important ones. **Don't read it front-to-back like a novel. Skim once to know what exists, then come back to specific sections when you need to make a decision.**

**The "stack" mental model:** A web application is built in layers. Each layer has its own tools:

- **Language layer** — what you write code in (TypeScript, Python, Go...)
- **Framework layer** — the scaffolding (Next.js, Django, Rails...)
- **Styling layer** — how it looks (Tailwind, CSS Modules...)
- **Data layer** — where information is stored (Postgres, MongoDB, Redis...)
- **Auth layer** — who can do what (Clerk, Auth0, custom JWT...)
- **Hosting layer** — where it runs (Vercel, AWS, Cloudflare...)
- **Observability layer** — how you know it's working (Sentry, Datadog...)

A "stack" is just one specific choice for each layer. The famous acronyms (MERN, LAMP, T3) are all just specific stack combinations.

**If you only remember one thing:** You don't need to know every tool. You need to know *one tool per layer* well enough to ship a working app, then expand from there.
:::

## The recommended 2026 starter stack

For a new full-stack project, the boring-but-effective combination:

| Layer            | Recommendation              |
|------------------|-----------------------------|
| Language         | TypeScript                  |
| Framework        | Next.js (or Astro for content) |
| Styling          | Tailwind + shadcn/ui        |
| Database         | Postgres (Supabase or Neon) |
| ORM              | Drizzle                     |
| Auth             | Clerk or Better Auth        |
| Hosting          | Vercel or Cloudflare        |
| Observability    | Sentry + PostHog + Better Stack |
| AI               | Vercel AI SDK + Anthropic/OpenAI |

This is the "boring" path. It's boring because it works. Save creativity for your product.

## Pages in this chapter

1. [Languages](/docs/stack/languages) — TypeScript, Python, Go, Rust, Java/Kotlin, C#, PHP, Ruby.
2. [Frontend Frameworks](/docs/stack/frontend-frameworks) — React, Vue, Svelte, Solid, Astro.
3. [Styling](/docs/stack/styling) — Tailwind, shadcn/ui, CSS Modules, alternatives.
4. [Build Tools](/docs/stack/build-tools) — Vite, Turbopack, Bun, esbuild.
5. [Package Managers](/docs/stack/package-managers) — pnpm, Bun, npm, Yarn.
6. [State Management](/docs/stack/state-management) — TanStack Query, Zustand, forms.
7. [Backend Frameworks](/docs/stack/backend-frameworks) — Hono, Express, Fastify, NestJS, FastAPI, Django, more.
8. [APIs](/docs/stack/apis) — REST, tRPC, GraphQL, gRPC, WebSockets, SSE, webhooks.
9. [Databases](/docs/stack/databases) — Postgres, SQLite, MongoDB, Redis, search, vector.
10. [ORMs & Database Tools](/docs/stack/orms) — Drizzle, Prisma, Kysely, raw SQL.
11. [Authentication](/docs/stack/authentication-tools) — Clerk, Better Auth, Auth.js, Auth0, Supabase.
12. [Background Jobs](/docs/stack/background-jobs) — Trigger.dev, Inngest, BullMQ, others.
13. [Services](/docs/stack/services) — Payments, email, files, video, maps, notifications.
14. [AI Infrastructure](/docs/stack/ai-infrastructure) — Models, SDKs, embeddings, observability.
15. [Hosting Platforms](/docs/stack/hosting) — Edge, App, Cloud.
16. [DevOps & Infrastructure](/docs/stack/devops) — Containers, K8s, IaC, secrets.
17. [Monitoring & Observability](/docs/stack/observability-tools) — Errors, logs, metrics, traces.
18. [Code Quality & Dev Tools](/docs/stack/code-quality) — Biome, ESLint, hooks.
19. [Editors & AI Assistants](/docs/stack/editors-ai) — VS Code, Cursor, Claude Code.

---

When you finish, move on to [Chapter 4: Personal Website Workflow](/docs/solo).
