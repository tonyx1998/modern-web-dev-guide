---
id: deployment-stages
title: Deployment Stages, Explained
sidebar_position: 25
sidebar_label: 24. Deployment Stages
description: A detailed walk through each of the eight deployment stages — what happens, what tools are involved, what can go wrong.
---

# Deployment Stages, Explained

> **In one line:** Source → CI → artifact → registry → deploy → runtime → CDN → DNS. Eight stages. Every one has tools, conventions, and failure modes worth knowing.

:::tip In plain English
This page walks through what each of the eight deployment stages actually *does*. After reading it, "deployment" stops being a black box and starts being a sequence of clearly-named steps you can debug, automate, and reason about.
:::

## Stage 1: Source code

Code lives in a **Git repository**, typically hosted on:

| Host          | Notes                                                            |
|---------------|------------------------------------------------------------------|
| **GitHub**    | Dominant, owned by Microsoft, integrated with Actions for CI.    |
| **GitLab**    | Self-hostable, all-in-one DevOps platform.                       |
| **Bitbucket** | Atlassian, popular alongside Jira.                               |
| **Gitea / Codeberg** | Self-hosted alternatives, smaller communities.            |

The **branch model** matters: most modern teams use **trunk-based** development with a `main` branch and short-lived feature branches. Pull requests merge to `main`, which triggers everything downstream.

## Stage 2: CI — Continuous Integration

Every push triggers automated checks:

- Install dependencies
- Run linters and formatters
- Run type checker (e.g., `tsc --noEmit`)
- Run unit tests
- Run integration tests
- Build the project
- Run security scans (SAST, SCA — looking for known vulnerable dependencies)

Failed CI blocks the change from merging.

**Tools:**
- **GitHub Actions** — dominant for indie/startup.
- **GitLab CI** — for GitLab users.
- **CircleCI** — fast, well-respected.
- **Buildkite** — common at larger companies.
- **Drone, Jenkins** — legacy or self-hosted setups.

:::note Worked example: a tiny CI workflow
```yaml
# .github/workflows/ci.yml
name: CI
on:
  pull_request:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build
```

That YAML, committed to your repo, is now a quality gate. Every commit, every PR, every merge runs through it.
:::

## Stage 3: Build artifact

CI produces a **build artifact** — a packaged version of your app:

| Artifact type              | What's inside                                            |
|---------------------------|----------------------------------------------------------|
| **Docker image**           | A complete filesystem snapshot with your app + dependencies |
| **Static bundle**          | A folder of `.html`, `.js`, `.css` for static sites      |
| **Serverless function package** | A zip with your code, deployed to Lambda/Workers   |
| **Native binary**          | Compiled Go/Rust/etc. binaries                            |

Whichever type, the artifact is **immutable** — once built, it never changes. Different versions are different artifacts.

## Stage 4: Artifact registry

Artifacts are stored in a **registry** for repeatable deployment:

| Registry                          | Best for                                       |
|-----------------------------------|------------------------------------------------|
| **Docker Hub**                    | Public, easy                                   |
| **GitHub Container Registry (GHCR)** | Tightly integrated with GitHub Actions      |
| **AWS ECR**                       | AWS users                                      |
| **Google Artifact Registry**       | GCP users                                      |

Cloud platforms (Vercel, Netlify, Cloudflare Pages) often handle artifact storage implicitly — you never see this stage.

## Stage 5: CD — Continuous Deployment / Delivery

CD takes passing builds and ships them:

- **Direct deployment** — build → deploy. Used by Vercel, Netlify, Cloudflare Pages.
- **Pull-based GitOps** — a controller (**Argo CD**, **Flux**) watches the Git repo and applies changes to the cluster.
- **Progressive delivery** — deploy to 1% of users, monitor metrics, gradually expand.

:::info Highlight: Continuous Deployment vs Continuous Delivery (the subtle difference)
**Continuous Delivery** = every commit *can* be deployed at any time (humans approve when).
**Continuous Deployment** = every commit *is* deployed automatically (no humans).

The first is a process choice — common at startups and most enterprises. The second requires high test coverage and confidence, and is common at organizations with strong engineering culture (Netflix, Etsy, modern indie projects).
:::

## Stage 6: Runtime environment

Where the code actually runs:

| Runtime                                   | Notes                                                       |
|-------------------------------------------|-------------------------------------------------------------|
| **PaaS** (Vercel, Netlify, Railway, Render, Fly.io) | You give them code, they run it. Easiest for solo/startup |
| **Containers** (AWS ECS, Google Cloud Run, Azure Container Apps) | You give them a Docker image, they run it       |
| **Kubernetes** (EKS, GKE, AKS, or self-hosted) | Container orchestration at scale; standard at large companies |
| **Serverless functions** (AWS Lambda, Cloudflare Workers, Vercel Edge Functions) | Tiny pay-per-execution handlers           |
| **Raw VMs** (EC2, Compute Engine, dedicated servers) | Full control, high operational burden                  |

For most new projects in 2026, **PaaS first**. Move down the list only when the higher tiers genuinely don't fit.

## Stage 7: CDN and edge

Static assets and (often) HTML are cached on the CDN. Users hit the CDN first; only cache misses reach your servers.

Modern setups use a CDN with edge compute (Cloudflare Workers, Vercel Edge Functions) to handle simple logic — auth, redirects, A/B test assignment — without involving the origin server at all.

## Stage 8: DNS and routing

DNS points your domain to the CDN/load balancer. Modern setups use **anycast** routing — the same IP address is announced from many physical locations, so users automatically hit the geographically closest entry point.

```
User in Tokyo → DNS for example.com → 1.2.3.4
   But "1.2.3.4" is announced by both Tokyo and Virginia.
   The user's network routes to whichever is closer → Tokyo.
```

This is invisible to your code — it just works.

## The pyramid runs in...

| Scale            | Total time, commit to live   |
|------------------|------------------------------|
| Solo project     | 30 seconds – 2 minutes       |
| Startup          | 5 – 15 minutes               |
| Enterprise (with approval gates) | Hours to weeks |

The whole pyramid runs in minutes for personal projects, hours for startups, and can involve approval gates and weeks of staging for large enterprises.

:::info Highlight: optimization isn't always faster — sometimes it's *safer*
At solo scale, speed wins — `git push` and 30 seconds later it's live.

At enterprise scale, *safety* wins — manual approvals, gradual rollouts, kill switches. A 30-second deploy is irrelevant if it accidentally takes down a payment system serving millions.

The right pyramid for your project depends on **what failure costs**, not on what's technically possible. A junior engineer's first instinct is "automate everything." A senior engineer's instinct is "automate everything *that's safe to automate*."
:::

## Wrapping up Part 1

If you've read this carefully, you now know:

- How the web actually moves bytes
- What HTTP really looks like
- How browsers turn HTML into pixels
- The rendering strategies that drive framework design
- The major API and database paradigms
- How auth works under the hood
- How code reaches production

Every later part of this guide builds on these foundations. The frameworks and tools change every few years, but these underlying concepts don't.

→ **Next chapter:** [Part 2: The Development Lifecycle](/docs/lifecycle) — the universal phases every project moves through, regardless of size or stack.
