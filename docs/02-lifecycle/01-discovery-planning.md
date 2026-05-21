---
id: discovery-planning
title: 'Phase 1: Discovery & Planning'
sidebar_position: 2
sidebar_label: 1. Discovery & Planning
description: Figure out what to build and why, before writing any code. The cheapest place to fix mistakes.
---

# Phase 1: Discovery & Planning

> **In one line:** Figure out *what* to build and *why* before writing a single line of code. The cheapest bugs are the ones you avoid by not building the wrong thing.

:::tip[In plain English]
Discovery is the *thinking* phase. Before you write code, you decide: who am I building for, what problem do they actually have, and what's the smallest thing that helps? The temptation is to skip this — to dive straight into code because that feels productive. But code that solves the wrong problem isn't progress; it's expensive deletion.
:::

## Why it matters

The most expensive bugs are not in code — they're in deciding what to build. A perfectly implemented feature nobody wants is a complete waste. Discovery is the cheapest place to fix mistakes.

The cost of changing direction grows exponentially through the lifecycle:

| Where you change your mind | Cost                                            |
|---------------------------|-------------------------------------------------|
| During discovery           | Free                                            |
| During design              | Hours                                           |
| During implementation      | Days                                            |
| After launch               | Weeks of migration, customer pain, lost trust   |

## What "planning" means at different scales

**Solo developer / personal project:**
- A paragraph in your notes app
- A quick sketch
- A list of 3–5 features

That's enough. Don't over-plan a side project.

**Small team / startup:**
- A 1–2 page PRD (Product Requirements Doc) in Notion or Linear
- Acceptance criteria for each feature
- Designs or wireframes attached
- Estimated effort
- Sprint planning to slot it into a 2-week cycle

**Large company:**
- 10–30 page PRDs with stakeholder sign-off
- User research, surveys, customer interviews
- Market analysis and competitive comparison
- Legal/compliance/security review checklists
- Cross-team dependency mapping
- Quarterly OKR alignment
- Capacity planning
- Multiple rounds of revision

## The seven discovery questions

Regardless of scale, you should answer:

1. **Who is this for?** (Specific user, not "everyone.")
2. **What problem does it solve?** (In their words, not yours.)
3. **What does success look like?** (Numerical, if possible.)
4. **What's the minimum that's useful?** (Avoid scope creep.)
5. **What are the constraints?** (Time, budget, regulation, team skills.)
6. **What could go wrong?** (Risks to acknowledge before they bite you.)
7. **Who needs to approve?** (Stakeholders, security, legal.)

:::note[Worked example: a beginner's first project]
**Bad planning:**
> "I'm going to build a productivity app with social features and AI."

**Good planning:**
> "I keep forgetting to drink water. I'll build a tiny webpage that sends me a browser notification every 60 minutes. Just for me. One page. No login. Success = I drink more water this month."

The second version is shippable in an evening. The first is a 6-month project that may never see daylight. **Smaller is better for first projects.**
:::

## Common anti-patterns

- **Solution before problem:** "Let's use blockchain!" before understanding what users want.
- **Over-planning:** Spending months in discovery and never shipping.
- **Under-planning:** Building something nobody wants because you didn't talk to users.
- **Feature creep during planning:** Every meeting adds three features. Resist.
- **Imagining users instead of asking them:** Real user research is uncomfortable but invaluable.

## Tools used in 2026

- **Notion / Linear** — Specs and project management
- **Figma / FigJam** — Visual collaboration, user journey maps
- **Loom** — Async video for cross-team communication
- **User research:** Dovetail, Maze, Lookback
- **Surveys:** Typeform, Tally
- **Analytics for understanding existing behavior:** PostHog, Amplitude, Mixpanel
- **AI-assisted research:** Summarizing user interviews with Claude/GPT, generating synthetic personas

:::info[Highlight: the cheapest user research that works]
You don't need a $50/seat research tool to start. The most valuable user research you can do as a beginner:

1. **Email 5 people in your target audience.** "Hey, I'm building X to solve Y. Would you be willing to chat for 15 minutes about how you handle Y today?"
2. **Listen more than you talk.** Don't pitch your idea. Ask how they currently do the thing.
3. **Notice contradictions** between what they say they want and what they actually do.

Three honest conversations are worth ten weeks of solo brainstorming.
:::

## What's next

→ Continue to [Phase 2: Design](./design) where the question shifts from *what* to build to *how it should look and feel*.
