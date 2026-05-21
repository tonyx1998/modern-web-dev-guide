---
id: decision-frameworks
title: 8. Decision Frameworks — Overview
sidebar_position: 1
sidebar_label: Overview
description: How to actually choose. Boring-technology rule, reversibility, team-size heuristics, cost of inaction.
---

# Part 8: Decision Frameworks

*How to actually make technology and architecture choices well.*

> **In one line:** Engineering decisions are mostly about restraint — preferring proven tools, deliberating proportionally to reversibility, and quantifying the cost of doing *nothing*.

:::tip In plain English
Most developers make bad choices because they pick technology based on what's trendy on Hacker News, what a famous YouTuber praised, or what the most senior person on the team likes. None of those are good reasons. This chapter teaches you to choose like a thoughtful engineer: boring tech for everything that isn't your differentiator, slow deliberation for one-way doors, fast deliberation for reversible ones, and a real cost-of-inaction calculation before any big refactor.
:::

## Why this chapter exists

Every project requires hundreds of decisions: what framework, which database, monolith or microservices, build or buy, refactor now or later. The wrong decisions compound; the right ones quietly enable everything that follows.

This chapter is a collection of frameworks for making these decisions well. They're general-purpose — apply them to any scale, any technology, any role.

:::info Jargon used throughout this chapter
- **Innovation token** — a unit of attention/risk you can "spend" by adopting an unfamiliar technology. Each team has a small budget per project.
- **One-way door / two-way door** — Jeff Bezos's terms for *Type 1* (irreversible) and *Type 2* (reversible) decisions.
- **Modular monolith** — a single deployable application internally organized into modules with clear boundaries — the default architecture for small/medium teams (contrast with *microservices*).
- **RFC (Request for Comments)** — a written design proposal that's reviewed by peers before adoption. Common at 50+ person orgs.
- **ADR (Architecture Decision Record)** — a short document logging *why* an architecture decision was made and what alternatives lost. Stored next to the code.
- **Cargo-culting** — copying a practice without understanding why it worked elsewhere. The #1 cause of imported-process pain.
- **Strangler fig** — incremental migration pattern where the new system grows around the old one until the old one can be removed (named after the tree).
- **Conway's law** — "any organization that designs a system will produce a design whose structure mirrors the organization's communication structure." Your team shape becomes your system shape.
:::

:::info Highlight: the single most important principle
**Boring technology beats exciting technology in almost every situation that matters.** Postgres in 2026 is still Postgres because it's reliable, well-documented, and well-understood. "Just use Postgres" is unglamorous, correct advice you'll hear for the rest of your career.

When two options seem roughly equal, pick the one that's been around longer, has more documentation, and is easier to undo.
:::

:::note Worked example: the mental model
Engineering decisions are like dietary choices for an athlete. You don't pick the new TikTok superfood. You stick with proven nutrition (lean protein, vegetables, complex carbs) and only experiment when the basics are dialed in.

In tech terms: you don't pick the new framework that's three months old. You stick with Postgres, React, TypeScript, and a managed host — and only spend an "innovation token" when something genuinely differentiates your product.
:::

## How this chapter is organized

Each page focuses on **one framework** with concrete examples and applicable advice. Read them in order the first time; revisit any single page later when you need a refresher.

### The big-picture frameworks

1. [The Boring Technology Rule](./boring-technology) — Save innovation tokens for the thing that differentiates your product.
2. [The Reversibility Test](./reversibility) — Deliberate proportionally to how hard a decision is to reverse.
3. [The Team Size Heuristic](./team-size-heuristic) — Your team's size constrains what's optimal.

### Build, buy, and team shape

4. [The Build vs Buy Decision](./build-vs-buy) — Default to buying for non-core capabilities.
5. [The Two-Pizza Rule](./two-pizza-rule) — Small teams ship faster.

### Why and when

6. [The "Why Now?" Question](./why-now) — A concrete problem, not "it would be cool."
7. [The Cost-of-Inaction Calculation](./cost-of-inaction) — The hidden cost of *not* deciding.

### Refactors and rewrites

8. [The Migration Strategy Framework](./migration-strategy) — Incremental migrations work; big-bang rewrites usually don't.
9. [The "Two Versions of the Same Code" Principle](./two-versions) — When to extract, when to leave duplication alone.
10. [The Premature Optimization Principle](./premature-optimization) — Work, right, fast — in that order.

### Communicating and revisiting decisions

11. [The Documentation Trade-Off](./documentation-tradeoff) — Document what doesn't change, not what does.
12. [The "What Would Hurt to Change" Question](./what-would-hurt) — Practical reversibility check.
13. [The "Why Are You Doing This?" Question](./why-doing-this) — Connect every change to a real outcome.

### Practical constraints

14. [The Hiring-Constraint Principle](./hiring-constraint) — Pick technologies your future self can hire for.

### Putting it together

15. [A Decision-Making Checklist](./checklist) — Ten questions for any significant decision.
16. [When to Override These Frameworks](./overriding) — Heuristics, not laws.

---

When you finish all 16 pages, move on to [Chapter 9: AI Integration](/docs/ai).
