---
id: frontend-architecture
title: 'Phase 2.5: Frontend Architecture at Scale'
sidebar_position: 6
sidebar_label: 5. Frontend at Scale
description: Design systems, micro-frontends, shared infrastructure, and performance budgets for enterprise frontends.
---

# Phase 2.5: Frontend Architecture at Scale

> **In one line:** Enterprise frontend is its own discipline — a versioned design system, micro-frontends owned by independent teams, shared SSR and analytics infrastructure, and strict performance budgets.

:::tip In plain English
A startup frontend is one Next.js repo. An enterprise frontend is dozens of teams shipping pieces of the same UI, all using the same shared component library, all measured against the same performance budget.

The hardest problem isn't the code — it's keeping the UI feeling like *one product* when hundreds of engineers are working on different pieces of it. That's what design systems and shared frontend infrastructure exist to solve.
:::

## Design system as code

- A private npm package (or set of packages) used by all product teams.
- Versioned semantically.
- Hundreds of components.
- Owned by a dedicated team with PMs and designers.
- Storybook for documentation and visual regression testing.
- Design tokens shared with Figma via tooling.

The design system is a *product*. Its users are internal engineers. It has releases, deprecations, migration guides, and adoption metrics.

## Micro-frontends

For very large apps, different teams ship independent UI pieces:

- **Module federation** (Webpack/Turbopack) allows runtime composition.
- **Iframes or web components** for stronger isolation.
- Trade-off: independent deploys per team vs. some duplication and complexity.

Micro-frontends are not free. They add complexity to routing, auth, analytics, and shared state. Most companies should resist them until the org pain of a monolithic frontend is genuinely worse than the runtime complexity of micro-frontends.

:::info Highlight: micro-frontends solve a *people* problem, not a *code* problem
The honest reason micro-frontends exist is that **a single frontend codebase shared by 50 teams is a coordination nightmare** — every deploy is a merge train, every conflict blocks 50 people.

Micro-frontends let each team deploy independently. The cost is real (bundle duplication, harder cross-cutting changes, more complex auth) but it's worth it once team coordination dominates engineering velocity.

If you're choosing micro-frontends and you have fewer than ~10 product teams, you're solving a problem you don't yet have.
:::

## Shared infrastructure

Frontend at scale relies on shared infrastructure provided by platform teams:

- **SSR rendering platform** (sometimes built in-house, e.g., Airbnb's Hypernova).
- **A/B testing framework.**
- **Analytics instrumentation.**
- **Feature flags.**
- **Error reporting.**
- **Performance monitoring (RUM).**
- **Internationalization (i18n) tooling.**

Each of these is a product, often built by a dedicated team. Product engineers use them via internal SDKs that hide the underlying complexity.

## Performance budgets

- Specific limits on bundle size, time-to-interactive, largest contentful paint.
- Automated alerts when budgets are exceeded.
- Tied to release approvals.

A performance budget is a hard constraint: "our login page must be interactive in under 2 seconds at the 75th percentile, on a 4G connection, on a $200 Android phone." If a PR pushes a metric over the budget, CI fails and the change has to be rethought.

:::note Worked example: a design-system upgrade rollout
A design system team wants to ship a major upgrade (v3 with new tokens, new accessibility primitives, breaking changes to ~20 components):

1. **Pre-release:** v3-beta published; one product team adopts it as a guinea pig.
2. **Migration tooling:** Codemods written for the breaking changes (rename props, adjust imports).
3. **Deprecation warnings:** v2 stays available but logs warnings; dashboard tracks adoption.
4. **Rollout window:** All teams given a quarter to migrate. Migration tracker visible to all directors.
5. **End of life:** After two quarters, v2 stops receiving security patches; finally removed when 100% adoption.

Six months end-to-end for what would take an afternoon at a startup. But the cost of forcing 200 engineers to fix breaking changes simultaneously would be far higher than the cost of a careful rollout.
:::

## What's next

→ Continue to [Phase 3: Developer Experience](./developer-experience) to see how internal platforms make this whole machine usable.
