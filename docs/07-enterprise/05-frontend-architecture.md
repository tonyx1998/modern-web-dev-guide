---
id: frontend-architecture
title: 'Phase 2.5: Frontend Architecture at Scale'
sidebar_position: 6
sidebar_label: 5. Frontend at Scale
description: Design systems, micro-frontends, shared infrastructure, and performance budgets for enterprise frontends.
---

# Phase 2.5: Frontend Architecture at Scale

> **In one line:** Enterprise frontend is its own discipline — a versioned design system, micro-frontends owned by independent teams, shared SSR and analytics infrastructure, and strict performance budgets.

:::tip[In plain English]
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

:::info[Highlight: micro-frontends solve a *people* problem, not a *code* problem]
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

:::note[Worked example: a design-system upgrade rollout]
A design system team wants to ship a major upgrade (v3 with new tokens, new accessibility primitives, breaking changes to ~20 components):

1. **Pre-release:** v3-beta published; one product team adopts it as a guinea pig.
2. **Migration tooling:** Codemods written for the breaking changes (rename props, adjust imports).
3. **Deprecation warnings:** v2 stays available but logs warnings; dashboard tracks adoption.
4. **Rollout window:** All teams given a quarter to migrate. Migration tracker visible to all directors.
5. **End of life:** After two quarters, v2 stops receiving security patches; finally removed when 100% adoption.

Six months end-to-end for what would take an afternoon at a startup. But the cost of forcing 200 engineers to fix breaking changes simultaneously would be far higher than the cost of a careful rollout.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Treating the design system as a Figma file shared with engineering.** Without versioned packages, codemods, deprecation warnings, and adoption dashboards, "the design system" is just a wiki. Components drift, divergent forks appear in three repos, and the "shared UI" turns into a 200-engineer telephone game.
- **Reaching for micro-frontends to fix a slow deploy.** Slow deploys are usually a CI problem, not an architecture problem. Splitting your frontend into ten independently deployed shells adds bundle duplication, auth complexity, and cross-cutting upgrade pain — and your CI is still slow.
- **Setting performance budgets nobody is on the hook for.** A budget without a named owner per metric is just a graph. Pick a team that owns LCP for the home page, give them a real lever (codemods, infrastructure changes), and let them say "no" to PRs that regress it.
- **Letting each team pick its own framework "for now."** Five years later you're maintaining React 17, React 19, Vue 3, and someone's Svelte experiment, plus four routers, four data layers, and four sets of accessibility bugs. Pick the menu; let teams choose from it.
- **Versioning the design system without owning the migration.** Shipping v3 with breaking changes and emailing teams to "please upgrade" produces a permanently fragmented codebase. The design system team owns the codemods *and* the dashboard *and* the deadline — not just the new components.
:::

## Page checkpoint

<Quiz id="enterprise-frontend-architecture-page" title="Did frontend architecture stick?" sampleSize={2}>

<Question
  prompt="The page argues micro-frontends primarily solve which kind of problem?"
  options={[
    { text: "A performance problem — they make pages load faster" },
    { text: "A people/coordination problem — they let independent teams deploy without merge trains" },
    { text: "A security problem — they sandbox malicious code" },
    { text: "A SEO problem — search engines prefer them" }
  ]}
  correct={1}
  explanation="Micro-frontends solve a coordination nightmare: a single codebase shared by 50 teams turns every deploy into a merge train. They have real costs (bundle duplication, harder cross-cutting changes) and aren't worth it until team coordination dominates engineering velocity."
  revisit={{ to: "/docs/enterprise/frontend-architecture#micro-frontends", label: "Micro-frontends" }}
/>

<Question
  prompt="How is an enterprise design system best described?"
  options={[
    { text: "A static Figma file shared with engineering" },
    { text: "An internal product — versioned packages with PMs, designers, deprecations, migration guides, and adoption metrics" },
    { text: "A wiki page listing approved colors and fonts" },
    { text: "A linter rule enforced in CI" }
  ]}
  correct={1}
  explanation="A design system at this scale is a product. It has internal users (engineers), versioned releases, deprecations, migration guides, and adoption metrics — owned by a dedicated team with PMs and designers, not just a Figma file."
  revisit={{ to: "/docs/enterprise/frontend-architecture#design-system-as-code", label: "Design system as code" }}
/>

<Question
  prompt="What does a performance budget actually do in CI?"
  options={[
    { text: "It tracks how much engineering time is spent on performance" },
    { text: "It fails the build when bundle size, time-to-interactive, or LCP exceed defined limits" },
    { text: "It allocates cloud spend to the frontend team" },
    { text: "It schedules performance audits quarterly" }
  ]}
  correct={1}
  explanation="A performance budget is a hard constraint with specific numeric limits — bundle size, time-to-interactive, LCP at a specific percentile on a specific device. If a PR pushes a metric over the budget, CI fails and the change has to be rethought."
  revisit={{ to: "/docs/enterprise/frontend-architecture#performance-budgets", label: "Performance budgets" }}
/>

<Question
  prompt="If you have fewer than about 10 product teams, what does the page recommend about micro-frontends?"
  options={[
    { text: "Adopt them immediately to future-proof the codebase" },
    { text: "Resist them — you're solving a problem you don't yet have" },
    { text: "Adopt them only for the marketing site" },
    { text: "Use module federation as a partial step" }
  ]}
  correct={1}
  explanation="Micro-frontends add real complexity (routing, auth, analytics, shared state). If you have fewer than ~10 product teams, the coordination cost of a monolithic frontend hasn't yet exceeded that complexity — you're inventing problems."
  revisit={{ to: "/docs/enterprise/frontend-architecture#micro-frontends", label: "When to adopt" }}
/>

</Quiz>

## What's next

→ Continue to [Phase 3: Developer Experience](./developer-experience) to see how internal platforms make this whole machine usable.
