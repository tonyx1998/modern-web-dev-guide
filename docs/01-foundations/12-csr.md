---
id: csr
title: CSR — Client-Side Rendering
sidebar_position: 13
sidebar_label: 12. CSR
description: The browser, not the server, builds the page. Great for internal tools and admin dashboards; poor default for public sites.
---

# CSR — Client-Side Rendering

> **In one line:** The server sends a near-empty HTML shell; the browser downloads a JavaScript bundle that builds the entire UI.

:::tip[In plain English]
CSR is what early React, Angular, and Vue apps did. The server's only job is to send the JavaScript bundle. The *browser* then runs that JavaScript, asks for data via API calls, and constructs every pixel of the UI itself. Fast and snappy *after* the initial load. Painfully slow *during* the initial load, especially on a 4G phone. Bad for SEO unless you patch it.
:::

## How CSR works

The server sends a near-empty HTML shell. The browser downloads JavaScript that then builds the entire UI.

**Flow:**

1. User requests `/products/42`.
2. Server sends:
   ```html
   <html>
     <body>
       <div id="app"></div>
       <script src="bundle.js"></script>
     </body>
   </html>
   ```
3. Browser downloads `bundle.js`, executes it.
4. JS makes API calls (e.g., `fetch('/api/products/42')`), builds the DOM, attaches handlers.

Until step 4 completes, the user sees a **blank white screen**. Slow networks make this worse — large bundles can take seconds to download and parse on cellular.

## Pros

- **Snappy navigation after initial load** — no full page reloads.
- **Server is just an API** — no rendering work, much simpler backend.
- **Familiar mental model** — it's basically a desktop app in the browser.

## Cons

- **Slow initial load** — large JS bundle, blank screen until JS runs.
- **Bad SEO** — search engine crawlers may not execute JS (Googlebot does, but inconsistently; most others don't).
- **Bad for low-end devices or slow networks** — CSR shifts work to the user's phone.
- **White flash on first paint** — bad first impression.

## When to use CSR

In 2026, **pure CSR is considered a poor default for public-facing sites**. The industry has largely moved to SSR + hydration for public apps and CSR only for internal tools.

CSR remains fine for:

| Site type           | Why CSR works here                                          |
|---------------------|-------------------------------------------------------------|
| Internal tools      | No SEO needed; users tolerate a few-second first load        |
| Admin dashboards    | Behind a login, no SEO, users use it daily so initial load amortizes |
| Highly interactive apps (Figma, Notion) | UI complexity makes per-request rendering wasteful  |
| Apps behind authentication | Search engines can't see them anyway                  |

## The tools

| Tool                     | Notes                                                       |
|--------------------------|-------------------------------------------------------------|
| **Vite + React/Vue/Svelte** | The modern CSR stack. Vite is the dominant build tool.   |
| **Create React App**     | Deprecated. Don't start new projects with it.               |
| **Angular**              | Defaults to CSR (with optional Angular Universal for SSR).  |
| **SolidJS + Vite**       | Fast-rising alternative; very small bundles.                |

:::note[Worked example: anatomy of a CSR app load]
Visit a CSR site (e.g., an old Create React App project). In DevTools → Network → reload:

1. **HTML response** arrives. Size: ~1 KB. Body: an empty `<div id="root">` and a `<script>` tag.
2. **JS bundle** arrives. Size: 200–500 KB compressed. The browser parses and executes it (100–500ms on a fast machine, multiple seconds on a slow phone).
3. **API requests** fire. Each one is 50–500ms.
4. Once all data is back, React/Vue mounts the components and the page becomes visible.

Time-to-first-meaningful-paint: typically 2–5 seconds on cellular. Compare to SSR (200–500ms) or SSG (50–100ms).
:::

:::info[Highlight: SSR + hydration is "CSR after the first request"]
A common misconception: people think SSR and CSR are mutually exclusive. They're not.

Modern frameworks (Next.js, Remix, SvelteKit) do **SSR for the first page load** (fast first paint, good SEO) and then **CSR for subsequent navigations** within the app (instant, no page reload). You get the best of both. This is why pure CSR has fallen out of favor for public apps — the alternatives give you everything CSR offered plus a faster first impression.
:::

## What's next

→ Continue to [ISR, Streaming & PPR](./isr-streaming-ppr) where we look at the hybrid strategies the industry invented to get the best of SSG, SSR, and CSR all at once.
