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

## Common mistakes

:::caution[Where people commonly trip up]
- **Confusing "the problem" with "your idea for solving it."** "Users need a Slack bot" is already a solution. Strip it back to the actual pain ("our team loses track of who owns which doc") before you commit to any shape of fix — otherwise discovery just rubber-stamps your initial guess.
- **Talking to friends instead of target users.** Friends are polite and will say your idea is great. Strangers in the actual user segment will tell you what they currently do, where it hurts, and what they'd never pay for. Five strangers beat fifty supportive friends.
- **Treating the PRD as a contract instead of a hypothesis.** Beginners freeze when reality diverges from the spec; experienced PMs revise the doc weekly as they learn. Write your plan in pencil — discovery continues into design and implementation.
- **Letting AI brainstorming substitute for talking to humans.** Claude or ChatGPT will happily generate a 20-page user research report from your prompt — and none of it is grounded in a real person's behavior. Use AI to summarize real interviews, not to invent fake ones.
- **Picking a success metric you can't actually measure.** "Increase engagement" without a defined event, source, and baseline is a wish, not a target. Pick a number you could pull from PostHog or your DB tomorrow, or your launch will have no honest verdict.
:::

## Page checkpoint

<Quiz id="lifecycle-discovery-planning-page" title="Did discovery & planning stick?" sampleSize={3}>

<Question
  prompt="Why does the page argue that discovery is 'the cheapest place to fix mistakes'?"
  options={[
    { text: "Designers charge less per hour than engineers" },
    { text: "The cost of changing direction grows exponentially as you move from discovery to design, implementation, and post-launch" },
    { text: "Discovery is the only phase where you can write tests" },
    { text: "Most bugs are caused by typos that planning eliminates" }
  ]}
  correct={1}
  explanation="Changing your mind during discovery is free; the same change after launch costs weeks of migration and lost trust. Catching the wrong idea early is dramatically cheaper than catching it in code."
  revisit={{ to: "/docs/lifecycle/discovery-planning#why-it-matters", label: "Why it matters" }}
/>

<Question
  prompt="A solo developer is planning a weekend project. According to the page, what's the appropriate level of planning?"
  options={[
    { text: "A 10-page PRD with stakeholder sign-off" },
    { text: "Full OKR alignment and capacity planning" },
    { text: "A paragraph in a notes app, a quick sketch, and 3-5 features" },
    { text: "User interviews with at least 20 participants before writing code" }
  ]}
  correct={2}
  explanation="Planning should scale with the project. A side project needs a paragraph and a sketch; over-planning a solo build is itself a form of procrastination."
  revisit={{ to: "/docs/lifecycle/discovery-planning#what-planning-means-at-different-scales", label: "Planning at different scales" }}
/>

<Question
  prompt="The page lists seven discovery questions. Which of these is NOT one of them?"
  options={[
    { text: "Who is this for?" },
    { text: "What does success look like?" },
    { text: "Which framework should we use?" },
    { text: "What's the minimum that's useful?" }
  ]}
  correct={2}
  explanation="Framework choice is an architecture decision, not a discovery question. Discovery focuses on the user, the problem, success metrics, scope, constraints, risks, and approvals — not implementation tech."
  revisit={{ to: "/docs/lifecycle/discovery-planning#the-seven-discovery-questions", label: "The seven discovery questions" }}
/>

<Question
  prompt="Which behavior best matches the page's recommendation for 'the cheapest user research that works'?"
  options={[
    { text: "Buy a $50/seat research tool before talking to anyone" },
    { text: "Pitch your idea to five friends and ask if they'd use it" },
    { text: "Email five people in your target audience and ask how they currently solve the problem" },
    { text: "Run a survey of 500 strangers on social media" }
  ]}
  correct={2}
  explanation="The page argues three honest conversations beat weeks of solo brainstorming. The trick is to ask how people currently handle the problem — not pitch your solution."
  revisit={{ to: "/docs/lifecycle/discovery-planning#tools-used-in-2026", label: "Cheapest user research" }}
/>

</Quiz>

## What's next

→ Continue to [Phase 3: Design](./design) where the question shifts from *what* to build to *how it should look and feel*.
