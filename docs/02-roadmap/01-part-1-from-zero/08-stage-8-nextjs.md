---
id: stage-8-nextjs
title: Stage 8 — Next.js
sidebar_position: 9
sidebar_label: Stage 8 — Next.js
description: A framework built on React — routing, server components, server actions, image optimisation, and a deploy pipeline. The default React stack for 2026.
---

# Stage 8 — Next.js

> **Time budget:** ~3–4 weeks

> **In one line:** React, plus routing, server rendering, image and font optimisation, API endpoints, and a production-ready build/deploy pipeline.

Next.js is a framework built on React. Where React is just the UI library, Next.js bundles in routing, server-side rendering, image and font optimisation, API endpoints, and a production-ready build/deploy pipeline. It's the default React stack for 2026 — Vercel (the company that makes it) and the React core team are deeply aligned on its direction.

For where Next.js sits among other React meta-frameworks, see [Frontend Frameworks](/docs/stack/frontend-frameworks). For the rendering strategies it uses under the hood, see [SSR](/docs/foundations/ssr), [SSG](/docs/foundations/ssg), and [ISR / Streaming / PPR](/docs/foundations/isr-streaming-ppr).

### 1. Create your app

```bash
npx create-next-app@latest my-site
# answer the prompts: TypeScript yes, Tailwind yes, App Router yes, ESLint yes, src/ no, alias yes
cd my-site
npm run dev
```

Open `http://localhost:3000`. You're running a Next.js app. The first thing to notice: a file in `app/page.tsx` became the page at `/`. That's file-based routing.

### 2. File-based routing (the App Router)

```
app/
├── page.tsx                # → /
├── about/
│   └── page.tsx            # → /about
├── blog/
│   ├── page.tsx            # → /blog
│   └── [slug]/
│       └── page.tsx        # → /blog/anything ([slug] is a parameter)
└── layout.tsx              # wraps every page in the app
```

Folders are URL segments. `page.tsx` is the actual page component. Square-brackets denote dynamic segments. `layout.tsx` wraps every child page — perfect for nav and footer.

### 3. Server vs Client Components — the headline feature

This is what makes Next.js (and modern React) different from anything before. **Every component is a server component by default.** Server components run on the server only — they can be `async`, talk directly to a database, read files, hold secrets — and ship zero JavaScript to the browser. They produce HTML.

```tsx
// app/blog/page.tsx — server component (the default)
async function BlogIndex() {
  // fetch directly from your database; no useEffect, no loading state
  const posts = await db.select().from(postsTable);
  return (
    <ul>
      {posts.map(p => <li key={p.id}>{p.title}</li>)}
    </ul>
  );
}
export default BlogIndex;
```

When you need interactivity — state, effects, event handlers — you mark a component as client with `"use client"` at the top of the file:

```tsx
// app/components/LikeButton.tsx
"use client";
import { useState } from "react";

export function LikeButton() {
  const [liked, setLiked] = useState(false);
  return <button onClick={() => setLiked(true)}>{liked ? "♥" : "♡"}</button>;
}
```

The pattern: server components for everything that just *shows* data; client components for the small islands that need interactivity. Most of your tree is server; client is the exception.

### 4. Server Actions: handling form submissions without API routes

```ts
// app/contact/actions.ts
"use server";
import { db } from "@/lib/db";

export async function sendMessage(formData: FormData) {
  const email = formData.get("email") as string;
  const body = formData.get("body") as string;
  await db.insert(messages).values({ email, body });
}
```

```tsx
// app/contact/page.tsx
import { sendMessage } from "./actions";

export default function ContactPage() {
  return (
    <form action={sendMessage}>
      <input name="email" type="email" required />
      <textarea name="body" required />
      <button type="submit">Send</button>
    </form>
  );
}
```

No `fetch` call, no API route, no JSON serialisation by you. Next.js secretly turns the action call into an HTTP POST. This is where Next.js feels like a different kind of framework.

### 5. Navigation: the `Link` component

```tsx
import Link from "next/link";

<Link href="/about">About</Link>
```

Use `Link` instead of `<a>` for internal navigation. It prefetches the destination, transitions without a full page reload, and feels instant.

### 6. Image and font optimisation

```tsx
import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

// in your layout:
<body className={inter.className}> ... </body>

// in a page:
<Image src="/me.jpg" alt="Tony" width={400} height={400} />
```

`next/image` automatically resizes, compresses, and serves modern formats (WebP/AVIF). `next/font` loads Google Fonts at build time with zero layout shift.

### 7. Deploying to Vercel

Push your repo to GitHub. Go to [vercel.com](https://vercel.com), click "Import Project," select your repo. The defaults are correct. Click Deploy. You're live on a `your-app.vercel.app` URL within a minute. Every push to `main` after that auto-deploys; every push to a branch gets its own preview URL. This is genuinely free for personal projects.

## Where to go deeper

- [Next.js Learn](https://nextjs.org/learn) — the official interactive tutorial. Builds a dashboard app step by step. The best single resource for this stage.
- [Next.js docs](https://nextjs.org/docs) — reference. The "App Router" sections are the only ones that matter for new projects.
- [Lee Robinson on YouTube](https://www.youtube.com/@LeeRobinson) — VP of Product at Vercel. Tutorial videos that match Next.js's current direction.

## Deeper in this guide

- [Frontend Frameworks](/docs/stack/frontend-frameworks) — Next.js vs Remix vs SvelteKit vs the rest.
- [SSR](/docs/foundations/ssr) — server-side rendering, the strategy Next.js extends.
- [SSG](/docs/foundations/ssg) — static generation, the other half of Next.js's hybrid model.
- [ISR / Streaming / PPR](/docs/foundations/isr-streaming-ppr) — the newer rendering modes Next.js is built around.

## Project

:::tip[Project — A multi-page Next.js site]
Use `npx create-next-app@latest`. Build a site with at least: a home page (hero + 3 feature cards), an "about" page, a "blog" section that lists posts from a hardcoded array, and a dynamic `/blog/[slug]` page that renders one post. Use the `Link` component for internal navigation. Use `next/image` for at least one image. Use a server action for a contact form. Deploy it to Vercel and share the link. You now have a real, public, full-stack site.
:::

→ [Next: Stage 9 — Ship a real portfolio](/docs/roadmap/part-1-from-zero/stage-9-portfolio) · [Back to Part I overview](/docs/roadmap/part-1-from-zero)
