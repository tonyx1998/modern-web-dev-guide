---
id: tier-3
title: Tier 3 — Skip or Defer
sidebar_position: 5
sidebar_label: Tier 3 — skip or defer
description: What the discourse loves but you don't need yet — and why.
---

# Tier 3 — Skip or Defer

> **In one line:** This is the list of things you'll see hyped that aren't worth your time right now.

Saying "no" is a skill. The [Decisions chapter](/docs/decisions) covers the broader "boring tech" framework — pick the option that costs you the least optionality.

## Rust or Go for your backend

Both are great languages. Neither solves a problem you have. Your bottleneck is "I haven't shipped this yet" or "tests don't exist" — not "Python is too slow." Pick these up only if you specifically want to do systems programming or work somewhere that requires them.

## Deep Kubernetes operations, service meshes, custom controllers

Docker itself is essential — covered in [Stage 12](/docs/roadmap/part-1-from-zero/stage-12-going-pro). Kubernetes *literacy* (reading manifests, running `kubectl logs`, deploying to an existing cluster) is also covered there and worth learning for any backend or full-stack role. What you should *not* do is dive into the deep end: writing custom operators and CRDs, tuning the scheduler, configuring Istio or Linkerd service meshes, managing your own etcd cluster, or building a "Kubernetes platform." That work is what platform engineers and SREs do full-time, and it's a different career track from web dev. Pursue it only if you specifically want to *be* a platform engineer; otherwise the literacy from Stage 12 is the right ceiling, and your cloud provider's managed Kubernetes (EKS, GKE, AKS) handles the rest.

## GraphQL

REST + TanStack Query covers your needs. tRPC or Server Actions give better type safety with less code. GraphQL shines for huge teams with many heterogeneous clients (web, iOS, Android, partners), not solo builds.

## Redux, Zustand, Jotai (global state libraries)

TanStack Query already manages server state. URL + local component state covers most "global" needs in your projects. Only reach for one of these if you have a genuinely cross-cutting client state need (a complex editor, multi-step wizard sharing state across routes, etc.).

## Microservices, event-driven architecture, CQRS

Patterns designed to solve organisational problems (many teams, independent deploys, regulated separation) at huge scale. At your scale, a monolith is faster to build, faster to deploy, and easier to reason about. Splitting later is doable; splitting too early is the most common cause of doomed greenfield projects.

→ See also: [Decisions chapter](/docs/decisions) for the "when is the cost worth it?" framework.

## Web3 / blockchain

No current career signal. If you're personally interested, fine — but don't put it on a learning roadmap.

## NestJS, Angular

Both are coherent, well-engineered ecosystems with shrinking 2026 market share against Next.js + plain React. Your React + Next investment compounds.

## Server-Sent Events / WebSockets from scratch

Useful primitives but easy to misuse. If you need realtime, use Convex / Zero / Pusher / Liveblocks rather than writing the protocol yourself.

## Common mistakes

:::caution[Where people commonly trip up]
- **Reading Tier 3 as "never use these."** This is "defer, not skip." Microservices are right at 50-engineer companies; Kubernetes operators are right when you're a platform engineer; GraphQL is right with many heterogeneous clients. The tier is a *now* judgement against *your* situation — solo or small-team, pre-product-market-fit. When your situation changes, the answers change.
- **Adopting microservices to "future-proof" a solo project.** Microservices solve organisational problems — many teams, independent deploys, regulated separation — not technical ones at your scale. A monolith ships in a week and refactors into services later when (and only when) team boundaries demand it. Splitting too early is the most common cause of doomed greenfield projects.
- **Diving into deep Kubernetes because it's on every job posting.** Job postings list k8s because the company already runs it. The *literacy* (read manifests, `kubectl logs`, deploy to an existing cluster) is genuinely useful and covered in Stage 12. Writing operators, tuning the scheduler, configuring Istio — that's a platform-engineering career track, not a web-dev prerequisite. Don't confuse the two.
- **Reaching for Redux/Zustand/Jotai by reflex.** The default in 2026 is: TanStack Query for server state, URL params + local component state for almost everything else. Global state libraries are right for genuinely cross-cutting client state (complex editors, multi-step wizards spanning routes). Installing Redux for a 3-page app is the canonical example of "shipped tomorrow with the wrong abstraction."
:::

## Page checkpoint

<Quiz id="tier-3-page" title="Did Tier 3 stick?" sampleSize={3}>

<Question
  prompt="Why are microservices on the Tier 3 &quot;defer&quot; list for solo and small-team builders?"
  options={[
    { text: "They're a failed architecture — nobody uses them anymore" },
    { text: "They solve organisational problems (many teams, independent deploys, regulated separation) — at solo / small-team scale a monolith is faster to build, faster to deploy, and easier to reason about; splitting too early is a common cause of doomed greenfield projects" },
    { text: "They only work with Java" },
    { text: "Microservices require Kubernetes and Kubernetes is also Tier 3" }
  ]}
  correct={1}
  explanation="Microservices, event-driven architectures, and CQRS exist to solve *organisational* problems at large scale — many teams shipping independently, regulated boundaries, etc. At your scale you don't have those problems; you have &quot;I haven't shipped this yet.&quot; A monolith fits that situation; splitting later is doable, splitting too early kills projects."
  revisit={{ to: "/docs/roadmap/part-2-modern-stack/tier-3#microservices-event-driven-architecture-cqrs", label: "Microservices, event-driven, CQRS" }}
/>

<Question
  prompt="A boring-tech framing of &quot;deep Kubernetes operations&quot; (writing operators, tuning the scheduler, running Istio): what does it cost a solo web dev who picks it up speculatively?"
  options={[
    { text: "Nothing — it's always good to know more" },
    { text: "It's a different career track (platform engineering / SRE) — the time spent doesn't compound into web-dev skill, and the literacy you actually need (read manifests, kubectl logs, deploy to a managed cluster) is far smaller and covered in Stage 12" },
    { text: "It locks you out of using any cloud provider" },
    { text: "It violates the Kubernetes license" }
  ]}
  correct={1}
  explanation="The boring-tech framing asks &quot;does this purchase compound into my next project, or is it a side quest?&quot; Deep k8s is a platform-engineering career — different track. The web-dev-relevant literacy is small (covered in Stage 12) and your cloud provider's managed k8s handles the rest. Time spent on operators and service meshes doesn't transfer to web-dev work."
  revisit={{ to: "/docs/roadmap/part-2-modern-stack/tier-3#deep-kubernetes-operations-service-meshes-custom-controllers", label: "Deep Kubernetes operations" }}
/>

<Question
  prompt="A teammate suggests adopting GraphQL for your two-page side project so it's &quot;future-proof.&quot; The Tier 3 framing says:"
  options={[
    { text: "Agree — GraphQL is strictly better than REST" },
    { text: "Decline — GraphQL is deprecated" },
    { text: "Decline for this case — GraphQL's win is huge teams with many heterogeneous clients (web + iOS + Android + partner APIs); a two-page solo build is much better served by REST + TanStack Query or tRPC / Server Actions, which give better type safety with less code" },
    { text: "Adopt GraphQL but also keep REST as a backup" }
  ]}
  correct={2}
  explanation="GraphQL genuinely shines when many different clients (web, iOS, Android, partners) need flexible queries against one schema — large orgs with heterogeneous frontends. For a solo two-page app, REST + TanStack Query or tRPC / Server Actions deliver better type safety with less code and less infra. &quot;Future-proofing&quot; with GraphQL is a classic over-investment for the situation."
  revisit={{ to: "/docs/roadmap/part-2-modern-stack/tier-3#graphql", label: "GraphQL" }}
/>

</Quiz>
