---
id: ci-cd
title: 'Phase 8: CI/CD'
sidebar_position: 9
sidebar_label: 8. CI/CD
description: Automate the path from "code committed" to "code in production." The factory assembly line for software.
---

# Phase 8: CI/CD

> **In one line:** CI runs tests automatically on every commit. CD ships passing builds to production automatically. Together: the factory assembly line for software.

:::tip[In plain English]
"CI" and "CD" are scary acronyms for simple ideas:

- **CI (Continuous Integration)** — Every time someone commits code, an automated system pulls it, runs the tests, and reports back. The "integration" part means *combining* everyone's work and proving the combined result still works. Without CI, ten developers can break each other's code without realizing.
- **CD (Continuous Deployment / Delivery)** — Once CI passes, an automated system *deploys* the code to a server where users (or testers) can access it. The deploy happens without anyone manually copying files anywhere.

In practice, this is a YAML file that lives in your repo. GitHub Actions, GitLab CI, and CircleCI read that YAML and run the steps it lists when you push a commit.
:::

## CI (Continuous Integration) — in detail

Every commit runs a pipeline of automated checks. If anything fails, the change is blocked.

A typical CI pipeline:

```yaml
# .github/workflows/ci.yml
name: CI
on:
  push:
    branches: [main]
  pull_request:

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Lint and format check
        run: bunx biome check .

      - name: Type check
        run: bunx tsc --noEmit

      - name: Unit tests
        run: bun run test

      - name: Build
        run: bun run build

      - name: Security audit
        run: bun audit
```

> **In English:** Trigger this job on every push to `main` and every pull request. Boot a fresh Ubuntu VM, install Bun, then run six gates in sequence: install with the lockfile pinned (no surprise upgrades), check formatting/lint, type-check, run tests, run the production build, and finally audit dependencies for known vulnerabilities. Any failure blocks the PR.

That YAML, committed to your repo, is now a quality gate. Every commit, every PR, every merge runs through it.

## CD (Continuous Deployment vs Delivery)

These terms get confused:

- **Continuous Delivery:** Every change is *deployable*. A human pushes the button to release.
- **Continuous Deployment:** Every change *is deployed* automatically after passing tests.

True continuous deployment requires high trust in your test suite. Many companies do continuous delivery (deploys are automated but gated) rather than full continuous deployment.

## Deployment strategies

| Strategy            | How it works                                                    | When to use                  |
|---------------------|-----------------------------------------------------------------|------------------------------|
| **Direct deployment** | Replace the running version with the new one                  | Simple apps; brief downtime is OK |
| **Blue/Green**      | Run two identical environments; switch traffic from old to new | Zero-downtime deploys with easy rollback |
| **Canary**          | Deploy to 1% of users first; monitor; gradually expand          | High-stakes changes          |
| **Feature flags**   | Code ships always; new features gated behind flags              | Decouple deploy from release |
| **Rolling**         | Replace instances one at a time                                  | Kubernetes default           |

Modern deployments often combine these: canary deploys controlled by feature flags, monitored for SLO breaches with automated rollback.

## Branching strategies

| Strategy             | Notes                                                              |
|---------------------|--------------------------------------------------------------------|
| **Trunk-based development** (2026 standard) | Everyone commits to `main` directly (or via very short-lived branches that merge within hours). Incomplete features hidden behind feature flags. |
| **GitHub Flow**      | Branch from `main`, commit, PR, merge to `main`, deploy. Simple, popular for web apps. |
| **Git Flow** (declining) | Multiple long-lived branches (`main`, `develop`, `feature/*`, `release/*`). Heavy for modern web apps. |

For most modern teams, trunk-based or GitHub Flow is the right default.

## Tools in 2026

| Tool                              | Notes                                              |
|----------------------------------|----------------------------------------------------|
| **GitHub Actions**                | Dominant for most projects. Free for public, generous free tier for private. |
| **GitLab CI**                     | All-in-one DevOps; popular when using GitLab.       |
| **CircleCI**                      | Strong for parallel testing.                        |
| **Buildkite**                     | Hybrid (cloud control, your own compute); popular at scale. |
| **Jenkins**                       | Legacy, still common in enterprises.                |
| **Argo CD / Flux**                | GitOps for Kubernetes.                              |
| **Vercel / Netlify / Cloudflare Pages** | Built-in CI/CD for their hosted apps.         |

:::note[Worked example: this very site's CI/CD]
This documentation site has `.github/workflows/deploy.yml`:

1. On every push to `main`, GitHub Actions runs `npm run build`.
2. The built static site is uploaded to GitHub Pages.
3. The new version is live on `tonyx1998.github.io/modern-web-dev-guide/` within ~2 minutes.
4. You can roll back to a previous version by reverting the commit and pushing.

That's a complete CI/CD pipeline for a static site, all expressed in one YAML file under 50 lines.
:::

:::info[Highlight: aim for under-10-minute CI]
A 30-minute CI loop kills productivity — developers context-switch, lose focus, accept worse code. A 5-minute loop keeps them in flow.

Common ways to speed up slow CI:

- **Parallelize jobs** (separate lint, test, build, type-check into parallel steps).
- **Cache dependencies** (`actions/setup-node@v4` with `cache: 'npm'`).
- **Run only what's needed** (skip the heavy E2E tests on docs-only PRs).
- **Use Turborepo or Nx remote cache** for monorepos.

Treat CI time as a budget. Over 10 minutes = problem to solve.
:::

## Common anti-patterns

- **Skipping tests in CI:** "Just merge it." The tests exist for a reason.
- **Long CI times:** A 30-minute CI loop kills productivity.
- **Flaky tests in CI:** Erodes trust until people retry until green.
- **No staging environment:** Deploy straight to prod with crossed fingers.
- **Manual deployment steps:** "First SSH in, then run this script..." Should be one button (or zero).

## Page checkpoint

<Quiz id="lifecycle-ci-cd-page" title="Did CI/CD stick?" sampleSize={2}>

<Question
  prompt="What's the actual difference between Continuous Delivery and Continuous Deployment?"
  options={[
    { text: "Delivery uses GitHub Actions; Deployment uses GitLab CI" },
    { text: "Delivery means every change is deployable but a human releases it; Deployment means every change auto-deploys after passing tests" },
    { text: "They're synonyms — the terms are interchangeable" },
    { text: "Delivery is for backends; Deployment is for frontends" }
  ]}
  correct={1}
  explanation="Both rely on automation. The difference is who pushes the final button: in continuous delivery a human gates production; in continuous deployment passing CI is the gate."
  revisit={{ to: "/docs/lifecycle/ci-cd#cd-continuous-deployment-vs-delivery", label: "Delivery vs Deployment" }}
/>

<Question
  prompt="A team wants zero-downtime deploys with an easy rollback path. Which deployment strategy from the page best fits?"
  options={[
    { text: "Direct deployment — replace the running version with the new one" },
    { text: "Blue/Green — run two identical environments and switch traffic between them" },
    { text: "Skip deploys; ship via email patches" },
    { text: "Manual SSH and copy files" }
  ]}
  correct={1}
  explanation="Blue/Green keeps the old version live while the new one warms up. Switching traffic is instant, and rollback is just flipping the switch back."
  revisit={{ to: "/docs/lifecycle/ci-cd#deployment-strategies", label: "Deployment strategies" }}
/>

<Question
  prompt="Which branching strategy does the page identify as the 2026 standard for most modern teams?"
  options={[
    { text: "Git Flow with long-lived develop, release, and feature branches" },
    { text: "Trunk-based development — short-lived branches that merge within hours, with feature flags hiding incomplete work" },
    { text: "One permanent branch per developer" },
    { text: "Whatever happens — branching is unnecessary" }
  ]}
  correct={1}
  explanation="Trunk-based development minimizes integration pain by keeping branches short and using flags for incomplete work. Git Flow is in decline for modern web apps."
  revisit={{ to: "/docs/lifecycle/ci-cd#branching-strategies", label: "Branching strategies" }}
/>

<Question
  prompt="Why does the page push hard on keeping CI runs under 10 minutes?"
  options={[
    { text: "GitHub charges per minute over 10" },
    { text: "Long CI loops kill productivity — developers context-switch, lose focus, and start accepting worse code" },
    { text: "Tests become less accurate after 10 minutes" },
    { text: "Browsers refuse to run longer pipelines" }
  ]}
  correct={1}
  explanation="A 30-minute CI loop trains people to merge and walk away. A 5-minute loop keeps them in flow. The page treats CI time as a budget to actively manage."
  revisit={{ to: "/docs/lifecycle/ci-cd#common-anti-patterns", label: "Aim for under-10-minute CI" }}
/>

</Quiz>

## What's next

→ Continue to [Phase 9: Deployment & Hosting](./deployment-hosting) where we get the code running on the public internet, reliably.
