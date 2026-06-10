---
id: deployment-pyramid
title: The Deployment Pyramid
sidebar_position: 24
sidebar_label: Deployment Pyramid
description: A bird's-eye view of how code becomes a live website. Source → CI → artifact → registry → deploy → runtime → CDN → user.
---

# The Deployment Pyramid

> **In one line:** Every project, from one-person blogs to Google, ships code through some variation of the same eight-stage pipeline. Knowing the stages helps you debug at *every* level.

:::tip[In plain English]
"Deploying" is just the word for *putting your code somewhere users can run it*. It's not a single action — it's a multi-step process where each step has a specific job. The pyramid below is the same shape used by everyone from a teenager building their first Astro site (`git push` and Vercel handles the rest) to Google rolling out a global change (the same eight stages, just way more automation at each one).
:::

![Deployment pyramid](/img/diagrams/deployment-pyramid.svg)

## The pyramid

How does code reach users? Every project, from one-person blogs to Google, uses some variation of this pipeline. A few terms before the diagram:

:::info[Jargon for the pipeline]
- **CI** (Continuous Integration) — automation that runs on every commit (lint, tests, security scans).
- **Artifact** — the *built* output of your code (a Docker container image, a static bundle, a serverless function package). What actually gets deployed.
- **Registry** — a storage system for artifacts, like a Git for compiled code (GHCR, ECR, Docker Hub).
- **CD** (Continuous Deployment) — automation that takes a registry artifact and rolls it out to a runtime.
- **Runtime** — the machine/container/function-host that actually executes your code.
- **CDN** (Content Delivery Network) — globally distributed edge caches that serve responses close to the user (covered earlier in the chapter).
:::

```mermaid
flowchart TD
    S["1. Source code<br/>(Git)"]
    CI["2. CI<br/>Tests pass?"]
    A["3. Build artifact<br/>(container, bundle, function)"]
    R["4. Artifact registry"]
    CD["5. Deployment<br/>(CD pipeline)"]
    RT["6. Runtime environment<br/>(servers / containers /<br/>serverless / edge)"]
    CDN["7. CDN / Edge"]
    U["8. Users"]
    S --> CI --> A --> R --> CD --> RT --> CDN --> U
```

> **Reading this diagram:** Top-down, each box is a *stage* with its own tools, failure modes, and debugging skills. The next page covers each stage in detail. This page gives you the bird's-eye map.

## The same shape at every scale

What changes between solo, startup, and enterprise isn't *what* the stages are — it's *how much automation, gating, and ceremony* surround each one.

| Stage              | Solo project                            | Startup                                | Enterprise                                                  |
|--------------------|-----------------------------------------|-----------------------------------------|-------------------------------------------------------------|
| 1. Source          | GitHub repo                              | GitHub + branch protection              | GitHub Enterprise + signed commits + required reviewers     |
| 2. CI              | GitHub Actions, ~30s                     | GitHub Actions, ~5min, lint+test        | Internal CI platform, ~30min, lint+test+security+SAST+SCA   |
| 3. Build artifact  | Static folder or Docker image            | Docker image                            | Multi-arch Docker, signed, SBOM attached                   |
| 4. Registry        | None or Vercel/Netlify implicit          | GHCR, ECR, Docker Hub                   | Internal registry with policy enforcement                  |
| 5. CD              | Auto-deploy on push                      | Auto-deploy to staging, manual to prod  | Multi-environment, progressive rollout, approval gates      |
| 6. Runtime         | Vercel/Netlify/Cloudflare Pages          | Vercel, Fly.io, ECS, Cloud Run          | Kubernetes (often custom internal platform)                |
| 7. CDN             | Bundled with hosting platform            | Cloudflare or CloudFront                | Multi-CDN with custom routing                              |
| 8. DNS             | Domain registrar                          | Managed by Cloudflare or platform       | Internal DNS team                                          |

The solo developer just types `git push` and 30 seconds later their site is live — but under the hood, every one of those eight stages happened. The difference is who/what runs each stage.

:::info[Highlight: this is why "deployment problems" are hard]
When something breaks in production, it could be in any of these 8 layers:

- A bug in your source code (layer 1).
- A test you forgot to update (layer 2).
- A misbuilt Docker image (layer 3).
- A registry permissions issue (layer 4).
- A botched CD config (layer 5).
- A runtime resource limit (layer 6).
- A CDN cache misconfiguration (layer 7).
- A DNS propagation issue (layer 8).

**The skill is knowing which layer to look at.** Once you have the map, debugging stops feeling random.
:::

## A real-world failure narrative

You push code. The site goes down. Where do you look?

```mermaid
flowchart TD
    Start["It worked yesterday."]
    Q2{Bad commit built?<br/>Check CI - layer 2}
    Q4{Artifact pushed to registry?<br/>Layer 4}
    Q5{CD picked up new artifact?<br/>Layer 5}
    Q6{New runtime actually running?<br/>Layer 6}
    Q7{CDN serving new version?<br/>Layer 7}
    Fix["Aha - layer 7 stale cache.<br/>Purge. Fixed."]
    Start --> Q2 -->|Yes| Q4 -->|Yes| Q5 -->|Yes| Q6 -->|Yes| Q7 -->|No - stale| Fix
    style Fix fill:#2a5
```

> **Reading this diagram:** It's a debugging checklist as a flowchart. You walk *down* the pipeline asking "did this layer do its job?" until you find the broken one. You'll repeat variations of this dance dozens of times in a career. Each layer is a place to look.

## Common mistakes

:::caution[Where people commonly trip up]
- **Calling "git push" a deployment strategy.** It works on a $0/month side project where Vercel handles every stage for you. The moment you outgrow that, you'll need a mental model for *all* eight stages — because something has to manage each one. "I just push" only works when someone else owns the rest of the pyramid.
- **Skipping CI on a solo project.** It feels like overkill until the day you push a typo at 11pm that breaks production. A ten-line GitHub Actions workflow that runs `npm test && npm run build` costs nothing and catches the embarrassments.
- **Treating the artifact as ephemeral.** If you can't redeploy the *exact* version that ran last Tuesday, you can't roll back when a regression appears Wednesday. Build the artifact once, store it in a registry, deploy *that* — don't rebuild from source on each deploy.
- **Debugging production by guessing.** When the site is down, walk the eight stages in order: source → CI → artifact → registry → CD → runtime → CDN → DNS. The bug is in exactly one of them. Random guessing wastes the first 30 minutes; the systematic walk takes 5.
- **Conflating "deployed" with "rolled out to users."** Pushing a new artifact to the registry, deploying to the runtime, *and* the CDN serving the new version are three different events with three different points of staleness. A green CD pipeline doesn't guarantee your users see the new code yet.
:::

## Page checkpoint

<Quiz id="deployment-pyramid-page" title="Did the deployment pyramid stick?" sampleSize={3}>

<Question
  prompt="What does it mean that the SAME 8-stage pyramid applies to both a solo blog and a Google-scale deployment?"
  options={[
    { text: "Both use identical tools at every stage" },
    { text: "The stages (source, CI, artifact, registry, CD, runtime, CDN, DNS) are the same — what differs is the amount of automation, gating, and ceremony at each one" },
    { text: "The solo developer doesn't need a runtime" },
    { text: "Only Google actually uses all 8 stages; smaller teams skip most of them" }
  ]}
  correct={1}
  explanation="A solo developer typing 'git push' triggers all 8 stages, just with default tooling and zero ceremony. An enterprise deploys through the same stages but with approval gates, signed artifacts, progressive rollouts, etc."
  revisit={{ to: "/docs/foundations/deployment-pyramid#the-same-shape-at-every-scale", label: "Same shape at every scale" }}
/>

<Question
  prompt="In the deployment pipeline, what is a 'build artifact'?"
  options={[
    { text: "The Git commit that triggered the build" },
    { text: "A packaged, immutable output of your code — like a Docker image, a static bundle, or a serverless function zip — that's what actually gets deployed" },
    { text: "A leftover file from CI that should be deleted" },
    { text: "An old version of the source code archived for history" }
  ]}
  correct={1}
  explanation="The artifact is what gets shipped: Docker image, static folder, function package, or compiled binary. It's immutable — once built, it never changes. Different versions are different artifacts stored in a registry."
  revisit={{ to: "/docs/foundations/deployment-pyramid#the-pyramid", label: "Build artifact stage" }}
/>

<Question
  prompt="Production breaks after a deploy. Why is knowing the 8 stages a debugging superpower?"
  options={[
    { text: "It lets you skip layers you don't like" },
    { text: "It gives you a checklist — you walk the pipeline asking 'did this layer do its job?' until you find the broken one, instead of guessing randomly" },
    { text: "It tells the CDN to retry on its own" },
    { text: "It eliminates the need to read logs" }
  ]}
  correct={1}
  explanation="A failure could be in any of source, CI, artifact, registry, CD, runtime, CDN, or DNS. Knowing the stages turns debugging into a systematic walk down the pipeline instead of a wild guess."
  revisit={{ to: "/docs/foundations/deployment-pyramid#a-real-world-failure-narrative", label: "Why deployment problems are hard" }}
/>

<Question
  prompt="The same change takes 30 seconds to ship at a solo project and several hours (with approval gates) at a large enterprise. Why?"
  options={[
    { text: "Enterprise computers are slower" },
    { text: "At small scale, speed wins. At enterprise scale, safety wins — manual approvals, gradual rollouts, and kill switches are worth slowing down for when failure costs millions" },
    { text: "Enterprises legally require multi-hour deploys" },
    { text: "Solo developers skip stages 2 through 7" }
  ]}
  correct={1}
  explanation="The right pyramid for a project depends on what failure costs. A bug in your side project is annoying; a bug in a payment system serving millions is catastrophic. Mature engineering automates everything that's safe to automate."
  revisit={{ to: "/docs/foundations/deployment-pyramid#the-same-shape-at-every-scale", label: "Optimization isn't always faster" }}
/>

</Quiz>

## What's next

→ Continue to [Deployment Stages, Explained](./deployment-stages) where we walk through each of the eight stages in detail with concrete tooling examples.
