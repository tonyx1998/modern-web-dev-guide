---
id: why-doing-this
title: The "Why Are You Doing This?" Question
sidebar_position: 14
sidebar_label: 13. Why Are You Doing This?
description: For every project, feature, and change — be able to answer why. Connect to a real user problem, business outcome, or strategic priority.
---

# The "Why Are You Doing This?" Question

> **In one line:** For every project, every feature, every change — be able to answer "why?" — and the answer should connect to a real user problem, a measurable outcome, or a strategic priority.

:::tip[In plain English]
A surprising amount of engineering effort goes into work that nobody can justify when asked directly. "Because we always have." "Because someone said so." "Because it would be cool." Make answering "why?" a habit on every change. The act of asking surfaces the work that should not be happening.
:::

The answer should connect to:

- A real user problem.
- A measurable business outcome.
- A strategic priority.

If the answer is "because we always have" or "because someone said so" or "because it would be cool" — pause. Maybe don't.

## Forcing functions

- PRDs require a "problem statement" section.
- Engineering proposals require a "motivation" section.
- 1:1s ask "what are you working on, and why?"
- Performance reviews ask "what impact did your work have?"

These force the question to surface.

:::note[Worked example: killing a multi-quarter project with one question]
A team has been working for two quarters on a "platform redesign." Onboarding the new engineering manager, she asks each engineer in 1:1s: "What problem does this solve, in a sentence?"

The answers vary wildly:

- "Our old platform is hard to use" (which user? what task?).
- "We need a better foundation for future features" (which features?).
- "It's been on the roadmap" (set by whom, why?).
- "Honestly, I'm not sure" (more common than you'd expect).

Nobody can point to a measurable user problem, a measured-and-unacceptable business outcome, or an explicit strategic decision. The project is paused; engineers are reallocated to two features that *do* have clear motivations. Six months later, neither team misses the redesign.

A single question saved 6+ engineer-quarters of work that nobody could justify when forced to.
:::

:::info[Highlight: "why" should be the first slide, not the last]
The most common failure mode in tech proposals is starting with the *what* (the new architecture, the new tool, the new team structure) and burying the *why* on slide 14. Then in review, everyone debates implementation details, and the underlying motivation never gets scrutiny.

Flip it: state the user problem or business outcome in the first paragraph. Everything else has to justify itself against that. If you can't fit the motivation into a paragraph, you haven't done the thinking yet.
:::

## What's next

→ Continue to [The Hiring-Constraint Principle](./hiring-constraint) — pick technologies your future self can hire for.
