---
id: personal-website-workflow
title: 4. Personal Website Workflow
sidebar_position: 5
sidebar_label: 4. Solo / Personal
description: Solo developers, personal sites, side projects. Free tiers, minimal ops, maximum shipping speed.
---

# Part 4: Personal Website / Side Project Workflow

*Solo developer, low budget, maximum shipping speed.*

:::tip Beginner orientation
**Who this chapter is for:** You, right now, building your first website or side project. One person, no boss, no users yet, no budget.

**The whole philosophy of solo development:** Pick boring, well-supported tools. Use free tiers. Ship fast. Don't worry about scaling problems you don't have yet. A weekend project with five users does not need Kubernetes.

**What "shipping" actually means:** Putting your project on the internet so a real URL — like `tony.dev` — loads your work in any browser, anywhere in the world. That's deployment. It's the milestone that separates "I'm learning to code" from "I built something."

**The 2026 solo stack at a glance:**
- **Code editor:** VS Code or Cursor (free, with AI built in)
- **Framework:** Next.js or Astro (React-based, fast, free)
- **Styling:** Tailwind CSS (utility classes, no separate stylesheet to maintain)
- **Data:** SQLite file, or free Postgres on Neon/Supabase
- **Hosting:** Vercel or Netlify free tier (deploys when you `git push`)
- **Auth (if needed):** Clerk free tier or simple email login
- **Total cost:** $0/month until you actually have users

**Mental model:** A solo workflow is like cooking at home. You don't need a commercial kitchen, multiple chefs, or food-safety inspectors. You need a stove, a knife, and ingredients. Pick the minimum that lets you make the meal.

**If you only remember one thing:** The best solo stack is the one that lets you go from "idea" to "URL my friend can open" in under an evening. Optimize for that.
:::

This file walks through how an individual developer plans, builds, ships, and maintains a personal website or side project in 2026. The principles here apply to portfolios, blogs, hobby SaaS, indie tools, learning projects, and any other one-person endeavor.

The whole goal: **spend your time on the actual product, not infrastructure.** Modern free tiers and managed services let one person ship what would have required a team a decade ago.

---

## The Personal Project Mindset

Personal projects are the opposite of enterprise software. The trade-offs are inverted:

| Enterprise          | Personal             |
|---------------------|----------------------|
| Process for safety  | Speed over process   |
| Plan for 5 years    | Plan for 5 weeks     |
| Optimize for teams  | Optimize for self    |
| Cost scales with revenue | Cost matters more than scale |
| Avoid risky tech    | Try new tech freely (it's your call) |
| Many environments   | Just local + production |
| Heavy testing       | Test the things that matter |
| Multiple reviewers  | You are the reviewer |

The biggest mistake solo developers make is **applying enterprise patterns to personal projects.** You don't need Kubernetes. You don't need microservices. You don't need a CI/CD pipeline with seventeen stages. You need to ship.

---

## Common Personal Project Types

The workflow varies slightly by what you're building:

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

For the rest of this file, the workflow focuses on **Type 3 (hobby SaaS)** as the most complete example. Simpler project types just skip steps.

---

## Phase 1: Planning (An Afternoon, Not a Month)

Personal planning is short and direct.

### Step 1: Write the Pitch

In one paragraph, answer:
- What does it do?
- Who is it for?
- Why would they use it instead of alternatives?

If you can't answer in one paragraph, you don't understand it well enough yet.

**Example:**
> "ShelfTrack is a web app for solo readers who want to track which books they're reading without a social network. Goodreads is bloated with social features and ads; ShelfTrack is just a clean shelf with progress tracking, ratings, and optional reading streaks. For me first, then anyone like me."

### Step 2: List the v1 Features

Five or fewer. If you have more, you're not at v1 yet.

**Example for ShelfTrack:**
1. Sign up / sign in.
2. Add a book to my shelf (search by ISBN or title).
3. Mark a book as currently reading, finished, or want-to-read.
4. Rate finished books (1–5 stars).
5. See my shelf as a list.

That's it. Reading streaks, recommendations, social features, exports — all v2+.

### Step 3: Sketch the UI

Paper, Figma, or just a Word doc with rectangles. Don't spend more than two hours.

### Step 4: Decide if It's Worth Building

Ask:
- Would I use this every week?
- Is there a clear next user beyond me?
- Can I build v1 in 2–4 weekends?
- Will I still care in 3 months?

If "yes" to most: build it. If "no" to most: skip it. Side projects you don't finish accumulate in your graveyard and demoralize you.

---

## Phase 2: Stack Selection

For a 2026 personal SaaS, the stack is basically pre-decided:

```
Frontend + Backend:  Next.js 15 (App Router)
Language:            TypeScript
Styling:             Tailwind + shadcn/ui
Database:            Postgres on Neon (or Supabase)
ORM:                 Drizzle
Auth:                Clerk (fastest) or Better Auth (free, open-source)
Email:               Resend
Payments (if any):   Stripe
File storage (if any): Cloudflare R2
Hosting:             Vercel (or Cloudflare Pages)
Monitoring:          Sentry free tier
Analytics:           Vercel Analytics + PostHog free tier
```

This stack handles everything from 0 to ~10,000 active users without changes. By the time you outgrow it, you'll have learned enough to make the next decision wisely.

### Why Not [Other Stack]?

You'll be tempted to evaluate alternatives. Resist for personal projects:

- **Why not Astro?** Fine for content-only. Add interactivity → switch to Next.js eventually anyway.
- **Why not Svelte/Vue?** Smaller ecosystem; fewer copy-paste solutions on Stack Overflow.
- **Why not [your own custom stack]?** You'll spend more time setting it up than building.
- **Why not the latest hype?** New tools have unknown failure modes. Personal projects need shipping more than experimentation.

The exception: **if your goal is learning a specific technology**, use it. Just be aware you're optimizing for learning, not shipping.

---

## Phase 3: Environment Setup (One Hour)

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

In about an hour, you have a working project, a connected GitHub repo, automated deployments, a managed database, auth, and error tracking. **A decade ago this would have taken a week.**

### .gitignore Essentials

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

### Setting Up Drizzle

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

```typescript
// src/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client);
```

Run migrations:
```bash
bunx drizzle-kit generate   # Creates SQL migration files
bunx drizzle-kit migrate    # Applies them to the database
```

---

## Phase 4: Development

The longest phase. Here's how to make it productive.

### Recommended Development Loop

1. Pick one feature from your v1 list.
2. Sketch the UI in a comment or scratch file.
3. Build the database schema (if new).
4. Build the server logic (Server Actions or Route Handlers).
5. Build the UI.
6. Test it manually.
7. Commit and push.
8. Vercel auto-deploys; check the preview URL.
9. Move to the next feature.

Repeat until v1 is done.

### Server Components vs Client Components

Next.js App Router gives you both:

- **Server Components** (default): Run on the server. Can `await` data. Cannot use `useState`, `useEffect`, event handlers, or browser APIs. Ship zero JS to the client.
- **Client Components** (marked with `"use client"`): Run on both server (for initial HTML) and client (for hydration). Can use all React features and browser APIs.

**Default to Server Components.** Add `"use client"` only when you need interactivity.

Example: a book list (Server Component, no JS needed) with an "Add Book" button (Client Component because it opens a modal).

```typescript
// src/app/library/page.tsx (Server Component)
import { db } from '@/db';
import { books } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { AddBookButton } from './add-book-button';  // Client Component
import { BookCard } from './book-card';

export default async function LibraryPage() {
  const { userId } = await auth();
  if (!userId) return <div>Sign in to see your library</div>;

  const myBooks = await db
    .select()
    .from(books)
    .where(eq(books.userId, userId));

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Library</h1>
        <AddBookButton />
      </header>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {myBooks.map(book => <BookCard key={book.id} book={book} />)}
      </div>
    </div>
  );
}
```

```typescript
// src/app/library/add-book-button.tsx (Client Component)
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AddBookDialog } from './add-book-dialog';

export function AddBookButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Add Book</Button>
      <AddBookDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
```

### Server Actions

For mutations (creating, updating, deleting data), Server Actions let you call server functions from client components without writing API routes:

```typescript
// src/app/library/actions.ts
'use server';

import { db } from '@/db';
import { books } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const AddBookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  status: z.enum(['reading', 'finished', 'wishlist']),
});

export async function addBook(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const parsed = AddBookSchema.parse({
    title: formData.get('title'),
    author: formData.get('author'),
    status: formData.get('status'),
  });

  await db.insert(books).values({ userId, ...parsed });
  revalidatePath('/library');
}
```

```typescript
// In a client component:
<form action={addBook}>
  <input name="title" placeholder="Title" required />
  <input name="author" placeholder="Author" required />
  <select name="status">
    <option value="reading">Reading</option>
    <option value="finished">Finished</option>
    <option value="wishlist">Want to read</option>
  </select>
  <button type="submit">Add</button>
</form>
```

No API endpoint needed. No fetch calls. No JSON parsing. The form just works.

### Handling Loading and Error States

Real apps need to handle async states properly. Next.js gives you file-based conventions:

```
src/app/library/
  page.tsx          ← The page itself
  loading.tsx       ← Shown while page.tsx is loading
  error.tsx         ← Shown if page.tsx throws
  not-found.tsx     ← Shown for 404s
```

```typescript
// src/app/library/loading.tsx
export default function Loading() {
  return <div className="animate-pulse">Loading your library...</div>;
}
```

### Styling Tips

- Use Tailwind utility classes directly in JSX. Don't try to "clean them up."
- Use shadcn/ui components for anything pre-built (buttons, inputs, dialogs, dropdowns).
- For one-off components, just write Tailwind classes.
- For repeated patterns, extract a component (don't extract a CSS class).
- Use `cn()` from `lib/utils.ts` (shadcn provides this) for conditional classes.

### Working With the AI Coding Assistant

In 2026, you'll likely use Cursor or VS Code with Claude/Copilot. Best practices:

- **Inline completions** for boilerplate: yes, just accept them.
- **Chat for new features**: describe what you want, review the generated code carefully.
- **Agentic mode** (Claude Code, Cursor's compose) for multi-file changes: review every change.
- **Never blindly trust** AI-generated security-sensitive code (auth, payments, input validation).

The AI is excellent at generating "the obvious next code" — boilerplate, CRUD operations, UI scaffolding. It's worse at making good architectural decisions, especially in unfamiliar codebases.

---

## Phase 5: Adding Auth

With Clerk, auth takes 20 minutes:

```typescript
// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtected = createRouteMatcher(['/library(.*)', '/settings(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isProtected(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};
```

```typescript
// src/app/layout.tsx
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <nav className="border-b p-4 flex justify-between items-center">
            <a href="/" className="font-bold">ShelfTrack</a>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton />
            </SignedOut>
          </nav>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
```

Done. Users can sign up, sign in, manage their account, sign out. Clerk handles passkeys, social login, multi-factor, password reset — all of it.

---

## Phase 6: Payments (If Building SaaS)

Stripe + a webhook handler. The minimal flow:

1. User clicks "Subscribe."
2. Your server creates a Stripe Checkout session.
3. User completes checkout on Stripe-hosted page.
4. Stripe redirects them back to your app.
5. Stripe sends a webhook to your server.
6. Your server marks the user as a subscriber in your DB.

```typescript
// src/app/api/checkout/route.ts
import Stripe from 'stripe';
import { auth } from '@clerk/nextjs/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  const { userId } = await auth();
  if (!userId) return new Response('Unauthorized', { status: 401 });

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: 'price_xxxxxxxxxxxxx', quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing`,
    metadata: { userId },
  });

  return Response.json({ url: session.url });
}
```

```typescript
// src/app/api/stripe/webhook/route.ts
import Stripe from 'stripe';
import { db } from '@/db';
import { subscriptions } from '@/db/schema';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')!;
  const body = await req.text();

  const event = stripe.webhooks.constructEvent(
    body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    await db.insert(subscriptions).values({
      userId: session.metadata!.userId,
      stripeCustomerId: session.customer as string,
      status: 'active',
    });
  }

  return new Response('ok');
}
```

Test webhooks locally with the Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## Phase 7: Deployment

You set this up in Phase 3. Pushing to GitHub triggers Vercel to:
1. Detect Next.js.
2. Install dependencies (with Bun if you set it up).
3. Run the build.
4. Deploy to a unique URL.
5. Promote `main` to your production domain.

### Custom Domain

In the Vercel dashboard:
1. Settings → Domains → Add Domain.
2. Buy a domain (Vercel sells them, or use Cloudflare/Porkbun/Namecheap).
3. Add the DNS records Vercel tells you to.
4. Vercel automatically provisions SSL.

Total cost: $10–15/year for the domain.

### Preview Deployments

Every branch and every PR gets its own URL. Share preview links with friends to get feedback before merging.

### Environment Variables

Vercel has three environments by default: Development, Preview, Production. Set environment variables per-environment in the dashboard.

Tip: Use different Stripe keys (test vs live) and different database URLs for preview vs production.

---

## Phase 8: Observability (Minimal)

For a personal project, three tools cover almost all needs:

### Sentry for Errors

```bash
bunx @sentry/wizard@latest -i nextjs
```

Wizard configures Sentry automatically. Now exceptions in your app show up in Sentry's dashboard with stack traces, breadcrumbs, and user context.

### Vercel Analytics for Traffic

Free with Vercel. Shows page views, top pages, top referrers, and core web vitals. No setup needed beyond enabling it.

### PostHog for Product Analytics (Optional)

If you want to know which features users actually use:

```bash
bun add posthog-js
```

Initialize in a client component and call `posthog.capture('event_name', { ... })` when interesting things happen.

### Uptime Monitoring (Optional)

Better Stack's free tier pings your homepage every 3 minutes. If it fails, you get an email.

That's enough until you have real users.

---

## Phase 9: Launching

Personal projects don't need a "launch" the way enterprise products do. You can soft-launch by:

1. Telling friends.
2. Posting on Twitter / Bluesky / Mastodon / Threads.
3. Writing a blog post about why you built it.
4. Posting to Hacker News (with a "Show HN: " title).
5. Posting to Reddit (relevant subreddits).
6. Posting to Product Hunt.
7. Posting to Indie Hackers.

Don't overthink launches. The product matters more than the launch.

### Pricing (For SaaS)

A common starting point:
- **Free tier:** Enough for a single individual to use (limited capacity).
- **Paid tier:** $5–15/month for the full experience.
- **Annual discount:** 2 months free.

Stripe handles the actual billing.

### Marketing Site

If you're selling, you need a landing page that explains:
- What it does (hero section, one sentence).
- Who it's for (subheadline).
- Why it's better than alternatives (3-4 differentiators).
- What it looks like (screenshots or video).
- Pricing (transparent, simple).
- Social proof (if any).
- CTA (sign up / try free).

For inspiration, look at landing pages of indie SaaS products on Indie Hackers.

---

## Phase 10: Maintenance

Once shipped, the work changes:

### Regular Maintenance

- **Watch Sentry weekly** for new error patterns.
- **Watch your Stripe dashboard** for failed payments.
- **Reply to user emails promptly** — early users are gold.
- **Merge Dependabot PRs** weekly (or daily, with caution).
- **Back up data** — most managed databases (Neon, Supabase) auto-backup, but check your settings.

### Adding Features

Use the same loop: pick one feature, build it end-to-end, ship it. Don't accumulate a half-built backlog.

### Performance

Most personal projects don't have performance problems. If they do:
- Check the slow query log in Neon/Supabase.
- Add indexes on columns you filter/sort on.
- Add caching with `unstable_cache` (Next.js) or Redis.
- Optimize images with Next.js `<Image>`.

### Costs

Watch your bills. A typical personal project at low traffic:

| Item                   | Cost/month       |
|------------------------|------------------|
| Domain (annualized)    | $1               |
| Vercel (free tier)     | $0               |
| Neon (free tier)       | $0               |
| Clerk (up to 10K MAU)  | $0               |
| Sentry (free tier)     | $0               |
| Stripe (per transaction)| variable        |
| **Total**              | **~$1/month**    |

If you grow beyond free tiers:

| Item                   | Cost/month       |
|------------------------|------------------|
| Vercel Hobby → Pro     | $20              |
| Neon Pro               | $19              |
| Clerk paid             | $25–100          |
| Sentry Team            | $26              |
| Better Stack           | $24              |
| Total at small scale   | $100–200         |

Still trivial for a project earning anything meaningful.

---

## Realistic Time Investment

A common breakdown for an indie SaaS v1:

- **Planning + design:** 1 weekend
- **Stack setup + auth + DB:** 1 weekend
- **Core features:** 4–8 weekends
- **Payments + landing page:** 1–2 weekends
- **Polish + launch:** 1–2 weekends

**Total:** 8–14 weekends (3–4 months of part-time work).

Most indie projects take longer than expected. Plan for 2x your initial estimate.

---

## Common Pitfalls

### Over-Engineering

Building infrastructure you don't need:
- Microservices for a 100-user app.
- Kubernetes for static content.
- A complex CI pipeline for a one-person project.
- GraphQL when REST is fine.
- A custom auth system instead of Clerk.

### Stack Churn

Switching frameworks every two weeks because you saw a tweet. Pick one; ship something.

### Skipping Deployment

Building for weeks before deploying. Deploy on day one with an empty page. Every step gets harder if you don't have a working deploy pipeline.

### Building Without Users

Building in isolation for months, then launching to crickets. Talk to potential users early. Show prototypes. Iterate based on real feedback.

### Premature Scaling

Designing for 1M users when you have 0. Build for 10x your current scale, not 1000x.

### Feature Creep

"I'll add just one more feature before launch." Repeated weekly. Ship the smallest useful thing, then iterate.

### Working Without Joy

Personal projects only work if you enjoy them. If a project becomes a chore, give yourself permission to shelf it or kill it. Life is too short for joyless side projects.

### Not Charging

For SaaS: charging $0 means users have no skin in the game. They give shallow feedback and don't show up. Charging $5/month attracts genuine customers from day one. Money is a strong filter.

### Not Shipping

The biggest failure mode of personal projects: never deploying. Polished MVPs in your local environment help no one. Ship ugly; iterate live.

---

## Pre-Built Templates Worth Knowing

Don't always start from scratch:

- **shadcn/ui** — Component library.
- **Vercel templates** (vercel.com/templates) — Many starter Next.js apps.
- **shipfa.st, mkdirs.com, indiestarter.dev** — Paid SaaS starter kits (auth + payments + landing page pre-built).
- **Create T3 App** — Type-safe full-stack starter (Next.js + tRPC + Drizzle + Tailwind).

Templates save days of setup. Just make sure you understand what they do — don't deploy something you can't maintain.

---

## A Sample Two-Weekend Project

To make this concrete, here's a realistic schedule for a small tool:

### Weekend 1: Setup + Backend

**Saturday:**
- Sketch the UI (2 hours)
- Set up Next.js, Tailwind, shadcn (1 hour)
- Set up Neon database, Drizzle schema (2 hours)
- Build the database mutations and server actions (4 hours)

**Sunday:**
- Build the main page UI (4 hours)
- Wire up server actions to forms (3 hours)
- Deploy to Vercel (30 minutes)
- Buy a domain, configure DNS (30 minutes)

End of weekend: a working v0 at a real URL.

### Weekend 2: Auth + Polish + Launch

**Saturday:**
- Add Clerk for auth (1 hour)
- Build the landing page (4 hours)
- Add Stripe Checkout (3 hours)
- Test the full flow (1 hour)

**Sunday:**
- Polish UI rough edges (3 hours)
- Set up Sentry (30 minutes)
- Write a launch blog post (2 hours)
- Post to Hacker News, Twitter, relevant subreddits (1 hour)
- Reply to feedback (ongoing)

End of weekend: a shipped product with users.

This is genuinely achievable in 2026. The tools have advanced to the point where one person can ship what used to require a small team.

---

## When to Graduate Beyond "Personal Project"

If your side project becomes meaningful (revenue, users, importance), you'll start outgrowing personal-project habits. Signs:

- You're working on it more than 20 hours a week.
- It's earning enough to cover its costs and your time.
- You have meaningful users (hundreds+).
- Bugs affect real people, not just you.
- You need help.

At that point, read the **05-small-company-workflow.md** file. The transition isn't dramatic — many of the same tools apply — but you'll start adding process, testing, and observability you skipped at the personal stage.

---

## Wrapping Up Part 4

The personal project workflow in 2026 is essentially:

1. Plan briefly.
2. Use the default stack.
3. Set up quickly with modern tools.
4. Build features one at a time, end-to-end.
5. Ship continuously.
6. Iterate based on real feedback.

The biggest enemy is over-thinking. Modern tools have removed most barriers — what remains is the discipline to focus on the actual product and ship.

**Next:** Part 5 covers what changes when you graduate to a small company / startup environment.
