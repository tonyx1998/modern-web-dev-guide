---
id: frontend-frameworks
title: Frontend Frameworks
sidebar_position: 3
sidebar_label: Frontend Frameworks
description: The component-based UI scaffolding around your app. React, Vue, Svelte, Solid, Astro — and when each is the right pick.
---

# Frontend Frameworks

> **In one line:** Frontend frameworks turn your language (TypeScript) into a full UI scaffolding — components, routing, data fetching, build pipeline. Next.js + React is the dominant 2026 default.

:::tip[Beginner: what is a "framework," really?]
A **library** is code you call. A **framework** is code that calls you.

When you use a *library* (Lodash, Day.js), you decide when to call it. You're in charge.

When you use a *framework* (Next.js, Django, Rails), the framework is in charge. It runs your application. You write *pieces* (a page component, a route handler) and the framework decides when to call them. You're filling in slots in someone else's machine.

This is why people say "you don't pick libraries lightly, but you really don't pick frameworks lightly" — switching frameworks means rewriting the structure of your whole app.
:::

## React 19 + Next.js 15 — the dominant combination

**React** is a library for building UIs from components. It's not a framework — it has no built-in router, data fetching, or build system. It's almost always used inside a framework.

**Next.js** is the dominant React framework. Maintained by Vercel. Includes routing, SSR, RSC, image optimization, font handling, and deployment integration.

**What's new in React 19:**

- **React Server Components (RSCs)** — Components that render only on the server. They can `await` data directly, and they ship zero JavaScript to the client.
- **`use()` hook** — Read promises and contexts inline.
- **Actions** — First-class form handling, with optimistic updates.
- **React Compiler** — Automatic memoization (no more manual `useMemo`/`useCallback`).

**What's new in Next.js 15:**

- App Router is mature (vs Pages Router which is legacy).
- **Partial Prerendering (PPR)** — Static shell + dynamic streaming holes.
- **Server Actions** — Call server functions from client components without writing API routes.
- **Turbopack** stable for dev (Webpack replacement, written in Rust).

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
| Content-heavy site (blog, docs)     | Astro                       |
| Vue shop building a new app         | Nuxt                        |
| Maximum performance, small bundle   | Svelte / SolidJS            |
| Existing Angular team or enterprise | Stay with Angular           |
| Static site with bits of JS         | Astro + HTMX or vanilla     |

:::info[Highlight: if you're new, pick Next.js]
You'll find passionate Reddit and Twitter threads telling you React is "old" or "bloated" and that you should pick Svelte/Solid/Qwik. **Ignore them on day one.** React + Next.js gives you the largest pool of jobs, tutorials, components, AI assistance, and Stack Overflow answers. You can switch frameworks later — but you won't, because once you ship 2 or 3 projects in one stack, the marginal value of switching is tiny.
:::

## What's next

→ Continue to [Styling](./styling) — how you make your components actually *look* like something.
