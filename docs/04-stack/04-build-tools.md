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

## Vite — the dominant standalone bundler

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

:::note[Version stamp — as of mid-2026]
Current line is **Vite 7**. The durable part — *native ES modules in dev, a bundler for prod* — is unchanged; the engine underneath is being swapped. Vite's team is moving production builds from Rollup to **Rolldown** (a Rust bundler in the same family as esbuild/Turbopack). You can opt in today via the `rolldown-vite` package; **Vite 8** (in beta as of late 2025) makes Rolldown the default. You won't change your config — it's a faster engine behind the same interface.
:::

## Turbopack

Vercel's Rust-based bundler, designed as a Webpack replacement. It ships inside Next.js — you don't choose it directly, it comes with the framework.

:::note[Version stamp — as of mid-2026]
As of **Next.js 16**, Turbopack is the **default bundler for both `next dev` *and* `next build`** — it's no longer dev-only or behind a flag. Webpack still works in Next.js for now, but new projects get Turbopack out of the box. (Earlier in v15 it was stable for dev but opt-in for production builds.)
:::

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

## Common mistakes

:::caution[Where people commonly trip up]
- **Tinkering with your bundler config to "make it faster."** Modern defaults beat custom config 9 times out of 10. If you're deep in `vite.config.ts` and you don't have a concrete bug, you're procrastinating. Close the file.
- **Choosing your build tool before your framework.** You don't pick Vite or Turbopack standalone for a new app — they come with Next.js, SvelteKit, Astro, etc. Pick the framework and inherit its bundler.
- **Confusing dev speed with prod build speed.** Vite is fast in dev because it skips bundling and serves ES modules directly. Production still does a full Rollup bundle — don't be surprised when `vite build` takes minutes on a large app.
- **Sticking with Webpack on a new project "because the team knows it."** That's the legacy tax. New work on Vite or Turbopack pays back in a week of saved dev-server time. The migration cost on an existing app is real, but a fresh repo has no excuse.
- **Importing huge libraries without checking tree-shaking.** `import _ from 'lodash'` pulls in everything; `import debounce from 'lodash/debounce'` (or use `lodash-es`) pulls in one function. The bundler can only shake what your imports allow.
:::

## Page checkpoint

<Quiz id="stack-build-tools-page" title="Did build tools stick?" sampleSize={2}>

<Question
  prompt="Why do browsers need a build tool between your source code and the page?"
  options={[
    { text: "Browsers ban any JavaScript longer than 1000 lines" },
    { text: "Browsers don't understand TypeScript or JSX directly, so something has to translate and bundle them into plain JS and CSS" },
    { text: "Browsers can't load files from disk without a build step" },
    { text: "Build tools are required to enable hot reload, which browsers refuse to do otherwise" }
  ]}
  correct={1}
  explanation="Browsers only run plain JavaScript and CSS. A build tool translates TypeScript/JSX into JS and bundles everything (including CSS and images) into files the browser can load."
  revisit={{ to: "/docs/stack/build-tools#vite--the-dominant-standalone-bundler", label: "Why build tools exist" }}
/>

<Question
  prompt="What makes Vite's dev server so fast compared with older bundlers like Webpack?"
  options={[
    { text: "It pre-bundles your entire app on every keystroke" },
    { text: "It uses native ES modules during development, so no full bundling is needed and updates are near-instant" },
    { text: "It only supports vanilla JavaScript, with no transforms" },
    { text: "It ships your source code unmodified to the browser, including TypeScript" }
  ]}
  correct={1}
  explanation="Vite serves files as native ES modules in dev — the browser pulls modules on demand instead of waiting for a full bundle. That's why the dev server starts in milliseconds and HMR is instant."
  revisit={{ to: "/docs/stack/build-tools#vite--the-dominant-standalone-bundler", label: "Vite section" }}
/>

<Question
  prompt="Which build tool ships inside Next.js 16 as the default bundler for both dev and production builds?"
  options={[
    { text: "esbuild" },
    { text: "Webpack" },
    { text: "Turbopack" },
    { text: "Rollup" }
  ]}
  correct={2}
  explanation="Turbopack is Vercel's Rust-based Webpack successor. As of Next.js 16 it's the default for both `next dev` and `next build` — no longer dev-only or opt-in. You don't choose it directly; it comes with Next.js."
  revisit={{ to: "/docs/stack/build-tools#turbopack", label: "Turbopack section" }}
/>

<Question
  prompt="What does Bun bundle into a single binary, beyond just being a bundler?"
  options={[
    { text: "A JS runtime, package manager, bundler, and test runner" },
    { text: "A database engine and ORM" },
    { text: "A CSS framework and design system" },
    { text: "An operating system and shell" }
  ]}
  correct={0}
  explanation="Bun is a JavaScript runtime (Node alternative), a package manager (10–30× faster than npm), a bundler, and a test runner — all in one binary."
  revisit={{ to: "/docs/stack/build-tools#bun--runtime--bundler--package-manager", label: "Bun section" }}
/>

</Quiz>

## What's next

→ Continue to [Package Managers](./package-managers) — how dependencies get installed and updated.
