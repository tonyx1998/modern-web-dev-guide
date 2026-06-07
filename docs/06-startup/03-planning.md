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

## Common mistakes

:::caution[Where people commonly trip up]
- **Writing PRDs no one reads.** A six-page PRD with three approvers is enterprise cosplay at this scale. If you can't summarize the doc in two sentences in standup, it's too long — the team will skim and you'll discover the misalignments during code review.
- **Treating Linear tickets as the spec.** Tickets are *tasks*, not requirements. Engineers staring at a one-line ticket re-invent the PRD in their head, and you ship five different interpretations of "add bulk export." Link every ticket back to the PRD.
- **Setting OKRs that read like project plans.** "Ship feature X by Q2" is a deliverable, not a Key Result. Real KRs are measurable outcomes (activation rate, p95 latency, trial-to-paid conversion). If you'd close the KR by merging a PR, you wrote a task in OKR clothing.
- **Letting "no spec yet" block engineering for a week.** At startup scale, engineering doing two days of spike work usually beats waiting for a perfect PRD. Build a throwaway, learn what the real questions are, then write the spec on the way out.
- **Carrying every uncompleted ticket into the next sprint forever.** Tickets that survive three sprints without being touched are signals — either no one actually wants the work, or the scope is wrong. Close them honestly and let priorities re-surface them if real.
:::

## Page checkpoint

<Quiz id="startup-planning-page" title="Did startup planning stick?" sampleSize={2}>

<Question
  prompt="What is the recommended size and format of a startup PRD on this page?"
  options={[
    { text: "A 1-3 page document in Notion or Linear covering problem, proposal, acceptance criteria, and open questions" },
    { text: "A 20-page formal spec signed by legal and compliance" },
    { text: "A single Jira ticket with bullet points" },
    { text: "A recorded video pitch with no written artifact" }
  ]}
  correct={0}
  explanation="At startup scale, PRDs are 1-3 pages — long enough to align product, design, and engineering, but short enough that everyone reads it in five minutes."
  revisit={{ to: "/docs/startup/planning#process", label: "PRD process" }}
/>

<Question
  prompt="How does the page describe a PRD's role once implementation starts?"
  options={[
    { text: "A binding contract that cannot change once approved" },
    { text: "A conversation starter that evolves as engineering and design discover constraints" },
    { text: "A purely marketing document the engineers ignore" },
    { text: "A legally required artifact for SOC 2" }
  ]}
  correct={1}
  explanation="The highlight warns against treating PRDs as binding specs. They're the current best understanding, expected to evolve as constraints, UX problems, and edge cases surface during implementation."
  revisit={{ to: "/docs/startup/planning#process", label: "PRDs are conversation starters" }}
/>

<Question
  prompt="What sprint cadence does the page describe as standard for startups?"
  options={[
    { text: "One-week sprints with daily demos" },
    { text: "Two-week sprints with planning, demo, and retro" },
    { text: "Six-week shape-up cycles only" },
    { text: "Quarterly releases with no in-between cadence" }
  ]}
  correct={1}
  explanation="Two-week sprints are standard, with planned scope, stretch goals, a review/demo, and a retrospective. Some teams use continuous flow instead, but sprints add structure for newer teams."
  revisit={{ to: "/docs/startup/planning#sprints", label: "Sprints" }}
/>

<Question
  prompt="What framework does the page describe for quarterly planning?"
  options={[
    { text: "Scaled Agile Framework (SAFe) with PI planning" },
    { text: "OKRs — aspirational Objectives paired with measurable Key Results" },
    { text: "MoSCoW prioritization across all backlog items" },
    { text: "RACI matrices for each quarterly goal" }
  ]}
  correct={1}
  explanation="Every three months the team picks 3-5 large goals using the OKR framework: Objectives are aspirational; Key Results are measurable. These cascade into sprints."
  revisit={{ to: "/docs/startup/planning#quarterly-planning", label: "Quarterly planning" }}
/>

</Quiz>

## What's next

→ Continue to [Phase 3: Design](./design) where Figma, the design system, and engineering collaboration take over.
