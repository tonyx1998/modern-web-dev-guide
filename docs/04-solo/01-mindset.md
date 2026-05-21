---
id: mindset
title: The Personal Project Mindset
sidebar_position: 2
sidebar_label: 1. Mindset
description: Personal projects invert the trade-offs of enterprise software. Speed beats process; one reviewer (you) beats many.
---

# The Personal Project Mindset

> **In one line:** Personal projects are the *opposite* of enterprise software — speed beats process, one developer beats committees, and shipping beats planning.

:::tip In plain English
When you're alone, every minute spent setting up CI, writing onboarding docs, or running approvals is a minute *not* spent building the actual thing. Big companies need process to keep dozens of people from stepping on each other. You don't. You're a chef cooking for yourself — skip the hairnets, the health-code paperwork, and the menu printing. Just cook.
:::

## Inverted trade-offs

Personal projects flip almost every assumption of enterprise software:

| Enterprise          | Personal             |
|---------------------|----------------------|
| Process for safety  | Speed over process   |
| Plan for 5 years    | Plan for 5 weeks     |
| Optimize for teams  | Optimize for self    |
| Cost scales with revenue | Cost matters more than scale |
| Avoid risky tech    | Try new tech freely (it's your call) |
| Many environments   | Just local + production |
| Heavy testing       | Test the things that matter |
| Multiple reviewers  | You are the reviewer |

## The biggest mistake

The biggest mistake solo developers make is **applying enterprise patterns to personal projects.**

- You don't need Kubernetes.
- You don't need microservices.
- You don't need a CI/CD pipeline with seventeen stages.
- You don't need a custom design system.
- You don't need an "architecture decision record" for choosing between Next.js and Astro.

You need to ship.

:::note Try it yourself
Take any side project you've started and never finished. List five decisions you made because "that's how real software is built" — a custom logger, a monorepo for one app, a Dockerfile you never actually used, a unit-test suite for trivial UI, a database abstraction layer for one table.

Now ask: would the project have shipped sooner without any of those? Almost always: yes.
:::

:::info Highlight: pick your reviewer
At an enterprise, design reviews, code reviews, and architecture committees are how the company avoids catastrophe. Solo, *you are all of them.* That's a feature, not a bug — you can make a call in five seconds that would take five meetings elsewhere. The flip side: nobody will catch your bad decisions for you. The fix isn't process. The fix is shipping early, watching it break in small ways, and iterating.
:::

## What's next

→ Continue to [Common Personal Project Types](./project-types) where we'll see how the workflow varies for portfolios, blogs, SaaS, tools, and learning projects.
