---
id: startup-checkpoint
title: Chapter 12 Checkpoint
sidebar_position: 30
sidebar_label: ✅ Checkpoint quiz
description: Mandatory checkpoint quiz for Chapter 11 — Startup / Small Co. 5 random questions drawn from a 15-question bank. Pass to unlock Chapter 13.
---

# Chapter 12 Checkpoint

You've finished the Startup chapter. Take a minute to make sure the core ideas stuck.

There are **15 questions in the bank** — each visit picks 5 at random, so retaking gives you different ones. If you miss one, the result card tells you exactly which page section to revisit, and the link highlights the paragraph for you.

You must pass (≥ 67%) to unlock the Next button and Chapter 12 in the sidebar.

<Quiz id="startup-checkpoint" title="Startup checkpoint" sampleSize={5}>

<Question
  prompt="The startup mindset is summarized as a single tension. What is it?"
  options={[
    { text: "Open source vs proprietary tooling" },
    { text: "Move fast, but don't accumulate fatal mistakes" },
    { text: "Hire fast, fire faster" },
    { text: "Ship to mobile first, then web" }
  ]}
  correct={1}
  explanation="The whole chapter is calibrated to that single tension. You can't be sloppy like a solo project (real customers churn) but you can't afford enterprise process either — every chapter section is finding the middle."
  revisit={{ to: "/docs/startup/mindset#the-five-guiding-principles", label: "Move fast, don't accumulate fatal mistakes" }}
/>

<Question
  prompt="At a 10-25 person startup, which hire usually appears around 15-20 engineers as shared infra pain gets too big to leave un-owned?"
  options={[
    { text: "A dedicated QA lead" },
    { text: "The first DevOps / platform engineer" },
    { text: "A VP of Engineering" },
    { text: "A frontend architect" }
  ]}
  correct={1}
  explanation="The first DevOps/platform engineer typically joins around 15-20 engineers — when flaky deploys, confusing bills, and missing staging story consume cross-team attention with no clear owner."
  revisit={{ to: "/docs/startup/team-structure#1025-person-team", label: "10-25 person team — first DevOps hire" }}
/>

<Question
  prompt="What is the recommended sprint and quarterly-planning cadence for a startup?"
  options={[
    { text: "One-week sprints with monthly OKRs" },
    { text: "Two-week sprints with quarterly OKRs (3-5 large goals per quarter)" },
    { text: "Six-week shape-up cycles with annual goals" },
    { text: "No sprints; only quarterly planning" }
  ]}
  correct={1}
  explanation="Two-week sprints are standard at this scale. Every three months, the team picks 3-5 large goals using OKRs — Objectives are aspirational, Key Results are measurable — which then cascade into the sprints."
  revisit={{ to: "/docs/startup/planning#sprints", label: "Sprints and quarterly OKRs" }}
/>

<Question
  prompt="What does the chapter recommend as the default component library for a 5-10 person startup?"
  options={[
    { text: "A fully custom in-house design system from day one" },
    { text: "shadcn/ui customized for brand, with components living in your own repo" },
    { text: "Material UI as a dependency" },
    { text: "Bootstrap with no customization" }
  ]}
  correct={1}
  explanation="shadcn/ui gives a fully-styled, accessible library you own (components live in your repo, not as a dependency). You customize colors and typography. Storybook-backed systems come later, but the path goes through shadcn, not around it."
  revisit={{ to: "/docs/startup/design#design-system-maturity-at-this-stage", label: "shadcn/ui as default" }}
/>

<Question
  prompt="The chapter calls the modular monolith the reigning 2026 pattern. What is its core promise?"
  options={[
    { text: "You can never split it later, so commit forever" },
    { text: "One deployable app with clean internal module boundaries, so a specific module can be cheaply extracted later if it truly outgrows the monolith" },
    { text: "It's the same as microservices but in one repository" },
    { text: "It eliminates the need for a database" }
  ]}
  correct={1}
  explanation="One Next.js app, internally organized so modules can later be split if and when they need to be. The worked example showed clean boundaries turning a three-month extraction into three weeks. Most modules never need extraction."
  revisit={{ to: "/docs/startup/architecture#the-modular-monolith", label: "Modular monolith" }}
/>

<Question
  prompt="The chapter lists a dominant 2026 stack (Next.js + TypeScript + Postgres + Drizzle + Vercel + Supabase + managed services). What's the claim about how far it scales?"
  options={[
    { text: "It tops out around 1,000 active users" },
    { text: "It handles roughly the first $10M+ in ARR for most modern SaaS, with minor adjustments rather than rewrites" },
    { text: "It only works for B2C apps" },
    { text: "It requires a rewrite past 5 engineers" }
  ]}
  correct={1}
  explanation="The page states this stack handles the first $10M+ ARR for most SaaS. Adjustments at that scale are usually read replicas, a queue + worker, and possibly one or two extracted modules — not rewriting everything."
  revisit={{ to: "/docs/startup/architecture#the-dominant-2026-small-company-stack", label: "Dominant 2026 stack scale claim" }}
/>

<Question
  prompt="The chapter calls one file sacred for onboarding. Which one?"
  options={[
    { text: ".env.example, kept as a contract listing every variable the app reads, so missing env vars never silently break new hires" },
    { text: "README.md, which must be over 10 pages" },
    { text: "package.json, which encodes onboarding steps in npm scripts" },
    { text: "Dockerfile, which fully reproduces the engineer's laptop" }
  ]}
  correct={0}
  explanation=".env.example is treated as a contract: every variable the app reads must appear there with a placeholder. CI should fail if a referenced env var is missing. Five minutes of discipline saves new hires hours of frustration."
  revisit={{ to: "/docs/startup/env-setup#secrets", label: ".env.example is sacred" }}
/>

<Question
  prompt="What does the chapter recommend when a feature is genuinely too large to fit in a 1-3 day branch?"
  options={[
    { text: "Keep the branch open as long as needed; long-lived branches are fine if the feature is big" },
    { text: "Either decompose into smaller mergeable steps, or merge incrementally behind a feature flag" },
    { text: "Skip code review to land it faster" },
    { text: "Merge the half-finished feature to main with a TODO comment" }
  ]}
  correct={1}
  explanation="Long-lived branches are technical debt — main drifts away, conflicts pile up, the merge becomes a high-risk event. The fix is to decompose the work or hide an incremental version behind a flag, almost never to keep the branch open."
  revisit={{ to: "/docs/startup/development#branching-strategy-trunk-based-development", label: "Trunk-based development" }}
/>

<Question
  prompt="The chapter rejects a fixed coverage target (e.g., 80%). What's the actual question it says drives the test suite?"
  options={[
    { text: "What percentage of files contain at least one test" },
    { text: "Would I sleep through the night with this test suite? — which depends on critical paths (payments, auth, data integrity) being well-tested" },
    { text: "How many tests run per CI minute" },
    { text: "Whether QA signs off on coverage numbers each sprint" }
  ]}
  correct={1}
  explanation="Chasing 90% coverage produces brittle tests for trivial getters and edge cases nobody hits. The real question is whether the suite covers the things that would actually hurt the business — payments, auth, data integrity — exhaustively. Test most other code lightly."
  revisit={{ to: "/docs/startup/testing#coverage-targets", label: "Coverage isn't the goal" }}
/>

<Question
  prompt="In the CI workflow example, why is the e2e job marked with needs: validate?"
  options={[
    { text: "To run e2e on a more powerful runner" },
    { text: "To wait until lint, types, unit/integration tests, and the build all pass before spending minutes on Playwright" },
    { text: "To hide the job from external contributors" },
    { text: "To cache the Playwright browser binaries" }
  ]}
  correct={1}
  explanation="needs: validate gates the expensive Playwright job behind the cheap validate job. If lint, types, tests, or build fails, you don't waste CI minutes spinning up headless Chromium."
  revisit={{ to: "/docs/startup/cicd#a-typical-workflow-file", label: "needs: validate" }}
/>

<Question
  prompt="When does the chapter say Railway or Render (Pattern B) is the better hosting choice over Vercel + Supabase?"
  options={[
    { text: "Whenever you have under 100 users" },
    { text: "When you need predictable per-month bills or long-running processes like WebSocket servers" },
    { text: "Whenever you want global edge presence" },
    { text: "Only when Vercel rejects your account" }
  ]}
  correct={1}
  explanation="Railway/Render charge for compute rather than per request, giving predictable bills, and they support long-running processes that serverless can't. The trade-off is no global edge by default — you may need to bolt on a separate CDN."
  revisit={{ to: "/docs/startup/deployment#pattern-b-railway--render-more-flexible", label: "Pattern B — Railway / Render" }}
/>

<Question
  prompt="Why does the chapter insist post-mortems be blameless?"
  options={[
    { text: "It's a soft cultural nicety with no operational benefit" },
    { text: "The moment people fear post-mortems, they hide near-misses — and hidden near-misses become future incidents" },
    { text: "HR requires it for legal reasons" },
    { text: "Naming individuals violates SOC 2" }
  ]}
  correct={1}
  explanation="The reason is practical, not soft. Fear of blame makes engineers hide near-misses, which become future incidents. Blameless writing trades the small dopamine hit of assigning fault for an honest learning culture that surfaces problems early."
  revisit={{ to: "/docs/startup/observability#on-call", label: "Blameless post-mortems" }}
/>

<Question
  prompt="A PR adds a new admin-only endpoint under /api/admin. The author argues route-level middleware already blocks non-admins, so the handler doesn't need its own check. What does the chapter say?"
  options={[
    { text: "The author is right — middleware is sufficient" },
    { text: "Re-check authorization server-side inside every protected handler, regardless of upstream guards — that's defense in depth" },
    { text: "Use a client-side check instead" },
    { text: "Only worry about it after a real breach" }
  ]}
  correct={1}
  explanation="The worked example shows the reviewer demanding a server-side isAdmin check inside the handler even with middleware in place. Middleware can be bypassed; defense in depth means every protected operation re-verifies authorization itself."
  revisit={{ to: "/docs/startup/security#authorization", label: "Defense in depth — authorization" }}
/>

<Question
  prompt="When Postgres starts to struggle under growth, what order does the chapter recommend?"
  options={[
    { text: "Split into microservices, then re-architect, then add a database cache" },
    { text: "Add indexes on scanned columns, then a connection pool (PgBouncer/Supavisor), then a Redis cache in front of hot endpoints — before any re-architecting" },
    { text: "Immediately migrate from Postgres to a NoSQL store" },
    { text: "Add Kubernetes and scale the app tier first" }
  ]}
  correct={1}
  explanation="Most we need to re-architect pain dissolves once Postgres is properly tuned: index the scanned columns, add a pooler for serverless connection exhaustion, cache hot endpoints with Redis. Re-architecting is a last resort, not a first one."
  revisit={{ to: "/docs/startup/maintenance#scaling-postgres", label: "Scale Postgres before re-architecting" }}
/>

<Question
  prompt="The chapter names a single biggest mistake of growing startups. Which is it?"
  options={[
    { text: "Picking TypeScript over JavaScript" },
    { text: "Microservices too early — adding network latency, distributed debugging, and deploy coordination to solve organizational problems you don't yet have" },
    { text: "Choosing Vercel over self-hosting" },
    { text: "Hiring a designer before a PM" }
  ]}
  correct={1}
  explanation="Microservices too early is named the single biggest mistake. A modular monolith handles ~50 engineers comfortably; most we need microservices pain is actually we need cleaner module boundaries. The worked example showed a 12-engineer team merging services back into a monolith and recovering velocity."
  revisit={{ to: "/docs/startup/pitfalls#microservices-too-early", label: "Microservices too early" }}
/>

</Quiz>

---

## What's next

→ Continue to [Chapter 13: Enterprise](/docs/enterprise) for a contrast: same problems, very different solutions at 500+ engineers.
