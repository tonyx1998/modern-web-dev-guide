---
id: personal-website-workflow
title: 4. Personal Website Workflow — Overview
sidebar_position: 1
sidebar_label: Overview
description: Solo developers, personal sites, side projects. Free tiers, minimal ops, maximum shipping speed.
---

# Part 4: Personal Website / Side Project Workflow

*Solo developer, low budget, maximum shipping speed.*

This chapter walks through how an individual developer plans, builds, ships, and maintains a personal website or side project in 2026. The principles here apply to portfolios, blogs, hobby SaaS, indie tools, learning projects, and any other one-person endeavor.

The whole goal: **spend your time on the actual product, not infrastructure.** Modern free tiers and managed services let one person ship what would have required a team a decade ago.

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

## How this chapter is organized

Each page focuses on a single phase or topic of the solo workflow. Read them in order the first time; revisit any single page later when you need a refresher.

### Pages in this chapter

1. [The Personal Project Mindset](/docs/solo/mindset) — Why enterprise patterns destroy personal projects.
2. [Common Personal Project Types](/docs/solo/project-types) — Portfolios, blogs, hobby SaaS, tools, learning projects.
3. [Phase 1: Planning](/docs/solo/planning) — An afternoon, not a month.
4. [Phase 2: Stack Selection](/docs/solo/stack-selection) — The 2026 default stack, and why.
5. [Phase 3: Environment Setup](/docs/solo/env-setup) — One hour to a deployed empty project.
6. [Phase 4: Development](/docs/solo/development) — Server/Client Components, Server Actions, the inner loop.
7. [Phase 5: Adding Auth](/docs/solo/auth) — Clerk in twenty minutes.
8. [Phase 6: Payments](/docs/solo/payments) — Stripe Checkout + a webhook.
9. [Phase 7: Deployment](/docs/solo/deployment) — Custom domain, preview URLs, environments.
10. [Phase 8: Observability](/docs/solo/observability) — Sentry, Vercel Analytics, PostHog, uptime.
11. [Phase 9: Launching](/docs/solo/launching) — Soft launches, pricing, marketing pages.
12. [Phase 10: Maintenance](/docs/solo/maintenance) — Weekly cadence, performance, costs.
13. [Realistic Time Investment](/docs/solo/time-investment) — How long an indie SaaS v1 actually takes.
14. [Common Pitfalls](/docs/solo/pitfalls) — Over-engineering, stack churn, not shipping.
15. [Pre-Built Templates Worth Knowing](/docs/solo/templates) — When not to start from scratch.
16. [A Sample Two-Weekend Project](/docs/solo/sample-project) — A concrete schedule.
17. [When to Graduate Beyond "Personal Project"](/docs/solo/graduating) — Signs you're outgrowing solo habits.

---

When you finish all 17 pages, move on to [Chapter 5: Small Company Workflow](/docs/startup).
