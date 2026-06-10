---
id: edge-computing
title: 'Edge computing: Workers, isolates, and the latency win'
sidebar_position: 46
sidebar_label: Edge computing
description: What "the edge" actually is, the V8 isolates model that Cloudflare Workers / Vercel Edge / Deno Deploy share, what runs at the edge vs origin, cold-start economics, and when edge is a real win vs hype.
---

# Edge computing: Workers, isolates, and the latency win

> **In one line:** Edge computing means running your code physically close to the user (often in 100+ data centers worldwide) for low latency — usually on a constrained, V8-isolate-based runtime that starts in under 5ms and can scale to millions of concurrent requests, at the cost of incompatibility with most of npm and a slim execution budget.

:::tip[In plain English]
A request from Tokyo to a Virginia server is ~150ms before your code even runs. If you can run your code in Tokyo instead, the user feels everything ~150ms snappier. That's the edge promise. The catch: edge runtimes (Cloudflare Workers, Vercel Edge Functions, Deno Deploy) aren't Node — they're a smaller, V8-isolate-based environment with no filesystem, limited memory, short execution time, and a curated subset of APIs. Use them for the things where latency matters (HTML rendering, auth checks, A/B routing, AI proxying) and keep origin servers for the things that need full Node (long-running jobs, heavy npm dependencies, raw filesystem).
:::

In 2026, edge is a standard layer in many web app stacks — not a replacement for origin, but a complement.

## What "edge" actually means

A traditional web app runs in *one* region (or a handful), behind a CDN that caches static assets. User in Sydney requesting an SSR page round-trips to your origin in Virginia: 300ms+ before anything happens.

Edge runtimes flip the model: **your code runs in the same datacenter as the user**, often as close as the nearest Cloudflare PoP (200+ globally) or the nearest Vercel edge node.

```mermaid
flowchart LR
    User[User in Sydney] -->|~15ms| Edge[Edge in Sydney]
    Edge -->|~150ms| Origin[Origin in Virginia]
    Edge -.->|cached at edge| User
    Origin -->|response| Edge
    Edge -->|response| User
```

For requests the edge can fully handle (cache hit, simple auth, geo-aware routing), the user never round-trips to origin. For requests that need origin (DB query, write), the edge becomes a smart proxy — adding the round-trip but doing useful work in parallel.

## The V8 isolates model

The major edge runtimes (Cloudflare Workers, Vercel Edge, Deno Deploy) all run on **V8 isolates** rather than Node processes or containers.

A **V8 isolate** is a lightweight JavaScript execution context. One Node process can host thousands of isolates. Each runs its own JS code in memory isolation.

```
Traditional: 1 Node process per Worker = 1 user's code = OS overhead, MB of memory
Isolates:    1 process hosts 1000s of isolates = MB → KB overhead per
```

Properties:
- **Fast startup** — a cold start (no isolate yet) is ~5ms. A warm one is microseconds.
- **Cheap to keep around** — thousands of isolates idle in memory, used as needed.
- **Strong isolation** — the V8 sandbox prevents one isolate from seeing another's memory.
- **Limited APIs** — no `fs`, no `child_process`, no raw threads, no native modules.
- **Strict resource budgets** — typically 128MB memory, 30-50ms CPU time per request (configurable, with limits).

The cold-start advantage is the headline. AWS Lambda's cold start is 100s of ms to seconds (booting Node + your code in a container). Workers boot in single-digit ms.

## What edge runtimes have, and don't

| Available | Not available |
|-----------|---------------|
| `fetch`, `Request`, `Response` (web standards) | `fs`, `child_process`, `worker_threads` |
| Web Crypto API | Node's `crypto` (mostly — partial via shims) |
| `TextEncoder`/`TextDecoder`, `URL`, `URLSearchParams` | Native binary modules (`.node` files) |
| Streams (`ReadableStream`) | Many npm packages that use Node built-ins |
| `caches.default` (Workers) — edge KV cache | Long-running background tasks |
| `KV`, `R2`, `D1` (CF), `Edge Config` (Vercel) | Direct disk access |
| WebSockets, HTTP/2/3 | Native `dns`, `tls` modules |
| WASM | Threads |

The npm compatibility issue is the practical pain point. Many libraries assume Node and either fail to load or fail at runtime in edge.

Movement toward this: Cloudflare's `nodejs_compat` flag emulates a growing subset of Node APIs. Vercel Edge supports `node:` prefixed imports for a curated set. Bun is Node-compatible but isn't an edge runtime yet (though it powers some).

For now: assume edge is "browser-ish JS with `fetch`," not "Node."

## What to run at the edge

The win is per-request, not per-feature. Patterns where edge shines:

### 1. Auth checks at the edge

Validate a JWT, check a session cookie, redirect unauthenticated users — all before the request hits origin.

```typescript
// Cloudflare Worker / Vercel Edge middleware
export const config = { matcher: '/dashboard/:path*' };

export default async function middleware(req: Request) {
  const session = req.cookies.get('session');
  if (!session) {
    return Response.redirect(new URL('/login', req.url));
  }
  const valid = await verifyJWT(session.value);
  if (!valid) return Response.redirect(new URL('/login', req.url));
  return NextResponse.next();
}
```

Saves a round trip for unauthenticated users; only legit requests hit your origin.

### 2. A/B testing / feature flag routing

Decide which variant to serve at the edge based on cookies, geo, or random assignment.

```typescript
const variant = Math.random() < 0.5 ? 'a' : 'b';
return rewriteToVariant(req, variant);
```

No round trip to origin to learn the variant.

### 3. Geographic routing

User in Europe → route to EU origin. User in US → US origin. Decided at edge based on the request's geolocation header (CF adds `cf-ipcountry` automatically).

### 4. Static + dynamic composition

Edge can stream a page: static shell from cache, dynamic chunks from origin. Lower TTFB than waiting for origin's full response.

Next.js App Router's streaming SSR + Partial Prerendering (PPR) leverages this — the edge serves the static shell instantly, then streams dynamic Suspense boundaries as origin computes them.

### 5. AI proxying

LLM streaming responses from the edge:

- Client → edge → AI provider.
- Edge streams the response back, possibly caching common prompts (with `cache_control`).
- Lower latency than client → origin (in one region) → AI provider.

Edge can also handle things like ephemeral key minting (mentioned in [Secrets & API keys](./secrets-and-keys#the-ephemeral-key-pattern)) — quick, no DB needed.

### 6. Image transformation

Cloudflare Images, Vercel Image, Imgix — image resize/format conversion at the edge, cached. Saves origin bandwidth and adds milliseconds where origin would add seconds.

### 7. Edge KV / config

Cloudflare Workers KV, Vercel Edge Config — small read-mostly key-value stores accessible in single-ms reads at the edge. Great for feature flags, lookup tables, redirect rules.

## What to NOT run at the edge

- **Heavy compute.** 30-50ms CPU budget; you can't run an ML model.
- **Long-running tasks.** No background jobs; the worker dies when the response is sent.
- **Stateful work.** No local filesystem; ephemeral memory; not the right place for "remember this user's progress."
- **Most npm packages with native deps.** `sharp`, `puppeteer`, anything with native binaries.
- **Direct heavy DB queries.** Edge → origin DB is a long network hop; you've lost the latency win. Use edge databases (D1, Turso, PlanetScale Hyperdrive) or cache.

The mental model: **edge is the smart router; origin is the kitchen.** Edge decides what to do, often answers quickly from cache, and delegates the heavy stuff to origin.

## Edge databases

Connecting from edge to a traditional Postgres in one region negates the latency win. Three approaches:

| Approach | Examples |
|----------|----------|
| **Edge-replicated DB** | Turso (libSQL), Cloudflare D1, PlanetScale (read replicas at edge), Fly Postgres (Litestream/LiteFS) |
| **Connection pooling at edge** | PlanetScale Hyperdrive, Neon's serverless driver — short-lived connections okay |
| **Edge KV** | Workers KV, Edge Config, Upstash Redis — small read-mostly key-value |

For "I need a Postgres I can call from the edge in under 10ms": Turso (SQLite + replication) or Neon with their pgserverless driver are the 2026 favorites.

## Cold starts and warm starts

Lambda's cold-start tax (100ms-2s) is what made edge runtimes attractive in the first place. Numbers (typical):

| Platform | Cold start | Warm |
|----------|-----------|------|
| **AWS Lambda (Node, no provisioned)** | 100-700ms | sub-ms |
| **AWS Lambda@Edge** | similar to Lambda | sub-ms |
| **Cloudflare Workers** | 1-5ms | sub-ms |
| **Vercel Edge** | similar to CF | sub-ms |
| **Deno Deploy** | ~5ms | sub-ms |
| **Cloudflare Workers + heavy npm imports** | 5-50ms (parsing) | sub-ms |

Cold start matters when your traffic is bursty (every Worker hot, then idle, then a burst → some cold starts in the burst). For steady traffic, Workers are always warm.

Pro tip: minimize imports at module top level. Each `import` parses on cold start.

## When edge isn't worth it

Most apps don't *need* edge. Honest scenarios where it's a real win:

- **High-traffic content** where TTFB savings compound.
- **Geographically diverse user base** (one US-only origin can't serve Europe + Asia well).
- **Read-heavy** dynamic content cacheable at edge.
- **AI streaming** where every 100ms saved improves perceived speed.

Scenarios where edge is hype:

- **Single-region B2B SaaS** with users mostly in one country.
- **Heavily write-heavy** apps — every write goes back to origin DB anyway.
- **Complex npm dependencies** that don't work at edge — fighting the runtime negates the win.
- **Tiny apps where origin is already fast.**

Don't pick edge for the resume. Pick it when you've measured TTFB to far-region users and want to fix it.

## Deploying edge code

The major platforms:

### Cloudflare Workers

```typescript
// worker.ts
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/hello') {
      return new Response(`Hello from ${request.cf?.colo}`);
    }
    return fetch(request);  // proxy to origin
  },
};
```

```toml
# wrangler.toml
name = "my-worker"
main = "worker.ts"
compatibility_date = "2026-01-01"
compatibility_flags = ["nodejs_compat"]
```

Deploy: `wrangler deploy`. Routes via `*.workers.dev` subdomain or your own domain on Cloudflare.

Pricing (2026): $5/month for ~10M requests; cheap.

### Vercel Edge Functions / Middleware

```typescript
// middleware.ts at project root
import type { NextRequest } from 'next/server';

export const config = { matcher: ['/((?!api|_next/static).*)'] };

export function middleware(req: NextRequest) {
  // runs at the edge for every matched request
}
```

Bundled with Next.js deployment. Per-region or globally distributed.

### Deno Deploy

Native to Deno; deploy with `deployctl`. URL imports, no `node_modules`, very fast.

### Bun + Cloudflare or other

Bun isn't itself an edge platform yet, but its dev-time speed makes Workers development pleasant.

## Other edge offerings

- **Fastly Compute@Edge** (Rust/Go/JS) — older, mature, WASM-based.
- **AWS Lambda@Edge / CloudFront Functions** — AWS's edge, integrates with their stack.
- **Akamai EdgeWorkers** — for Akamai-shop enterprises.

## Common mistakes

:::caution[Where people commonly trip up]
- **Picking edge by default.** "Modern apps use edge." If your origin is fast for your users, edge adds complexity (different runtime, npm incompatibility) for marginal gains. Measure first.
- **Calling a single-region Postgres from edge.** Edge → US Postgres takes ~150ms from Asia. You moved the latency, you didn't remove it. Use an edge DB (Turso, D1) or accept that complex DB work stays at origin.
- **Importing the world.** `import { everything } from 'lodash'` in a Worker bloats cold start. Tree-shake aggressively; small imports.
- **Using Node-only npm packages.** `sharp`, `puppeteer`, `bcrypt` (native) — fail at edge. Pick edge-compatible alternatives (`@noble/hashes` for crypto, etc.).
- **Treating edge like a long-running server.** No background tasks. The worker is gone the moment the response is sent. Use queues + workers (at origin) for that.
- **Relying on local cache that's per-isolate.** Each isolate has its own memory; a user might hit a different one next request. Use KV / Cache API for shared state.
- **No origin fallback.** Worker has a bug → entire site is broken. Cloudflare's `fetch(request)` passthrough lets you skip the Worker and hit origin directly on error.
- **30-50ms CPU exceeded errors.** Tight CPU budgets bite when you accidentally do heavy work at edge. Profile; move heavy work to origin or background workers.
- **Mixing logs from many isolates with no correlation.** Worker logs across thousands of concurrent isolates need trace IDs to be useful. Wire OpenTelemetry / Workers Logpush correctly.
- **Underestimating egress to origin.** Every Worker call to origin is bandwidth. If you proxy every request, you pay both edge *and* origin bandwidth. Cache where you can.
:::

## Page checkpoint

<Quiz id="foundations-edge-computing-page" title="Did edge computing stick?" sampleSize={3}>

<Question
  prompt="Why do Cloudflare Workers / Vercel Edge cold-start in single-digit ms when AWS Lambda takes 100ms-2s?"
  options={[
    { text: "They run on faster hardware" },
    { text: "Edge platforms use V8 isolates — lightweight JS execution contexts that share a Node process — instead of spinning up a container per function. Boot a new container = slow; spin up a new isolate = fast. Trade-off: you get a smaller, browser-like API surface, not full Node" },
    { text: "They preload all customer code" },
    { text: "Lambda is intentionally slow" }
  ]}
  correct={1}
  explanation="Isolates vs containers is the architectural distinction. Many isolates share one process and the V8 engine; starting one is microseconds-to-ms. Containers must boot the OS bits + Node + your code from scratch."
  revisit={{ to: "/docs/foundations/edge-computing#the-v8-isolates-model", label: "V8 isolates model" }}
/>

<Question
  prompt="A team deploys their whole Next.js app to Vercel Edge. Pages that read from their single-region Postgres are *slower* than the previous origin-only deploy. Why?"
  options={[
    { text: "Edge runtimes are slower" },
    { text: "Edge ran near the user, but the DB call from edge → distant origin Postgres adds the latency back. The edge win disappears when every request still has to make a long DB call. Either use an edge-replicated DB (Turso, D1, PlanetScale with read replicas at edge) or keep DB-heavy pages at origin" },
    { text: "Vercel throttles paid plans" },
    { text: "Postgres doesn't support edge" }
  ]}
  correct={1}
  explanation="Edge code at the user's edge, DB call to faraway origin → you moved the latency, not removed it. Edge wins when work happens at the edge (cache, simple auth, A/B routing). Heavy DB use needs edge DBs or origin compute."
  revisit={{ to: "/docs/foundations/edge-computing#edge-databases", label: "DB latency at edge" }}
/>

<Question
  prompt="A team's edge function imports a 500KB npm package. Cold starts spike to ~50ms. What's the right reaction?"
  options={[
    { text: "Stop using edge" },
    { text: "Edge cold-start cost is dominated by JS parse time; large imports hurt. Tree-shake aggressively, replace heavy libraries with edge-friendly alternatives, lazy-import what's not needed on every request. The whole point of edge is the fast start — preserve it" },
    { text: "Buy a Workers Enterprise plan" },
    { text: "Use AWS Lambda" }
  ]}
  correct={1}
  explanation="Edge advantage is the millisecond-cold-start. Each import is parsing on first invocation. Keep the worker small; for heavy work, push it origin-side or use dynamic imports for cold paths."
  revisit={{ to: "/docs/foundations/edge-computing#cold-starts-and-warm-starts", label: "Cold start size matters" }}
/>

<Question
  prompt="A team wants to run a 2-minute video transcoding job 'at the edge' for low latency. What's wrong with this plan?"
  options={[
    { text: "Transcoding is illegal at the edge" },
    { text: "Edge runtimes have strict CPU time per request (30-50ms) and don't support long-running tasks. They're for fast request handlers, not heavy compute. Transcoding belongs on a worker (origin) — possibly invoked via an edge-side trigger but executed away from the edge" },
    { text: "FFmpeg isn't available in any environment" },
    { text: "Edge can only run JavaScript" }
  ]}
  correct={1}
  explanation="Edge is the smart router, not the kitchen. Tight CPU and time budgets; no filesystem; no long-running background. Heavy work belongs at origin (or a managed service like Mux for transcoding)."
  revisit={{ to: "/docs/foundations/edge-computing#what-to-not-run-at-the-edge", label: "Don't run heavy work at edge" }}
/>

</Quiz>

## What's next

→ Continue to [Performance & Core Web Vitals](./performance).
