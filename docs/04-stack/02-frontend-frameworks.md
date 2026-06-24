---
id: frontend-frameworks
title: Frontend Frameworks
sidebar_position: 3
sidebar_label: Frontend Frameworks
description: The component-based UI scaffolding around your app. React, Vue, Svelte, Solid, Astro — and when each is the right pick.
---

# Frontend Frameworks

> **In one line:** Frontend frameworks turn your language (TypeScript) into a full UI scaffolding — components, routing, data fetching, build pipeline. Next.js + React is the dominant 2026 default.

→ **Going deeper:** once components and hooks click, [Advanced React](/docs/stack/frontend-frameworks-advanced) covers the render model, the rules of hooks, Server Components, and performance.

:::tip[Beginner: what is a "framework," really?]
A **library** is code you call. A **framework** is code that calls you.

When you use a *library* (Lodash, Day.js), you decide when to call it. You're in charge.

When you use a *framework* (Next.js, Django, Rails), the framework is in charge. It runs your application. You write *pieces* (a page component, a route handler) and the framework decides when to call them. You're filling in slots in someone else's machine.

This is why people say "you don't pick libraries lightly, but you really don't pick frameworks lightly" — switching frameworks means rewriting the structure of your whole app.
:::

## React 19 + Next.js — the dominant combination

**React** is a library for building UIs from components. It's not a framework — it has no built-in router, data fetching, or build system. It's almost always used inside a framework.

**Next.js** is the dominant React framework. Maintained by Vercel. Includes routing, SSR, RSC, image optimization, font handling, and deployment integration.

:::note[Version stamp — as of mid-2026]
The durable idea (component UI library + a framework that runs it) doesn't change; the version numbers do. Current as of mid-2026: **React 19.2**, **Next.js 16**. Treat the bullet specifics below as the dated layer.
:::

**What's new in React 19:**

- **React Server Components (RSCs)** — Components that render only on the server. They can `await` data directly, and they ship zero JavaScript to the client.
- **`use()` hook** — Read promises and contexts inline.
- **Actions** — First-class form handling, with optimistic updates.
- **React Compiler — 1.0 GA (Oct 2025).** Automatic memoization (no more hand-written `useMemo`/`useCallback`). It's **opt-in**: you add the compiler (a Babel plugin / framework flag) deliberately; it isn't on by default yet. The durable takeaway — *write straightforward components and let the compiler handle memoization* — is the direction the whole ecosystem is moving.

**What's new in Next.js 16:**

- App Router is the default (Pages Router is legacy).
- **Turbopack is now the default bundler for *both* `next dev` and `next build`** (Rust, the Webpack successor) — it's no longer dev-only or opt-in.
- **Cache Components + `"use cache"`.** Next 16 made rendering **dynamic by default at request time** and introduced an explicit **`"use cache"`** directive to opt pages/components/functions back into caching. This *replaces* the old experimental Partial Prerendering (PPR) flag, which was **removed** — Cache Components is the finished form of the same "static shell + dynamic holes" idea.
- **Server Actions** — Call server functions from client components without writing API routes.

**Why this stack dominates:**

- Largest ecosystem of components, libraries, and tutorials.
- Easiest hiring market.
- Vercel's developer experience is genuinely best-in-class.
- shadcn/ui (see styling page) was built for it.

## Vue 3.5 + Nuxt 4

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

> **In English:** `ref(0)` creates a **reactive primitive** — a value Vue tracks so the template re-renders when it changes. `computed(...)` is a derived value that automatically updates when its dependencies do. The template uses `{{ }}` for interpolation and `@click` for events. Everything in the `<script setup>` block is auto-exposed to the template — no `return` statement needed.

**Nuxt** is the Vue equivalent of Next.js — routing, SSR, modules, deployment.

**Strengths:** Cleaner template syntax than JSX (subjective); strong defaults; massive in Europe and Asia.

**Trade-off:** Smaller US job market than React.

## Svelte 5 + SvelteKit

Svelte *compiles* your components to vanilla JS at build time. The runtime is tiny, bundle sizes are small, and the syntax is minimalistic.

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

**Strengths:** Smaller bundles than React/Vue; less boilerplate; loved by developers in surveys.

**Trade-off:** Smallest of the "big three" by market share.

## SolidJS

Looks like React (JSX), but uses fine-grained reactivity instead of virtual DOM diffing. Extremely fast — often the top performer in benchmarks.

**When to choose:** Performance-critical apps; teams that want React-like ergonomics with better runtime.

**Trade-off:** Much smaller ecosystem than React.

## Astro 5 — the content framework

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

> **In English:** The fenced `---` block (Astro's **frontmatter**) runs *only at build time* — that's where you fetch data and do imports. Everything below is the static HTML output. The trick is `client:visible` on the React component: Astro ships HTML for everything else, but hydrates only that single component, and only when it scrolls into view. That's why Astro pages weigh almost nothing.

**Best for:** Blogs, marketing sites, documentation, portfolios — anywhere content matters more than interactivity.

**Why it's special in 2026:** It produces faster, lighter sites than any JS-framework competitor for content-heavy use cases.

## TanStack Start — the type-safe React alternative

If Next.js is the "batteries-included, server-first" React framework, **TanStack Start** (v1.0, March 2026) is its main type-safe alternative. It's built on **TanStack Router + Vite + Nitro**, and its pitch is a different mental model: *an SPA that gains SSR benefits*, rather than a server app with client exceptions.

The headline is **end-to-end type safety**:

- **Routes are type-checked at compile time.** In Next.js, a route is a string (`/users/[id]`) with no compile-time validation — a typo'd link fails at runtime. In TanStack Start, the whole route tree (and its params) is typed, so a wrong route or a missing param is a TypeScript error before you run anything.
- **Server functions give you typed RPC** — call a server function from the client and the argument/return types flow through automatically, no hand-written API contract or schema.

**When to reach for it (as of mid-2026):** data-driven apps — dashboards, admin panels, internal tools — and teams that value explicit control and Vite's speed over Next's conventions. It's production-ready, but its ecosystem and hiring market are still much smaller than Next's, so for a *first* job-oriented project Next.js is still the safer default.

## Other notable frameworks

| Framework            | Notes                                                              |
|----------------------|--------------------------------------------------------------------|
| **Remix**            | Merged with React Router (now React Router v7). Web-standards-first. |
| **Qwik**             | Innovative "resumability" instead of hydration; niche but interesting. |
| **Angular 19**       | Still dominant in enterprises. Recently adopted signals. Strong in banking and healthcare. |
| **HTMX + AlpineJS**  | A counter-movement: server-rendered HTML with small JS sprinkles. Popular with Django/Rails/Laravel stacks. |

## Decision matrix

| Need                                | Recommendation              |
|-------------------------------------|-----------------------------|
| New full-stack web app              | Next.js (React)             |
| Type-safe, data-heavy app (dashboards, internal tools) | TanStack Start |
| Content-heavy site (blog, docs)     | Astro                       |
| Vue shop building a new app         | Nuxt                        |
| Maximum performance, small bundle   | Svelte / SolidJS            |
| Existing Angular team or enterprise | Stay with Angular           |
| Static site with bits of JS         | Astro + HTMX or vanilla     |

:::info[Highlight: if you're new, pick Next.js]
You'll find passionate Reddit and Twitter threads telling you React is "old" or "bloated" and that you should pick Svelte/Solid/Qwik. **Ignore them on day one.** React + Next.js gives you the largest pool of jobs, tutorials, components, AI assistance, and Stack Overflow answers. You can switch frameworks later — but you won't, because once you ship 2 or 3 projects in one stack, the marginal value of switching is tiny.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Starting a new Next.js project on the Pages Router because a 2022 tutorial said to.** App Router is the path forward — Server Components, Server Actions, streaming, and Cache Components (`"use cache"`) all live there. If a tutorial uses `pages/api/...`, find a newer one.
- **Sprinkling `"use client"` at the top of every file.** That defeats the point of React Server Components. The default is server; mark `"use client"` only at the leaves that genuinely need interactivity (state, effects, browser APIs). Keep data-fetching and rendering on the server.
- **Treating React as a framework.** React is a UI library. It has no router, no data layer, no build system on its own. If you find yourself wiring Webpack + a router + SSR by hand, stop — pick Next.js, Remix, or a Vite-based React template instead.
- **Picking Svelte/Solid/Qwik for your first job project because it benchmarks well.** Performance is rarely the wall on a first app; ecosystem, hiring, and AI assistance are. Use the framework with the most answers when you search a bug.
- **Reaching for Astro on a highly interactive app.** Astro is content-first — when most of your UI is dashboards, dialogs, and live state, you're fighting the framework. Astro shines for blogs, docs, marketing; Next/Nuxt/SvelteKit shine for apps.
:::

## Page checkpoint

<Quiz id="stack-frontend-frameworks-page" title="Did frontend frameworks stick?" sampleSize={3}>

<Question
  prompt="What's the key distinction between a library and a framework, as the page describes it?"
  options={[
    { text: "Libraries are open-source; frameworks are paid" },
    { text: "A library is code you call; a framework is code that calls you" },
    { text: "Libraries are written in TypeScript; frameworks are written in Rust" },
    { text: "Libraries run only in the browser; frameworks run only on the server" }
  ]}
  correct={1}
  explanation="With a library you decide when to invoke its functions. With a framework, the framework runs your app and calls into the pieces you wrote — which is why switching frameworks is so expensive."
  revisit={{ to: "/docs/stack/frontend-frameworks#react-19--nextjs--the-dominant-combination", label: "Library vs framework" }}
/>

<Question
  prompt="What do React Server Components (RSCs) in React 19 give you that traditional client components do not?"
  options={[
    { text: "Automatic offline support via Service Workers" },
    { text: "Direct DOM access from server code" },
    { text: "Server-only rendering that can `await` data and ships zero JavaScript to the client" },
    { text: "Built-in TypeScript type generation for props" }
  ]}
  correct={2}
  explanation="RSCs render only on the server, can await data directly, and ship zero JS to the browser — moving data-fetching and rendering off the client entirely."
  revisit={{ to: "/docs/stack/frontend-frameworks#react-19--nextjs--the-dominant-combination", label: "React 19 features" }}
/>

<Question
  prompt="Why is Astro a great pick for a content-heavy site like a blog or documentation?"
  options={[
    { text: "It bundles your whole site into one JavaScript file" },
    { text: "It ships zero JavaScript by default and only hydrates 'islands' of interactivity" },
    { text: "It is the fastest virtual-DOM implementation available" },
    { text: "It includes a built-in CMS and database" }
  ]}
  correct={1}
  explanation="Astro is content-first: it produces static HTML and only ships JS for the specific components you mark as interactive (via directives like `client:visible`), keeping pages tiny."
  revisit={{ to: "/docs/stack/frontend-frameworks#astro-5--the-content-framework", label: "Astro section" }}
/>

<Question
  prompt="What makes Svelte's bundle sizes smaller than React's or Vue's?"
  options={[
    { text: "Svelte runs entirely on the server with no client code" },
    { text: "Svelte compiles components to vanilla JS at build time, so there is no large runtime to ship" },
    { text: "Svelte uses WebAssembly instead of JavaScript" },
    { text: "Svelte requires you to write your own renderer" }
  ]}
  correct={1}
  explanation="Svelte is a compiler: it converts your components into small chunks of vanilla JS at build time, so there's no big framework runtime to ship — bundles end up smaller than React or Vue."
  revisit={{ to: "/docs/stack/frontend-frameworks#svelte-5--sveltekit", label: "Svelte section" }}
/>

</Quiz>

## What's next

→ Continue to [Styling](./styling) — how you make your components actually *look* like something.
