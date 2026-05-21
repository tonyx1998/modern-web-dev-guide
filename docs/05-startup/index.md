---
id: small-company-workflow
title: 5. Small Company Workflow — Overview
sidebar_position: 1
sidebar_label: Overview
description: Startups and small companies (5–50 people). Real product, paying customers, managed services.
---

# Part 5: Small Company / Startup Workflow (5–50 People)

*Real product, paying customers, small team, balancing speed and quality.*

This chapter covers the workflow for actual companies — startups and small businesses with engineering teams between five and fifty people. There's a real product, real customers, and real money involved, but the operational scale doesn't yet justify enterprise-grade infrastructure.

The defining characteristic of this stage: **everything must work, but nothing should require a dedicated team to operate.** You're optimizing for the smallest team that can ship and maintain real software.

:::tip[Beginner orientation]
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

## How this chapter is organized

Each page focuses on a single topic or phase. Read them in order the first time; revisit any single page later when you need a refresher.

### Pages in this chapter

1. [The Small Company Mindset](/docs/startup/mindset) — Between personal-project sloppiness and enterprise heaviness.
2. [Team Structure at This Scale](/docs/startup/team-structure) — 5, 25, and 50 person org shapes.
3. [Phase 1: Discovery & Planning](/docs/startup/planning) — PRDs, sprints, OKRs at startup scale.
4. [Phase 2: Design](/docs/startup/design) — Figma, design systems, engineering collaboration.
5. [Phase 3: Architecture](/docs/startup/architecture) — The modular monolith, the 2026 stack, RFCs.
6. [Phase 4: Environment Setup](/docs/startup/env-setup) — Monorepo, onboarding, three environments, secrets.
7. [Phase 5: Development Practices](/docs/startup/development) — Trunk-based development, conventional commits, feature flags, migrations.
8. [Phase 6: Testing Strategy](/docs/startup/testing) — Vitest, Playwright, the testing pyramid, manual QA.
9. [Phase 7: CI/CD](/docs/startup/cicd) — GitHub Actions, branch protection, hot fixes.
10. [Phase 8: Deployment & Infrastructure](/docs/startup/deployment) — Three popular hosting patterns and how to pick.
11. [Phase 9: Observability](/docs/startup/observability) — Sentry, logs, uptime, product analytics, on-call.
12. [Phase 10: Security and Compliance](/docs/startup/security) — Daily hygiene, SOC 2, pen testing.
13. [Phase 11: Maintenance and Scaling](/docs/startup/maintenance) — Weekly cadence, scaling Postgres, cost optimization.
14. [A Realistic Cost Breakdown](/docs/startup/cost-breakdown) — What a $1M ARR startup actually spends.
15. [Sample Day-in-the-Life](/docs/startup/day-in-life) — A concrete startup engineer's day.
16. [Common Pitfalls at This Scale](/docs/startup/pitfalls) — Microservices too early, premature scaling, process theater.
17. [When You're Outgrowing This Scale](/docs/startup/outgrowing) — Signs you're approaching the enterprise stage.

---

When you finish all 17 pages, move on to [Chapter 6: Large Company Workflow](/docs/enterprise).
