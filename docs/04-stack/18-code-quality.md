---
id: code-quality
title: Code Quality & Developer Tools
sidebar_position: 19
sidebar_label: Code Quality
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

## Common mistakes

:::caution[Where people commonly trip up]
- **Skipping TypeScript strict mode.** Without `"strict": true`, `null`/`undefined` slip through, `any` becomes implicit, and you're paying for TypeScript while keeping JavaScript's bug profile. Turn it on at project creation — fixing the few resulting errors is a one-evening tax for a year of caught bugs.
- **Running both ESLint and Biome in the same repo.** They overlap, contradict, and fight on save. Pick one. If you're migrating, run a single pass, commit, then delete the loser's config and dependencies entirely.
- **Pre-commit hooks that take 30 seconds.** People learn to bypass them with `--no-verify`, and now the hooks protect nothing. Keep pre-commit fast (lint-staged + Biome on changed files only); push slow checks (type-check, full test suite) into CI where they belong.
- **Letting CI be the only place lint runs.** PR feedback 5 minutes later when you've already moved on is annoying and slow. Run the same checks locally on save (editor extension) and on commit (lint-staged) — CI is the final safety net, not the first.
- **Adopting Turborepo / Nx before you have a monorepo.** A single Next.js app doesn't need a build orchestrator. Reach for monorepo tooling when you have *multiple* packages that share code and want to skip rebuilds of unchanged ones.
- **Treating Prettier/Biome formatting choices as a personality issue.** Tabs vs spaces and semi vs no-semi are arguments past you have already lost. Accept the formatter's defaults, commit, never mention it in a PR review again.
:::

## Page checkpoint

<Quiz id="stack-code-quality-page" title="Did code quality tooling stick?" sampleSize={3}>

<Question
  prompt="What does Biome combine into a single tool that previously required ESLint + Prettier?"
  options={[
    { text: "A linter and a formatter, written in Rust, with one config and one CLI" },
    { text: "A test runner and a bundler" },
    { text: "A type checker and a build tool" },
    { text: "A documentation generator and a deployment tool" }
  ]}
  correct={0}
  explanation="Biome is a fast, unified linter+formatter in Rust. Migrating means one config and one binary instead of the ESLint+Prettier pair, with sensible defaults and dramatically faster runs."
  revisit={{ to: "/docs/stack/code-quality#biome", label: "Biome section" }}
/>

<Question
  prompt="Why is TypeScript strict mode worth enabling on day one?"
  options={[
    { text: "It compiles your code into a smaller bundle" },
    { text: "It turns on a bundle of flags (`strictNullChecks`, `noImplicitAny`, etc.) that collectively catch huge classes of bugs at compile time" },
    { text: "It enables async/await syntax" },
    { text: "It is required for npm to publish a package" }
  ]}
  correct={1}
  explanation="`strict: true` enables strictNullChecks, noImplicitAny, strictFunctionTypes, and strictBindCallApply together. Without it, you're leaving a huge amount of TypeScript's value on the table."
  revisit={{ to: "/docs/stack/code-quality#typescript-strict-mode", label: "Strict mode" }}
/>

<Question
  prompt="What job do tools like Husky and lefthook do in the dev workflow?"
  options={[
    { text: "They auto-format code in production after deploys" },
    { text: "They run git hooks (pre-commit, pre-push) so checks like lint and format run automatically before bad code reaches the repo" },
    { text: "They host your code on a private git server" },
    { text: "They run end-to-end tests in CI" }
  ]}
  correct={1}
  explanation="Husky and lefthook install git hooks that run scripts on commit/push. Combined with lint-staged, you can auto-format staged files so stylistically broken code never even gets committed."
  revisit={{ to: "/docs/stack/code-quality#husky--lefthook", label: "Husky / lefthook" }}
/>

<Question
  prompt="What problem do monorepo tools like Turborepo and Nx solve?"
  options={[
    { text: "They convert a monorepo into many smaller repos" },
    { text: "They cache builds, parallelize tasks, and skip work in packages whose source didn't change" },
    { text: "They replace your test framework" },
    { text: "They generate database migrations across packages" }
  ]}
  correct={1}
  explanation="Monorepos hold multiple packages in one repo. Turborepo/Nx track which packages actually changed and cache previous outputs so unchanged packages don't rebuild — massive speedup as the repo grows."
  revisit={{ to: "/docs/stack/code-quality#turborepo--nx", label: "Turborepo / Nx" }}
/>

</Quiz>

## What's next

→ Continue to [Editors & AI Coding Assistants](./editors-ai) — the last stack-page, covering the tools you actually *type into*.
