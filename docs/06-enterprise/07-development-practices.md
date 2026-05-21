---
id: development-practices
title: 'Phase 4: Development Practices'
sidebar_position: 8
sidebar_label: 7. Dev Practices
description: Trunk-based development, strict code review, automated checks, architectural fitness functions, and internal libraries.
---

# Phase 4: Development Practices

> **In one line:** Daily coding at enterprise scale means trunk-based development with feature flags, multiple reviewers, automated everything (lint, type-check, tests, security, performance), and fitness functions that enforce architecture rules in CI.

:::tip In plain English
At a startup, "we have CI" means tests run on PRs. At an enterprise, "we have CI" means every commit is checked against dozens of automated rules — security scanners, license compliance, accessibility checks, performance budgets, type strictness, custom architectural rules — and the build fails if any of them complain.

This sounds painful, but it's actually liberating. Once you trust that CI catches the obvious mistakes, you can focus on the interesting parts of the change in code review.
:::

## Trunk-based development with feature flags

- Long-lived branches are forbidden — they cause integration pain.
- Engineers commit to `main` (or develop branches that merge within hours).
- Incomplete features hidden behind feature flags.
- Continuous integration in the strictest sense.

A long-lived branch at this scale is a ticking bomb: by the time you're done, twenty other people have moved the code under you. Short-lived branches and feature flags solve both problems — code reaches main fast, and it's invisible to users until the flag is flipped.

## Strict code review

- Usually 2+ approvers required.
- Code owners must approve changes to their areas (configured via `CODEOWNERS` file).
- Security review for sensitive changes (auth, crypto, payments).
- Architecture review for cross-cutting changes.

The `CODEOWNERS` file is the mechanical enforcement of ownership. You can't merge a change to the payments service without an approver from the payments team — GitHub blocks the merge.

## Automated checks on every commit

A typical enterprise CI runs:

- **Linting** (extensive, often custom rules).
- **Type checking** (TypeScript strict mode, mypy strict, etc.).
- **Unit tests** with coverage minimums.
- **Security scans** (SAST, dependency vulnerability scanning).
- **License compliance** (no GPL code in proprietary product).
- **Performance budgets.**
- **Accessibility checks.**

Each of those is a quality gate. The combination is what makes enterprise codebases livable a decade later.

## Architectural fitness functions

- Automated tests that enforce architectural rules.
- Example: "no service should import directly from another service's internal modules."
- Example: "API responses must include a trace ID header."
- These run in CI; violations block merges.

Fitness functions are how you keep architecture decisions enforced without relying on every reviewer to remember them. The rule lives in code; the code runs in CI; the rule is automatically applied to every PR forever.

:::info Highlight: fitness functions beat written guidelines every time
Written architecture guidelines age badly. People forget them. New hires never see them. Reviewers get tired.

A fitness function — a single test that fails if the rule is broken — survives turnover, scales to any team size, and never gets tired. The best enterprise architecture teams convert every guideline they care about into a fitness function. If it isn't enforced in CI, it isn't enforced.
:::

## Internal libraries and frameworks

- Strong opinions on how to build at this company.
- Custom HTTP client with built-in metrics, tracing, retries.
- Custom database access layer with audit logging.
- Custom error handling that ties into observability.

Enterprises tend to build wrappers around open-source libraries. The wrapper enforces the company's standards (retries, tracing, audit logging) so engineers get them automatically. This is also why dropping an enterprise engineer into a startup is jarring — they're suddenly missing all the infrastructure they assumed was free.

:::note Worked example: anatomy of an enterprise PR
A typical small PR (changing a single function in the payments service) might trigger:

- Lint, format, type-check (parallel, ~1 minute each).
- Unit tests (parallel shards, ~3 minutes).
- Integration tests against staged dependencies (~5 minutes).
- SAST scan for security issues (~2 minutes).
- Dependency vulnerability scan (~30 seconds).
- License compliance check (~30 seconds).
- Performance regression test on key endpoints (~3 minutes).
- Accessibility check on changed UI (~1 minute).
- Fitness functions: "no cross-service DB access," "all endpoints have audit logging," etc. (~1 minute).
- Two human reviewers (one team member, one CODEOWNER for the touched module).
- Optional: security team review if the PR touches auth, crypto, or payments.

Total: ~8 minutes of CI on parallel runners, plus human review time. Each individual check is fast; the combined coverage is what makes the codebase safe at scale.
:::

## What's next

→ Continue to [Phase 5: Testing at Scale](./testing) — how the testing pyramid expands dramatically once you have hundreds of services.
