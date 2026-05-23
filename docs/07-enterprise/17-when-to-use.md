---
id: when-to-use
title: When to Use This Workflow
sidebar_position: 18
sidebar_label: 17. When to Use
description: Which enterprise practices to adopt at your scale — and which are overkill until you're much larger.
---

# When to Use This Workflow

> **In one line:** Not every company at "500+ engineers" needs all of the above — each enterprise practice has a scale at which its cost is justified, and adopting them early is just as wasteful as adopting them late.

:::tip[In plain English]
A common mistake is thinking "we want to be like Google someday, so let's set up like Google now." That's almost always wrong. Each enterprise practice was invented to solve a specific scale problem. Adopting it before you have that problem is pure cost.

The right move: keep an eye on which problems are actually starting to bite you, and adopt the matching enterprise practice when (and only when) the pain justifies the investment.
:::

## When each practice starts being worth it

The scale at which different practices become valuable varies:

- **Service mesh** — Becomes valuable around 30–50 services or 50–100 engineers in microservices.
- **Internal developer platform** — Justified once you have 5+ teams routinely setting up new services.
- **SOC 2 / formal security program** — When you sell to enterprises or handle sensitive data.
- **Chaos engineering** — When reliability matters more than incremental velocity.
- **Distributed tracing** — When services span multiple teams.

Adopt enterprise practices when their cost is justified by the org's scale, not because "big companies do this."

## Heuristics for when to adopt

A few general rules:

- **Adopt automation when manual processes break the same way twice.** The third time a deploy goes wrong because someone forgot a step, write the script.
- **Adopt platforms when teams start reinventing the same wheel.** If three teams just built their own deploy tooling, it's time for a platform team.
- **Adopt formal review processes when changes start breaking each other.** If your last three incidents involved one team's change breaking another team's service, you need contracts and reviews.
- **Adopt compliance when a customer or regulator asks.** Don't pursue SOC 2 speculatively; pursue it when a deal depends on it.

:::info[Highlight: lag indicators tell you when to invest]
The best signal that you've outgrown a process isn't "we feel slow" — it's a *concrete pattern of failures*:

- Three incidents this quarter caused by deploys → invest in canary and rollback.
- Two services repeatedly stepping on each other's APIs → invest in contracts and schema registries.
- Onboarding takes a week longer than it used to → invest in DevEx.

Wait for the lag indicators. They tell you exactly which problem to solve next, and they let you justify the investment to leadership with real data.
:::

## When *not* to adopt enterprise practices

Equally important: when to *resist* adopting enterprise practices:

- **Don't adopt Kubernetes** until you've genuinely outgrown a PaaS like Render, Fly, or Railway. Most startups never need it.
- **Don't adopt microservices** until your monolith has actually become the bottleneck. Most teams ship faster on a well-designed modular monolith.
- **Don't adopt service meshes** to manage three services. The mesh becomes the most complex thing in the system.
- **Don't adopt formal RFC processes** for two-engineer changes. Async chat is faster and good enough.

Each of these tools has a real use, but each also has a real cost. At small scale, that cost dwarfs the benefit.

:::note[Worked example: a typical adoption sequence]
A 2026-style company growing from 20 to 200 engineers might adopt enterprise practices in roughly this order:

1. **20–40 engineers:** GitHub Actions CI, Sentry, Vercel/Render deploys. Solo on-call. No "process" beyond PR reviews.
2. **40–80 engineers:** First platform/DevEx hire. Internal CLI emerges. Datadog or Honeycomb adopted.
3. **80–120 engineers:** Modular monolith starts splitting into a few services. SOC 2 begins. First SRE hire.
4. **120–200 engineers:** Kubernetes adopted. Service mesh becomes interesting. RFC process formalized. Multi-team incident response.
5. **200+ engineers:** Full microservices, Backstage, chaos engineering, formal AppSec team.

Each step is triggered by a real pain. Skipping ahead — Kubernetes at 30 engineers, AppSec team at 50 — is almost always the wrong call.
:::

## Common mistakes

:::caution[Where people commonly trip up]
- **Adopting enterprise practices to "look mature" in a funding round.** Investors don't grade you on whether you run Kubernetes; they grade you on revenue and growth. Building enterprise infrastructure to impress a board is a fast way to slow the company that's supposed to be impressing them.
- **Waiting for the lag indicator that never quite arrives.** The opposite mistake: refusing to adopt anything until production is on fire. By then you're firefighting and building the new system at the same time — the worst possible context to make architectural decisions. Pick a clear trigger ("the third deploy-caused incident") and act on it the first time it hits.
- **Cherry-picking the practice without the prerequisites.** Adopting feature flags without an observability story to measure them, or canary deploys without an SLO to evaluate them, leaves you with the cost of the new tool and none of the benefit. Each practice depends on the ones underneath it.
- **Mandating the new practice org-wide on day one.** Telling 30 teams to migrate to a new platform "by Q3" without piloting it first guarantees a botched rollout. Run one or two teams on it, fix the rough edges, *then* expand — the same way you'd ship a customer-facing product.
- **Confusing "scale we hope to reach" with "scale we have."** Setting up a 200-engineer process at 40 engineers means 160 engineers' worth of meetings funded by 40 engineers' worth of headcount. Build for the scale you're at; revisit when the lag indicators say you've moved.
:::

## Page checkpoint

<Quiz id="enterprise-when-to-use-page" title="Did when-to-use stick?" sampleSize={2}>

<Question
  prompt="What's the common mistake when reading about enterprise practices?"
  options={[
    { text: "Dismissing them as unnecessary at any scale" },
    { text: "Thinking 'we want to be like Google someday, so let's set up like Google now' — adopting each practice before you have the problem it solves" },
    { text: "Treating enterprise advice as too vague" },
    { text: "Believing enterprise practices were invented by consultants" }
  ]}
  correct={1}
  explanation="Each enterprise practice was invented to solve a specific scale problem. Adopting it before you have that problem is pure cost. The right move is to watch which problems are actually starting to bite and adopt the matching practice when the pain justifies it."
  revisit={{ to: "/docs/enterprise/when-to-use", label: "When to adopt" }}
/>

<Question
  prompt="What is the best signal that you've outgrown a current process?"
  options={[
    { text: "A vague feeling of slowness" },
    { text: "A concrete pattern of failures — e.g., 'three incidents this quarter caused by deploys' justifies investing in canary and rollback" },
    { text: "Hitting a particular headcount number" },
    { text: "A competitor adopting the new practice" }
  ]}
  correct={1}
  explanation="Lag indicators — concrete repeating failures — tell you exactly which problem to solve next and let you justify investment to leadership with real data. 'We feel slow' is too vague to act on; 'three deploy-caused incidents this quarter' points directly at canary and rollback work."
  revisit={{ to: "/docs/enterprise/when-to-use#heuristics-for-when-to-adopt", label: "Lag indicators" }}
/>

<Question
  prompt="According to the page, when should you adopt SOC 2?"
  options={[
    { text: "As soon as you incorporate" },
    { text: "When a customer or regulator asks — don't pursue it speculatively, pursue it when a deal depends on it" },
    { text: "When you hit 100 employees" },
    { text: "Before raising any funding" }
  ]}
  correct={1}
  explanation="SOC 2 is expensive and time-consuming. Pursue it when a deal depends on it — when a customer asks or a regulator requires it — not speculatively. Same logic applies to most compliance: drive it from real business need, not aspiration."
  revisit={{ to: "/docs/enterprise/when-to-use#heuristics-for-when-to-adopt", label: "Compliance timing" }}
/>

<Question
  prompt="The page recommends resisting Kubernetes until what point?"
  options={[
    { text: "Day one — Kubernetes is required for any production workload" },
    { text: "You've genuinely outgrown a PaaS like Render, Fly, or Railway — most startups never need it" },
    { text: "You hit 50 services" },
    { text: "After SOC 2 certification" }
  ]}
  correct={1}
  explanation="Kubernetes is powerful but operationally heavy. Most startups ship faster on a PaaS (Render, Fly, Railway) and never genuinely outgrow it. Adopting Kubernetes early just to look enterprise-ready trades real velocity for theoretical scalability."
  revisit={{ to: "/docs/enterprise/when-to-use#when-not-to-adopt-enterprise-practices", label: "Don't adopt early" }}
/>

</Quiz>

## What's next

→ Continue to [When You're "Too Big" for This Workflow](./too-big) — what happens at the scale where this guide stops applying.
