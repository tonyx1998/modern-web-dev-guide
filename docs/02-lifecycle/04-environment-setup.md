---
id: environment-setup
title: 'Phase 4: Environment Setup'
sidebar_position: 5
sidebar_label: 4. Environment Setup
description: Prepare the workshop before construction — runtimes, editors, version control, linters, secrets, the foundation that makes building possible.
---

# Phase 4: Environment Setup

> **In one line:** Set up the workshop before the build. The hours you spend on a good local environment save you weeks of fighting your tools later.

:::tip[In plain English]
Before you write your first line of feature code, you need: a runtime installed (Node), an editor configured (VS Code or Cursor), a Git repo created, a linter set up, environment variables wired in, and a way to run the app locally. This is "the boring stuff" but it's where future you will live every single day. Invest now, harvest later.
:::

## What environment setup covers

- Local development environment (runtimes, package managers, language toolchains)
- Editor configuration (extensions, settings, AI assistants)
- Version control (Git, GitHub, branch protection rules)
- Package management (lockfiles, dependency strategy)
- Secrets management (.env files, vaults, never-commit-secrets discipline)
- Linters and formatters (Biome, ESLint, Prettier)
- Pre-commit hooks (Husky, lefthook)
- Containerization (Docker for consistent environments)
- Database tooling (migrations, seed scripts, local DB instance)
- Monorepo tooling (Turborepo, Nx) if applicable
- Documentation (README, CONTRIBUTING)

## The "works on my machine" problem

The classic developer joke: code that runs perfectly on the original author's laptop and nowhere else. Modern tooling has largely solved this:

- **Lockfiles** (`bun.lock`, `pnpm-lock.yaml`, `package-lock.json`) pin exact dependency versions.
- **Docker / Dev Containers** provide identical environments across machines.
- **Node version managers** (`nvm`, `fnm`, `volta`) ensure everyone uses the same runtime version.
- **Cloud development environments** (GitHub Codespaces, Gitpod) provide pre-configured environments on demand.

## Setting up a modern project (worked example)

A typical 2026 Next.js project setup:

```bash
# Install Bun (fastest JS runtime/package manager)
curl -fsSL https://bun.sh/install | bash

# Create the project
bunx create-next-app@latest my-app \
  --typescript --tailwind --app --src-dir \
  --import-alias "@/*"

cd my-app

# Add component library
bunx shadcn@latest init
bunx shadcn@latest add button card input form dialog

# Replace ESLint + Prettier with Biome (faster)
bun add -D @biomejs/biome
bunx biome init

# Add TypeScript strict mode (in tsconfig.json):
# "strict": true

# Add pre-commit hooks
bun add -D husky lint-staged
bunx husky init
echo "bunx lint-staged" > .husky/pre-commit

# Initialize git and push to GitHub
git init
git add .
git commit -m "Initial commit"
gh repo create my-app --public --source=. --push
```

> **In English:** This recipe installs **Bun** (a fast JavaScript runtime + package manager that's a drop-in replacement for Node/npm), scaffolds a Next.js + TypeScript + Tailwind project, drops in **shadcn/ui** (a library of copy-pasteable React components), swaps the default lint/format toolchain for **Biome** (a single Rust-based replacement for ESLint + Prettier), installs **Husky** to run lint-staged on every commit, then initializes a Git repo and creates a public GitHub repo via the `gh` CLI in one go. That's a complete modern setup in about 5 minutes.

## Editor setup

**VS Code** (free) or **Cursor** (paid, AI-first fork of VS Code) dominate in 2026. Essential extensions:

- TypeScript and JavaScript Language Features (built-in)
- Tailwind CSS IntelliSense
- Biome (or ESLint + Prettier if using those)
- GitLens
- Error Lens
- Path Intellisense
- AI assistant (Cursor's built-in, GitHub Copilot, or Continue)

**JetBrains** tools (WebStorm, IntelliJ) are popular in enterprises and worth paying for if you spend 40+ hours a week coding.

## Secrets management

**Never commit secrets to Git.** Use:

- **`.env.local`** files for local dev (always gitignored).
- **Vercel/Railway environment variables** for hosted secrets.
- **Doppler / 1Password / HashiCorp Vault** for team secret sync.
- **AWS Secrets Manager / Google Secret Manager** for cloud-native apps.

:::info[Highlight: if you accidentally commit a secret, rotate it immediately]
Removing a leaked secret from Git history *does not help*. Bots scrape new GitHub commits within minutes; once a secret has appeared in any public commit, assume it's compromised. Rotate the secret (generate a new one, invalidate the old one) the moment you notice. Then clean up the history if you want.
:::

## Common anti-patterns

- **Skimping on setup:** Hours spent every week fighting your tools because you didn't invest in setup.
- **Snowflake environments:** Every developer's machine slightly different, debugging is impossible.
- **Committing `node_modules`:** Don't. (Yes, people still do this.)
- **Committing secrets:** Catastrophic. Rotate immediately if you do.
- **No README:** Future you, in six months, will not remember how to run the project.

:::note[Worked example: the README every project needs]
A minimum-viable README:

```markdown
# Project Name

What it does (one sentence).

## Quick start

```bash
git clone <url>
cd <repo>
cp .env.example .env       # then fill in real values
npm install
npm run dev
```

Then open http://localhost:3000.

## Environment variables

| Variable | What it's for | Where to get it |
|----------|---------------|-----------------|
| DATABASE_URL | Postgres connection | Supabase dashboard |
| STRIPE_KEY | Payment processing | Stripe dashboard |

## Common tasks

- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run test` — run tests
```

Spending 15 minutes on this saves your team (and future you) hours.
:::

## What's next

→ Continue to [Phase 5: Implementation](./implementation) where we *finally* start writing the actual feature code.
