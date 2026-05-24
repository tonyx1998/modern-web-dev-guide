---
id: env-setup
title: 'Phase 4: Environment Setup (One Hour)'
sidebar_position: 6
sidebar_label: 5. Environment Setup
description: From empty folder to deployed empty project in about an hour. Next.js, Drizzle, Clerk, Vercel, all wired together.
---

# Phase 4: Environment Setup (One Hour)

> **In one line:** In ~60 minutes you can go from empty folder to a real URL with auth, a database, error tracking, and `git push` deploys. A decade ago this took a week.

:::tip[In plain English]
This is the part that feels like magic now. Modern tooling has collapsed a week of devops into a one-hour copy-paste. By the end of this phase you'll have a working URL on the internet — empty, but real — that redeploys every time you `git push`. Get to that milestone first, *then* start building features. Never the other way around.
:::

## A complete modern setup

A complete modern setup:

```bash
# 1. Install Bun (faster than npm)
curl -fsSL https://bun.sh/install | bash

# 2. Create the project
bunx create-next-app@latest shelftrack \
  --typescript --tailwind --app --src-dir --import-alias "@/*"
cd shelftrack

# 3. Set up shadcn/ui
bunx shadcn@latest init
bunx shadcn@latest add button card input form label dialog dropdown-menu

# 4. Add database tools
bun add drizzle-orm postgres
bun add -D drizzle-kit

# 5. Add auth (using Clerk in this example)
bun add @clerk/nextjs

# 6. Add validation
bun add zod react-hook-form @hookform/resolvers

# 7. Replace ESLint/Prettier with Biome
bun add -D @biomejs/biome
bunx biome init

# 8. Set up git
git init
git add .
git commit -m "Initial commit"

# 9. Create GitHub repo and push
gh repo create shelftrack --private --source=. --push

# 10. Sign up for services
#  - vercel.com (connect GitHub)
#  - neon.tech (create database)
#  - clerk.com (create application)
#  - sentry.io (create project)

# 11. Configure environment variables
# Create .env.local with:
#  DATABASE_URL=postgresql://...
#  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
#  CLERK_SECRET_KEY=...
#  SENTRY_DSN=...

# 12. Add the same variables to Vercel (via dashboard)

# 13. Deploy the empty project
git push
# Vercel auto-detects and deploys
```

> **In English:** This is a 13-step shopping list that takes you from nothing to a deployed app. Steps 1–7 install tooling and JS dependencies (Bun is a faster Node alternative; `bunx` runs a package without permanently installing it; `shadcn/ui` is a library of copy-paste React components; **Drizzle** is a TypeScript **ORM** — Object-Relational Mapper, a library that lets you query SQL with typed JS code; **Biome** is a single tool that replaces ESLint and Prettier). Steps 8–9 put the project in Git and on GitHub. Steps 10–12 sign you up for the hosted services and wire their credentials into both your local `.env.local` and the Vercel dashboard. Step 13 — `git push` — is the entire deploy: Vercel detects Next.js and builds the site.

In about an hour, you have a working project, a connected GitHub repo, automated deployments, a managed database, auth, and error tracking. **A decade ago this would have taken a week.**

## .gitignore Essentials

```
node_modules/
.next/
.env.local
.env*.local
*.log
.DS_Store
.vercel
```

Never commit `.env.local`. Add a `.env.example` with placeholder values to help future-you remember what's needed.

## Setting Up Drizzle

```typescript
// drizzle.config.ts
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

> **In English:** This config tells the **Drizzle Kit** CLI three things: where your schema lives (`src/db/schema.ts`), where to write generated SQL migrations (`drizzle/`), and what database to connect to (URL from the environment). It's the bridge between "I edited the schema in TypeScript" and "the migration tool knows what to do."

```typescript
// src/db/schema.ts
import { pgTable, text, timestamp, integer, serial } from 'drizzle-orm/pg-core';

export const books = pgTable('books', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),  // Clerk user ID
  title: text('title').notNull(),
  author: text('author').notNull(),
  status: text('status', { enum: ['reading', 'finished', 'wishlist'] }).notNull(),
  rating: integer('rating'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

> **In English:** This is the *schema* — a TypeScript description of the `books` table. Drizzle generates SQL from it. `serial(...).primaryKey()` creates an auto-incrementing ID. `userId` stores the Clerk-issued user identifier (text, not a foreign key, because Clerk lives outside your DB). `status` is constrained to three valid strings. `createdAt` defaults to "now" in the database itself.

```typescript
// src/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client);
```

> **In English:** Creates the database client your app code will import. `postgres(...)` opens the raw connection; `drizzle(client)` wraps it so you get typed query builders (`db.select().from(books)`) instead of writing raw SQL strings.

Run migrations:
```bash
bunx drizzle-kit generate   # Creates SQL migration files
bunx drizzle-kit migrate    # Applies them to the database
```

:::note[Try it yourself]
Time yourself. The first time you go through this, it will take longer than an hour — probably two or three — because every signup page is slightly different and every API key needs to land in the right place. *Write down* the exact steps as you go.

The second time, on a different project, it'll take ~30 minutes. The third time, it's muscle memory. The cliché "make it work, then make it fast" applies to your own setup process too.
:::

:::info[Highlight: deploy *before* you build]
Step 13 — `git push` to deploy an empty project — is the single most important step. It guarantees that:

1. The deploy pipeline works *before* you write any features.
2. You see broken deploys immediately, not after a week of accumulated work.
3. You're forced to keep `main` shippable from day one.
4. You have a real URL to share when something works.

Skip this and you build for a week, try to deploy, hit five errors that all interact, and lose a day untangling them.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Committing `.env.local` to the repo.** One careless `git add .` and your Clerk secret and DB URL are now in your public history forever. The fix is to add `.env*.local` to `.gitignore` *before* you write any secrets, and to rotate any key the moment it touches git — `git rm --cached` is not enough once it's pushed.
- **Skipping the deploy-empty-project step.** It feels like a waste of a `git push` when there's nothing to show. The fix is to do it anyway — when your first real feature breaks the build, you'll know it's the feature, not the pipeline. Compound errors are the worst kind to debug solo.
- **Forgetting to mirror env vars into Vercel.** Local works, you push, the deploy 500s because `DATABASE_URL` isn't set in the Vercel dashboard. The fix is a checklist: every time you add a variable to `.env.local`, immediately add it to all three Vercel environments. Future-you will keep tripping on this otherwise.
- **Treating the setup as a one-time event.** You'll do this again — next project, in six months — and forget half of it. The fix is to write the steps down *as you go* in a personal `setup.md` gist. By the third project, you have a personal playbook that beats every blog post.
:::

## Page checkpoint

<Quiz id="solo-env-setup-page" title="Did environment setup stick?" sampleSize={2}>

<Question
  prompt="Why is step 13 — git push to deploy an empty project — called the single most important step?"
  options={[
    { text: "It earns SEO credit for the new domain" },
    { text: "It proves the deploy pipeline works before you write features" },
    { text: "It triggers the first Stripe webhook" },
    { text: "It forces you to write a README" }
  ]}
  correct={1}
  explanation="Deploying nothing first guarantees the pipeline works. If you wait a week and then deploy, errors stack up and interact — debugging five problems at once is much harder than one at a time."
  revisit={{ to: "/docs/solo/env-setup#a-complete-modern-setup", label: "Deploy before you build" }}
/>

<Question
  prompt="What does the .env.example file exist for, since .env.local is gitignored?"
  options={[
    { text: "It's required by Vercel's build system" },
    { text: "It documents which env vars are needed, with placeholder values" },
    { text: "It's loaded automatically in production" },
    { text: "It's the legal record of which services you use" }
  ]}
  correct={1}
  explanation="The actual secrets stay out of git, but .env.example commits the *shape* — variable names with placeholder values — so future-you (or anyone cloning the repo) knows what needs to be set."
  revisit={{ to: "/docs/solo/env-setup#gitignore-essentials", label: ".gitignore essentials" }}
/>

<Question
  prompt="In the Drizzle setup, what does drizzle-kit generate do?"
  options={[
    { text: "Creates a new Postgres database" },
    { text: "Creates SQL migration files from your TypeScript schema" },
    { text: "Applies migrations to the database" },
    { text: "Generates TypeScript types from existing tables" }
  ]}
  correct={1}
  explanation="generate produces the SQL migration files from your schema.ts changes; migrate is the separate step that applies those migrations to the database."
  revisit={{ to: "/docs/solo/env-setup#setting-up-drizzle", label: "Drizzle commands" }}
/>

<Question
  prompt="Roughly how long does this full setup take the first time you do it?"
  options={[
    { text: "About 15 minutes" },
    { text: "About an hour (sometimes two or three the first time)" },
    { text: "A full weekend" },
    { text: "About a week" }
  ]}
  correct={1}
  explanation="The page targets about an hour but is honest that the first run often takes two or three — every signup is different. By the third project it's muscle memory."
  revisit={{ to: "/docs/solo/env-setup#phase-3-environment-setup-one-hour", label: "Setup time" }}
/>

</Quiz>

## What's next

→ Continue to [Phase 5: Development](./development) where we build features end-to-end with Server Components, Server Actions, and Tailwind.
