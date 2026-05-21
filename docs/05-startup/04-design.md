---
id: design
title: 'Phase 2: Design'
sidebar_position: 5
sidebar_label: 4. Design
description: Figma plus a growing design system. Engineering and design collaborate closely — reviews, stand-ups, and shadcn/ui as the shared vocabulary.
---

# Phase 2: Design

> **In one line:** Figma plus a design system. Designers and engineers collaborate closely and share a component library — usually shadcn/ui at first.

:::tip[In plain English]
At solo scale, "design" might be a few rectangles on paper. At startup scale, you have a designer (or several) producing real Figma files, *and* a shared design system that translates those files into code. The whole goal is to keep the gap between "what's in Figma" and "what's in production" small enough that designers can trust what they see in staging.
:::

## How designers work

Designers work in Figma. They use the company's **design system** (a set of reusable components and tokens).

## Engineering–design collaboration

Engineering and design collaborate closely:
- Engineers attend design reviews to flag feasibility issues early.
- Designers attend stand-ups to stay synced.
- Both use shadcn/ui or a custom design system in code.

## Design system maturity at this stage

- **5–10 people:** Use shadcn/ui directly. Customize colors and typography to match brand.
- **10–25 people:** Maintain a small private component library extending shadcn.
- **25–50 people:** Full design system in Storybook, with a designer-engineer owner.

:::note[Worked example: the design-feasibility loop]
A designer mocks up a new dashboard with a fancy sticky filter panel. In design review, an engineer notices: "We render this server-side, so the sticky panel has to be a Client Component, which means we ship JS for the filter logic." They propose: either accept the JS cost, or make the panel non-sticky and ship purely server-rendered.

Both options get sketched. The designer picks "non-sticky, server-rendered" because performance matters more than the visual flourish here. Decision made in five minutes — *because the engineer was in the room.*

Without that feedback loop, the team would have built the sticky version, discovered the cost mid-implementation, and either shipped a slower page or thrown away two days of design work.
:::

:::info[Highlight: shadcn/ui is the default for a reason]
At 5–10 people, you don't have time to build a design system. shadcn/ui gives you a fully-styled, accessible component library you *own* (the components live in your repo, not as a dependency). You customize colors, typography, and edge cases as needed.

As you grow, you wrap shadcn components in your own primitives, then eventually graduate to a fully owned design system in Storybook. But the path from "no design system" to "full Storybook" goes through shadcn — not around it.
:::

## What's next

→ Continue to [Phase 3: Architecture](./architecture) where the modular monolith and the 2026 stack come together.
