---
id: csr
title: CSR — Client-Side Rendering
sidebar_position: 13
sidebar_label: CSR
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

## Common mistakes

:::caution[Where people commonly trip up]
- **Picking pure CSR for a public marketing site in 2026.** It was the default in 2017. It is not in 2026. Crawlers see a blank shell, link previews break on Slack/Twitter, and LCP on a 4G phone is awful. Default to a hybrid framework (Next.js, Remix, Astro) unless the app lives entirely behind a login.
- **Assuming "Googlebot runs JS" means SEO is solved.** Googlebot is *one* crawler. Bing, DuckDuckGo, Slack, Discord, Telegram, OpenGraph scrapers, AI training crawlers — most of them do not execute JavaScript at all. They see `<div id="root">` and index nothing.
- **Letting the bundle grow unchecked.** "Just one more library" pushes you from 200KB to 800KB without anyone noticing. Add a bundle-size budget (`source-map-explorer`, `bundle-visualizer`) to CI so the next 100KB dependency has to be justified.
- **Ignoring the loading state.** A CSR app shows nothing until JS loads, runs, calls APIs, and renders. Without a server-rendered shell or a skeleton, users see a multi-second blank page and assume the site is broken. At minimum, ship a meaningful HTML placeholder.
- **Falling for "SSR vs CSR" as a binary.** Modern hybrid frameworks do SSR on the first request and CSR for subsequent navigations within the app. You don't pick one — you get both. "Pure CSR" is a specific choice with specific trade-offs, not the only alternative to SSR.
:::

## Page checkpoint

<Quiz id="csr-page" title="Did CSR stick?" sampleSize={2}>

<Question
  prompt="On a pure CSR app, what does the server actually return for /products/42?"
  options={[
    { text: "A fully rendered HTML page with the product's name and price" },
    { text: "A near-empty HTML shell plus a <script> tag — the JS then fetches data and builds the DOM" },
    { text: "A JSON document describing the product" },
    { text: "Nothing — CSR doesn't use a server" }
  ]}
  correct={1}
  explanation="In CSR the server just ships the JS bundle and an empty <div id='app'>. The browser downloads the bundle, runs it, calls APIs, and builds every pixel of the UI. Until that finishes, the user sees a blank screen."
  revisit={{ to: "/docs/foundations/csr#how-csr-works", label: "How CSR works" }}
/>

<Question
  prompt="Which is the MOST appropriate use case for pure CSR in 2026?"
  options={[
    { text: "A public blog that needs to be indexed by Google" },
    { text: "An e-commerce storefront where SEO drives sales" },
    { text: "An internal admin dashboard behind login" },
    { text: "A marketing landing page" }
  ]}
  correct={2}
  explanation="CSR is fine for things behind a login where SEO is irrelevant and users tolerate the few-second first load (since they use the app daily). Public, SEO-sensitive pages should use SSR or SSG instead."
  revisit={{ to: "/docs/foundations/csr#when-to-use-csr", label: "When to use CSR" }}
/>

<Question
  prompt="Why is pure CSR bad for SEO on most public sites?"
  options={[
    { text: "Search engines block CSR apps on purpose" },
    { text: "Search engine crawlers may not execute JavaScript reliably, so they see only the empty shell, not the rendered content" },
    { text: "CSR apps can't use HTTPS" },
    { text: "CSR forbids meta tags" }
  ]}
  correct={1}
  explanation="Googlebot runs JS inconsistently and most other crawlers (and link-preview bots on Slack, Twitter, etc.) don't run it at all. They see <div id='root'></div> and index nothing useful."
  revisit={{ to: "/docs/foundations/csr#cons", label: "CSR cons" }}
/>

<Question
  prompt="What does 'SSR + hydration is CSR after the first request' actually mean?"
  options={[
    { text: "SSR replaces CSR entirely — there's no overlap" },
    { text: "Modern frameworks render the first page on the server (fast paint, good SEO), then a client-side router handles subsequent navigations like a SPA" },
    { text: "SSR can't be used together with client-side JavaScript" },
    { text: "Every page in a hybrid app is rendered twice — once on the server and once in the browser" }
  ]}
  correct={1}
  explanation="Hybrid frameworks (Next.js, Remix, SvelteKit) give you SSR's fast first paint AND SPA-like instant navigation. After the initial page load, route changes are handled by client-side JS — that's the 'CSR after first request' part."
  revisit={{ to: "/docs/foundations/csr#when-to-use-csr", label: "SSR + hydration vs CSR" }}
/>

</Quiz>

## What's next

→ Continue to [ISR, Streaming & PPR](./isr-streaming-ppr) where we look at the hybrid strategies the industry invented to get the best of SSG, SSR, and CSR all at once.
