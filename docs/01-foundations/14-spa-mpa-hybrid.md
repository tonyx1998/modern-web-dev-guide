---
id: spa-mpa-hybrid
title: SPA vs MPA vs Hybrid
sidebar_position: 15
sidebar_label: SPA vs MPA
description: A related but separate distinction from rendering strategies. How navigations work — full page reloads or in-place swaps — and why modern frameworks do both.
---

# SPA vs MPA vs Hybrid

> **In one line:** "How is HTML built?" and "What happens on navigation?" are two different questions. SPA, MPA, and Hybrid are answers to the *second* one.

:::tip[In plain English]
Imagine you click a link from `/home` to `/about`.

- **MPA (Multi-Page App):** The browser tosses the current page in the trash and loads `/about` from scratch. Brief white flash. New HTML. Page-reload feeling.
- **SPA (Single-Page App):** The browser stays on the *same HTML page* the whole time. JavaScript fetches the `/about` content, swaps it into the existing DOM. No reload. Instant feeling.
- **Hybrid:** First visit is MPA (server sends real HTML). Subsequent navigations within the site are SPA-style (JavaScript handles them).

Almost every modern framework defaults to Hybrid.
:::

## MPA — Multi-Page Application

Every navigation is a full page load. The browser requests `/about`, the server sends a new HTML page, the browser tosses the current page and renders the new one.

This is how the web worked from 1993 to ~2010 and how most content sites still work.

**Pros:**
- Simple mental model — every URL is a real page.
- Browser back/forward works perfectly.
- SEO is automatic (every URL returns full HTML).
- Smaller bundle size — no client-side router.

**Cons:**
- Each navigation feels heavier (white flash, asset re-downloads).
- Shared state (like a music player) gets reset on every navigation.
- No app-like persistence between pages.

## SPA — Single-Page Application

The browser loads one HTML page at the start. All subsequent "navigations" are simulated: JavaScript updates the URL (using the History API) and swaps content in place.

**Pros:**
- Instant navigation after initial load.
- Persistent state across "pages" (music keeps playing while you browse).
- App-like feel.

**Cons:**
- Slow first load (need to download the JS bundle).
- Breaks browser features if implemented carelessly (back button, scroll position, focus management).
- Bad SEO without extra work.
- More complex to build and debug.

## Hybrid — The 2026 Default

Modern frameworks (Next.js, Nuxt, SvelteKit, Remix) do *both*:

- **First request:** Server renders HTML (SSR or SSG).
- **Subsequent navigations:** Client-side router takes over, fetches only the data needed for the new page, swaps content.

You get fast first paint, good SEO, and snappy navigation — all without choosing.

:::note[Worked example: how Hybrid actually feels]
Open `https://nextjs.org` (a Hybrid app).

1. **First request to `/`:** Server returns fully-formed HTML. You see the page immediately. ~100ms.
2. **Click "Docs":** No white flash. The URL changes to `/docs`. Content swaps in place. ~50ms.
3. **Click "Examples":** Same — instant, in-place.
4. **Open a new tab and visit `/docs` directly:** Server returns fully-formed HTML again. Still ~100ms. SEO and direct-URL access work perfectly.

You get the best of MPA (real HTML on every URL) and SPA (instant navigation within the app).
:::

## How the two questions relate

| Rendering strategy   | Navigation style     | Common together?              |
|---------------------|----------------------|-------------------------------|
| SSG                 | MPA                  | Astro default                 |
| SSG                 | SPA                  | Older Gatsby apps             |
| SSG                 | Hybrid               | Modern Astro with view transitions |
| SSR                 | MPA                  | Traditional Rails, Django     |
| SSR                 | SPA                  | Rare — defeats the purpose    |
| SSR                 | Hybrid               | Next.js, Remix, SvelteKit (the dominant 2026 combo) |
| CSR                 | SPA                  | Vite + React/Vue (internal tools) |
| CSR                 | MPA                  | Doesn't really exist          |

:::info[Highlight: stop worrying, start building]
This page taught you the vocabulary. You don't actually need to *choose* between SPA, MPA, and Hybrid on day one — the framework you pick chooses for you.

- Use **Next.js** or **Remix** → you get Hybrid by default.
- Use **Astro** → MPA by default, Hybrid optionally.
- Use **Vite + React** alone → SPA by default.

Pick a framework first; the SPA-vs-MPA decision falls out naturally from that choice.
:::

## Page checkpoint

<Quiz id="spa-mpa-hybrid-page" title="Did SPA vs MPA vs Hybrid stick?" sampleSize={2}>

<Question
  prompt="What question does the SPA-vs-MPA distinction actually answer?"
  options={[
    { text: "Whether the site uses HTTPS" },
    { text: "Where the HTML is built (server vs client)" },
    { text: "What happens on navigation between pages — full reload or in-place swap" },
    { text: "Whether the site uses a database" }
  ]}
  correct={2}
  explanation="SPA vs MPA is about NAVIGATION, not rendering. MPA reloads the page on every link click; SPA stays on one HTML document and swaps content via JS. It's a separate axis from SSG/SSR/CSR."
  revisit={{ to: "/docs/foundations/spa-mpa-hybrid#how-the-two-questions-relate", label: "How the two questions relate" }}
/>

<Question
  prompt="In a Hybrid app (the 2026 default), what happens when a user visits / for the first time?"
  options={[
    { text: "The browser downloads a large JS bundle and shows a blank screen until it finishes" },
    { text: "The server returns fully-formed HTML (SSR or SSG), so the page appears almost instantly" },
    { text: "The CDN refuses the request because Hybrid apps require login" },
    { text: "Nothing happens until the user clicks something" }
  ]}
  correct={1}
  explanation="The first request returns real HTML — that's the MPA-like part, good for SEO and fast first paint. Only AFTER that first load do subsequent navigations become SPA-style (instant, no reload)."
  revisit={{ to: "/docs/foundations/spa-mpa-hybrid#hybrid--the-2026-default", label: "Hybrid — the 2026 default" }}
/>

<Question
  prompt="Which is a real downside of a pure SPA on a public marketing site?"
  options={[
    { text: "It can't use cookies" },
    { text: "Slow first load (must download JS bundle first) and weak SEO unless you patch it" },
    { text: "It can't communicate with a backend" },
    { text: "Browsers refuse to render SPAs" }
  ]}
  correct={1}
  explanation="A SPA shows a blank screen until the JS bundle loads — bad for first impression and bad for crawlers that don't run JS. After the first load, SPAs feel snappy, but the first paint cost is real."
  revisit={{ to: "/docs/foundations/spa-mpa-hybrid#spa--single-page-application", label: "SPA cons" }}
/>

<Question
  prompt="You pick Astro for a content site. What's the default navigation style?"
  options={[
    { text: "SPA — Astro uses a client-side router by default" },
    { text: "MPA — every navigation is a full page load by default, with Hybrid optional via view transitions" },
    { text: "Hybrid — same as Next.js" },
    { text: "There's no navigation; Astro is single-page only" }
  ]}
  correct={1}
  explanation="Astro is MPA by default — it ships almost no JS and treats each page as a real page load. You can opt-in to Hybrid behavior with view transitions, but the default is multi-page."
  revisit={{ to: "/docs/foundations/spa-mpa-hybrid#hybrid--the-2026-default", label: "Pick a framework" }}
/>

</Quiz>

## What's next

→ Continue to [REST APIs](./apis-rest) where we shift from rendering HTML to the *other* major thing web servers do: serve raw data.
