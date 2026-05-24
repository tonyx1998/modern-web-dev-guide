---
id: design
title: 'Phase 3: Design'
sidebar_position: 3
sidebar_label: 2. Design
description: Decide how the product looks and feels before writing code. Changing pixels in Figma takes minutes; in code, hours.
---

# Phase 3: Design

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

## Common mistakes

:::caution[Where people commonly trip up]
- **Treating "design" as "make the colors look nice."** Visual polish is the *last* design concern. If your information architecture is wrong, no amount of gradient or font tweaking saves the screen. Get IA and user flows right first; mockups come after.
- **Designing on a 1440px desktop only, then "making it responsive" later.** In 2026, most traffic is mobile and most users have a tiny viewport. Design the small screen first; the desktop layout is the easier upscale, not the other way around.
- **Trusting AI design-to-code tools to ship production UI.** v0 and Lovable produce convincing-looking output that often ignores accessibility, breaks at edge content lengths, and pulls in dependencies you don't want. Treat their output as a starting wireframe, not a finished component.
- **Pixel-fighting with engineers over breakpoints.** Demanding the design match Figma exactly at every screen width turns into a months-long whack-a-mole. Agree on a fluid system (spacing scale, type ramp, container queries) and let the layout breathe between named breakpoints.
- **Forgetting the "max content" state.** Designs usually show 3 nicely-spaced items. Real users have 47 items, 200-character names, and emoji in their display name. Design the realistic worst case alongside the happy path, or your layout will collapse in production.
:::

## Page checkpoint

<Quiz id="lifecycle-design-page" title="Did design stick?" sampleSize={2}>

<Question
  prompt="What's the page's central argument for designing in Figma (or on paper) before writing code?"
  options={[
    { text: "Designers refuse to work in code editors" },
    { text: "Iteration is dramatically cheaper in design tools than in code, so bad ideas get caught before they become bad code" },
    { text: "It's the only way to enforce WCAG compliance" },
    { text: "Investors expect to see Figma mockups before funding" }
  ]}
  correct={1}
  explanation="Changing pixels in Figma takes minutes; changing them in code takes hours and risks regressions. Design is cheap prototyping that catches bad ideas before they cost real engineering time."
  revisit={{ to: "/docs/lifecycle/design#why-design-before-code", label: "Why design before code" }}
/>

<Question
  prompt="Which sub-phase of design produces low-fidelity sketches — boxes and labels, no color or fonts?"
  options={[
    { text: "Information Architecture" },
    { text: "Wireframes" },
    { text: "High-fidelity mockups" },
    { text: "Design system" }
  ]}
  correct={1}
  explanation="Wireframes are deliberately low-fidelity so people focus on structure and flow, not colors or typography. Pixel-perfect comes later in mockups."
  revisit={{ to: "/docs/lifecycle/design#the-six-sub-phases-of-design", label: "Six sub-phases of design" }}
/>

<Question
  prompt="The page strongly recommends designing empty states first. Why?"
  options={[
    { text: "Empty states use less ink when printed" },
    { text: "Empty states are easier to design than populated screens" },
    { text: "Users live in empty states during onboarding — the most critical part of any product" },
    { text: "Empty states are required by WCAG AAA" }
  ]}
  correct={2}
  explanation="Every new user starts in an empty state. A well-designed empty state guides them to the next action; a missing one confuses them at the worst possible moment."
  revisit={{ to: "/docs/lifecycle/design#tools-in-2026", label: "Design empty states first" }}
/>

<Question
  prompt="Which of the following is called out as a design anti-pattern on the page?"
  options={[
    { text: "Designing with realistic content lengths" },
    { text: "Considering keyboard navigation early" },
    { text: "Designing only the happy path with no empty, loading, or error states" },
    { text: "Using design tokens shared between Figma and code" }
  ]}
  correct={2}
  explanation="Real interfaces spend a lot of time NOT in the happy path. Designing only the happy path leaves engineers improvising the most-seen screens of the product."
  revisit={{ to: "/docs/lifecycle/design#common-anti-patterns", label: "Design anti-patterns" }}
/>

</Quiz>

## What's next

→ Continue to [Phase 4: Architecture](./architecture) where the question shifts from *how it looks* to *how it works under the hood*.
