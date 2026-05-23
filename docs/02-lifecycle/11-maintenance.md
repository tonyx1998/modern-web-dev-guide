---
id: maintenance
title: 'Phase 11: Maintenance, Iteration & Scaling'
sidebar_position: 12
sidebar_label: 11. Maintenance
description: Keep the product working and improving over time. The longest phase by far — often 80% of total engineering effort.
---

# Phase 11: Maintenance, Iteration & Scaling

> **In one line:** Once a product exists, the *real* work begins. Bug fixes, security patches, dependency updates, refactors, migrations, incident response — for years. This is what most working developers spend most of their time on.

:::tip[In plain English]
There's a misconception that "real software engineering" is the building phase. It's not. **Most engineering work happens after launch.** Fixing bugs you didn't anticipate. Patching libraries with new vulnerabilities. Refactoring code that no longer fits. Migrating to new frameworks because the old ones became unmaintainable. Responding to outages at 3am. Writing post-mortems. This is the *day job* for working engineers — and it's where most of your career growth will happen.
:::

## Why maintenance matters

For most products, **80% of total engineering effort happens after launch.** The work includes:

- Bug fixes
- Customer support escalations
- Security patches
- Dependency updates
- Performance optimization
- New features
- Tech debt repayment
- Infrastructure scaling
- Documentation upkeep
- Refactoring
- Migrations to new tech
- Incident response and post-mortems
- Compliance and audit work

## Bug triage

Bugs flow in from multiple sources: customer support, internal use, error tracking, monitoring alerts. A triage process:

| Question                | Determines                                  |
|------------------------|---------------------------------------------|
| **Severity?**           | Critical (production broken), High (major feature broken), Medium, Low |
| **Reproducibility?**    | Can you reliably make it happen?            |
| **Impact?**             | How many users? How frequent?               |
| **Workaround?**         | Is there a way to mitigate while fixing?   |

High-severity bugs get fixed immediately. Lower-severity ones go into a backlog and are addressed by priority.

## Dependency management

JavaScript projects often have 1,000+ transitive dependencies. Keeping them current is constant work:

- **Dependabot / Renovate** open PRs for outdated dependencies automatically.
- **Security advisories:** GitHub alerts on known vulnerabilities.
- **Lockfile audits:** `bun audit`, `npm audit`, `pnpm audit`.

The right cadence: **weekly updates for most projects. Daily for security-sensitive ones.**

## Scaling

When traffic grows, infrastructure must adapt:

**Vertical scaling:** Bigger machines. Simple, has limits, expensive at the high end.

**Horizontal scaling:** More machines. Requires the app to be stateless or use shared state (Redis, etc.).

**Database scaling:**
- **Read replicas** — Multiple read-only copies; reads scale linearly.
- **Connection pooling** (PgBouncer, Supavisor) — Handle thousands of clients with few DB connections.
- **Caching** (Redis) — Reduce DB load.
- **Sharding** — Split data across multiple DBs (very complex; last resort).

**Caching:**
- **CDN cache** — Static assets, sometimes HTML.
- **In-memory cache** (Redis) — Frequently accessed data.
- **Application cache** — In-process; fast but limited to one server.
- **HTTP caching** — `Cache-Control` headers; the most underused win.

**Async work:**
- Move slow operations off the request path (background jobs).
- Use queues (BullMQ, Trigger.dev, SQS) for reliability.

## Tech debt

Every codebase accumulates debt — quick decisions that need revisiting, abstractions that no longer fit, libraries that fell out of fashion.

**Managing tech debt:**
- Track it explicitly (in your issue tracker, not just in heads).
- Allocate time (10–20% of capacity) to it every sprint.
- Tie payback to business value when possible ("this refactor unblocks feature X").
- **Big rewrites are usually disasters; prefer incremental refactoring.**

## Migrations

Inevitable at any company older than a few years:

- Moving to a new framework version
- Switching ORMs
- Changing databases
- Reorganizing a monolith into services (or services back into a monolith)
- Replacing a third-party service

Successful migrations:
- **Run old and new in parallel** (dual-writing during the transition).
- **Migrate gradually** (feature by feature, user by user).
- **Have a rollback plan** at every step.
- **Test against production data** copies.

## Incident response

When things break in production:

1. **Acknowledge** — On-call engineer responds to the page.
2. **Triage** — How bad? How many users? Is it spreading?
3. **Mitigate** — Stop the bleeding (often rollback or feature flag off).
4. **Diagnose** — What's actually wrong?
5. **Fix** — Real fix, then deploy.
6. **Post-mortem** — Write up what happened, what we learned, what we'll change.

:::info[Highlight: blameless post-mortems]
Post-mortems should be **blameless** — focus on systems and processes, not individuals. People make mistakes; resilient systems tolerate them.

Bad post-mortem: "Alice deployed a bad change that took down checkout."

Good post-mortem: "A change passed CI but had a runtime bug that only manifested on production data. Our staging env didn't have a copy of representative production data. Action item: weekly staging refresh from production-anonymized backup."

The first blames a person; the second improves the system. Only the second prevents the next outage.
:::

## Common anti-patterns

- **Treating maintenance as second-class work.** Engineers want to build new things; without explicit incentives, maintenance gets neglected.
- **No on-call rotation.** Everything ends up on the most senior engineer's plate.
- **Big-bang migrations.** Trying to switch frameworks in one PR. Disaster.
- **Ignoring tech debt.** It compounds until you can't ship new features.
- **No post-mortems.** Same incidents recur.
- **Blame culture.** People hide mistakes; learning stops.

## Common mistakes

:::caution[Where people commonly trip up]
- **Letting Dependabot PRs queue up unread.** After a few weeks you have 40 open PRs, no idea which are safe, and a CVE buried in the pile. Either auto-merge patch updates with passing CI, or carve out a weekly hour to triage — letting them stack is the worst option.
- **Blaming the engineer instead of the system in post-mortems.** "Alice pushed a bad change" feels like an answer; it isn't. The real question is why CI, review, staging, and feature flags all let it through. Blameless analysis isn't being nice — it's the only mode that finds the *next* incident before it happens.
- **Treating big rewrites as the solution to messy code.** Joel Spolsky's "Things You Should Never Do" was published in 2000 and is still right in 2026 — the rewritten version takes longer than expected, ships fewer features, and recreates most of the old bugs. Refactor incrementally; rewrite only the smallest layer that's truly intractable.
- **Doing migrations in one big switchover.** A weekend cut-over from MySQL to Postgres, or Redux to Zustand, sounds heroic and reliably fails. Dual-write, dual-read, gradually shift traffic, then delete the old path. Boring, slow, ships.
- **No on-call rotation, so one person quietly owns everything.** That person burns out, leaves, and takes the operational knowledge with them. Even a two-person rotation with a shared runbook spreads the knowledge and keeps the system survivable when someone takes a vacation.
:::

## Page checkpoint

<Quiz id="lifecycle-maintenance-page" title="Did maintenance stick?" sampleSize={2}>

<Question
  prompt="Roughly what share of total engineering effort does the page say happens after a product's launch?"
  options={[
    { text: "About 10% — building is most of the work" },
    { text: "About 50% — it's an even split" },
    { text: "About 80% — most engineering work happens after launch" },
    { text: "It depends entirely on the framework" }
  ]}
  correct={2}
  explanation="Bug fixes, security patches, dependency churn, migrations, refactors, and incident response dwarf the original build. Most working engineers spend most of their careers here."
  revisit={{ to: "/docs/lifecycle/maintenance#why-maintenance-matters", label: "Why maintenance matters" }}
/>

<Question
  prompt="What does the page mean by a 'blameless' post-mortem?"
  options={[
    { text: "Nobody attends — it's written by a manager" },
    { text: "It focuses on systems and processes rather than naming individuals as the cause" },
    { text: "It hides the incident from the rest of the company" },
    { text: "It skips action items so nobody feels singled out" }
  ]}
  correct={1}
  explanation="The page's example: 'Alice deployed a bad change' blames a person; 'staging didn't mirror production data' improves the system. Only the second prevents the next outage."
  revisit={{ to: "/docs/lifecycle/maintenance#incident-response", label: "Blameless post-mortems" }}
/>

<Question
  prompt="The page recommends a specific approach to tech debt. Which one?"
  options={[
    { text: "Schedule a big rewrite every two years" },
    { text: "Ignore it until features stop shipping" },
    { text: "Track it explicitly and allocate 10-20% of capacity to it every sprint, preferring incremental refactoring" },
    { text: "Pay it down only when management complains" }
  ]}
  correct={2}
  explanation="Tech debt compounds. Continuous, small, business-aligned paydown beats big-bang rewrites — which are usually disasters."
  revisit={{ to: "/docs/lifecycle/maintenance#tech-debt", label: "Managing tech debt" }}
/>

<Question
  prompt="What's the page's recipe for a successful large migration?"
  options={[
    { text: "Flip the switch in one big PR over a weekend" },
    { text: "Run old and new in parallel, migrate gradually, keep a rollback plan at every step, and test against production-data copies" },
    { text: "Freeze all other development until the migration finishes" },
    { text: "Hire a consultant to do it without involving the team" }
  ]}
  correct={1}
  explanation="Dual-writing, gradual cutover, and reversibility turn 'terrifying migration' into 'boring sequence of small deploys'. Big-bang migrations are an anti-pattern the page calls out explicitly."
  revisit={{ to: "/docs/lifecycle/maintenance#migrations", label: "Migrations" }}
/>

</Quiz>

## Wrapping up Part 2

The eleven phases — discovery, design, architecture, setup, implementation, testing, review, CI/CD, deployment, observability, maintenance — are present in every project. The scale of each phase varies dramatically, but the rhythm is universal.

Internalizing this lifecycle gives you a mental model for *any* project:

- "We're in implementation; testing comes next."
- "We're spending too long on planning; ship something and iterate."
- "We're missing observability; we need to fix that before scaling."

→ **Next chapter:** [Part 3: The Tech Stack, Decoded](/docs/stack) — every major piece of the 2026 tech stack, explained in detail.
