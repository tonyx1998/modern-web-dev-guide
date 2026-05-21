---
id: small-company-workflow
title: 5. Small Company Workflow
sidebar_position: 6
sidebar_label: 5. Startup / Small Co.
description: Startups and small companies (5–50 people). Real product, paying customers, managed services.
---

# Part 5: Small Company / Startup Workflow (5–50 People)

*Real product, paying customers, small team, balancing speed and quality.*

:::tip Beginner orientation
**The leap from solo to startup:** Solo, you can break your own site without consequence. At a startup, breaking the site means actual humans can't use the product they're paying for. Everything in this chapter exists because *real users will notice your mistakes*.

**What changes once you have a small team and paying customers:**
- You can't just push to production from your laptop anymore (someone needs to review your changes first)
- You need automated tests (because manual testing doesn't scale past ~3 features)
- You need monitoring (because users will hit bugs you didn't know existed)
- You need a real database backup strategy (because losing data ends companies)
- You need a way to roll back a bad deploy in minutes

**The startup philosophy:** Buy, don't build, anything that isn't your core product. If you're building a recipe app, you do *not* build your own authentication system, your own payment processor, or your own analytics — you pay $20-200/month for managed services that do those things better than you ever would.

**The 2026 startup stack at a glance:**
- **Framework:** Next.js (most common) or Remix (App Router style)
- **Database:** Postgres (managed: Supabase, Neon, RDS)
- **Auth:** Clerk, Auth0, or Supabase Auth
- **Payments:** Stripe (no alternative is even close)
- **Email:** Resend or Postmark
- **Hosting:** Vercel (most common), AWS, or Cloudflare
- **Error tracking:** Sentry
- **Analytics:** PostHog or Plausible
- **Total cost at 1,000 users:** typically $200-$800/month total

**Mental model:** Solo dev is cooking at home. Startup dev is running a small restaurant. You have a few employees, a Yelp review section that matters, health-department visits (security/compliance), and food that has to actually arrive at the table while still warm (uptime).

**If you only remember one thing:** Startups win by shipping fast *without* breaking things. The whole workflow in this chapter exists to find that balance.
:::

This is the workflow for actual companies — startups and small businesses with engineering teams between five and fifty people. There's a real product, real customers, and real money involved, but the operational scale doesn't yet justify enterprise-grade infrastructure.

The defining characteristic of this stage: **everything must work, but nothing should require a dedicated team to operate.** You're optimizing for the smallest team that can ship and maintain real software.

---

## The Small Company Mindset

The mindset sits between personal projects and enterprises:

- **Move fast, but don't accumulate fatal mistakes.** Pick technologies that scale to 100K users without rewrites; design schemas you can extend without painful migrations.
- **Lean on managed services.** Time spent operating infrastructure is time not spent on product. Vercel, Supabase, Clerk, Stripe — they're cheaper than another engineer.
- **Process exists to enable speed.** Add process when missing it causes pain; not before. A daily standup is process; a 14-stage release approval workflow is bureaucracy.
- **Plan for 18 months, not 5 years.** Most architectural decisions can be revisited. Don't paralyze the team with multi-year predictions.
- **Hire for capability, not credentials.** Small teams need generalists who can pick up unfamiliar work. Specialists come later.

The opposite mistakes — the dual failure modes of this stage — are:
1. **Acting like a personal project at scale:** Skipping tests, skipping reviews, skipping monitoring. Things break in production, customers churn, you firefight constantly.
2. **Acting like an enterprise too early:** Microservices for 5 engineers, weeks-long architectural reviews, Kubernetes for a 100-user app. Crushing overhead, no shipping.

The right balance is uncomfortable. You'll over-build sometimes; you'll under-build sometimes. That's normal.

---

## Team Structure at This Scale

A typical small-startup engineering org in 2026:

### 5–10 Person Team

- **2–6 full-stack engineers** (no specialization yet — everyone touches everything)
- **0–1 designer** (often part-time, contract, or doubled with a PM)
- **0–1 product manager** (often the founder or a founding engineer)
- **1 founding CTO or technical lead**
- **No dedicated DevOps, QA, security, or platform engineers**

Everyone wears multiple hats. Engineers handle their own deployments, monitoring, on-call. The CTO does architecture, hiring, vendor decisions, and still ships code.

### 10–25 Person Team

- **5–15 engineers** with early specialization beginning (frontend-focused, backend-focused, infra-curious)
- **1–2 designers**
- **2–3 product managers**
- **1 engineering manager** (or the CTO still managing directly)
- **1 first-hire DevOps / platform engineer** (often joins around 15–20 engineers)
- **0–1 first-hire security or compliance person** (often around 20–25, especially if pursuing SOC 2)

You start to see "teams" emerge: maybe a frontend team, an API team, an infrastructure team. They're informal and people cross boundaries.

### 25–50 Person Team

- **15–35 engineers** organized into 3–5 product teams
- **3–8 designers**
- **5–10 PMs**
- **2–4 engineering managers**
- **A small platform team** (2–4 people)
- **A small DevOps/SRE team** (1–3 people)
- **Maybe a data team** (1–2 analysts/data engineers)
- **A security or compliance lead**

Now teams have clear ownership of services or product areas. Cross-team coordination becomes a real cost. Architecture decisions need broader buy-in.

---

## Phase-by-Phase Walkthrough

### Phase 1: Discovery & Planning

**Tools:**
- **Linear** — Issue tracking, sprint planning. The dominant choice for new startups in 2026.
- **Notion** — Documentation, specs, wikis.
- **Figma + FigJam** — Design and collaboration.
- **Loom** — Async video for cross-functional communication.
- **Slack** — Real-time communication.

**Process:**

The product team (PM + designer + tech lead) writes 1–3 page **PRDs (Product Requirements Documents)** in Notion or Linear. PRDs cover:
- Problem statement and user pain.
- Proposed solution at a high level.
- Acceptance criteria (what "done" looks like).
- Out of scope (what we're explicitly NOT doing).
- Open questions.
- Estimated effort and timeline.

Engineering reviews the PRD for feasibility. Designers attach mockups. The team discusses in a planning meeting; the PRD gets refined; tickets are created.

**Sprints:**

Two-week sprints are standard. Each sprint has:
- Planned scope (negotiated during sprint planning).
- Stretch goals.
- A review/demo at the end.
- A retrospective on process.

Some teams use **continuous flow** (no sprints — just a prioritized queue). Both work; sprints add structure that helps newer teams.

**Quarterly planning:**

Every 3 months, the team picks a small number (3–5) of large goals for the quarter. These cascade down into sprints. The framework is often **OKRs (Objectives and Key Results)** — Objectives are aspirational; Key Results are measurable.

### Phase 2: Design

Designers work in Figma. They use the company's **design system** (a set of reusable components and tokens).

Engineering and design collaborate closely:
- Engineers attend design reviews to flag feasibility issues early.
- Designers attend stand-ups to stay synced.
- Both use shadcn/ui or a custom design system in code.

**Design system maturity** at this stage:
- 5–10 people: Use shadcn/ui directly. Customize colors and typography to match brand.
- 10–25 people: Maintain a small private component library extending shadcn.
- 25–50 people: Full design system in Storybook, with a designer-engineer owner.

### Phase 3: Architecture

The reigning 2026 pattern for small companies: **modular monolith**.

```
┌──────────────────────────────────────────────┐
│              Single Next.js app              │
│ ┌──────────┐ ┌──────────┐ ┌──────────────┐   │
│ │ User mgmt│ │ Billing  │ │ Core feature │   │
│ │  module  │ │  module  │ │   module     │   │
│ └──────────┘ └──────────┘ └──────────────┘   │
│ ┌──────────┐ ┌──────────┐ ┌──────────────┐   │
│ │  Notif   │ │  Search  │ │   Admin      │   │
│ │  module  │ │  module  │ │  module      │   │
│ └──────────┘ └──────────┘ └──────────────┘   │
│         │              │              │      │
│         ▼              ▼              ▼      │
│ ┌──────────────────────────────────────────┐ │
│ │  Shared: DB, cache, queue, observability │ │
│ └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

All deployed as one Next.js app. Internally organized so that modules can later be split into services if needed (but most never need to be).

**The dominant 2026 small-company stack:**

| Layer            | Tool                                              |
|------------------|---------------------------------------------------|
| Frontend + SSR   | Next.js 15 (App Router)                           |
| Language         | TypeScript (strict mode)                          |
| UI               | shadcn/ui + Tailwind CSS v4                       |
| Internal API     | tRPC or Server Actions                            |
| Public API       | REST with OpenAPI (if needed for partners/SDK)    |
| Database         | PostgreSQL via Supabase or Neon                   |
| ORM              | Drizzle                                           |
| Auth             | Clerk or Better Auth                              |
| Background jobs  | Trigger.dev or Inngest                            |
| Payments         | Stripe (or Paddle/Lemon Squeezy for global tax)   |
| Email            | Resend                                            |
| Files            | Cloudflare R2                                     |
| Search           | Postgres full-text → Typesense if needed          |
| Observability    | Sentry + PostHog + Better Stack                   |
| Feature flags    | PostHog or Statsig                                |
| Hosting          | Vercel + Supabase (or Railway, or Cloudflare)     |
| CI/CD            | GitHub Actions + Vercel auto-deploys              |
| Secrets          | Doppler or Vercel/Supabase env vars               |

**This stack handles roughly the first $10M+ in ARR for most modern SaaS companies.** It scales further with minor adjustments (read replicas, caching layers) without architectural rewrites.

**RFCs (Request for Comments):**

Major architectural changes get an RFC — a short written proposal:

```markdown
# RFC: Move from Server Actions to tRPC

## Context
We've grown to 8 engineers and 30+ Server Actions. They're becoming
hard to track and lack a unified validation/error pattern.

## Proposal
Migrate to tRPC for our internal API. Server Actions remain for
form submissions; tRPC handles all other mutations and queries.

## Alternatives Considered
1. Keep Server Actions, add stricter conventions.
2. Move to REST with OpenAPI.

## Trade-offs
+ Better DX, type safety end-to-end
+ Unified error handling
- Migration cost: ~2 weeks of one engineer
- Learning curve for new hires

## Decision
Proposed; needs sign-off from CTO and frontend lead.
```

RFCs become a useful artifact — future engineers understand why decisions were made.

### Phase 4: Environment Setup

For a team to onboard a new engineer in under a day:

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

**Onboarding script (`scripts/setup.sh`):**
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

**Three environments:**
- **Local** — Each developer's machine. Uses a local Postgres (Docker) or a personal Neon branch.
- **Preview** — Vercel auto-creates per PR. Connected to a separate preview database (often a Neon branch).
- **Production** — The real thing. Strictly protected, deployments require passing CI.

**Secrets:**
- **Doppler** or **1Password Developer** for syncing secrets across the team.
- Vercel and Supabase store production secrets in their dashboards.
- Local `.env.local` files (gitignored) for development.

### Phase 5: Development Practices

**Branching strategy: Trunk-based development.**

Engineers create short-lived feature branches (typically merged within 1–3 days). Long-lived branches are forbidden — they cause merge conflicts and integration pain.

**Workflow:**
1. Pull latest `main`.
2. `git checkout -b feature/add-bulk-export`.
3. Write code, commit often.
4. Push and open a PR.
5. Wait for CI and review.
6. Address feedback.
7. Merge to `main` (usually squash-merge for clean history).
8. Branch is deleted.

**Conventional Commits:**

Commit messages follow a convention:

```
feat: add bulk export endpoint
fix: handle null email in signup
chore: bump drizzle to 0.36
docs: update README with deploy steps
refactor: extract email sending to package
test: add coverage for billing edge cases
```

This enables automatic changelog generation and clear history.

**Feature flags:**

Significant new features ship behind flags. PostHog or Statsig is configured to enable them per-user, per-cohort, or by percentage rollout.

```typescript
import { useFeatureFlag } from '@/lib/posthog';

export function BulkExportButton() {
  const enabled = useFeatureFlag('bulk-export');
  if (!enabled) return null;
  return <Button onClick={handleExport}>Export All</Button>;
}
```

Flags let you:
- Ship code without releasing it.
- Roll out gradually (1% → 10% → 100%).
- A/B test variants.
- Kill features instantly without redeploying.

**Database migrations:**

Always with Drizzle Kit; never edit production schema by hand:

```bash
# Edit schema.ts to add a new column
bunx drizzle-kit generate    # Creates SQL migration file
git add drizzle/
git commit -m "feat: add export_format to users"
# Open PR; CI verifies migration applies cleanly
# Merge; deployment runs migration before app code update
```

**Pair programming and async review:**

Some teams pair extensively; others work async. Both are fine. The key: real review of code, not rubber stamps.

### Phase 6: Testing Strategy

A pragmatic testing pyramid:

```
              ▲
             /│\
            / │ \
           /  │  \      Playwright E2E (10–30 critical paths)
          /───┼───\
         /    │    \
        /─────┼─────\   Vitest integration (50–200)
       /      │      \
      /───────┼───────\
     /        │        \
    /─────────┼─────────\Vitest unit (hundreds to thousands)
```

**Unit tests** (Vitest):
- Pure business logic.
- Validation functions.
- Utility functions.
- Component rendering for shared UI library.

```typescript
import { describe, it, expect } from 'vitest';
import { calculateInvoiceTotal } from './invoice';

describe('calculateInvoiceTotal', () => {
  it('applies tax to subtotal', () => {
    const result = calculateInvoiceTotal({
      items: [{ price: 100, quantity: 2 }],
      taxRate: 0.08,
    });
    expect(result).toEqual({ subtotal: 200, tax: 16, total: 216 });
  });

  it('handles empty items', () => {
    const result = calculateInvoiceTotal({ items: [], taxRate: 0.08 });
    expect(result).toEqual({ subtotal: 0, tax: 0, total: 0 });
  });
});
```

**Integration tests:**
- API endpoint + database.
- Server Actions with real DB.
- Webhook handlers.

Run against a test database (often a Neon branch per CI run, or a Docker Postgres).

**E2E tests (Playwright):**
- Critical user flows ONLY: sign-up, sign-in, checkout, main feature path.
- 10–30 tests total, not hundreds.
- Run on CI; some teams run a subset on every push, full suite nightly.

```typescript
import { test, expect } from '@playwright/test';

test('user can sign up and complete checkout', async ({ page }) => {
  await page.goto('/signup');
  await page.fill('[name=email]', `test+${Date.now()}@example.com`);
  await page.fill('[name=password]', 'SecurePass123!');
  await page.click('button[type=submit]');
  await expect(page).toHaveURL('/dashboard');

  await page.click('text=Upgrade');
  await page.click('text=Start subscription');
  // Stripe test mode auto-fills card
  await page.frameLocator('iframe[name^="__privateStripeFrame"]')
    .locator('[name=cardnumber]').fill('4242 4242 4242 4242');
  // ... rest of checkout
  await page.click('text=Subscribe');
  await expect(page.locator('text=Subscription active')).toBeVisible();
});
```

**Manual QA:**
- The PM or designer clicks through new features before merge.
- For larger changes, a "QA day" before release.
- No dedicated QA team yet at this scale.

**Coverage targets:**
- No formal target (e.g., not "80% coverage required").
- Focus on testing what would break the business if it failed.
- Critical paths (payment, auth, data integrity) should have multiple test layers.

### Phase 7: CI/CD with GitHub Actions

A typical workflow file:

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Lint and format
        run: bunx biome check .

      - name: Type check
        run: bun run typecheck

      - name: Unit + integration tests
        run: bun run test
        env:
          DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}

      - name: Build
        run: bun run build

  e2e:
    runs-on: ubuntu-latest
    needs: validate
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Install Playwright browsers
        run: bunx playwright install --with-deps chromium

      - name: Run E2E tests
        run: bun run test:e2e
        env:
          BASE_URL: ${{ secrets.PREVIEW_URL }}
```

CI typically completes in 5–10 minutes. Vercel handles deployment separately — every PR gets a preview URL automatically; merges to `main` deploy to production.

**Branch protection:**

GitHub branch protection on `main`:
- Require pull request before merging.
- Require status checks to pass (CI, type check, tests).
- Require approval from at least 1 reviewer.
- Dismiss stale approvals when new commits are pushed.
- Require linear history (no merge commits).

**Hot fixes:**

For emergency production fixes, the same flow applies — branch, PR, review, merge, deploy. CI is fast enough that emergency fixes ship in 15–30 minutes.

### Phase 8: Deployment & Infrastructure

Three popular hosting patterns for small companies in 2026:

#### Pattern A: Vercel + Supabase (Most Popular)

- **Vercel** hosts Next.js (edge + serverless functions).
- **Supabase** provides Postgres + Auth + Realtime + Storage + Edge Functions.
- **Cloudflare R2** for file storage if not using Supabase Storage.
- **Resend** for email.
- **Trigger.dev** for background jobs.

```
┌──────────────────────────────────────┐
│           Cloudflare DNS             │
└─────────┬────────────────────────────┘
          │
          ▼
┌──────────────────────────────────────┐
│        Vercel (global edge)          │
│  - Next.js app                       │
│  - Static assets via Vercel CDN      │
│  - Serverless functions for APIs     │
└─────────┬────────────────────────────┘
          │
          ▼
┌──────────────────────────────────────┐
│           Supabase                   │
│  - Postgres                          │
│  - Auth (or use Clerk separately)    │
│  - Storage                           │
│  - Realtime                          │
└──────────────────────────────────────┘
```

**Pros:** Easiest, fastest, best DX, scales smoothly to substantial traffic.
**Cons:** Vercel bills can spike unexpectedly with traffic; some lock-in.

#### Pattern B: Railway / Render (More Flexible)

- **Railway / Render** runs your app in containers.
- Predictable pricing (you pay for compute, not per request).
- Good when you need long-running processes (WebSocket servers, persistent connections).

**Pros:** Predictable bills, single platform, more control.
**Cons:** No global edge presence; you may need a separate CDN.

#### Pattern C: Cloudflare-First (Edge-Native)

- **Cloudflare Pages + Workers** runs the app at the edge globally.
- **Cloudflare D1** (SQLite) or external Postgres for data.
- **Cloudflare R2** for storage.
- **Cloudflare KV / Durable Objects** for state.

```
┌──────────────────────────────────────┐
│       Cloudflare (global edge)       │
│  ┌─────────────┐  ┌──────────────┐   │
│  │   Pages     │  │   Workers    │   │
│  │ (frontend)  │  │  (API/logic) │   │
│  └─────────────┘  └──────────────┘   │
│  ┌─────────────┐  ┌──────────────┐   │
│  │     R2      │  │      KV      │   │
│  │  (storage)  │  │   (cache)    │   │
│  └─────────────┘  └──────────────┘   │
│  ┌─────────────┐  ┌──────────────┐   │
│  │     D1      │  │  Durable     │   │
│  │  (SQLite)   │  │   Objects    │   │
│  └─────────────┘  └──────────────┘   │
└──────────────────────────────────────┘
```

**Pros:** Cheap, fast, globally distributed by default.
**Cons:** Edge runtime constraints (smaller compute, no long-running processes), some libraries don't work.

#### Choosing Between Them

| Need                              | Pattern        |
|-----------------------------------|----------------|
| Standard SaaS, easy DX            | A (Vercel)     |
| Bills must be predictable         | B (Railway)    |
| Global low-latency app            | C (Cloudflare) |
| Need persistent connections       | B (Railway)    |
| Maximum free-tier value           | C (Cloudflare) |

### Phase 9: Observability

A typical small-company observability stack:

**Errors: Sentry**
- Captures exceptions in frontend, backend, and serverless functions.
- Source maps for readable stack traces.
- Releases tied to git commits.
- Alerts for new error types or regression in volume.

**Logs: Better Stack or Axiom**
- Centralized logs from Vercel functions + Supabase + Resend + Stripe webhooks.
- Search across all sources.
- Saved queries for common investigations.

**Uptime: Better Stack Heartbeats**
- Pings critical endpoints every 1–3 minutes.
- Alerts on 3+ consecutive failures.
- Status page for customers.

**Product analytics: PostHog**
- Page views, user behavior, funnel analysis.
- Session replay for debugging hard-to-reproduce issues.
- Feature flags + A/B testing.
- Cohort analysis.

**Performance: Vercel Analytics + Sentry Performance**
- Core Web Vitals from real users.
- API endpoint latencies.
- Slow query identification.

**On-call:**
- Simple rotation: one engineer at a time, rotates weekly.
- Tools: Better Stack On-call, Incident.io, or PagerDuty.
- Runbooks for common issues in Notion.
- Blameless post-mortems for significant incidents.

### Phase 10: Security and Compliance

**Daily hygiene:**
- HTTPS everywhere with HSTS.
- Strict Content Security Policy (CSP) headers.
- All inputs validated with Zod (defense in depth).
- Rate limiting on auth endpoints, API endpoints, and expensive operations.
- Dependabot or Renovate for dependency updates.
- Secrets in a vault (Doppler/1Password), never in code or chat.
- Database row-level security (RLS) where applicable.

**Authentication:**
- Strong password requirements + breached-password checks.
- Multi-factor authentication available (often required for admins).
- Session expiration and idle timeout.
- Audit log of admin actions.

**Authorization:**
- Server-side checks on every protected operation (never trust the client).
- Tenant isolation in multi-tenant apps (every query filters by tenant).
- Least-privilege roles.

**Data:**
- Encrypted at rest (managed DBs do this automatically).
- Encrypted in transit (TLS everywhere).
- Regular backups (Supabase/Neon do this; verify they exist).
- PII minimization (don't store what you don't need).
- Data deletion on user request (GDPR/CCPA).

**SOC 2:**
- Most B2B SaaS pursues SOC 2 Type II around 20–30 employees.
- Vanta or Drata automates ~80% of the work.
- Costs $10–30K for the audit + ongoing platform fees.
- Takes 3–6 months to achieve initial Type I; 6–12 months for Type II.

**Penetration testing:**
- Annual third-party pen test once you have meaningful customers.
- Costs $10–30K per engagement.
- Required by many enterprise customers' security questionnaires.

**Bug bounty:**
- Optional at this scale. HackerOne or Bugcrowd if you want one.
- Or just an "email security@company.com" address with a responsible disclosure policy.

### Phase 11: Maintenance and Scaling

**Weekly cadence:**
- Bug triage (Linear, Jira) — categorize new issues.
- Sprint review/planning — what shipped, what's next.
- Performance review — slowest endpoints, costliest queries.
- Cost review — Vercel/Supabase/Sentry/PostHog bills.

**Scaling Postgres:**
- **Indexes** for columns frequently filtered or sorted.
- **Read replicas** when read load becomes significant (Supabase, Neon support this).
- **Connection pooling** (PgBouncer, Supavisor) — essential in serverless environments.
- **Caching** (Upstash Redis) — reduce repeated queries.
- **Query optimization** — `EXPLAIN ANALYZE` slow queries; rewrite or add indexes.

**Scaling the app:**
- Vercel auto-scales serverless functions.
- Railway auto-scales containers.
- Add background job workers if queues are backing up.
- Add caching layers (Redis, CDN) before scaling compute.

**Cost optimization:**
- Move large data to R2 (no egress fees).
- Cache API responses aggressively.
- Use ISR or static generation where possible.
- Right-size your database tier.
- Audit unused services periodically.

---

## A Realistic Cost Breakdown

For a startup at ~$1M ARR with ~5,000 active users:

| Item                  | Monthly Cost     | Notes                            |
|-----------------------|------------------|----------------------------------|
| Vercel Team           | $20–500          | Scales with bandwidth & functions |
| Supabase Pro          | $25–500          | Scales with DB size + bandwidth  |
| Clerk                 | $25–300          | Per-MAU pricing                  |
| Sentry                | $30–200          | Per-event pricing                |
| PostHog               | $0–300           | Generous free tier               |
| Better Stack          | $30–100          | Logs + uptime + on-call          |
| Trigger.dev / Inngest | $20–200          | Background jobs                  |
| Resend                | $20–100          | Email volume                     |
| Stripe                | 2.9% + 30¢/txn   | Revenue-based                    |
| GitHub Team           | $4/user          | $40 for 10 engineers             |
| Linear                | $8/user          | $80 for 10 engineers             |
| Doppler               | $0–20/user       | Secrets                          |
| Vanta (if SOC 2)      | $300–1,000       | Compliance platform              |
| Domain + misc         | $20              |                                  |
| **Total**             | **$500–$3,500**  | Negligible vs payroll            |

For comparison, a single mid-level engineer costs $15–25K/month fully loaded. Infrastructure costs at this scale are noise.

---

## Sample Day-in-the-Life

Concrete example of a small-company engineer's day:

**9:00 AM** — Coffee + check Linear inbox. Reply to PM about acceptance criteria for the new feature.

**9:30 AM** — Stand-up (15 min): what I did yesterday, what I'll do today, blockers.

**9:45 AM** — Review two PRs from teammates. Approve one; leave comments on the other.

**10:30 AM** — Deep work: implementing the bulk export feature. Branch off main, write a Drizzle migration, write the Server Action, write the UI.

**12:00 PM** — Lunch.

**1:00 PM** — Push WIP branch, open draft PR for early feedback.

**1:30 PM** — Pair with another engineer on a tricky Stripe webhook bug. Find and fix.

**3:00 PM** — Back to bulk export. Write Playwright test for the critical path.

**4:00 PM** — Push, mark PR as ready. CI runs.

**4:30 PM** — Triage a new error in Sentry. Quick fix, separate PR.

**5:00 PM** — Wrap up. Tomorrow: address PR feedback, ship the export feature, start the next ticket.

This is the rhythm. Iterative, collaborative, focused.

---

## Common Pitfalls at This Scale

### Microservices Too Early

The single biggest mistake of growing startups. Microservices add:
- Network latency between services.
- Distributed debugging complexity.
- Deployment coordination.
- Operational overhead.
- Communication boundaries between teams (which is what they're for — but you don't have enough teams yet).

A modular monolith handles ~50 engineers comfortably. Most "we need microservices" pain is actually "we need cleaner module boundaries."

### Premature Scaling

Designing for 10M users when you have 100. Building elaborate caching layers, sharded databases, multi-region failover — for traffic levels a single Postgres handles trivially.

Build for 10x current scale. Re-architect when actual load demands it.

### Skipping Observability Until Something Breaks

By the time you wish you had Sentry, you've already had ten production bugs you didn't know about. Set up Sentry on day one.

### No Code Review

"We're moving fast" is not an excuse. Code review:
- Catches bugs.
- Spreads knowledge.
- Builds team culture.
- Forces clarity.

Even a 2-person team should review each other's work.

### Building Auth/Payments/Email From Scratch

Time spent building these is time not spent on your differentiator. Use Clerk, Stripe, Resend. The cost is trivial compared to engineering time.

### Ignoring Security Until Compelled

A breach can kill a startup — lost trust, lost customers, possible legal liability. Basic hygiene from day one (HTTPS, validated inputs, secrets management) is cheap.

### Hiring Specialists Too Early

A 10-person team needs generalists. Hiring a specialized DevOps engineer when nobody on the team can touch infrastructure creates a bottleneck.

### Process Theater

Daily standups that have become status reports nobody listens to. Weekly retros that produce action items nobody acts on. JIRA fields nobody fills in. Periodically prune.

### Tech Debt Avoidance

"We'll refactor next quarter" — three years in a row. Tech debt compounds. Allocate explicit time (10–20% per sprint) to maintenance and refactoring.

---

## When You're Outgrowing This Scale

Signs you're approaching the next stage:

- **Engineering org > 50 people.** Communication overhead is constant. Decisions take days, not hours.
- **Multiple teams routinely block each other.** "We're waiting on the platform team" becomes a regular phrase.
- **The monolith deploys are getting risky.** Every deploy touches code from 20 engineers.
- **You're considering microservices for real reasons.** Different teams need different deployment cadences; different services have wildly different scaling needs.
- **Compliance work is consuming significant time.** SOC 2, HIPAA, PCI all stack up.
- **You have on-call but it's exhausting.** A single engineer can't reasonably understand the whole system.

That's when **06-large-company-workflow.md** becomes relevant.

---

## Wrapping Up Part 5

Small-company web development in 2026 is a sweet spot. The tooling is mature, the patterns are well-understood, and a small team can ship genuinely impressive software:

- Pick the dominant stack (Next.js + Postgres + Vercel + Supabase + managed services).
- Build a modular monolith.
- Add process when missing it causes pain.
- Lean on managed services for everything not central to your differentiator.
- Maintain code quality through review and testing.
- Monitor production from day one.
- Plan for the next year, not the next decade.

The hardest discipline: resisting both extremes. Don't be sloppy like a personal project; don't be heavyweight like an enterprise. Stay in the middle, where execution speed is highest.

**Next:** Part 6 covers what changes when you scale to enterprise — hundreds of engineers, regulatory compliance, massive infrastructure.
