---
id: stack-checkpoint
title: Chapter 4 Checkpoint
sidebar_position: 30
sidebar_label: ✅ Checkpoint quiz
description: Mandatory checkpoint quiz for Chapter 4 — Tech Stack. 5 random questions drawn from a 15-question bank. Pass to unlock Chapter 5.
---

# Chapter 4 Checkpoint

You've finished the Tech Stack chapter. Take a minute to make sure the core ideas stuck.

There are **15 questions in the bank** — each visit picks 5 at random, so retaking gives you different ones. If you miss one, the result card tells you exactly which page section to revisit, and the link highlights the paragraph for you.

You must pass (≥ 60%) to unlock the Next button and Chapter 5 in the sidebar.

<Quiz id="stack-checkpoint" title="Tech Stack checkpoint" sampleSize={5}>

<Question
  prompt="A friend asks: 'I want to build a typical full-stack web app in 2026 — what language should I pick?' Which answer matches the chapter's recommended starter stack?"
  options={[
    { text: "Python, because it has the largest standard library" },
    { text: "Go, because deployment is easiest" },
    { text: "TypeScript, because it works on both frontend and backend, has the largest ecosystem, and the build-step cost is negligible" },
    { text: "Rust, because it's the fastest at runtime" }
  ]}
  correct={2}
  explanation="The recommended 2026 starter stack uses TypeScript end-to-end. It pairs with React/Next.js on the frontend, Hono/Next.js route handlers on the backend, and gives you one language across the whole app. Python and Go are great for AI/ML and concurrent services respectively, but they're not the default for a typical full-stack web app."
  revisit={{ to: "/docs/stack/languages#typescript--the-default-for-web", label: "TypeScript — the default for web" }}
/>

<Question
  prompt="You're building a documentation site that's mostly static content with a few interactive widgets. Which frontend framework choice fits the chapter's recommended pattern?"
  options={[
    { text: "Next.js with React Server Components everywhere" },
    { text: "Astro, which ships zero JS by default and only hydrates the interactive components as 'islands'" },
    { text: "SvelteKit configured as a single-page app" },
    { text: "Plain Create React App, then strip out unused code" }
  ]}
  correct={1}
  explanation="Astro is content-first: it produces static HTML and only hydrates the components you mark interactive (via `client:visible` etc.). For docs and blogs, that produces faster, lighter pages than any JS-framework competitor. Next.js is the default for app-shaped sites, not content-shaped ones."
  revisit={{ to: "/docs/stack/frontend-frameworks#astro-5--the-content-framework", label: "Astro — the content framework" }}
/>

<Question
  prompt="You're starting a new React app and want a polished, accessible UI in a weekend. The chapter's recommended combo is:"
  options={[
    { text: "Material UI installed from npm, configured via theme overrides" },
    { text: "Styled-components plus a hand-rolled design system" },
    { text: "Tailwind CSS plus shadcn/ui — whose CLI copies the component source into your project so you own and can edit it" },
    { text: "Bootstrap 5 plus jQuery for interactivity" }
  ]}
  correct={2}
  explanation="Tailwind + shadcn/ui is the dominant 2026 styling stack. shadcn/ui isn't an npm package — its CLI copies React components (built on Radix + Tailwind) into your repo, so you own the code, can customize freely, and aren't locked to a package version."
  revisit={{ to: "/docs/stack/styling#shadcnui--not-a-library-a-collection", label: "shadcn/ui — not a library, a collection" }}
/>

<Question
  prompt="A teammate dumps the user list fetched from `/api/users` into a Zustand store so 'we can read it from anywhere.' What's the chapter's verdict on this pattern?"
  options={[
    { text: "Correct — Zustand is the right home for any data your app needs" },
    { text: "Wrong — server data is a cache, not state. Use TanStack Query (or RSC) for it; reserve Zustand/Redux for purely client state" },
    { text: "Correct, as long as you also store it in localStorage" },
    { text: "Wrong — Zustand can't hold arrays of users, you need Redux" }
  ]}
  correct={1}
  explanation="The most common state-management mistake is treating fetched server data as client state. TanStack Query (or React Server Components) handles caching, deduping, background refetching, and invalidation for you. Zustand/Redux/Context are for purely client state — open menus, theme, draft form input."
  revisit={{ to: "/docs/stack/state-management#server-state", label: "Server vs client state" }}
/>

<Question
  prompt="You're building a small full-stack TypeScript app where you control both the React client and the server. Which API style does the chapter recommend to get end-to-end type safety with the least ceremony?"
  options={[
    { text: "GraphQL with a federated schema" },
    { text: "gRPC with protobuf" },
    { text: "tRPC — you call server procedures by name with shared TypeScript types and get compile-time errors when shapes drift" },
    { text: "SOAP over HTTP for compatibility" }
  ]}
  correct={2}
  explanation="tRPC's selling point is exactly this: when both ends are TypeScript and you own both, you skip explicit API contracts and the client gets the server's types directly. Rename a field on the server and the client gets a compile error. For public APIs or non-TS clients, REST is the right default."
  revisit={{ to: "/docs/stack/apis#trpc", label: "tRPC section" }}
/>

<Question
  prompt="Your AI feature needs to stream LLM tokens to the browser so users see the typewriter effect. Which transport is the chapter's standard pick, and why?"
  options={[
    { text: "WebSockets, because they're bidirectional" },
    { text: "Long polling, because it works in every browser" },
    { text: "Server-Sent Events (SSE) — one-way over HTTP, automatic browser reconnection, works with HTTP/2 multiplexing, and what the Vercel AI SDK uses under the hood" },
    { text: "gRPC streams, because they're the fastest" }
  ]}
  correct={2}
  explanation="LLM responses are one-way (server → client), token by token. SSE is the natural fit — plain HTTP with automatic reconnect — and the Vercel AI SDK's `toDataStreamResponse()` wraps the model stream in an SSE response. WebSockets are bidirectional overkill for this; gRPC is awkward from browsers."
  revisit={{ to: "/docs/stack/apis#server-sent-events-sse", label: "Server-Sent Events" }}
/>

<Question
  prompt="You need to add semantic search for your app's documents. The chapter's recommended 2026 data setup is:"
  options={[
    { text: "Stand up a dedicated Pinecone cluster and replicate documents to it nightly" },
    { text: "Use Postgres with the pgvector extension to store and query embeddings — one DB, one ops burden" },
    { text: "Switch your whole app to MongoDB, which has built-in vector search" },
    { text: "Build a custom embedding store on top of Redis sorted sets" }
  ]}
  correct={1}
  explanation="The chapter's default data stack for 95% of projects is Postgres + Redis + pgvector. pgvector turns your existing Postgres into a vector database, so you don't add a separate service. Pinecone/Qdrant/Weaviate are only worth it when you have specific needs Postgres can't meet."
  revisit={{ to: "/docs/stack/databases#postgresql--the-default", label: "PostgreSQL — the default" }}
/>

<Question
  prompt="A new TypeScript backend on Cloudflare Workers needs an ORM. Which combination does the chapter highlight as the 2026 leader, and why?"
  options={[
    { text: "Sequelize, because it has the longest history" },
    { text: "Prisma with its own query engine binary, because of its schema-first DSL" },
    { text: "Drizzle, because of its precise TypeScript inference, lightweight runtime, SQL-like syntax, and edge-runtime compatibility" },
    { text: "TypeORM, because it uses decorators like NestJS" }
  ]}
  correct={2}
  explanation="Drizzle's distinguishing features — strong TS inference, no heavy query engine, SQL-like ergonomics, edge-runtime compatibility — are exactly what serverless and edge stacks need. Prisma remains widely used, but new projects are increasingly choosing Drizzle, especially for edge runtimes."
  revisit={{ to: "/docs/stack/orms#drizzle-orm--the-2026-leader", label: "Drizzle — the 2026 leader" }}
/>

<Question
  prompt="A solo developer asks: 'Should I roll my own auth to save money?' The chapter's answer is:"
  options={[
    { text: "Yes — modern auth is just a JWT and a password hash" },
    { text: "No — auth is genuinely hard (sessions, MFA, social, recovery, passkeys) and services like Clerk, Better Auth, Supabase Auth, and Auth.js have generous free tiers. The engineering cost of DIY dwarfs the savings" },
    { text: "Only if you're using GraphQL" },
    { text: "Yes, but only for the first 10,000 users" }
  ]}
  correct={1}
  explanation="Clerk gives 10k MAU free, Supabase Auth 50k MAU free, Better Auth and Auth.js are free and open-source. The engineering cost of correctly implementing password hashing, sessions, MFA, social logins, account recovery, and passkeys is enormous — and getting any of it wrong is a security incident."
  revisit={{ to: "/docs/stack/authentication-tools#clerk", label: "Why outsource auth" }}
/>

<Question
  prompt="Your route handler needs to send a welcome email that takes 3 seconds via an external API. The chapter's correct pattern is:"
  options={[
    { text: "Send the email inline in the handler — 3 seconds is fine for users" },
    { text: "Enqueue a background job (Trigger.dev, Inngest, BullMQ, or platform `waitUntil()` for very small cases) and return the HTTP response immediately" },
    { text: "Open a WebSocket to the email provider for the duration of the request" },
    { text: "Set the HTTP timeout to 30 seconds and let the user wait" }
  ]}
  correct={1}
  explanation="HTTP requests should be fast — users wait for them. The endpoint enqueues the task and returns; a worker picks it up later. Trigger.dev/Inngest are the modern TS picks; for tiny side projects, Next.js `waitUntil()` or platform cron is enough until you have multiple tasks needing retries and monitoring."
  revisit={{ to: "/docs/stack/background-jobs#triggerdev", label: "Why background jobs" }}
/>

<Question
  prompt="You're estimating costs for an indie SaaS. The chapter's 'buy decision tree' for categories like payments, transactional email, file storage, and video says:"
  options={[
    { text: "Always build first — you'll learn more about the domain" },
    { text: "Buy when it's not your core product, when 3+ mature competitors offer it as a service, or when you'd be embarrassed by your in-house version next to theirs — which is almost always for these categories" },
    { text: "Buy only the parts that involve PCI compliance" },
    { text: "Build for the first 1,000 users, then migrate to a vendor" }
  ]}
  correct={1}
  explanation="Payments, email deliverability, file storage, and video are enormous specialized problems already solved well by Stripe, Resend, R2/S3, and Mux. The math almost always favors buying — Stripe charges 2.9% + 30¢ vs. ~$10M and 18 months to build a compliant global payments system."
  revisit={{ to: "/docs/stack/services#payments", label: "Buy decision tree" }}
/>

<Question
  prompt="You're shipping an AI feature in production. The chapter's day-one cost-discipline habits are:"
  options={[
    { text: "Always use the most expensive model so quality is high, and bill users upfront" },
    { text: "Cache aggressively with provider prompt caching, route easy tasks to cheaper models (Haiku/Mini, not Opus), track per-request cost, and set monthly spend limits before you ship" },
    { text: "Disable streaming so you can count tokens manually after each response" },
    { text: "Skip observability — AI costs are unpredictable anyway" }
  ]}
  correct={1}
  explanation="A single long conversation can rack up dollars. Prompt caching (Anthropic and OpenAI both support it), routing easy classification to cheaper models, instrumenting per-request cost (Helicone/Langfuse), and provider spend limits are all day-one moves. One viral tweet + no spend limit = an awful Monday morning."
  revisit={{ to: "/docs/stack/ai-infrastructure#ai-observability", label: "AI cost discipline" }}
/>

<Question
  prompt="A bootstrapped Next.js startup is hitting traffic spikes from a launch. They're on Vercel and panicking about 'vendor lock-in.' What's the chapter's framing?"
  options={[
    { text: "Stop everything and migrate to AWS today before customers leave" },
    { text: "Lock-in is real on every platform — but for early-stage projects, shipping beats portability. Most projects fail by not shipping, not by getting locked in. A Vercel → AWS migration is a 2–6 week project later if needed" },
    { text: "Lock-in is illegal in the EU, so just file a complaint" },
    { text: "Switch to Cloudflare Workers tonight — it has no lock-in" }
  ]}
  correct={1}
  explanation="Every platform has lock-in (Vercel-isms, Cloudflare-isms, AWS Lambda-isms, Postgres-specific SQL). For early-stage projects, velocity beats portability. If you do hit scaling-cost issues later, the migration is a finite, manageable project — and it's a great problem to have."
  revisit={{ to: "/docs/stack/hosting#edge-platforms-most-popular-for-new-apps", label: "Hosting tiers" }}
/>

<Question
  prompt="A new senior engineer wants to introduce Kubernetes, custom Helm charts, and a service mesh on a 5-person team running on Vercel. The chapter's stance is:"
  options={[
    { text: "Adopt all of it now — these are industry standards" },
    { text: "Docker is useful even at small scale and maybe Terraform if your cloud setup grows complex; K8s, service meshes, and custom Helm are a solution looking for a problem at small scale" },
    { text: "Skip Docker too — containers are legacy" },
    { text: "Move to bare metal first, then layer in K8s when you have 50 engineers" }
  ]}
  correct={1}
  explanation="Kubernetes earns its complexity at real scale (typically 50+ engineers, many services). On a small team using a hosting platform, K8s is overhead without payoff. The page is explicit: Docker yes, Terraform maybe, everything else 'a solution looking for a problem' at small scale."
  revisit={{ to: "/docs/stack/devops#orchestration", label: "Most projects don't need K8s" }}
/>

<Question
  prompt="The chapter argues AI coding assistants 'amplify whatever you already know.' What's the practical implication for someone learning web dev in 2026?"
  options={[
    { text: "Skip learning fundamentals — the AI will fill them in for you" },
    { text: "Keep learning the underlying concepts (the rest of this guide). The skills that matter most are reading code, judging design, debugging, and architectural taste — i.e., reviewing and editing AI output, not raw typing speed" },
    { text: "Use only the most expensive model for every line of code" },
    { text: "Avoid AI tools until you can hand-write every utility from scratch" }
  ]}
  correct={1}
  explanation="A junior with AI but no fundamentals produces code they can't debug; a senior with AI produces 2–5× more high-quality code. As AI generates more code, the bottleneck moves to review — reading carefully, spotting bad designs, and judging architecture compound the value of every AI suggestion."
  revisit={{ to: "/docs/stack/editors-ai#how-ai-tools-have-changed-the-workflow", label: "AI workflow changes" }}
/>

</Quiz>

---

## What's next

→ Continue to [Chapter 5: Cloud Platforms](/docs/cloud) — the infrastructure your stack actually runs on, from VMs and containers to networking, identity, and cost.
