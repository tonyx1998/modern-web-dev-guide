---
id: build-tools
title: Build Tools
sidebar_position: 5
sidebar_label: Build Tools
description: The engines that turn your source code (TypeScript, JSX, CSS) into something browsers can run. Vite, Turbopack, Bun, esbuild.
---

# Build Tools

> **In one line:** A build tool turns your TypeScript and JSX into the JavaScript and CSS a browser can run. Vite is the dominant standalone choice; Turbopack ships inside Next.js; Bun is faster than both for many tasks.

:::tip[In plain English]
Browsers don't understand TypeScript or JSX directly. Someone has to translate that source code into plain JavaScript and bundle it together with your CSS and images into files the browser can load. That translator is your **build tool**. In 2026, build tools have gotten so fast that you barely notice them — the dev server starts in milliseconds and updates instantly when you save a file.
:::

## Vite 6 — the dominant bundler

Vite uses native ES modules during development (no bundling needed, instant updates) and Rollup for production builds.

**Why it won:**

- Dev server starts in milliseconds, even for huge projects.
- Hot module replacement (HMR) is genuinely instant.
- Works with React, Vue, Svelte, Solid, Lit, vanilla.
- Excellent default configuration.

For non-Next.js projects, Vite is the obvious choice in 2026.

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm run dev   # Starts in ~200ms
```

## Turbopack

Vercel's Rust-based bundler, designed as a Webpack replacement. Used inside Next.js for dev (stable in v15) and increasingly for production builds.

You don't choose Turbopack directly — it comes with Next.js.

## Bun — runtime + bundler + package manager

Bun is multiple tools in one binary:

- A JavaScript runtime (Node.js alternative).
- A package manager (faster than npm/yarn/pnpm).
- A bundler (faster than esbuild).
- A test runner.

```bash
bun install   # 10-30x faster than npm install
bun run dev   # Runs your scripts
bun test      # Runs tests
bun build src/index.ts   # Bundles
```

**In 2026:** Bun is widely adopted for development tooling (especially the package manager). Using Bun as the runtime for production servers is rising but less universal than Node.

## esbuild

Go-based bundler. Powers many other tools (Vite uses it for dependency pre-bundling). Rarely used directly; mostly a behind-the-scenes engine.

## Webpack — legacy

The dominant bundler from 2014–2022. Still around in many projects but rarely chosen for new work. Slower, more configuration, more cognitive load than Vite/Turbopack.

## Decision matrix

| Framework choice         | Build tool that comes with it           |
|--------------------------|------------------------------------------|
| Next.js                   | Turbopack (configured for you)          |
| Vite-based React / Vue / Svelte | Vite (configured for you)       |
| Astro                     | Vite (configured for you)               |
| Custom bundling needs     | Bun build or esbuild                    |
| Legacy migration          | Webpack (you may have no choice)        |

:::info[Highlight: you rarely *configure* a build tool in 2026]
Five years ago, "webpack.config.js" was where you spent half your life. Today, modern tools have such good defaults that most projects never touch their bundler config. If you find yourself deep in `vite.config.ts` or `next.config.js`, pause and ask: is this a real need, or am I tinkering? Modern defaults beat custom config 9 times out of 10.
:::

## What's next

→ Continue to [Package Managers](./package-managers) — how dependencies get installed and updated.
