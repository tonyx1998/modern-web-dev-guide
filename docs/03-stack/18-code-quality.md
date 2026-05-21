---
id: code-quality
title: Code Quality & Developer Tools
sidebar_position: 19
sidebar_label: 18. Code Quality
description: Biome (fast linter+formatter), TypeScript strict mode, pre-commit hooks, monorepo tools. The dev-experience layer.
---

# Code Quality & Developer Tools

> **In one line:** Biome is the modern unified linter+formatter; TypeScript strict mode catches whole categories of bugs; Husky / lefthook run checks before each commit so bad code never lands.

:::tip[In plain English]
This is the "automatic quality control" layer of your dev environment. It enforces consistent style (so you don't argue about tabs vs spaces in PR reviews), catches obvious mistakes (typos, unused variables, wrong types), and runs those checks automatically — on save, on commit, and in CI. The result: less time on trivia, more time on real engineering.
:::

## Biome

Fast, unified linter + formatter, written in Rust. Replacing the ESLint + Prettier combo for many new projects.

```bash
bunx biome check .   # Lint and format check
bunx biome format .  # Auto-format
```

**Why teams are migrating:**

- Single tool replaces ESLint + Prettier.
- Dramatically faster (Rust core).
- Sensible defaults out of the box.
- Less config to maintain.

## ESLint v9

Still widely used, especially in legacy. The "flat config" format is the new standard.

If you're starting a new project, try Biome first. If you have an existing project with ESLint, no urgent need to migrate.

## TypeScript strict mode

Set `"strict": true` in `tsconfig.json`. This enables several flags that collectively catch a huge class of bugs:

- `strictNullChecks` — `null` and `undefined` aren't assignable to other types.
- `noImplicitAny` — variables and parameters must be typed.
- `strictFunctionTypes` — stricter checking of function compatibility.
- `strictBindCallApply` — checks `bind`, `call`, `apply` argument types.

A project without strict mode is leaving a huge amount of TS's value on the table.

## Husky / lefthook

Git hooks. Run scripts before commits/pushes.

```bash
# Add a pre-commit hook that lints and formats
bun add -D husky lint-staged
bunx husky init
echo "bunx lint-staged" > .husky/pre-commit
```

```json
// package.json
"lint-staged": {
  "*.{ts,tsx,js,jsx}": ["biome check --apply", "biome format --write"]
}
```

Now every commit auto-formats your staged code. Bad-style code can't even reach the repo.

## Changesets

Version and changelog management for monorepos. If you're publishing npm packages or maintaining a monorepo with versioned packages, Changesets is the standard tool.

## Turborepo / Nx

Monorepo build tools. Turborepo is simpler; Nx is more featured.

A monorepo holds multiple projects in one repo (frontend + backend + shared lib, or multiple packages). These tools cache builds, parallelize tasks, and let you skip work in projects that didn't change.

:::info[Highlight: the 30-minute setup that saves 100 hours]
For any new TypeScript project, spend 30 minutes setting up:

1. **TypeScript strict mode** — `"strict": true` in tsconfig.
2. **Biome** — single command for lint + format.
3. **Husky + lint-staged** — pre-commit hooks that auto-format.
4. **CI lint step** — the same `biome check` runs on PRs.

You've now made it impossible for stylistically inconsistent or obviously-broken code to land. This will save you 100+ hours of code-review nit-picking over the project's lifetime.
:::

## What's next

→ Continue to [Editors & AI Coding Assistants](./editors-ai) — the last stack-page, covering the tools you actually *type into*.
