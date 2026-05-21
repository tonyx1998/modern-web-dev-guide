---
id: design
title: 'Phase 2: Design'
sidebar_position: 3
sidebar_label: 2. Design
description: Decide how the product looks and feels before writing code. Changing pixels in Figma takes minutes; in code, hours.
---

# Phase 2: Design

> **In one line:** Decide how the product looks and feels in design tools first, where changes cost minutes — not in code, where they cost hours.

:::tip[In plain English]
"Design" doesn't mean "make it pretty." It means *plan the user experience*. What screens exist, in what order, with what content, in what visual hierarchy. The medium is Figma (or paper, or a whiteboard) — somewhere you can iterate quickly. Once it feels right in design, you implement it. Skipping design is the most common cause of "I built this and now I want to redo it."
:::

## Why design before code?

Changing pixels in Figma takes minutes. Changing pixels in code takes hours and risks introducing regressions. Design is a cheap form of prototyping that catches bad ideas before they become bad code.

## The six sub-phases of design

| Sub-phase                  | What it produces                                   |
|---------------------------|----------------------------------------------------|
| **Information Architecture (IA)** | The site map. Navigation. URL hierarchy. What content exists, and how it's organized. |
| **User Flows / Journeys**  | Step-by-step maps: "sign up → confirm → onboard → first action." |
| **Wireframes**             | Low-fidelity sketches. Boxes and labels — no color or fonts. |
| **High-Fidelity Mockups**  | Pixel-perfect designs with real colors, fonts, spacing. |
| **Prototypes**             | Clickable Figma flows that simulate the app.       |
| **Design System**          | Reusable components (buttons, inputs, cards) with consistent style. |

## Modern design practice in 2026

Design has become tightly coupled to engineering:

- **Design tokens** — Colors, spacing, typography defined as variables (`--color-primary`, `space-4`) shared between Figma and code.
- **Design-to-code** — Figma plugins generate Tailwind/CSS directly; AI tools (v0.dev, Lovable, Bolt) generate working components from designs.
- **Component-driven design** — Designers work in the same component library engineers use, so handoff is trivial.
- **Real data, not lorem ipsum** — Modern designs use realistic content lengths and edge cases.

## Accessibility from the start

Accessibility (a11y) isn't something to retrofit. Designs should account for:

- Color contrast (WCAG AA minimum, AAA preferred)
- Touch target sizes (44×44px minimum)
- Keyboard navigation
- Screen reader semantics
- Reduced motion preferences
- Right-to-left language support

Accessibility errors caught at design cost minutes. The same error caught after launch can cost weeks of rework.

:::note[Worked example: a beginner's "design" can be paper]
You don't need Figma for a side project. The minimum viable design is:

1. **A list of screens** the user will see, in order.
2. **A sketch on paper** showing the structure of each screen.
3. **A list of the components** that need to exist (button, card, form).

That's it. Spending 30 minutes on this saves hours of "wait, where does this button go?" during coding.
:::

## Common anti-patterns

- **Designing without engineers:** Designs that look great but are technically impractical.
- **Designing without users:** Looks beautiful, usability tests it tanks.
- **Skipping design for "engineering speed":** Almost always slower in total.
- **Pixel-perfect demands across breakpoints:** A waste; design fluid systems instead.
- **Designing happy paths only:** Real interfaces have empty states, loading states, error states, partial data states.

## Tools in 2026

| Tool                | What it's for                                            |
|---------------------|----------------------------------------------------------|
| **Figma**            | Dominant design tool. Has FigJam for whiteboarding, Dev Mode for engineer handoff. |
| **Penpot**           | Open-source alternative.                                  |
| **v0.dev / Lovable / Bolt.new** | AI-powered design-to-code.                      |
| **Storybook**        | Interactive component documentation.                      |
| **Chromatic**        | Visual regression testing for design systems.             |

:::info[Highlight: design the empty states first]
Most beginner designers (and engineers) only design the happy path — the screen with data, a few items, everything working. But users hit empty states constantly:

- The very first time they use your app, *nothing* exists yet.
- They search for something that doesn't match.
- The API failed; nothing loaded.
- They have 0 items in this category.

A well-designed empty state guides users to the *next action*. A missing empty state confuses them. Design those screens *before* the happy-path screens — they're where users live during onboarding, which is the most critical part of any product.
:::

## What's next

→ Continue to [Phase 3: Architecture](./architecture) where the question shifts from *how it looks* to *how it works under the hood*.
