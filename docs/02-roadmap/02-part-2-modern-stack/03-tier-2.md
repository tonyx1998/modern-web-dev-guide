---
id: tier-2
title: Tier 2 — Worth Knowing
sidebar_position: 4
sidebar_label: Tier 2 — worth knowing
description: Ten tools to learn when a specific project asks for them — not before.
---

# Tier 2 — Worth Knowing

> **In one line:** Adopt these when a specific project asks for them — not before. Learning them speculatively wastes time.

## Cloudflare Workers + Hono

### What it is

**Cloudflare Workers** is a serverless platform — you write a function, deploy it, and Cloudflare runs it for you across 300+ data centres. There's no "server" you provision; it spins up on demand near each user. Built on V8 isolates (the same engine as Chrome's JS) rather than full Node.js, so the runtime is smaller and faster to start than AWS Lambda.

**Hono** is a tiny web framework (think: Express, but modern and 14kb) designed to run on Workers, Bun, Node, Deno — anywhere. It gives you routing, middleware, and request/response helpers without the bulk of Express or Next.js.

### Why it matters for you

Your `all-in-one-URL` backend currently sits on Render's free tier, which spins down after 15 minutes idle (first request after idle takes 30+ seconds). Workers don't have cold starts in that sense — they're warm everywhere. For a small API like yours, Workers + Hono + a Cloudflare D1 database (their SQLite) would be cheaper, faster, and run everywhere on Earth.

### Prerequisites

- You've built one REST API before.
- You understand "serverless" at a high level — code that runs on demand, no server to manage, scales automatically.
- You know what middleware is — a function that runs between the request arriving and your handler (e.g. auth checks, logging).

### How it looks

```ts
// src/index.ts
import { Hono } from "hono";
const app = new Hono();

app.get("/", (c) => c.text("Hello from the edge"));

app.post("/shorten", async (c) => {
  const { url } = await c.req.json();
  const slug = Math.random().toString(36).slice(2, 8);
  await c.env.DB.prepare("INSERT INTO links VALUES (?, ?)").bind(slug, url).run();
  return c.json({ slug });
});

export default app;
```

Deploy with `npx wrangler deploy`. Live globally in seconds.

### First step

Re-implement the URL-shortening endpoint of `all-in-one-URL` as a Worker + Hono service backed by D1. Keep the Python backend running. Compare cold-start times yourself.

→ See also: [Hosting](/docs/stack/hosting), [Backend Frameworks](/docs/stack/backend-frameworks)

## Convex / Zero (local-first databases)

### What it is

A **backend-as-a-service** built around real-time sync. You define a schema and write "queries" (read functions) and "mutations" (write functions) in TypeScript. The framework hosts your data, runs your functions, and pushes updates to all connected clients automatically — no WebSocket setup, no React Query cache invalidation, no "did the other tab see this update yet" wrangling.

**Convex** is the mature player — closer to Firebase's developer experience, but with relational data and TypeScript-first APIs. **Zero** (by Rocicorp) is newer and takes the local-first idea further — the database lives in IndexedDB on the client, the server is just a sync coordinator.

### Why it matters for you

Anything multiplayer, anything collaborative, anything that needs "live updates" — Convex or Zero saves you from writing a Postgres + Redis + WebSocket + sync layer by hand. For solo projects it's a 10× speed-up to a working app.

### Prerequisites

- You know what a database is.
- You've used `useState` in React.
- You understand the difference between "fetching data once" and "subscribing to updates."

### How it looks

```ts
// convex/messages.ts — your backend function
import { query, mutation } from "./_generated/server";

export const list = query(async ({ db }) => {
  return await db.query("messages").order("desc").take(50);
});

export const send = mutation(async ({ db }, { text }) => {
  await db.insert("messages", { text, at: Date.now() });
});
```

```ts
// in your React component
const messages = useQuery(api.messages.list);   // auto-subscribes to updates
const send = useMutation(api.messages.send);

// when send() is called, every other tab updates within ~50ms.
```

### First step

Build a tiny multiplayer toy — a shared todo list, a chat room — on Convex. ~1 hour from zero to deployed. Don't overthink it.

→ See also: [Databases](/docs/stack/databases)

## Stripe + Resend

### What it is

**Stripe** is the payments platform: you call their API, they handle credit cards, taxes, subscriptions, fraud, and refunds. **Stripe Checkout** is their hosted pay page — you redirect users to a Stripe-hosted URL, they pay, you get a webhook back. Zero PCI-compliance burden.

**Resend** is the modern equivalent for transactional email (welcome emails, password resets, receipts). React-based email templates, a clean API, great deliverability.

### Why it matters for you

The moment anything you build crosses from "personal portfolio" to "people are paying for this," Stripe is the unambiguous answer. Resend is the unambiguous answer for "the app needs to send email." Both are well under an hour to integrate.

### Prerequisites

- You've made HTTP API calls before.
- You understand what a **webhook** is — an HTTP endpoint on your server that an external service calls to notify you of an event ("payment succeeded," "subscription cancelled").
- You know what an API key is and how to keep it secret (never commit it to git).

### How it looks

```ts
// create a Stripe Checkout session, redirect the user
const session = await stripe.checkout.sessions.create({
  mode: "payment",
  line_items: [{ price: "price_abc123", quantity: 1 }],
  success_url: "https://your-site.com/thanks",
  cancel_url: "https://your-site.com/cancelled",
});
return Response.redirect(session.url);
```

```tsx
// send an email with Resend
await resend.emails.send({
  from: "hello@yourdomain.com",
  to: user.email,
  subject: "Welcome",
  react: <WelcomeEmail name={user.name} />,
});
```

### First step

Don't learn these in the abstract. Wait until a project needs payment or email. Then you'll do it in an evening.

→ See also: [Services](/docs/stack/services)

## Authentication (Better Auth / Clerk / Lucia)

### What it is

**Authentication** = proving who someone is (login). **Authorisation** = checking what they're allowed to do. The first is a solved problem — don't write it yourself. Three good options:

- **Clerk**: hosted auth-as-a-service. Drop-in UI, social logins, multi-factor, user management dashboard. Costs money past free tier. Fastest to ship.
- **Better Auth**: open-source, framework-agnostic, you self-host (the data lives in your own DB). Modern, type-safe, growing fast in 2026.
- **Lucia**: minimalist, you write more of the glue but you understand every line. Best for learning how auth actually works.

Concepts: a **session** is a record that you're logged in (usually a row in a `sessions` table, identified by a long random string stored in a cookie). A **JWT** is a self-contained signed token (the session info is inside the cookie, no DB lookup needed) — modern advice is "prefer DB sessions; only use JWTs if you have a reason." **OAuth** is the standard for "log in with Google/GitHub/etc." — see [Authentication concept](/docs/foundations/authentication).

### Why it matters for you

Your `solomock` uses an email allowlist — fine for a closed beta. The moment you want anyone to be able to sign up and have their own session history, you need real auth. Don't build it yourself. SQL-injection-grade bugs hide in hand-rolled auth.

### Prerequisites

- You know what a cookie is (a small key/value pair the server tells the browser to remember and send back on every request).
- You know what HTTPS is.
- You know what a database is.
- For Lucia: you've done a Drizzle-style schema definition.

### How Clerk looks

```tsx
// app/layout.tsx
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function Layout({ children }) {
  return (
    <ClerkProvider>
      <html><body>
        <SignedOut><SignInButton /></SignedOut>
        <SignedIn><UserButton /></SignedIn>
        {children}
      </body></html>
    </ClerkProvider>
  );
}
```

### First step

When `solomock` needs real users, drop Clerk in for a weekend trial. If you hit Clerk's free limits, swap to Better Auth — by then you'll know what auth flows you actually need.

→ See also: [Authentication tools](/docs/stack/authentication-tools), [Authentication concept](/docs/foundations/authentication)

## Turborepo / pnpm workspaces

### What it is

A **monorepo** is a single git repository containing multiple projects (apps, libraries, shared code). The opposite is a **polyrepo** — one repo per project.

**pnpm workspaces** is a feature of pnpm (a faster, disk-efficient alternative to npm) that links projects within the same repo together — they can import from each other as if they were published packages, but it's all local.

**Turborepo** sits on top of pnpm workspaces and adds smart task running: it remembers which files each task touches, so if you change file X, only the projects affected by X get rebuilt or retested. Huge speed-ups in big repos.

### Why it matters for you

Your `all-in-one-URL` is already two projects in one folder (`services/` + `ui/`) without monorepo tooling. You probably duplicate types between them. With pnpm workspaces + a shared `packages/types/` folder, the URL response shape is defined once and consumed in both.

### Prerequisites

- You've used npm or pnpm before.
- You know what `package.json` is.
- You know what a git repository is.

### How it's organised

```
my-monorepo/
├── package.json            # root, declares workspaces
├── pnpm-workspace.yaml
├── turbo.json              # Turborepo task config
├── apps/
│   ├── web/                # your Next.js app
│   └── api/                # your backend
└── packages/
    ├── types/              # shared TS types
    └── ui/                 # shared shadcn components
```

### First step

Don't pre-migrate. The next time you start a project that obviously has two halves (a marketing site + an app, or a CLI + a library), reach for `pnpm create turbo` instead of plain npm.

→ See also: [Package Managers](/docs/stack/package-managers), [Build Tools](/docs/stack/build-tools)

## tRPC / typed server actions

### What it is

A REST API is a contract you write twice: once on the server (the route handler) and once on the client (the fetch call + the type of the response). If you change the server, nothing forces you to update the client; you find out at runtime.

**tRPC** ("typed RPC") removes the contract duplication. You define a function on the server. On the client, you import it and call it. The types flow through automatically. Under the hood it's still HTTP, but you never write fetch code or hand-type response shapes.

Server Actions in Next.js (covered in Tier 1) achieve something similar within Next.js specifically. tRPC is the framework-agnostic version — works with React Native, Astro, vanilla React, anything.

### Why it matters for you

Your `all-in-one-URL/ui` calls your FastAPI backend via fetch — you maintain TypeScript types of the response shape by hand. If the Python side changes, the UI breaks at runtime. tRPC eliminates that whole class of bug, but requires the backend to be in TypeScript too. So this is most useful if you're already migrating off Python (which is implied by Drizzle + Workers above).

### Prerequisites

- Comfortable TypeScript (generics, inference).
- You've built one client-server app with fetch calls.
- You understand TanStack Query — tRPC pairs with it.

### First step

Skip until you have a TS-only stack. Then read the tRPC docs and convert one endpoint.

→ See also: [APIs (foundations)](/docs/foundations/apis-graphql-trpc)

## Bun

### What it is

A new JavaScript runtime — a replacement for Node.js. Also a package manager (faster than npm/pnpm), a bundler, and a test runner, all in one binary written in Zig. APIs are mostly Node-compatible, so most code works unchanged.

### Why it matters for you

Mostly a speed win. `bun install` is 5–25× faster than `npm install`. `bun test` is several times faster than Vitest. For solo work where you run `install` often, that adds up. Production-readiness for serving traffic is improving but still trails Node.

### Prerequisites

- You've used Node and npm.

### First step

Install Bun. Use it as your package manager (`bun install` instead of `npm install`) on a project where you do many install cycles, like `solomock`. Keep Node as the actual runtime for now.

→ See also: [Languages](/docs/stack/languages), [Package Managers](/docs/stack/package-managers)

## Vercel AI SDK

### What it is

A TypeScript library that abstracts over LLM providers (OpenAI, Anthropic, Google, local models) with a single API. Handles streaming, tool calling, structured output, multi-turn chat — without writing the boilerplate per provider. Includes React hooks (`useChat`, `useCompletion`) for plumbing a streaming chat UI in ~20 lines.

### Why it matters for you

`solomock` uses the OpenAI Realtime API directly (which is fine — it's voice-specific). But the moment you add any non-Realtime LLM feature (e.g. "summarise the interview transcript"), the AI SDK is faster to use than the OpenAI SDK directly, and trivially lets you swap models or providers.

### Prerequisites

- You've made one call to an LLM API.
- You know what "streaming" means — receiving the response token-by-token as it's generated, rather than waiting for the whole thing.

### How it looks

```ts
// app/api/chat/route.ts
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = await streamText({
    model: openai("gpt-4o"),
    messages,
  });
  return result.toDataStreamResponse();
}
```

### First step

Add a "summarise this interview" button to `solomock` using `generateText` from the AI SDK. ~30 minutes of work.

→ See also: [AI Layer chapter](/docs/ai), [AI Infrastructure](/docs/stack/ai-infrastructure)

## Astro Server Islands

### What it is

Astro's core model is "everything is static HTML; interactive bits are tiny islands of JavaScript." Originally, those islands hydrated on the client. **Server Islands** (Astro 4.x+) let you mark a component as "render this on the server, on demand, after the static page loads." So a mostly-static page can still have a dynamic section (current user's name, a personalised quote) without going full SSR.

### Why it matters for you

Your `roofing-site` is pure static. If you wanted to add "show this morning's available booking slots" dynamically without redeploying every hour, Server Islands give you that without ejecting to Next.js.

### First step

On the roofing site, replace one hard-coded number (e.g. "5-star reviews this month") with a Server Island that fetches it live. See the Astro docs — pattern is a single attribute change.

→ See also: [Frontend Frameworks](/docs/stack/frontend-frameworks), [SSG](/docs/foundations/ssg)

## OpenTelemetry basics

### What it is

A vendor-neutral standard for instrumenting code — recording **traces** (a tree of operations: "this request triggered these DB calls and that external API"), **metrics** (counts, durations, sizes over time), and **logs**. Sentry, Datadog, Honeycomb, Grafana — they all speak OTel.

The point: you instrument once. If you change observability vendors later, you don't rewrite instrumentation.

### Why it matters for you

For a solo dev with one backend, Sentry alone is fine. OpenTelemetry becomes worth it when you have multiple services calling each other and you need to follow a single user request across them.

### First step

Defer until you have ≥2 services. Then read the Honeycomb or Datadog OTel quickstart.

→ See also: [Observability tools](/docs/stack/observability-tools)

## Common mistakes

:::caution[Where people commonly trip up]
- **Learning Tier 2 tools speculatively.** This whole tier is "learn it *when a project asks for it*." Spending a Saturday on Convex without a multiplayer project to apply it to, or wiring up tRPC on a single-page form-submit app, burns time you could have used shipping. Wait for the pull.
- **Adopting tRPC when Server Actions already cover the need.** If your stack is Next.js end-to-end and your APIs are only consumed by your own app, Server Actions (Tier 1) give you typed RPC for free. tRPC's win is *framework-agnostic* typed RPC — multiple clients (React Native, Astro, vanilla React) calling the same backend. Reach for it then; before then it's extra layers.
- **Treating Cloudflare Workers as a drop-in for any Node backend.** Workers run V8 isolates, not Node — no filesystem, no long-lived TCP pools, no native dependencies, strict CPU limits per request. Re-implementing a backend on Workers means rethinking the parts that assume Node. Great for the small-fast-endpoint half of the app; wrong for the heavy-lifting half.
- **Picking Bun / Astro / Convex because the demo videos look cool.** Hype velocity is not fit. The honest question is "what does my next project actually need?" If the answer is "the auth flow Clerk already handles" or "the email Resend already sends," reach for the tool that maps to your real next step — not the trendiest entry on this page.
:::

## Page checkpoint

<Quiz id="tier-2-page" title="Did Tier 2 stick?" sampleSize={3}>

<Question
  prompt="You're building a one-page contact form for a friend's small business — Next.js, one form submit, one database insert. Is tRPC the right tool?"
  options={[
    { text: "Yes — type safety always wins" },
    { text: "Yes — tRPC is required for production Next.js apps in 2026" },
    { text: "No — a Next.js Server Action already gives you typed RPC for in-app calls; tRPC's win is framework-agnostic typed RPC across multiple clients" },
    { text: "No — REST is the only correct answer for a form submit" }
  ]}
  correct={2}
  explanation="tRPC shines when you have multiple clients (React Native, Astro, vanilla React, etc.) hitting the same backend and want shared types. Inside a single Next.js app, Server Actions already give you typed function calls server-to-client without the tRPC setup. For a one-page form: Server Action."
  revisit={{ to: "/docs/roadmap/part-2-modern-stack/tier-2#trpc--typed-server-actions", label: "tRPC / typed server actions" }}
/>

<Question
  prompt="What does a local-first sync engine (Convex, Zero) give you that a standard Postgres + REST stack does NOT?"
  options={[
    { text: "Cheaper hosting at scale" },
    { text: "An instant-feeling UI (writes hit a local copy first), automatic real-time sync to other connected clients, and offline tolerance — without you writing the WebSocket / conflict-resolution / cache-invalidation glue" },
    { text: "Better SEO" },
    { text: "Type-safe SQL queries — Postgres doesn't have those" }
  ]}
  correct={1}
  explanation="The point of a sync engine is that the database, the offline storage, the sync protocol, and the conflict resolution are bundled. You get instant UI (local write first), live updates across clients, and offline tolerance — the messy parts of building a multiplayer app — without writing a Postgres + Redis + WebSocket layer by hand."
  revisit={{ to: "/docs/roadmap/part-2-modern-stack/tier-2#convex--zero-local-first-databases", label: "Convex / Zero" }}
/>

<Question
  prompt="What's the key thing edge runtimes (Cloudflare Workers + Hono) change about how you write backend code?"
  options={[
    { text: "Nothing — it's just hosting; the code is the same as a Node Express app" },
    { text: "You write in Rust instead of JavaScript" },
    { text: "You lose parts of the Node API (filesystem, long-lived TCP, native modules) and gain global low-latency execution + no cold starts in the traditional sense — so backend code is structured around small stateless handlers" },
    { text: "Code runs only in the user's browser" }
  ]}
  correct={2}
  explanation="Workers run V8 isolates, not full Node — no fs, no native binaries, no persistent connections, strict CPU limits per request. In exchange you get code running in 300+ data centres near every user with effectively no cold starts. The trade-off forces small stateless handler-shaped backend code (which is also why Hono exists)."
  revisit={{ to: "/docs/roadmap/part-2-modern-stack/tier-2#cloudflare-workers--hono", label: "Cloudflare Workers + Hono" }}
/>

</Quiz>
