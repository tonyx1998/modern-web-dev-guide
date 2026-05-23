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

## Common mistakes

:::caution[Where people commonly trip up]
- **Forking shadcn into a "custom design system" at 8 engineers.** You don't have the throughput to own a real component library yet. Customize tokens, customize specific components when you must, but resist the urge to rename everything and turn it into "your" system before there's a designer-engineer pairing to own it.
- **Skipping engineering review on Figma files.** You ship the mock, then discover halfway through implementation that the gradient requires a Client Component or the chart library can't render that shape. Five minutes of "is this feasible?" before designs go to engineers saves days.
- **Treating Figma fidelity as the acceptance criterion.** Pixel-perfect is the wrong goal at this stage. The right goal is "the experience matches the intent" — which sometimes means ignoring 4px of padding to save a day of engineering work.
- **Hiring a second designer before the first one has a design system to point to.** Two designers without a shared library produce two visual languages. Lock the foundation (tokens, primitives, common patterns) before adding the next seat.
- **Letting design debt grow invisibly.** Engineers route around the design system with one-off components when shadcn doesn't fit. Without a quarterly audit, you wake up with 14 button variants. Track exceptions explicitly.
:::

## Page checkpoint

<Quiz id="startup-design-page" title="Did startup-scale design stick?" sampleSize={2}>

<Question
  prompt="Why does the page recommend shadcn/ui as the default component library for a 5-10 person startup?"
  options={[
    { text: "It's the cheapest paid component library on the market" },
    { text: "It gives a fully-styled, accessible library you own in your repo, with no time spent building one" },
    { text: "It's mandated by Next.js" },
    { text: "It removes the need to ever hire a designer" }
  ]}
  correct={1}
  explanation="At 5-10 people you can't afford to build a design system. shadcn/ui ships accessible, customizable components that live in your own repo — you customize colors and typography rather than starting from scratch."
  revisit={{ to: "/docs/startup/design#design-system-maturity-at-this-stage", label: "shadcn/ui default" }}
/>

<Question
  prompt="What design-system progression does the page describe as team size grows?"
  options={[
    { text: "shadcn/ui directly, then small private library extending shadcn, then full Storybook system" },
    { text: "Material UI, then Ant Design, then a fully custom CSS framework" },
    { text: "Tailwind utility classes only, never any component library" },
    { text: "Storybook from day one, regardless of team size" }
  ]}
  correct={0}
  explanation="The page maps the path: 5-10 people use shadcn directly; 10-25 wrap shadcn in private primitives; 25-50 graduate to a Storybook-based design system with a designer-engineer owner."
  revisit={{ to: "/docs/startup/design#design-system-maturity-at-this-stage", label: "Design system maturity" }}
/>

<Question
  prompt="What is the main argument the page makes for engineers attending design reviews?"
  options={[
    { text: "Engineers can negotiate down designer salaries" },
    { text: "Engineers flag feasibility issues early, before days of design or code are wasted" },
    { text: "Designers can't be trusted alone with Figma" },
    { text: "It's required to pass SOC 2 audits" }
  ]}
  correct={1}
  explanation="The worked example shows an engineer in design review surfacing a Client Component cost before implementation. A decision in five minutes saves days of throwaway design or slow code."
  revisit={{ to: "/docs/startup/design#engineeringdesign-collaboration", label: "Design-feasibility loop" }}
/>

<Question
  prompt="What is the overarching goal of design at startup scale, per the In Plain English intro?"
  options={[
    { text: "Maximize pixel-perfect fidelity with no engineering compromise" },
    { text: "Keep the gap between what's in Figma and what's in production small enough that designers trust staging" },
    { text: "Move design entirely into code so designers no longer use Figma" },
    { text: "Outsource all visual work to external agencies" }
  ]}
  correct={1}
  explanation="The introduction frames the goal as closing the Figma-to-production gap so design can trust what they see in staging — not perfect fidelity, not eliminating Figma, just a small reliable gap."
  revisit={{ to: "/docs/startup/design#phase-2-design", label: "Plain English intro" }}
/>

</Quiz>

## What's next

→ Continue to [Phase 3: Architecture](./architecture) where the modular monolith and the 2026 stack come together.
