---
id: cicd
title: 'Phase 7: CI/CD with GitHub Actions'
sidebar_position: 10
sidebar_label: 9. CI/CD
description: A typical GitHub Actions workflow that lints, type-checks, tests, and builds. Vercel handles deployment separately. Branch protection enforces review.
---

# Phase 7: CI/CD with GitHub Actions

> **In one line:** GitHub Actions lints, type-checks, tests, and builds on every PR. Vercel handles deployment. Branch protection makes the green-CI requirement non-optional.

:::tip In plain English
"CI/CD" is just two ideas: every change is verified automatically (CI), and verified changes deploy automatically (CD). At startup scale, you don't need to build either yourself — GitHub Actions runs your tests for free, and Vercel deploys whenever `main` updates. The interesting work is configuring branch protection so neither step can be bypassed under pressure.
:::

## A typical workflow file

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
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Lint and format
        run: bunx biome check .

      - name: Type check
        run: bun run typecheck

      - name: Unit + integration tests
        run: bun run test
        env:
          DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}

      - name: Build
        run: bun run build

  e2e:
    runs-on: ubuntu-latest
    needs: validate
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Install Playwright browsers
        run: bunx playwright install --with-deps chromium

      - name: Run E2E tests
        run: bun run test:e2e
        env:
          BASE_URL: ${{ secrets.PREVIEW_URL }}
```

> **In English:** This is a GitHub Actions workflow — the YAML lives at `.github/workflows/ci.yml` and runs on every push to `main` and every pull request. There are two jobs. **`validate`** runs on a fresh Ubuntu VM: it checks out the code, installs Bun, runs `bun install --frozen-lockfile` (the strict version that fails if `bun.lock` is out of date), lints with Biome, type-checks, runs unit/integration tests against a real test database, and finally compiles the production build. **`e2e`** only runs after `validate` passes (`needs: validate`); it installs Playwright's headless Chromium and runs the end-to-end suite against a preview URL. Secrets (`TEST_DATABASE_URL`, `PREVIEW_URL`) are stored in GitHub's encrypted secrets store, not in the YAML.

CI typically completes in 5–10 minutes. Vercel handles deployment separately — every PR gets a preview URL automatically; merges to `main` deploy to production.

## Branch protection

GitHub branch protection on `main`:
- Require pull request before merging.
- Require status checks to pass (CI, type check, tests).
- Require approval from at least 1 reviewer.
- Dismiss stale approvals when new commits are pushed.
- Require linear history (no merge commits).

## Hot fixes

For emergency production fixes, the same flow applies — branch, PR, review, merge, deploy. CI is fast enough that emergency fixes ship in 15–30 minutes.

:::note Worked example: a hot fix at 11 PM
A user reports checkout is broken. You confirm in Sentry: a null check is missing in the Stripe webhook handler.

1. **23:02** — Branch off main: `git checkout -b fix/stripe-webhook-null`.
2. **23:05** — Add the null check, add a test that would have caught it.
3. **23:07** — Push, open PR.
4. **23:08** — Ping a teammate on Slack. They review in 3 minutes.
5. **23:14** — CI green, approval in. Merge.
6. **23:17** — Vercel deploy completes. Verify in production.

Total: 15 minutes from "user reports broken" to "fixed in production" — without bypassing review, without deploying off a personal laptop. The fast-CI + branch-protection combination is what makes that possible.
:::

:::info Highlight: branch protection isn't bureaucracy
At 5 people, "we trust each other to not push broken code" is reasonable. At 15, that trust breaks down — not because anyone is bad, but because *somebody* will get tired and push a typo to main on a Friday.

Branch protection makes the safe path the default path. Nobody has to remember to ask for review; nobody has to remember to wait for CI. The system enforces both. This is process earning its way in.
:::

## What's next

→ Continue to [Phase 8: Deployment & Infrastructure](./deployment) where we compare three popular hosting patterns.
