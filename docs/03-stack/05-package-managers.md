---
id: package-managers
title: Package Managers
sidebar_position: 6
sidebar_label: 5. Package Managers
description: How dependencies get installed and managed. pnpm, Bun, npm, Yarn — and which to pick.
---

# Package Managers

> **In one line:** A package manager installs and updates the libraries your project depends on. Bun is fastest; pnpm is strictest; npm comes with Node and works fine.

:::tip In plain English
Your project depends on hundreds of libraries — React, Tailwind, TypeScript, etc. — written by other people and published to **npm** (the central registry). A **package manager** is the tool that downloads those libraries to your machine, keeps them current, and locks the exact versions so your teammates get the same setup. The choice mostly affects *speed* and *disk usage*, not correctness.
:::

## pnpm — fast and efficient

pnpm uses a content-addressable store: every package version is stored once on disk and hardlinked into projects. Saves enormous amounts of disk space; install is fast.

```bash
npm install -g pnpm
pnpm install
pnpm add react
```

**Why teams choose it:**

- Faster than npm.
- Disk-efficient (huge for monorepos).
- Strict dependency resolution (catches phantom dependencies).
- Excellent monorepo support.

## Bun (as a package manager)

The fastest package installer available. Compatible with `package.json`.

```bash
bun install        # Install everything in package.json
bun add react      # Add a dependency
bun add -D vitest  # Add a dev dependency
bun remove react   # Remove a dependency
```

Bun's package installer is *dramatically* faster than npm/pnpm/yarn — often 10–30× faster on cold installs.

## npm

Comes bundled with Node.js. Fine for simple projects. Slower than alternatives but universally available.

```bash
npm install
npm install react
```

## Yarn

Was the popular alternative to npm in the late 2010s. Yarn 1 is legacy; Yarn 4 (modern, with PnP and workspaces) is innovative but niche.

## Decision matrix

| Use case                  | Recommendation     |
|--------------------------|--------------------|
| Solo projects / small teams | Bun for speed   |
| Larger teams / monorepos  | pnpm for strictness |
| Just learning, on Node already | npm is fine  |
| Yarn shop already         | Yarn 4 if modernized; otherwise switch |

:::info Highlight: the lockfile is the source of truth
Whichever package manager you choose, **commit the lockfile** (`package-lock.json`, `pnpm-lock.yaml`, `bun.lock`, `yarn.lock`). The lockfile records the *exact* version of every package — including transitive dependencies — that was installed. Without it, your teammates and CI servers can get different versions and you'll hit "works on my machine" bugs.

The lockfile is more important than which package manager produced it.
:::

:::note Try it yourself
```bash
# In an empty folder:
echo '{"name":"test","version":"1.0.0"}' > package.json

# Time each one (cold cache):
time npm install react
time pnpm install react
time bun add react
```

You'll see a dramatic spread. Bun is usually 5–10× faster than npm on the same machine, and pnpm sits comfortably in between.
:::

## What's next

→ Continue to [State Management](./state-management) — how your app keeps track of data and UI state across components.
