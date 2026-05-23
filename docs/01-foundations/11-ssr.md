---
id: ssr
title: SSR — Server-Side Rendering
sidebar_position: 12
sidebar_label: SSR
description: HTML is generated on the server, fresh, for every request. Slower than SSG but always up-to-date and personalizable.
---

# SSR — Server-Side Rendering

> **In one line:** Build HTML fresh, per user, per request. Slower than SSG but always current and personalizable.

:::tip[In plain English]
SSR is what the web did before SSG existed and what most "dynamic" sites still do. Every time you visit `amazon.com/orders`, Amazon's servers look up *your* orders, build *your* personalized HTML, and send it to you. The next user gets entirely different HTML built for them. The trade-off: someone has to do that work on the server every time, which costs money and adds latency.
:::

## How SSR works

HTML is generated on the server **for each request**.

**Flow:**

1. User requests `/products/42`.
2. Server runs your code, queries the database, builds HTML.
3. Server sends HTML to the user.
4. Browser displays it; JavaScript **hydrates** the page (attaches event handlers and framework state to the already-rendered DOM) to add interactivity.

```mermaid
flowchart LR
    U[User] --> S[Server runs code]
    S --> DB[(Query DB)]
    DB --> R[Render HTML]
    R --> B[Browser shows page]
    B --> H[JS hydrates - fully interactive]
    style S fill:#2a5
    style R fill:#2a5
```

> **Reading this diagram:** The green steps are the per-request work — every visitor pays for them. That's the cost of "always fresh" data.

The word **hydrate** matters here: the server sends complete HTML *and* a JavaScript bundle. The browser shows the HTML immediately, then runs the JavaScript which "attaches" event handlers and React/Vue/etc. state to the existing DOM. The page goes from "visible but inert" to "fully interactive" smoothly.

## Pros

- **Always-fresh data** — every request hits the database.
- **Good for SEO** — search engines see real HTML, not an empty `<div id="app">`.
- **Can personalize per request** — show the user's name, region, currency, etc.
- **Works without JavaScript on the client** — even with JS disabled, content is visible.

## Cons

- **Slower than SSG** — server has to do work per request.
- **Requires running servers** — more expensive than just hosting static files.
- **Server load scales with traffic** — 10× users means roughly 10× server CPU.

:::note[Worked example: SSG vs SSR for the same page]
Imagine `/products/42`.

**With SSG:**

- *Build time:* Render the page for product 42 once. Save as `products-42.html`.
- *Request:* CDN serves `products-42.html` in ~30ms.
- *Problem:* If price changes, you must rebuild and redeploy.

**With SSR:**

- *Request:* Server queries DB for product 42, renders HTML with current price. Sends to user in ~200ms.
- *Benefit:* Price update is reflected immediately.
- *Cost:* Server does this work every single time.

A blog post would be SSG (rarely changes). A product page with live inventory and pricing would be SSR (changes constantly).
:::

## When to use SSR

| Site type            | SSR fit?                                          |
|---------------------|---------------------------------------------------|
| E-commerce           | ✅ Live pricing, inventory, recommendations       |
| Social media feeds   | ✅ Personalized per user                          |
| Dashboards (public)  | ✅ Live data                                      |
| Booking / scheduling | ✅ Live availability                              |
| Blog / docs          | ⚠️ Possible, but SSG is usually better            |
| Marketing site       | ❌ Use SSG                                        |

## The tools

| Tool              | Notes                                                       |
|-------------------|-------------------------------------------------------------|
| **Next.js**       | Most common 2026 choice (App Router does streaming SSR by default) |
| **Nuxt**          | Vue equivalent of Next.js                                   |
| **SvelteKit**     | Svelte equivalent                                           |
| **Remix**         | React, web-platform-first (form-driven)                     |
| **Rails**         | The classic — Ruby on Rails has been doing SSR since 2004   |
| **Django**        | Python equivalent                                           |
| **Phoenix / Elixir** | LiveView is a fascinating SSR + real-time hybrid         |

:::info[Highlight: SSR is just "the original web" with better tools]
SSR sounds modern but it's actually the *oldest* model — PHP, Rails, Django, even ASP from the 1990s all did SSR. What changed in the last decade is that React/Vue/Svelte made it possible to have an SSR architecture *and* a snappy SPA-like client experience, by sending hydration JavaScript alongside the server-rendered HTML.
:::

## A subtle but important point: streaming

Modern SSR isn't all-or-nothing. With **streaming SSR** (the default in Next.js App Router, Remix, SvelteKit), the server starts sending HTML *as soon as it has the first chunk ready*, before the slow parts are done. The browser starts rendering the header, navigation, and other fast-loading sections immediately, while slow database queries continue in the background and stream in when ready.

We'll cover streaming in detail in the [ISR, Streaming & PPR page](./isr-streaming-ppr). For now, just know that "SSR is too slow" is a 2015 critique — modern streaming SSR is competitive with SSG for first paint.

:::note[Try it yourself]
```bash
npx create-next-app@latest my-app
# accept defaults (App Router = streaming SSR by default)
cd my-app
npm run dev
```

Visit `http://localhost:3000`. Then open DevTools → Network → reload. You'll see the HTML response stream in chunks rather than as one big blob — that's streaming SSR in action. Watch the "Waterfall" column in particular: each chunk lights up as it arrives, so you can literally see the page being built top-down over the wire.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Doing a slow query inside the server render and wondering why first paint is slow.** SSR is fresh, but every request blocks on the database. A 600ms query becomes a 600ms LCP. The fix is either (a) cache the query result for N seconds at the framework or Redis layer, or (b) move the slow part inside a `<Suspense>` boundary so the page streams while it loads.
- **Forgetting that hydration ships JavaScript.** "Server-rendered" doesn't mean "no JS" — the browser still downloads and runs the framework runtime to attach event handlers. If you want SSR *without* hydration JS, you need Astro islands, HTMX, or RSC + careful client-component boundaries.
- **Reading from `window` or `document` in a server-rendered component.** That code runs on the server first, where neither exists, and the page crashes during render. Guard with `typeof window !== 'undefined'` or move browser-only code into a `useEffect` / `"use client"` boundary.
- **Caching personalized SSR responses at the CDN.** If your SSR page renders the logged-in user's name and the CDN caches it as `public`, the next visitor sees a stranger's name. Personalized SSR responses must be `Cache-Control: private` or skip the CDN cache entirely.
- **Treating "I added SSR" as a security model.** Server-rendered code runs on a public endpoint just like an API. Anyone can hit `/profile/42` directly — if you forget the auth check on that route, you've leaked the data. SSR isn't a protection layer; auth checks are.
:::

## Page checkpoint

<Quiz id="ssr-page" title="Did SSR stick?" sampleSize={2}>

<Question
  prompt="In a typical React SSR setup, what does 'hydration' refer to?"
  options={[
    { text: "The server querying the database before rendering" },
    { text: "The browser running JavaScript that attaches event handlers and framework state to the already-rendered DOM" },
    { text: "The CDN caching the HTML for the next request" },
    { text: "The browser converting HTML into a PDF" }
  ]}
  correct={1}
  explanation="The server sends complete HTML plus a JS bundle. The browser shows the HTML immediately, then runs the JS, which 'hydrates' the existing DOM — attaching event handlers, restoring state, making it interactive."
  revisit={{ to: "/docs/foundations/ssr#how-ssr-works", label: "How SSR works" }}
/>

<Question
  prompt="What's a key advantage of SSR over SSG for a product page with live pricing?"
  options={[
    { text: "SSR uses less server CPU" },
    { text: "SSR generates HTML fresh per request, so the price is always current — no rebuild required" },
    { text: "SSR works without HTTPS" },
    { text: "SSR doesn't need JavaScript on the client at all" }
  ]}
  correct={1}
  explanation="SSR re-queries the database on every request, so any data change is reflected immediately. SSG would require a rebuild and redeploy each time the price changes — impractical for live data."
  revisit={{ to: "/docs/foundations/ssr#pros", label: "SSR pros" }}
/>

<Question
  prompt="What does 'streaming SSR' improve over traditional all-at-once SSR?"
  options={[
    { text: "It compresses the HTML harder" },
    { text: "The server starts flushing HTML as soon as the first chunk is ready, so fast sections (header, layout) paint before slow data finishes loading" },
    { text: "It moves all rendering to the client" },
    { text: "It eliminates the need for a server" }
  ]}
  correct={1}
  explanation="Traditional SSR waits for ALL data before sending any HTML. Streaming SSR sends the page header and shell immediately, then streams in slow sections (often inside Suspense boundaries) as their data arrives — dramatically faster first paint."
  revisit={{ to: "/docs/foundations/ssr#a-subtle-but-important-point-streaming", label: "Streaming SSR" }}
/>

<Question
  prompt="What's the main cost trade-off you're accepting when you choose SSR over SSG?"
  options={[
    { text: "Worse SEO" },
    { text: "Server CPU work per request, which scales with traffic — 10x users means roughly 10x server cost" },
    { text: "No support for caching" },
    { text: "No way to use a CDN" }
  ]}
  correct={1}
  explanation="SSG is free at request time (the CDN does the work). SSR pays server CPU per request, so cost scales linearly with traffic. You get freshness and personalization in exchange."
  revisit={{ to: "/docs/foundations/ssr#cons", label: "SSR cons" }}
/>

</Quiz>

## What's next

→ Continue to [CSR — Client-Side Rendering](./csr) where the *browser* builds the HTML with JavaScript instead of the server.
