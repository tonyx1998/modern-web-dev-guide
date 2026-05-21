---
id: project-types
title: Common Personal Project Types
sidebar_position: 3
sidebar_label: 2. Project Types
description: Portfolios, blogs, hobby SaaS, tools, learning projects. Each calls for a slightly different stack and effort budget.
---

# Common Personal Project Types

> **In one line:** Not all personal projects need the same stack. Five common shapes, five appropriate trade-offs.

:::tip In plain English
"Personal project" is a category, not a recipe. A weekend portfolio site and a side-business SaaS look nothing alike under the hood — the portfolio is essentially Markdown plus a CSS framework, while the SaaS has auth, a database, payments, and webhooks. Pick the shape first, then the stack falls out naturally.
:::

## Five common shapes

The workflow varies slightly by what you're building.

### Type 1: Portfolio Site

A few pages showing who you are and what you've built. Mostly static content.

- **Pages:** Home, About, Projects, Blog, Contact.
- **Update frequency:** Rare (mostly when you have new work to showcase).
- **Interactivity:** Minimal.
- **Stack:** Astro + Tailwind + Markdown content.
- **Effort:** Weekend project for v1.

### Type 2: Personal Blog / Content Site

Regular writing for a personal audience.

- **Pages:** Home, post list, individual posts, RSS feed.
- **Update frequency:** Weekly or monthly content.
- **Interactivity:** Maybe comments (often skipped or outsourced to Disqus).
- **Stack:** Astro + Markdown + maybe a CMS like Sanity.
- **Effort:** Weekend setup, ongoing content writing.

### Type 3: Hobby SaaS / Indie Product

A real product with users (maybe paying).

- **Pages:** Marketing site + app behind login.
- **Update frequency:** Continuous.
- **Interactivity:** Full app — auth, data, payments.
- **Stack:** Next.js + Postgres + Clerk + Stripe.
- **Effort:** Weeks to months for MVP, then ongoing.

### Type 4: Tool or Utility

Single-purpose interactive tool (e.g., a JSON formatter, a color picker, a calculator).

- **Pages:** One page does the thing.
- **Update frequency:** When you add features.
- **Interactivity:** Heavy client-side.
- **Stack:** Next.js or Vite + React, deployed to Cloudflare Pages.
- **Effort:** Few days to weeks.

### Type 5: Learning Project

Something you build to learn, possibly never to deploy.

- **Pages:** Whatever the tutorial demands.
- **Update frequency:** Until you finish learning.
- **Stack:** Whatever you're trying to learn.
- **Effort:** A few hours to a few weeks.

:::note Worked example: matching shape to project
You want to "build a website to share my running routes with friends." Which type is it?

- If it's mostly static maps and a blog post about each route → **Type 1 (Portfolio)** or **Type 2 (Blog)**.
- If friends log in, draw routes, comment on each other's → **Type 3 (Hobby SaaS)**.
- If you want a clever embedded GPX-file viewer → **Type 4 (Tool)**.

The labels matter because they imply wildly different effort. Confuse "blog with maps" with "social fitness app" and you'll under-estimate by 10x.
:::

:::info Highlight: this chapter focuses on Type 3
For the rest of this chapter, the workflow focuses on **Type 3 (hobby SaaS)** as the most complete example. Simpler project types just skip steps — a portfolio doesn't need [auth](./auth) or [payments](./payments), a learning project doesn't need [observability](./observability) or [a launch](./launching). Read the whole chapter, then mentally cross out what doesn't apply to your shape.
:::

## What's next

→ Continue to [Phase 1: Planning](./planning) where we'll do the entire planning phase in an afternoon.
