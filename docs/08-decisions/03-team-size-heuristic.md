---
id: team-size-heuristic
title: The Team Size Heuristic
sidebar_position: 4
sidebar_label: 3. Team Size
description: Your team's size constrains what's optimal. Patterns that work for 5 people often fail at 50.
---

# The Team Size Heuristic

> **In one line:** Your team size constrains what's optimal — patterns that work for 5 people often fail at 50, and patterns designed for 500 engineers crush a small startup.

:::tip In plain English
The biggest source of wasted engineering effort is **importing practices from a much larger or smaller company** without considering whether they fit. A solo developer doesn't need RFCs. A 500-person org can't survive without them. Match the process to the size.
:::

A pattern that works for a 5-person team often fails at 50. A pattern designed for 500 engineers crushes a small startup. Use these bands as a rough guide, not a rulebook.

## 1 person

**Optimize for:** Speed, joy, learning.

- Pick what you know best.
- Use defaults aggressively.
- Skip process.
- Don't build for hypothetical future scale.

## 2–10 people

**Optimize for:** Shipping velocity, low coordination cost.

- Pick popular defaults (you'll hire people who already know them).
- Maintain code quality through review and tests.
- Lightweight process — daily standup, sprint planning, retros.
- Modular monolith.
- One product manager or founder calls product shots.

## 10–50 people

**Optimize for:** Sustainable velocity, emerging specialization.

- Standardize aggressively (everyone uses the same stack).
- Allow exceptions only with justification.
- Real engineering process — code review requirements, on-call rotation, deployment automation.
- Begin to specialize (frontend, backend, infra-curious).
- Start building internal documentation and runbooks.

## 50–500 people

**Optimize for:** Team autonomy, cross-team coordination.

- Strong defaults; deviation requires architectural review.
- Distinct teams with clear ownership.
- Internal platforms emerge (or formal vendors take their place).
- Real process: RFCs, ADRs, formal launches.
- SRE / DevOps becomes a discipline.

## 500+ people

**Optimize for:** Reliability, scalability, hiring.

- Build internal platforms that abstract complexity from product teams.
- Formal compliance and security programs.
- Multiple parallel investments (ML platform, design system, observability platform).
- Heavy process around production changes.
- Specialized roles for every function.

## How to apply it

Ask: "Is this practice helping or hurting at our current size?" Add what genuinely helps. Remove what's pure overhead.

The biggest mistake is **importing practices from a much larger or smaller company** without considering whether they fit.

:::note Worked example: a process that broke a 12-person team
A 12-person startup hires a senior engineer from a 5,000-person company. The new hire introduces:

- A formal RFC process for any change over 100 lines.
- A weekly architecture review meeting.
- Required design docs before any new feature.

Six months later, the team is shipping half as much as before. The process was correct *at the previous company's scale*, where you might never meet the team affected by your change. At 12 people, you can literally walk over to them.

The fix: keep ADRs for genuinely irreversible decisions (database, language, auth provider) and drop the rest. Velocity recovered within a month.
:::

:::info Highlight: the symmetric mistake
The *opposite* mistake — a 200-person org running with no process because "we move like a startup" — is equally common and equally expensive. By 200 people, you cannot all sit in one room and align. Either process emerges deliberately, or it emerges as chaos.

Process should scale up with team size. A team of 1 doesn't write RFCs; a team of 500 cannot survive without them.
:::

## What's next

→ Continue to [The Build vs Buy Decision](./build-vs-buy) — default to buying for non-core capabilities; build only where you're the world's expert.
