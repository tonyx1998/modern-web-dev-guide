---
id: env-setup
title: 'Phase 4: Environment Setup'
sidebar_position: 7
sidebar_label: 6. Environment Setup
description: Monorepo with Turborepo, onboarding script that gets a new engineer running in under a day, three environments (local, preview, production), and managed secrets.
---

# Phase 4: Environment Setup

> **In one line:** A monorepo with Turborepo, a one-script onboarding flow, three environments, and a real secrets manager. New hires running locally in under a day.

:::tip[In plain English]
At solo scale, "the setup" is whatever's on your laptop. At startup scale, the setup is *whatever a brand-new engineer can stand up by lunchtime on day one.* Everything in this phase exists to compress the onboarding loop — because onboarding pain compounds with every hire.
:::

## Repository structure

For a team to onboard a new engineer in under a day, the **monorepo** (one Git repo containing multiple apps and shared libraries) is wired up with **Turborepo** (a build orchestrator that runs tasks in parallel across packages and caches their results):

**Repository structure (monorepo with Turborepo):**
```
my-startup/
├── apps/
│   ├── web/          # The main Next.js app
│   ├── admin/        # Internal admin tool
│   └── marketing/    # Marketing site (Astro)
├── packages/
│   ├── db/           # Drizzle schema + client
│   ├── ui/           # Shared components
│   ├── auth/         # Shared auth logic
│   ├── email/        # Transactional emails
│   └── config/       # Shared config (tsconfig, biome)
├── turbo.json
├── package.json
└── README.md
```

> **Reading this layout:** `apps/` holds anything that gets deployed independently (the main product, an admin console, the marketing site). `packages/` holds shared code those apps import — schema, UI components, auth helpers, transactional emails, common tooling config. A change to `packages/db` rebuilds anything that uses it; a change to `apps/marketing` doesn't touch `apps/web`. Turborepo figures that dependency graph out for you.

## Onboarding script

**`scripts/setup.sh`:**
```bash
#!/usr/bin/env bash
set -e

echo "Installing Bun..."
curl -fsSL https://bun.sh/install | bash

echo "Installing dependencies..."
bun install

echo "Setting up local database..."
docker-compose up -d postgres

echo "Running migrations..."
bun run db:migrate

echo "Seeding database..."
bun run db:seed

echo "Setting up environment variables..."
cp .env.example .env.local
echo "→ Now fill in .env.local with credentials from 1Password"

echo "Starting dev server..."
bun run dev
```

> **In English:** This is a single onboarding script the new hire runs once. `set -e` makes it fail loudly if any step errors. It installs the Bun runtime, installs JS dependencies, brings up a local Postgres in Docker, applies migrations and seed data, copies `.env.example` to `.env.local` (which the user then fills in with secrets from 1Password), and finally starts the dev server. The whole point: one command instead of a fifteen-step README.

## Three environments

- **Local** — Each developer's machine. Uses a local Postgres (Docker) or a personal Neon branch.
- **Preview** — Vercel auto-creates per PR. Connected to a separate preview database (often a Neon branch).
- **Production** — The real thing. Strictly protected, deployments require passing CI.

## Secrets

- **Doppler** or **1Password Developer** for syncing secrets across the team.
- Vercel and Supabase store production secrets in their dashboards.
- Local `.env.local` files (gitignored) for development.

:::note[Worked example: an onboarding day from the new hire's view]
**9:00 AM** — Laptop arrives. Open the README.

**9:30 AM** — Clone the repo. Run `./scripts/setup.sh`. It installs Bun, runs `bun install`, spins up Docker Postgres, runs migrations and seeds.

**10:30 AM** — Open 1Password and copy the 12 secrets it asks for into `.env.local`. `bun run dev` brings the app up at `localhost:3000`.

**11:00 AM** — Sign in with a seeded test user. Click around. Read the architecture doc in `/docs`.

**12:00 PM** — Lunch with team.

**1:30 PM** — Pick up a "starter" Linear ticket (typically a `good-first-issue` label). Branch off main.

**4:30 PM** — Open the first PR. Get it reviewed.

**End of day one:** running locally, deployed to a preview URL, one merged PR. That's the bar.
:::

:::info[Highlight: the .env.example file is sacred]
The single most common source of onboarding pain: "the app runs but it crashes when I try to log in" — because some `.env` variable was missing from `.env.example` even though the original engineer set it months ago.

Treat `.env.example` as a contract. Every variable the app reads from the environment must appear there with a placeholder value. CI should fail if a referenced env var isn't in `.env.example`. Five minutes of discipline saves new hires hours of frustration.
:::

## Page checkpoint

<Quiz id="startup-env-setup-page" title="Did environment setup stick?" sampleSize={2}>

<Question
  prompt="What is the page's stated bar for a new engineer's first day?"
  options={[
    { text: "Reading documentation and shadowing for a full week" },
    { text: "Running locally, deployed to a preview URL, and one merged PR by end of day one" },
    { text: "Reviewing the full codebase before touching any code" },
    { text: "Completing a multi-day security training course" }
  ]}
  correct={1}
  explanation="The worked example sets the bar at running locally, deploying to a preview URL, and merging one starter PR on day one — possible because the onboarding script and setup are designed to compress that loop."
  revisit={{ to: "/docs/startup/env-setup#onboarding-script", label: "Onboarding day bar" }}
/>

<Question
  prompt="Why does the page treat the .env.example file as sacred?"
  options={[
    { text: "Because Vercel will refuse to deploy without it" },
    { text: "Because missing variables are the single most common source of onboarding pain" },
    { text: "Because it stores production secrets" },
    { text: "Because GitHub charges extra to read it" }
  ]}
  correct={1}
  explanation="Every env var the app reads must appear in .env.example with a placeholder. Five minutes of discipline keeps new hires from chasing a missing variable for hours."
  revisit={{ to: "/docs/startup/env-setup#secrets", label: "env.example is sacred" }}
/>

<Question
  prompt="Which three environments does the page describe as standard at this stage?"
  options={[
    { text: "Local, Preview (per-PR), and Production" },
    { text: "Dev, QA, Staging, UAT, and Production" },
    { text: "Local and Production only" },
    { text: "Sandbox, Internal, and Customer-facing" }
  ]}
  correct={0}
  explanation="The page describes three environments: each developer's local machine, Vercel auto-created preview per PR (often with a Neon branch), and a strictly protected production. No QA/UAT/staging sprawl yet."
  revisit={{ to: "/docs/startup/env-setup#three-environments", label: "Three environments" }}
/>

<Question
  prompt="What does the page describe as the role of Turborepo in this setup?"
  options={[
    { text: "A serverless function runtime" },
    { text: "A build orchestrator that runs tasks in parallel across packages and caches their results" },
    { text: "A secrets manager for production credentials" },
    { text: "A CSS framework that replaces Tailwind" }
  ]}
  correct={1}
  explanation="Turborepo is the build orchestrator that figures out the dependency graph in the monorepo, runs tasks in parallel across packages, and caches results so untouched apps don't rebuild."
  revisit={{ to: "/docs/startup/env-setup#repository-structure", label: "Turborepo role" }}
/>

</Quiz>

## What's next

→ Continue to [Phase 5: Development Practices](./development) where trunk-based development, conventional commits, and feature flags shape the daily workflow.
