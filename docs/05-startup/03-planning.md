---
id: planning
title: 'Phase 1: Discovery & Planning'
sidebar_position: 4
sidebar_label: 3. Planning
description: PRDs in Notion or Linear, two-week sprints, quarterly OKRs. The lightweight planning that supports a startup engineering team.
---

# Phase 1: Discovery & Planning

> **In one line:** A 1–3 page PRD in Notion or Linear, two-week sprints, and OKRs every quarter. Enough structure to align a team, not so much it slows shipping.

:::tip[In plain English]
At a startup, planning has to scale beyond "a paragraph in Notes.app" because more than one person needs to read it. But it shouldn't yet be the multi-week, multi-stakeholder process of an enterprise PRD. The format converges on a 1–3 page document that the product team writes, engineering reviews, and design attaches mockups to — then turns into Linear tickets.
:::

## Tools

- **Linear** — Issue tracking, sprint planning. The dominant choice for new startups in 2026.
- **Notion** — Documentation, specs, wikis.
- **Figma + FigJam** — Design and collaboration.
- **Loom** — Async video for cross-functional communication.
- **Slack** — Real-time communication.

## Process

The product team (PM + designer + tech lead) writes 1–3 page **PRDs (Product Requirements Documents)** in Notion or Linear. PRDs cover:
- Problem statement and user pain.
- Proposed solution at a high level.
- Acceptance criteria (what "done" looks like).
- Out of scope (what we're explicitly NOT doing).
- Open questions.
- Estimated effort and timeline.

Engineering reviews the PRD for feasibility. Designers attach mockups. The team discusses in a planning meeting; the PRD gets refined; tickets are created.

## Sprints

Two-week sprints are standard. Each sprint has:
- Planned scope (negotiated during sprint planning).
- Stretch goals.
- A review/demo at the end.
- A retrospective on process.

Some teams use **continuous flow** (no sprints — just a prioritized queue). Both work; sprints add structure that helps newer teams.

## Quarterly planning

Every 3 months, the team picks a small number (3–5) of large goals for the quarter. These cascade down into sprints. The framework is often **OKRs (Objectives and Key Results)** — Objectives are aspirational; Key Results are measurable.

:::note[Worked example: a one-page PRD]
> **PRD: Bulk Export for Power Users**
>
> **Problem.** Power users (top 5% by usage) regularly ask for a way to export their data. Currently they screenshot or copy-paste, which is unusable past ~50 rows.
>
> **Proposal.** Add a "Download CSV" button on the main library view. Generates a signed URL to a CSV in R2 valid for one hour.
>
> **Acceptance criteria.**
> - Button is visible only to authenticated users with at least one item.
> - CSV columns match the visible table columns + a `created_at` ISO timestamp.
> - Export of up to 100K rows completes in &lt;15s.
> - Failures show a clear toast with a "try again" CTA.
>
> **Out of scope.** Excel / XLSX format. Scheduled exports. Filtering before export (use the existing table filters).
>
> **Open questions.** Do we need rate limiting? (Eng: yes, 1 per minute per user.)
>
> **Estimate.** 2 engineer-weeks, 2 design-days. Target ship: next sprint.

One page; everyone reads it in five minutes; engineering opens tickets straight from it.
:::

:::info[Highlight: PRDs are conversation starters, not contracts]
The biggest mistake new teams make is treating the PRD as a binding spec. It's not. It's the *current best understanding* of what to build, written down so that engineering, design, and product are pointed in the same direction. Expect it to change during implementation — when engineering finds a constraint, when design discovers a UX problem, when QA notices an edge case. The PRD evolves with the work.
:::

## What's next

→ Continue to [Phase 2: Design](./design) where Figma, the design system, and engineering collaboration take over.
