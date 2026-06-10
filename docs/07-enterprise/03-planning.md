---
id: planning
title: 'Phase 1: Discovery & Planning'
sidebar_position: 4
sidebar_label: 3. Planning
description: How enterprises decide what to build — OKRs, PRDs, RFCs, and the cross-functional review gauntlet.
---

# Phase 1: Discovery & Planning

> **In one line:** Planning is a discipline at this scale — multi-page PRDs, written RFCs, and cross-functional reviews from security, privacy, legal, accessibility, and ops, all coordinated by program managers.

:::tip[In plain English]
At a startup, "planning" is often "the founder DM'd me a Loom." At an enterprise, planning is a multi-week process producing tens of pages of documents that survive years of staff turnover.

That's not bureaucracy — it's pattern matching against past failures. Every cross-functional review exists because some earlier launch missed something obvious in hindsight: a regulation, an accessibility gap, a data flow that wasn't compliant. The doc-and-review machinery is institutional memory.
:::

## Strategic planning (quarterly/annual)

- Top-down OKRs from CEO/leadership cascade through the org.
- Each team picks objectives that ladder to higher-level goals.
- Cross-team dependencies are mapped.
- Budgets and headcount allocations follow planning cycles.

The cadence is usually quarterly for goals and annual for budget. Big initiatives can span many quarters.

## Product Requirements Documents (PRDs)

- 10–30 pages, sometimes more.
- Include user research, market analysis, competitive landscape.
- Specify success metrics, edge cases, accessibility considerations.
- Reviewed by product, engineering, design, legal, security, privacy.
- Multiple revision rounds.

A PRD at this scale isn't just "what we're building" — it's "what we're building, why, who needs to approve it, what could go wrong, and how we'll know if it worked."

## Engineering Design Docs / RFCs

- Engineers propose technical approaches in written form.
- Include alternatives considered with trade-offs.
- Cross-team impact analysis.
- Capacity planning ("this feature will generate ~X RPS at peak").
- Reviewed by senior engineers across affected teams.
- Often a multi-week process.

A good RFC is read by people who've never met the author, two years later, trying to understand why a decision was made. It saves enormous amounts of time by capturing the *reasoning*, not just the conclusion.

:::info[Highlight: the "alternatives considered" section is the most valuable]
The single most useful section of an enterprise RFC is the "Alternatives considered" block — three or four approaches that were *rejected* and *why*.

Without it, future engineers re-litigate the same decision every 18 months. With it, you can answer "why didn't we just use X?" by pointing to the RFC where someone already explored it and listed the reasons. This is institutional memory at its best.
:::

## Cross-functional reviews

This is the part that startup engineers find most foreign:

- **Security review** — Threat modeling for new features touching auth, payments, or data.
- **Privacy review** — GDPR, CCPA, HIPAA implications. Data flow diagrams.
- **Legal review** — Terms of service implications, regulatory exposure.
- **Accessibility review** — WCAG compliance.
- **Localization review** — Does this work across all supported languages and regions?
- **Operations review** — Runbook, monitoring, rollback plans before launch.

Each review is gated by a specialized team. Skipping reviews isn't a "move fast" advantage — it's how a $50M settlement happens two years later.

## Program management

- TPMs coordinate dependencies across teams.
- Gantt charts, dependency graphs, weekly status updates.
- Risks tracked formally with owners and mitigation plans.

The TPM's job is to make sure the auth team doesn't ship its piece three weeks before the mobile team is ready for it, and that the marketing date matches reality.

:::note[Worked example: a "small" feature's planning timeline]
A feature like "enable passkey login alongside passwords":

- **Week 1:** PM drafts PRD; engineering staff engineer drafts RFC.
- **Week 2:** Cross-functional reviews land — security flags two threat scenarios, privacy asks about analytics, accessibility asks about screen-reader support, legal asks about regulatory disclosures.
- **Week 3:** RFC revised; capacity plan written; TPM produces a launch plan.
- **Week 4:** Code starts being written.

Three weeks of planning for a feature whose code might take two weeks to write. At first glance this looks wasteful. In practice, the *change of plan rate* once code is being written is much lower than at a startup — fewer rewrites, fewer "oh we should have asked legal first" moments, fewer launches that get rolled back.
:::

This planning overhead is real, but at enterprise scale, the cost of misaligned work across hundreds of engineers far exceeds the cost of planning.

## Common mistakes

:::caution[Where people commonly trip up]
- **Writing RFCs nobody reads.** A 40-page RFC that lands the day before a decision is theater. Post the draft two weeks before, ping specific reviewers by name, and treat "no comments" as "nobody read it" — not as approval.
- **Skipping the "Alternatives considered" section because the answer felt obvious.** It won't be obvious to the engineer reading this in 2028. Spend the extra hour listing the three approaches you rejected and *why* — that's the section that pays for the whole document.
- **Treating cross-functional reviews as boxes to tick.** If you schedule security review the day before launch, the only options are "ship anyway" or "delay the launch." Pull each reviewer in during design, when they can still change the shape of the thing.
- **Letting OKRs ladder into work nobody owns.** A team-level OKR with no on-call accountability and no operational plan is a wish. Every objective should have a named owner and a clear answer to "who pages who when it breaks?"
- **Mistaking planning volume for planning quality.** Forty pages of PRD doesn't beat ten focused pages with a clear success metric. Length signals effort, not rigor — and at this scale, reviewers will skim either way.
:::

## Page checkpoint

<Quiz id="enterprise-planning-page" title="Did enterprise planning stick?" sampleSize={3}>

<Question
  prompt="According to the page, which section of an enterprise RFC is the single most valuable?"
  options={[
    { text: "The implementation plan" },
    { text: "The capacity estimate" },
    { text: "The 'Alternatives considered' block — three or four approaches that were rejected and why" },
    { text: "The author's bio" }
  ]}
  correct={2}
  explanation="The Alternatives Considered block is what stops future engineers from re-litigating the same decision every 18 months. It captures the reasoning behind a choice, not just the conclusion — that's institutional memory at its best."
  revisit={{ to: "/docs/enterprise/planning#engineering-design-docs--rfcs", label: "RFC alternatives" }}
/>

<Question
  prompt="Why does an enterprise route a feature through security, privacy, accessibility, legal, and ops reviews before code starts?"
  options={[
    { text: "To slow engineers down deliberately" },
    { text: "Because each review exists due to a past incident or regulation — skipping them is how $50M settlements happen" },
    { text: "Because lawyers control the engineering org" },
    { text: "Because regulations require a fixed three-week planning window" }
  ]}
  correct={1}
  explanation="Cross-functional reviews aren't bureaucracy — they're pattern matching against past failures. Each gate exists because a similar feature once missed something obvious in hindsight. The doc-and-review machinery is institutional memory."
  revisit={{ to: "/docs/enterprise/planning#cross-functional-reviews", label: "Cross-functional reviews" }}
/>

<Question
  prompt="What is the main payoff of three weeks of planning for a two-week feature at enterprise scale?"
  options={[
    { text: "Fewer line items on the cloud bill" },
    { text: "A much lower change-of-plan rate once code is being written — fewer rewrites and rollbacks" },
    { text: "Faster code reviews" },
    { text: "Better unit test coverage" }
  ]}
  correct={1}
  explanation="The planning overhead looks wasteful until you see that the change-of-plan rate, once code is being written, drops sharply. Fewer rewrites, fewer 'oh we should have asked legal first' moments, fewer rolled-back launches."
  revisit={{ to: "/docs/enterprise/planning#worked-example", label: "Worked example" }}
/>

<Question
  prompt="Which document captures user research, market analysis, success metrics, and accessibility considerations?"
  options={[
    { text: "The PRD (Product Requirements Document)" },
    { text: "The RFC (Engineering Design Doc)" },
    { text: "The runbook" },
    { text: "The CODEOWNERS file" }
  ]}
  correct={0}
  explanation="A PRD at this scale is 10–30 pages and answers what you're building, why, who needs to approve, what could go wrong, and how you'll know it worked. The RFC focuses on the technical approach; the PRD covers the broader product picture."
  revisit={{ to: "/docs/enterprise/planning#product-requirements-documents-prds", label: "PRDs" }}
/>

</Quiz>

## What's next

→ Continue to [Phase 3: Architecture](./architecture) to see what gets built once the planning machinery hands off to engineers.
