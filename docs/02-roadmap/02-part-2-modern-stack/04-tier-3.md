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
